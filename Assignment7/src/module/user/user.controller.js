import { Router } from "express";
import * as userService from "./user.service.js";
import { response } from "../../common/index.js";

export const userRouter = Router();

userRouter.post("/signup", async (req, res, next) => {
  try {
    const user = await userService.signup(req.body);
    return response({
      res,
      msg: "User created",
      data: user,
      status: 201,
    });
  } catch (e) {
    next(e);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const user = await userService.login(req.body);
    return response({
      res,
      msg: "User fetched",
      data: user,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

userRouter.patch("/update", async (req, res, next) => {
  const { id } = req.query,
    userData = req.body;
  try {
    const { modifiedCount, ...user } = await userService.updateUser({
      id,
      userData,
    });

    return response({
      res,
      msg: modifiedCount === 0 ? "Nothing updated" : "User updated",
      data: user,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

userRouter.delete("/delete", async (req, res, next) => {
  const { id } = req.query,
    { password } = req.body;
  try {
    const user = await userService.deletUser({ id, password });

    return response({
      res,
      msg: "User deleted",
      data: user,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

userRouter.get("/", async (req, res, next) => {
  const { id } = req.query;
  try {
    const user = await userService.getUserById(id);

    return response({
      res,
      msg: "User fetched",
      data: user,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

