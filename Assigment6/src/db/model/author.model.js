import { db } from "../connection.js";
export const authorModel = await db.createCollection("authors");
