import express from "express";
import connectDB from "./db/connection.js";
import { errorHandler } from "./common/index.js";
import {port} from "./config/config.service.js";
import * as routers from "./module/index.js";

const app = express();

try {
  await connectDB();
} catch (error) {
  console.error(`Database connection failed: ${error.message}`);
  process.exit(1);
}
app.use(express.json());

app.use("/user", routers.userRouter);
app.use("/auth", routers.authRouter);

app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: 1,
  });
});

app.use("/{*dummy}", (req, res, next) => {
  console.log(req.params.dummy);

  res.status(404).json({
    msg: "404 PAGE NOT FOUND",
    // join -> join the array's valuse
    route: req.params.dummy.join("/"),
  });
});

app.use(errorHandler);
app.listen(port, () => {
  console.log("server is running");
});
