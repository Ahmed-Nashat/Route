import * as exceptions from "../../common/exceptions/index.js";
import { userModel } from "../../db/model/user.model.js";

export const signup = async (userData) => {
  const { email } = userData;
  const user = await userModel.findOne({ email });
  if (user) exceptions.conflict("Email is already exists");
  return userModel.create(userData);
};

export const login = async (userData) => {
  const { email, password } = userData;
  const [user] = await userModel.find({ email, password });
  console.log(user);

  if (!user) exceptions.notFound("Invalid email or password");
  return {
    status: "loged in",
    user,
  };
};

export const updateUser = async ({ id: userId, userData }) => {
  const { email } = userData;

  const user = await userModel.findOne({
    _id: userId,
    password: userData.password,
  });

  if (!user) exceptions.notFound("User not found");
  delete userData.password && userData.id;

  if (email && email !== user.email) {
    const existing = await userModel.findOne({ email });
    if (existing) exceptions.conflict("Email already exists");
  } else {
    delete userData.email;
  }
  const updatedUser = await user.updateOne(userData);

  return {
    modifiedCount: updatedUser.modifiedCount,
    updatedUser: user,
  };
};

export const deletUser = async ({ id: userId, password }) => {
  const user = await userModel.findOneAndDelete({
    _id: userId,
    password,
  });
  if (!user) exceptions.notFound("User not found");

  return user;
};

export const getUserById = async (userId) => {
  const user = await userModel.findById(userId).populate("notes");
  if (!user) exceptions.notFound("User not found");
  delete user.password;
  const userNotes = user.notes;

  return {
    user,
    totalNotes: userNotes.length,
  };
};
