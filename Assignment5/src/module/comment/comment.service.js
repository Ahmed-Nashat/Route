import { Op } from "sequelize";
import { commentModel } from "../../db/model/comment.model.js";
import { checkPostExistence } from "../post/post.service.js";
import { checkUserExistence } from "../user/user.service.js";
import { userModel } from "../../db/model/user.model.js";
import { postModel } from "../../db/model/post.model.js";

export async function checkCommentExistence(commentId) {
  const comment = await commentModel.findByPk(commentId);
  if (!comment) throw new Error("Post not found", { cause: 404 });
  return comment;
}

export const createComment = async (data) => {
  const { postId, userId } = data;

  checkUserExistence(userId);
  checkPostExistence(postId);

  const comment = new commentModel(data);
  await comment.save();
  return comment;
};

export const updateComment = async (commentId, data) => {
  const { userId, content } = data;

  const comment = checkCommentExistence(commentId);

  const isOwner = comment.userId === userId;
  if (!isOwner) throw new Error("Unauthorized", { cause: 401 });

  const updatedComment = await comment.update({ content });
  return updatedComment;
};

export const findOrCreateComment = async (data) => {
  const { postId, userId, content } = data;

  checkUserExistence(userId);
  checkPostExistence(postId);

  const [comment, created] = await commentModel.findOrCreate({
    where: {
      postId,
      userId,
      content,
    },
    defaults: {
      postId,
      userId,
      content,
    },
  });
  return { comment, created };
};

export const searchComment = async (word = "") => {
  const result = await commentModel.findAndCountAll({
    where: {
      content: {
        [Op.like]: `%${word}%`,
      },
    },
  });
  if (result.rows < 1) throw new Error("No comments found", { cause: 404 });

  return {
    matchedCount: result.count,
    comments: result.rows,
  };
};

export const getRecentComments = async () => {
  return await commentModel.findAll({
    order: [["createdAt", "DESC"]],
    limit: 3,
  });
};

export const getCommentDetails = async (commentId) => {
  const comment = await commentModel.findByPk(commentId, {
    include: [
      {
        model: userModel,
        attributes: { exclude: ["password"] },
      },
      {
        model: postModel,
      },
    ],
  });

  if (!comment) {
    throw new Error("Comment not found", { cause: 404 });
  }

  return comment;
};
