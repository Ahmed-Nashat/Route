import express from "express";
import { errorHandler } from "./src/common/index.js";
import connectDB from "./src/db/connection.js";
import * as routers from "./src/module/index.js";

const app = express();
const port = 3000;
app.use(express.json());

await connectDB();

app.use("/users", routers.userRouter);
app.use("/notes", routers.noteRouter);

app.use(errorHandler);
app.listen(port, () => {
  console.log("Server is running");
});
