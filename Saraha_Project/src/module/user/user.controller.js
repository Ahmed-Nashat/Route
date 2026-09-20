import { Router } from "express";
import { success } from "../../common/index.js";
import * as userService from "./user.service.js";
import { authMiddleware } from "../../common/index.js";

export const userRouter = Router();

userRouter.get("/", authMiddleware, async (req, res, next) => {
  try {
    return success({
      res,
      msg: "User fetched",
      status: 200,
      data: req.user,
    });
  } catch (e) {
    next(e);
  }
});
