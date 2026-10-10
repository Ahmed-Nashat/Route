import * as configService from "../../config/config.service.js";
import jwt from "jsonwebtoken";
import * as enums from "../enum/index.js";
import {
  notFoundException,
  serverException,
  UnauthorizedException,
} from "../exceptions/index.js";
import { userRepo } from "../repo/user.repo.js";
import { redisService } from "../index.js";
import crypto from "crypto";
import { getUserKey } from "../../module/auth/auth.service.js";

export const createTokens = ({
  userId,
  issuer,
  role = enums.roleEnum.user,
}) => {
  const secrets = getTokenSecretsForRole(role);
  const jwtid = crypto.randomUUID();

  return {
    accessToken: jwt.sign(
      {
        sub: userId,
      },
      secrets.access,
      {
        expiresIn: configService.access_ex,
        issuer,
        audience: [role],
        jwtid,
      },
    ),
    refreshToken: jwt.sign(
      {
        sub: userId,
      },
      secrets.refresh,
      {
        expiresIn: configService.refresh_ex,
        issuer,
        audience: [role],
        jwtid,
      },
    ),
  };
};

export const verifyToken = async ({ token, tokenType }) => {
  const decoded = jwt.decode(token);

  // check weither there is a revoked token for this user and this jti or not
  if (
    (await redisService.exists({
      key: getRevokeKey(decoded?.sub, decoded?.jti),
    })) === "Key exists"
  ) {
    UnauthorizedException("You are already loged out");
  }

  const secret = getTokenSecretForType(tokenType, decoded?.aud[0]);

  try {
    jwt.verify(token, secret);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      UnauthorizedException("Token has expired");
    }
    throw err;
  }

  if (
    (await redisService.exists({ key: getUserKey(decoded?.sub) })) ==
    "Key exists"
  ) {
    // get the cached user from redis
    const cachedUser = await redisService.get({
      key: getUserKey(decoded?.sub),
    });

    if (
      cachedUser?.credintialsChangedAt &&
      decoded.iat <= cachedUser.credintialsChangedAt
    ) {
      UnauthorizedException("You are already loged out");
    }

    return cachedUser;
  }

  const user = await userRepo.findById({
    id: decoded?.sub,
    select: [
      "name",
      "firstName",
      "lastName",
      "email",
      "role",
      "gender",
      "phoneNumber",
      "credintialsChangedAt",
    ],
  });
  if (!user) notFoundException("User not found");

  if (user.credintialsChangedAt && decoded.iat <= user.credintialsChangedAt) {
    UnauthorizedException("You are already loged out");
  }

  // cache loged in user for 30 sec
  await redisService.set({
    key: `user::${user?._id}`,
    value: user,
    ttl: 30,
  });

  return user;
};

const getTokenSecretsForRole = (role) => {
  let secret;

  switch (Number(role)) {
    case enums.roleEnum.admin:
      secret = {
        access: configService.admin_access_secret_key,
        refresh: configService.admin_refresh_secret_key,
      };
      break;

    case enums.roleEnum.user:
      secret = {
        access: configService.user_access_secret_key,
        refresh: configService.user_refresh_secret_key,
      };
      break;

    default:
      serverException("Unhandled role");
  }
  return secret;
};

const getTokenSecretForType = (tokenType, role) => {
  let secrets = getTokenSecretsForRole(role);
  let secret;
  switch (tokenType) {
    case enums.tokenTypesEnum.access:
      secret = secrets.access;
      break;

    default:
      secret = secrets.refresh;
      break;
  }
  return secret;
};

export function getRevokeKey(userId, jti) {
  return `revokeToken::${userId}::${jti}`;
}

export function getPrefixRevoke(userId) {
  return `revokeToken::${userId}`;
}
