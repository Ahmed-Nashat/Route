import path from "path";
import { config } from "dotenv";

const filePath = path.resolve(import.meta.dirname, "../../.env");

config({
  path: filePath,
});

export default {
  DB_URI: process.env.DB_URI,
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT || 3000,
};
