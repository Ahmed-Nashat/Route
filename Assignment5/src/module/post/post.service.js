import { commentModel } from "../../db/model/comment.model.js";
import { postModel } from "../../db/model/post.model.js";
import { userModel } from "../../db/model/user.model.js";
import { checkUserExistence } from "../user/user.service.js";

export async function checkPostExistence(postId) {
  const post = await postModel.findByPk(postId);
  if (!post) throw new Error("Post not found", { cause: 404 });
  return post;
}

export const createPost = async (data) => {
  const { userId } = data;
  const user = checkUserExistence(userId);

  const post = new postModel(data);
  await post.save();
  return post.dataValues;
};

export const deletePost = async (data) => {
  const { id, userId } = data;

  const post = checkPostExistence(id) 

  const isOwner = post.userId === userId;
  if (!isOwner) throw new Error("Unauthorized", { cause: 401 });

  post.destroy();

  return post;

  //   const isOwner = await postModel.findOne({
  //     where: {
  //       id,
  //       userId,
  //     },
  //   });
};

export const getPost = async (postId) => {
  await checkPostExistence(postId);

  return await postModel.findByPk(postId, {
    attributes: ["id", "title"],

    include: [
      {
        model: userModel,
        attributes: ["id", "name"],
      },
      {
        model: commentModel,
        attributes: ["id", "content"],
      },
    ],
  });
};

export const commentCount = async (postId) => {
  const post = await checkPostExistence(postId);
  const { id, title } = post.dataValues;

  const count = await commentModel.count({
    where: { postId },
  });

  return {
    id,
    title,
    Comment: count,
  };
};
