import {
  badRequestException,
  conflictException,
  notFoundException,
  encryptPhoneNumber,
  createTokens,
  verifyToken,
  myCompare,
  myHash,
  enums,
  userRepo,
} from "../../common/index.js";

export const creatUser = async (userData) => {
  const { email } = userData;

  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) conflictException("User already exists");

  encryptPhoneNumber(userData);

  return await userRepo.create({
    ...userData,
    DOB: new Date(userData.DOB),
    password: await myHash(userData.password),
  });
};

export const login = async (userData, issuer) => {
  const { email, password } = userData;
  const user = await userRepo.findByEmail(email);
  if (!user) notFoundException("User not found");

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
