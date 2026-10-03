import { Router } from "express";
import { response, validator } from "../../common/index.js";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";

export const authRouter = Router();

// ---------------------- REFRESH TOKEN ----------------------
authRouter.get(
  "/refreshToken",
  validator(authValidation.refreshTokenSchema),
  async (req, res, next) => {
    const refreshToken = req.headers.authorization;
    const issuer = `${req.protocol}//${req.hostname}`;
    try {
      const tokens = await authService.refreshToken(refreshToken, issuer);
      return response({
        res,
        msg: "Token refreshed",
        data: tokens,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- SIGNUP -----------------------------
authRouter.post(
  "/signup",
  // validation midlleware
  validator(authValidation.signupSchema),
  async (req, res, next) => {
    try {
      const user = await authService.creatUser(req.validate.body);
      return response({
        res,
        msg: user ? "User created" : "User creation failed",
        data: user ? user : null,
        status: 201,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- LOGIN ------------------------------
authRouter.post(
  "/login",
  // validation midlleware
  validator(authValidation.loginSchema),
  async (req, res, next) => {
    const issuer = `${req.protocol}//${req.hostname}`;
    try {
      const tokens = await authService.login(req.validate.body, issuer);
      return response({
        res,
        msg: "User loged in",
        data: tokens,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- LOGIN WITH GOOGLE ------------------
authRouter.post("/loginWithGmail", async (req, res, next) => {
  try {
    const issuer = `${req.protocol}://${req.host}`;
    const { token, status } = await authService.loginWithGmail(
      req.body,
      issuer,
    );
    return response({
      res,
      msg: "Loged in with google",
      data: token,
      status,
    });
  } catch (e) {
    next(e);
  }
});
