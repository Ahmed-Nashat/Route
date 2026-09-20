import { config } from "dotenv";
import fs from "fs";

const envFile = `.env.${process.env.NODE_ENV}`;
const envFilePath =
  process.env.NODE_ENV && fs.existsSync(envFile) ? envFile : ".env";

config({ path: envFilePath });

export const port = Number(process.env.PORT),
  db_uri = process.env.DB_URI,
  enc_algo = process.env.ENC_ALGO,
  key = process.env.KEY,
  iv_length = Number(process.env.IV_LENGTH),
  user_access_secret_key = process.env.USER_ACCESS_SECRET_KEY,
  user_refresh_secret_key = process.env.USER_REFRESH_SECRET_KEY

