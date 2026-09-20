import mongoose from "mongoose";
import { db_uri } from "../config/config.service.js";

export default async () => {
  if (!db_uri) {
    throw new Error("DB_URI is missing. Add it to your .env file.");
  }

  await mongoose.connect(db_uri, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.log(`DB connected: ${mongoose.connection.name}`);
};
