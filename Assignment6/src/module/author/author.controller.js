import { Router } from "express";
import * as authorService from "./author.service.js";
import { response } from "../../common/index.js";

export const authorRouter = Router();

authorRouter.post("/authors", async (req, res) => {
  const author = await authorService.addAuthor(req.body);
  return response({
    res,
    msg: "Author added",
    data: author,
    status: 201,
  });
});
