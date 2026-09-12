import express from "express";
import * as routers from "./module/index.js";
import { db } from "./db/connection.js";
import configService from "./config/config.service.js";
import { errorHandler } from "./common/middleware/globalErrorHandler.js";

const app = express();
const port = configService.PORT;
app.use(express.json());

// await db();
app.use("/collection", routers.bookRouter);
app.use("/collection", routers.authorRouter);
app.use("/collection", routers.logRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
