import { Op } from "sequelize";
import { userModel } from "../../db/model/user.model.js";

export async function checkUserExistence(userId) {
  const user = await postModel.findByPk(userId);
  if (!user) throw new Error("Post not found", { cause: 404 });
  return user;
}

export const createUser = async (userDate) => {
  const exist = await userModel.findOne({
    where: {
      email: userDate.email,
    },
  });
  if (exist) {
    throw new Error("Email already exists", { cause: 409 });
  }
  const user = userModel.build(userDate);
  console.log(user);
  console.log(user.isNewRecord);

  await user.save();
  return user;
};

export const updateUser = async (userId, data) => {
  const { email } = data;
  const existEmail = await userModel.findOne({
    where: {
      email,
      id: {
        [Op.ne]: userId,
      },
    },
  });
  if (existEmail) {
    throw new Error("Email is already taken", { cause: 409 });
  }

  const [updatedUser, created] = await userModel.upsert({
    id: userId,
    ...data,
  });

  return { user: updatedUser, created: Boolean(created) };
};

export const findUserByEmail = async (userEmail) => {
  const isExist = await userModel.findOne({
    where: {
      email: userEmail,
    },
    attributes: {
      exclude: ["password"],
    },
  });
  if (!isExist) {
    throw new Error("User not found", { cause: 404 });
  }
  console.log(isExist);

  return isExist;
};

export const findUserByPK = async (userId) => {
  const isExist = await userModel.findByPk(userId, {
    attributes: {
      exclude: ["role", "password"],
    },
  });
  if (!isExist) {
    throw new Error("User not found", { cause: 404 });
  }

  return isExist;
};
