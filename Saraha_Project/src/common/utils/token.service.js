import {
  user_access_secret_key,
  user_refresh_secret_key,
  admin_access_secret_key,
  admin_refresh_secret_key,
} from "../../config/config.service.js";
import jwt from "jsonwebtoken";
import * as enums from "../enum/index.js";
import { notFoundException, serverException } from "../exceptions/index.js";
import { userRepo } from "../repo/user.repo.js";

export const createTokens = ({
  userId,
  issuer,
  role = enums.roleEnum.user,
}) => {
  const jwtid = Math.ceil(Math.random() * 1000).toString();

  let secrets = getTokenSecretsForRole(role);

  return {
    accessToken: jwt.sign(
      {
        sub: userId,
      },
      secrets.access,
      {
        expiresIn: "30m",
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
        expiresIn: "1d",
        issuer,
        audience: [role],
        jwtid,
      },
    ),
  };
};

export const verifyToken = async ({ token, tokenType }) => {
  const { aud, sub } = jwt.decode(token);
  console.log({ sub });

  const secret = getTokenSecretForType(tokenType, aud[0]);  
  jwt.verify(token, secret);

  const user = await userRepo.findById({
    id: sub,
    select: ["name", "firstName", "lastName", "email", "role", "gender"],
  });  
  if (!user) notFoundException("User not found");

  return user;
};

const getTokenSecretsForRole = (role) => {
  let secret;
  switch (parseInt(role)) {
    case enums.roleEnum.admin:
      secret = {
        access: admin_access_secret_key,
        refresh: admin_refresh_secret_key,
      };
      break;

    case enums.roleEnum.user:
      secret = {
        access: user_access_secret_key,
        refresh: user_refresh_secret_key,
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
