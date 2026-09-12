import { db } from "../connection.js";

// export const bookModel = await db.createCollection("books");
export const bookModel = db.collection("books");
