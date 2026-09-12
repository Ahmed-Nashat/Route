import dotenv from "dotenv";
import path from "path";

const nodeEnv = process.env.NODE_ENV || "dev";
const envFilePath = path.resolve(
  import.meta.dirname,
  `../../.env.${nodeEnv}`,
);
dotenv.config({
  path: envFilePath,
});

const db_uri = process.env.DB_URI;

if (!db_uri) {
  throw new Error("db_uri is mmissing", { cause: 500 });
}

export default {
  port: Number(process.env.PORT ?? 3500),
  DB_URI: db_uri,
};
