import { Router } from "express";
import { success } from "../../common/index.js";
import * as authService from "./auth.service.js";

export const authRouter = Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const user = await authService.creatUser(req.body);
    return success({
      res,
      msg: user ? "User created" : "Failed",
      data: user ? user : null,
      status: 201,
    });
  } catch (e) {
    next(e);
  }
});

authRouter.get("/login", async (req, res, next) => {
  const issuer = `${req.protocol}//${req.hostname}`;
  try {
    const tokens = await authService.login(req.body, issuer);

    return success({
      res,
      msg: "User loged in",
      data: tokens
    });
  } catch (e) {
    next(e);
  }
});

authRouter.get("/refreshToken", async (req, res, next) => {
  const refreshToken = req.headers.authorization;
  const issuer = `${req.protocol}//${req.hostname}`;
  try {
    const tokens = await authService.refreshToken(refreshToken, issuer);
    return success({
      res,
      msg: "Token refreshed",
      data: tokens,
    });
  } catch (e) {
    next(e);
  }
});
