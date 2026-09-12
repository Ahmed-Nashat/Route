import { MongoClient } from "mongodb";
import configService from "../config/config.service.js";

export const client = new MongoClient(configService.DB_URI);
const dbName = configService.DB_NAME;

async function connection() {
  await client.connect();
  const db = client.db(dbName);
  console.log("DB connected");
  return db;
}

export const db = await connection();
