import { userModel } from "../../db/model/index.js";
import {
  badRequestException,
  encryptPhoneNumber,
  checkExistence,
  createTokens,
  verifyToken,
  myCompare,
  myHash,
  enums,
} from "../../common/index.js";
import * as helper from "../../db/repositery/base.repo.js";

export const creatUser = async (userData) => {
  const { email } = userData;

  await checkExistence({
    model: userModel,
    searchParameter: { email },
    isTrue: true,
    msg: "User already exists",
    statusCode: 409,
  });

  encryptPhoneNumber(userData);

  return await helper.create({
    model: userModel,
    data: {
      ...userData,
      DOB: new Date(userData.DOB),
      password: await myHash(userData.password),
    },
  });
};

export const login = async (userData, issuer) => {
  const { email, password } = userData;
  const user = await checkExistence({
    model: userModel,
    searchParameter: { email },
    msg: "User not found",
  });

  const isCorrectPassword = await myCompare({
    plainText: password,
    cypherText: user.password,
  });
  if (!isCorrectPassword) badRequestException("Invalid email or password");

  return createTokens({ userId: user.id, issuer });
};

export const refreshToken = async (refreshToken, issuer) => {
  const user = await verifyToken({
    token: refreshToken,
    tokenType: enums.tokenTypesEnum.refresh,
  });
  return createTokens({ userId: user.id, issuer });
};
