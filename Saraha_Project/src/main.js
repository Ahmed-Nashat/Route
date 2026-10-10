import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import { errorHandler, redisService } from "./common/index.js";
import { port } from "./config/config.service.js";
import * as routers from "./module/index.js";

const app = express();

// ---------------------- DB CONNECTION ----------------------
try {
  await connectDB();
} catch (error) {
  console.error(`Database connection failed: ${error.message}`);
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// ---------------------- ROUTES -----------------------------
app.use("/user", routers.userRouter);
app.use("/auth", routers.authRouter);

// ---------------------- HEALTH CHECK -----------------------
app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: 1,
  });
});

// ---------------------- DUMMY ------------------------------
app.use("/{*dummy}", (req, res, next) => {
  console.log(req.params.dummy);

  res.status(404).json({
    msg: "404 PAGE NOT FOUND",
    route: req.params.dummy.join("/"),
  });
});

// ---------------------- MIDDLEWARE -------------------------
app.use(errorHandler);

// ---------------------- SERVER LISTING ---------------------
app.listen(port, () => {
  console.log("server is running");
});
