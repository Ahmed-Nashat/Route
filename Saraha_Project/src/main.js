import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import { errorHandler } from "./common/index.js";
import { port, origins } from "./config/config.service.js";
import * as routers from "./module/index.js";
import helmet from "helmet";

const app = express();

// ---------------------- DB CONNECTION ----------------------
try {
  await connectDB();
} catch (error) {
  console.error(`Database connection failed: ${error.message}`);
  process.exit(1);
}

app.use(
  cors({
    // allow this to connect to the database
    // origin: function (origin, cb) {
    //   if (!origins.includes(origin))
    //     cb(new Error("Not allowed origin"), origin);
    //   else cb(null, origin);
    // },
  }),
);
app.use(helmet());
app.use(express.json());

// ---------------------- ROUTES -----------------------------
app.use("/user", routers.userRouter);
app.use("/auth", routers.authRouter);
app.use("/message", routers.messageRouter);
app.use("/uploads", express.static("uploads"));

// ---------------------- HEALTH CHECK -----------------------
app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: 1,
  });
});

// ---------------------- DUMMY ------------------------------
app.use("/{*dummy}", (req, res, next) => {
  res.status(404).json({
    msg: "404 PAGE NOT FOUND",
    route: req.params.dummy.join("/"),
  });
});

// ---------------------- MIDDLEWARE -------------------------
app.use(errorHandler);

// ---------------------- SERVER LISTING ---------------------
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
