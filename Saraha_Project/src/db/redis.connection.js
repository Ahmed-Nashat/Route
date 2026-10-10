import { createClient } from "redis";
import { redis_uri } from "../config/config.service.js";

export const redisClient = createClient({
  url: redis_uri,
});

export const redisConnection = async () => {
  try {
    await redisClient.connect()
    console.log("Redis connected");
  } catch (e) {
    console.log(e);
    throw e;
  }
};
