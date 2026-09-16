import mongoose from "mongoose";
import configservice from "../config/config.service.js";

export default async () => {
  try {
    await mongoose.connect(configservice.DB_URI, {
      dbName: configservice.DB_NAME,
    });
    await mongoose.syncIndexes();
    console.log("DB connected");
  } catch (e) {
    throw new Error(e.message);
  }
};
