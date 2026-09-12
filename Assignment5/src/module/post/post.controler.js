import { Router } from "express";
import * as postService from "./post.service.js";
import { success } from "../../common/utils/response.js";

export const postRouter = Router();

postRouter.post("/", async (req, res) => {
  const post = await postService.createPost(req.body);

  return success({
    res,
    data: post,
    status: 201,
    msg: "Post created",
  });
});

postRouter.delete("/delete", async (req, res) => {
  const post = await postService.deletePost(req.body);

  return success({
    res,
    data: post,
    msg: "Post deleted",
  });
});

postRouter.get("/getPost", async (req, res) => {
  const post = await postService.getPost(req.query.id);

  return success({
    res,
    data: post,
    msg: "success",
  });
});

postRouter.get("/commentCount", async (req, res) => {
  const post = await postService.commentCount(req.query.id);

  return success({
    res,
    data: post,
    msg: "success",
  });
});
