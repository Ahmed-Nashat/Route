import { Router } from "express";
import * as commentService from "./comment.service.js";
import { success } from "../../common/utils/response.js";

export const commentRouter = Router();

commentRouter.post("/createComment", async (req, res) => {
  const comment = await commentService.createComment(req.body);

  return success({
    res,
    data: comment,
    status: 201,
  });
});

commentRouter.patch("/update", async (req, res) => {
  const commentId = req.query.id;
  const body = req.body;
  const comment = await commentService.updateComment(commentId, body);

  return success({
    res,
    msg: "Comment updated",
    data: comment,
  });
});

commentRouter.post("/findOrCreate", async (req, res) => {
  const { comment, created } = await commentService.findOrCreateComment(
    req.body,
  );
  return success({
    res,
    data: comment,
    status: created ? 201 : 200,
    msg: created ? "Comment created" : "Comment already exists",
  });
});

commentRouter.get("/search", async (req, res) => {
  const comments = await commentService.searchComment(req.query.word);
  return success({
    res,
    data: comments,
    msg: "Comments retrived",
  });
});

commentRouter.get("/recent", async (req, res) => {
  const comments = await commentService.getRecentComments();
  return success({
    res,
    data: comments,
    msg: "Here is the latest 3 comments",
  });
});

commentRouter.get("/details/:id", async (req, res) => {
  const commentId = req.params.id;
  const comment = await commentService.getCommentDetails(commentId);
  return success({
    res,
    data: comment,
    msg: "Comment details retrieved successfully",
  });
});
