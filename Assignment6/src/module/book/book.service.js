import { ObjectId } from "mongodb";
import { bookModel, authorModel, logModel } from "../../db/model/index.js";

export const createBook = async (data) => {
  const author = await authorModel.findOne({ _id: new ObjectId(data.author) });
  let bookLog;

  if (!author) {
    bookLog = await logModel.insertOne({
      book: data.title,
      action: `Creation failed, Author ${data.author} not found`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    throw new Error(`Author ${data.author} not found`, { cause: 404 });
  }

  const book = {
    ...data,
    author: new ObjectId(data.author),
    createdAt: new Date(),
  };
  await bookModel.insertOne(book);

  bookLog = {
    bookName: book.title,
    bookId: book._id,
    action: "Created",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await logModel.insertOne(bookLog);

  return { book, book_log: bookLog };
};

export const createManyBooks = async (data) => {
  const authors = [];
  const insertedBooks = [];
  const bookLog = [];

  await Promise.all(
    data.map(async (book) => {
      const exists = await authorModel.findOne({
        _id: new ObjectId(book.author),
      });

      if (exists) {
        const newBook = {
          ...book,
          author: new ObjectId(book.author),
          createdAt: new Date(),
        };
        const createdBook = await bookModel.insertOne(newBook);
        insertedBooks.push(newBook);

        authors.push(book.author);
        bookLog.push({
          bookName: book.title,
          bookId: createdBook.insertedId,
          action: "Created",
          createdAt: new Date(),
        });
      } else {
        authors.push(`Author ${book.author} does not exist`);
        bookLog.push({
          book: book.title,
          action: `Createion faild, Author ${book.author} not found`,
          createdAt: new Date(),
        });
      }
    }),
  );

  if (insertedBooks.length === 0) {
    throw new Error("No valid authors found", { cause: 400 });
  }
  await logModel.insertMany(bookLog);

  return {
    books: insertedBooks,
    authors,
    count: insertedBooks.length,
    book_Log: bookLog,
  };
};

export const updateBook = async (bookName, data) => {
  const { _id, ...updateData } = data;
  const filter = bookName
    ? { title: bookName }
    : _id
      ? { _id: new ObjectId(_id) }
      : {};

  if (updateData.author) {
    updateData.author = new ObjectId(updateData.author);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    filter,
    { $set: { ...updateData, updatedAt: new Date() } },
    {
      includeResultMetadata: false,
      returnDocument: "after",
    },
  );

  if (!updatedBook) throw new Error("Book not found", { cause: 404 });

  const bookLog = await logModel.insertOne({
    book: updatedBook._id,
    action: "update",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { updatedBook, bookLog };
};

export const getAllBooks = async () => {
  return await bookModel
    .aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { name: 1, _id: 0 } }],
        },
      },
      {
        $set: { author: { $ifNull: [{ $arrayElemAt: ["$author", 0] }, null] } },
      },
    ])
    .toArray();
};

export const skipLimit = async () => {
  return await bookModel
    .aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [
            {
              $project: {
                name: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $set: { author: { $ifNull: [{ $arrayElemAt: ["$author", 0] }, null] } },
      },
    ])
    .skip(2)
    .limit(3)
    .toArray();
};

export const findBook = async (bookName) => {
  const book = await bookModel.findOne({ title: bookName });
  if (!book) throw new Error(`${bookName} is not found`, { cause: 404 });
  return book;
};

export const creatBookTitleIndex = async () => {
  return await bookModel.createIndex({ title: 1 });
};

export const getBooksByYearRange = async (fromYear, toYear) => {
  const books = await bookModel
    .find({
      year: {
        $gte: Number(fromYear),
        $lte: Number(toYear),
      },
    })
    .toArray();

  return {
    books,
    count: `${books.length === 1 ? books.length + " book" : books.length + " books"} found`,
  };
};

export const getBooksGenre = async (searchWord) => {
  const books = await bookModel.find({ geners: searchWord }).toArray();

  return {
    books,
    count: `${books.length === 1 ? books.length + " book" : books.length + " books"} found`,
  };
};

export const getBooksExcludedGenres = async (searchWord) => {
  const books = await bookModel
    .find({ geners: { $nin: searchWord } })
    .toArray();

  return {
    books,
    count: `${books.length === 1 ? books.length + " book" : books.length + " books"} found`,
  };
};

export const getBooksYearInteger = async () => {
  return await bookModel
    .find({
      year: { $type: "int" },
    })
    .toArray();
};

export const deleteBookBeforeYear = async (year) => {
  return await bookModel.deleteMany({
    year: { $lt: Number(year) },
  });
};

export const filterAndSort = async (providedYear) => {
  const books = await bookModel
    .aggregate([
      {
        $match: { year: { $gt: Number(providedYear) } },
      },
      {
        $sort: { year: -1 },
      },
    ])
    .toArray();
  return books;
};

export const getBooksPublishedAfterYear = async (providedYear) => {
  const books = await bookModel
    .aggregate([
      {
        $match: { year: { $gt: Number(providedYear) } },
      },
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $project: {
          title: 1,
          author: { $arrayElemAt: ["$author.name", 0] },
          year: 1,
          _id: 0,
        },
      },
    ])
    .toArray();
  return books;
};

export const separateGenres = async () => {
  const books = await bookModel
    .aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$geners",
      },
      {
        $project: {
          title: 1,
          author: { $arrayElemAt: ["$author.name", 0] },
          year: 1,
          geners: 1,
          _id: 0,
        },
      },
    ])
    .toArray();
  return books;
};

export const joinLogs = async () => {
  const books = await bookModel
    .aggregate([
      {
        $lookup: {
          from: "logs",
          localField: "_id",
          foreignField: "bookId",
          as: "logs",
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: '_id',
          as: "author",
        },
      },
      {
        $project: {
          action: { $arrayElemAt: ["$logs.action", 0] },
          title: "$title",
          year: "$year",
          author: { $arrayElemAt: ["$author.name", 0] },
          _id: 0,
        },
      },
    ])
    .toArray();
  console.log(books);
  return books;
};
