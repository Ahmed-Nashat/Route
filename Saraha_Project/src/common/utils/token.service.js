import {
  user_access_secret_key,
  user_refresh_secret_key,
} from "../../config/config.service.js";
import jwt from "jsonwebtoken";
import { checkExistenceById } from "../helpers/index.js";
import * as enums from "../enum/index.js";
import { userModel } from "../../db/model/index.js";

export const createTokens = ({ userId, issuer }) => {
  const jwtid = Math.ceil(Math.random() * 1000).toString();

  return {
    accessToken: jwt.sign(
      {
        sub: userId,
      },
      user_access_secret_key,
      {
        expiresIn: "30m",
        issuer,
        audience: [enums.tokenTypesEnum.access],
        jwtid,
      },
    ),
    refreshToken: jwt.sign(
      {
        sub: userId,
      },
      user_refresh_secret_key,
      {
        expiresIn: "1d",
        issuer,
        audience: [enums.tokenTypesEnum.refresh],
        jwtid,
      },
    ),
  };
};

export const verifyToken = async ({ token, tokenType }) => {
  const secret = getSecret(tokenType);
  const { sub } = jwt.decode(token);
  jwt.verify(token, secret);

  return await checkExistenceById({
    model: userModel,
    searchParameter: sub,
    msg: "User not found",
    selectQuery: ["name", "firstName", "lastName", "email", "gender"],
  });
};

const getSecret = (tokenType) => {
  let secret = null;
  switch (tokenType) {
    case enums.tokenTypesEnum.access:
      secret = user_access_secret_key;
      break;

    default:
      secret = user_refresh_secret_key;
      break;
  }
  return secret;
};
