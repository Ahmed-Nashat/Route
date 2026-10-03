import {
  badRequestException,
  encryptPhoneNumber,
  createTokens,
  verifyToken,
  myCompare,
  myHash,
  enums,
  userRepo,
  conflictException,
  notFoundException,
  decryptPhoneNumber,
} from "../../common/index.js";
import { OAuth2Client } from "google-auth-library";
import { google_client_id } from "../../config/config.service.js";

// ---------------------- REFRESH TOKEN ----------------------
export const refreshToken = async (refreshToken, issuer) => {
  const authorization = refreshToken;
  const [prefix, token] = authorization.split(" ");
  const user = await verifyToken({
    token,
    tokenType: enums.tokenTypesEnum.refresh,
  });
  return createTokens({ userId: user.id, issuer });
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
  return newUser;
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
    return { token, status: 200 };
  }

  // signup
  user = await userRepo.create({
    email,
    firstName: given_name,
    lastName: family_name,
    image: picture,
    provider: enums.providerEnum.google,
  });

  const token = createTokens({
    userId: user.id,
    issuer,
  });
  return { token, status: 201 };
};
