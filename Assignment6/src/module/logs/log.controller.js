import { Router } from "express";
import * as logService from "./log.service.js";
import { response } from "../../common/index.js";

export const logRouter = Router();

logRouter.post("/logs/capped", async (req, res, next) => {
  try {
    const result = await logService.creatCappedLogs();
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

logRouter.post("/logs", async (req, res, next) => {
  try {
    const log = await logService.creatLog(req.body);
    return response({
      res,
      msg: "Log created",
      data: log,
      status: 201,
    });
  } catch (e) {
    next(e);
  }
});
