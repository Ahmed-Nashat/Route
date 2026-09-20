import { enums, verifyToken } from "../../common/index.js";

export const getUserById = async (userToken) => {
  return await verifyToken(userToken, enums.tokenTypesEnum.access);
};
