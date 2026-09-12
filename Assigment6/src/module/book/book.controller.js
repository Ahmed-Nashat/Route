import * as bookService from "./book.service.js";
import { Router } from "express";
import { response } from "../../common/index.js";

export const bookRouter = Router();

bookRouter.post("/addBook", async (req, res, next) => {
  try {
    const book = await bookService.createBook(req.body);

    return response({
      res,
      msg: "Book created",
      data: book ? book : { ok: 0 },
      status: 201,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.post("/addManyBook", async (req, res, next) => {
  try {
    const book = await bookService.createManyBooks(req.body);

    return response({
      res,
      msg: "Books created",
      data: book ? book : { ok: 0 },
      status: 201,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.post("/books/index", async (req, res, next) => {
  try {
    const indexName = await bookService.creatBookTitleIndex();
    return res.status(200).send(indexName);
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books", async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();
    return response({
      res,
      msg: "Books fetched",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/skipLimit", async (req, res, next) => {
  try {
    const books = await bookService.skipLimit();
    return response({
      res,
      msg: "Books fetched",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.patch("/books/update", async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.query.name, req.body);
    return response({
      res,
      msg: "Book updates",
      data: book,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/findBook", async (req, res, next) => {
  try {
    const book = await bookService.findBook(req.query.name);
    return response({
      res,
      msg: "Book fetched",
      data: book,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/year", async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const books = await bookService.getBooksByYearRange(from, to);
    return response({
      res,
      msg: "Books fetched",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/genre", async (req, res, next) => {
  try {
    const { genre } = req.query;
    console.log(genre);

    const books = await bookService.getBooksGenre(genre);
    return response({
      res,
      msg: "Books fetched",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/genreExclude", async (req, res, next) => {
  try {
    const { genre } = req.query;
    const books = await bookService.getBooksExcludedGenres(genre.split(","));

    return response({
      res,
      msg: "Books fetched",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/yeariInteger", async (req, res, next) => {
  try {
    const books = await bookService.getBooksYearInteger();
    return response({
      res,
      msg: "Books with integer year fetched",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.delete("/books/deleteBooks", async (req, res, next) => {
  try {
    const year = req.query.year;
    const books = await bookService.deleteBookBeforeYear(year);

    return response({
      res,
      msg: books.deletedCount > 0 ? "Books deleted" : "No books found",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/aggregate1", async (req, res, next) => {
  try {
    const year = req.query.year;
    const books = await bookService.filterAndSort(year);

    return response({
      res,
      msg: books.length > 0 ? "Books fetched" : "No books found",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/aggregate2", async (req, res, next) => {
  try {
    const year = req.query.year;
    const books = await bookService.getBooksPublishedAfterYear(year);

    return response({
      res,
      msg: books.length > 0 ? "Books fetched" : "No books found",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/aggregate3", async (req, res, next) => {
  try {
    const books = await bookService.separateGenres();

    return response({
      res,
      msg: books.length > 0 ? "Books fetched" : "No books found",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});

bookRouter.get("/books/aggregate4", async (req, res, next) => {
  try {
    const books = await bookService.joinLogs();

    return response({
      res,
      msg: books.length > 0 ? "Books fetched" : "No books found",
      data: books,
      status: 200,
    });
  } catch (e) {
    next(e);
  }
});
