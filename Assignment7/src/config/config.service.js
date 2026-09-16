import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const envFilePath = path.resolve(currentDir, "../../.env");

config({ path: envFilePath });

export default {
  DB_URI: process.env.DB_URI,
  DB_NAME: process.env.DB_NAME,
};
