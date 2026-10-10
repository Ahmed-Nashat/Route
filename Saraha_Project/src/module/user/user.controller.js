import { Router } from "express";
import {
  response,
  authMiddleware,
  validator,
  decryptPhoneNumber,
  roleBasedAccessMiddleware,
  enums,
} from "../../common/index.js";
import * as userService from "./user.service.js";
import { getUserByIdSchema, pagginationSchema } from "./user.validation.js";

export const userRouter = Router();

// ---------------------- GET SIGNED IN USER PROFILE ---------
userRouter.get(
  "/",
  authMiddleware,
  roleBasedAccessMiddleware([enums.roleEnum.user]),
  async (req, res) => {
    req.user.phone = decryptPhoneNumber(req.user);
    return response({
      res,
      msg: "User fetched",
      data: req.user || {},
    });
  },
);

// ---------------------- GET USER PROFILE -------------------
userRouter.get(
  "/profile/:userId",
  validator(getUserByIdSchema),
  async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.validate.params.userId);
      if (req.validate.query.phoneNumber) {
        user.phoneNumber = decryptPhoneNumber(user);
      }
      return response({
        res,
        msg: "User fetched",
        data: user,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- GET ALL USERS ----------------------
userRouter.get(
  "/getAllUsers",
  authMiddleware,
  roleBasedAccessMiddleware([enums.roleEnum.admin]),
  validator(pagginationSchema),
  async (req, res, next) => {
    try {
      const users = await userService.getAllusers(
        req.query.page,
        req.query.limit,
      );
      return response({
        res,
        msg: "Users fetched",
        data: users,
      });
    } catch (e) {
      next(e);
    }
  },
);
