import { enums, userRepo, verifyToken } from "../../common/index.js";

export const getUserById = async (userToken) => {
  return await verifyToken({
    token: userToken,
    tokenType: enums.tokenTypesEnum.access,
  });
};

export const updateUser = async ({ userToken, updatedData }) => {
  const user = await verifyToken({
    token: userToken,
    tokenType: enums.tokenTypesEnum.access,
  });

  return await userRepo.findByIdAndUpdate(user.id, updatedData, { new: true });
};
