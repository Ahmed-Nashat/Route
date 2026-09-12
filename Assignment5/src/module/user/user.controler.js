import { Router } from "express";
import * as userService from "./user.service.js";
import { success } from "../../common/utils/response.js";
export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const user = await userService.createUser(req.body);

  return success({
    res,
    msg: user.isNewRecord ? "User created" : "User updated",
    status: user.isNewRecord ? 201 : 200,
    data: user,
  });
});

userRouter.put("/update/:id", async (req, res) => {
  const { user, created } = await userService.updateUser(
    req.params.id,
    req.body,
  );

  return success({
    res,
    data: user,
    status: created ? 201 : 200,
    msg: created ? "User created" : "User updated",
  });
});

userRouter.get("/byEmail", async (req, res) => {
  const user = await userService.findUserByEmail(req.query.email);

  return success({
    res,
    data: user,
    msg: "User fetched",
  });
});

userRouter.get("/:id", async (req, res) => {
  const user = await userService.findUserByPK(req.query.id);

  return success({
    res,
    data: user,
    msg: "User fetched",
  });
});
