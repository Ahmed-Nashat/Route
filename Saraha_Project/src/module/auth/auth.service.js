import {
  badRequestException,
  encryptPhoneNumber,
  createTokens,
  eventEmitter,
  verifyToken,
  myCompare,
  myHash,
  enums,
  userRepo,
  redisService,
  conflictException,
  notFoundException,
  decryptPhoneNumber,
} from "../../common/index.js";
import { OAuth2Client } from "google-auth-library";
import { google_client_id, refresh_ex } from "../../config/config.service.js";
import jwt from "jsonwebtoken";
import {
  getPrefixRevoke,
  getRevokeKey,
} from "../../common/utils/token.service.js";
import crypto from "crypto";
import {
  max_send_retries,
  max_otp_retries,
} from "../../config/config.service.js";

// ---------------------- FUNCTIONS --------------------------
export const getUserKey = (userId) => `user::${userId?.toString()}`;
export const getUserOTPKey = (userId) => `otp::${getUserKey(userId)}`;
export const getUserOTPForgetKey = (userId) =>
  `forget::${getUserOTPKey(userId)}`;
const getUserSendKey = (userId) => `send::${getUserKey(userId)}`;
const getUserOtpTriesKey = (userId) => `tries::${getUserOTPKey(userId)}`;
const generateOtp = () => crypto.randomInt(100000, 1000000);
const createAndSendOtp = async ({ user, event }) => {
  const otp = generateOtp();
  await redisService.set({
    key: getUserOTPForgetKey(user?.id),
    value: otp,
    ttl: 5 * 60,
  });
  eventEmitter.emit(event, {
    recipients: { to: user?.email },
    otp,
    name: user?.name,
  });
};
const revokedToken = async (token) => {
  const data = jwt.decode(token),
    currentTimeInSec = Math.ceil(Date.now() / 1000),
    iat = currentTimeInSec - data.iat,
    ttl = refresh_ex - iat;

  if (ttl > 0) {
    redisService.set({
      key: getRevokeKey(data?.sub, data?.jti),
      value: 1,
      ttl,
    });
  }
};
const wrongOtpHandler = async (userId) => {
  const key = getUserOtpTriesKey(userId);
  if (await redisService.exists({ key })) {
    await redisService.incr({ key });
  } else {
    await redisService.set({ key, value: 1, ttl: 5 * 60 });
  }
  badRequestException("Wrong OTP");
};
const blockUser = async (userId) => {
  const userOtpretries = await redisService.get({
    key: getUserOtpTriesKey(userId),
  });
  if (userOtpretries && userOtpretries == max_otp_retries) {
    // delete the active otp
    await redisService.del({ key: [getUserOTPKey(userId)] });
    badRequestException(
      `Try again after ${Math.ceil((await redisService.ttl({ key: userOtpretries })) / 60)} minutes`,
    );
  }
};
// -----------------------------------------------------------

// ---------------------- REFRESH TOKEN ----------------------
export const refreshToken = async (refreshToken, issuer) => {
  const authorization = refreshToken;
  const [prefix, token] = authorization.split(" ");
  const user = await verifyToken({
    token,
    tokenType: enums.tokenTypesEnum.refresh,
  });
  // revoke the old refresh token
  await revokedToken(token);
  return createTokens({
    userId: user._id || user.id,
    issuer,
    role: user.role,
  });
};

// ---------------------- SIGNUP -----------------------------
export const creatUser = async (userData) => {
  const { email, password } = userData;

  const user = await userRepo.findByEmail({ email });
  if (user) conflictException("This email is already exists");

  const newUser = await userRepo.create({
    ...userData,
    DOB: new Date(userData.DOB),
    password: await myHash(password),
    phoneNumber: encryptPhoneNumber(userData),
  });

  newUser.phoneNumber = decryptPhoneNumber(newUser);
  newUser.password = password;

  await createAndSendOtp({ user, event: enums.eventEnum.signup });
  return newUser;
};

// ---------------------- CONFIRM EMAIL ----------------------
export const confirmEmail = async ({ email, otp }) => {
  const user = await userRepo.findByEmail({ email });
  const UserOtpkey = getUserOTPKey(user?.id);

  await blockUser(user?.id);

  const redisOtp = await redisService.get({ key: UserOtpkey });
  user.phoneNumber = decryptPhoneNumber(user);

  if (redisOtp == otp) {
    await user.updateOne({ $set: { confirmEmail: true } });
    await redisService.del({ key: [UserOtpkey] });
    return user;
  } else await wrongOtpHandler(user?.id);
};

// ---------------------- RESEND OTP -------------------------
export const resendOtp = async ({ email, topic }) => {
  const user = await userRepo.findByEmail({ email });

  switch (topic) {
    case enums.eventEnum.signup:
      const sendKey = getUserSendKey(user?._id || user?.id);
      const otpKey = getUserOTPKey(user?._id || user?.id);

      if ((await redisService.exists({ key: otpKey })) === "Key exists") {
        badRequestException("cant't send new OTP try again later");
      }

      let count = await redisService.get({ key: sendKey });
      if (count) {
        if (count == max_send_retries) {
          badRequestException(
            `You reached your limit, please try after ${
              (await redisService.ttl({ key: sendKey })) < 1
                ? 0
                : (await redisService.ttl({ key: sendKey })) / 60
            } minutes`,
          );
        } else await redisService.incr({ key: sendKey });
      } else await redisService.set({ key: sendKey, value: 1, ttl: 600 });

      const otp = generateOtp();
      await redisService.set({
        key: otpKey,
        value: otp,
        ttl: 5 * 60,
      });

      eventEmitter.emit(enums.eventEnum.signup, {
        recipients: { to: email },
        otp,
        name: user?.name,
      });
      break;

    default:
      break;
  }
  return `new OTP sent for ${topic}`;
};

// ---------------------- LOGIN ------------------------------
export const login = async (userData, issuer) => {
  const { email, password } = userData;

  const user = await userRepo.findByEmail({ email });
  if (!user) notFoundException("User not found");

  await myCompare({
    plainText: password,
    cypherText: user.password,
  });

  eventEmitter.emit(enums.eventEnum.login, {
    recipients: { to: email },
    subject: "New login",
    text: `a new login detected at ${new Date()}, if it's not you please change the password`,
  });

  return createTokens({
    userId: user.id,
    issuer,
    role: user.role,
  });
};

// ---------------------- VERIFY GOOGLE ID -------------------
async function verifyGoogleid(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: google_client_id,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) badRequestException("Email is not verified");
  return payload;
}

// ---------------------- LOGIN WITH GOOGLE ------------------
export const loginWithGmail = async ({ idToken }, issuer) => {
  const payload = await verifyGoogleid(idToken);
  const { email, given_name, family_name, picture } = payload;
  let user = await userRepo.findByEmail(email);

  if (user) {
    // login.
    const token = createTokens({
      userId: user.id,
      issuer,
    });
    eventEmitter.emit(enums.eventEnum.login, {
      recipients: { to: email },
      subject: "New login",
      text: `a new login detected at ${new Date()}, if it's not you please change the password`,
    });
    return { token, status: 200 };
  }

  // signup
  user = await userRepo.create({
    email,
    firstName: given_name,
    lastName: family_name,
    image: picture,
    provider: enums.providerEnum.google,
    confirmEmail: true,
  });

  const otp = generateOtp();
  redisService.set({
    key: getUserOTPKey(newUser?._id),
    value: otp,
    ttl: 5 * 60,
  });
  eventEmitter.emit(enums.eventEnum.signup, {
    recipients: { to: email },
    otp,
    name: userData?.name,
  });

  const token = createTokens({
    userId: user.id,
    issuer,
  });
  return { token, status: 201 };
};

// ---------------------- LOGOUT -----------------------------
export const logout = async (auth, type) => {
  const [, token] = auth.split(" ");
  const rawToken = token || auth;

  switch (type) {
    case enums.logoutEnum.all:
      const data = jwt.decode(rawToken);
      await userRepo.updateOne({
        filter: { _id: data?.sub },
        // update time in seconds
        data: { credintialsChangedAt: Math.ceil(Date.now() / 1000) },
      });
      const arr = await redisService.keys({
        prefix: getPrefixRevoke(data?.sub),
      });
      if (arr.length > 0) {
        // delete all revoked token
        await redisService.del({ key: arr });
      }
      // remove cached user
      await redisService.del({ key: getUserKey(data?.sub) });
      break;
    default:
      // create one revoked token
      await revokedToken(rawToken);
      break;
  }
};

// ---------------------- FORGET PASSWORD --------------------
export const forgetPassword = async (email) => {
  const user = await userRepo.findByEmail({ email });
  if (!user) notFoundException("User not found");
  // to revoke any previous tokens
  await user.updateOne({
    $set: { credintialsChangedAt: Date.now() },
  });
  const arr = await redisService.keys({
    prefix: getPrefixRevoke(user?.id),
  });
  arr.length && (await redisService.del({ key: arr }));
  await createAndSendOtp({ user, event: enums.eventEnum.forget });
  return;
};

// ---------------------- RESET PASSWORD ---------------------
export const resetPassword = async ({ email, otp, newPassword, cPassword }) => {
  const user = await userRepo.findByEmail({ email });
  if (!user) notFoundException("User not found");

  if (newPassword !== cPassword) badRequestException("Password dont't match");

  await blockUser(user?.id);

  const redisOtp = await redisService.get({
    key: getUserOTPForgetKey(user?.id),
  });
  // he didn't forget the password
  if (!redisOtp) notFoundException("OTP not found");

  if (redisOtp == otp) {
    await user.updateOne({
      $set: {
        password: await myHash(newPassword),
      },
    });
    return "Password changed";
  } else {
    await wrongOtpHandler(user?.id);
  }
};
