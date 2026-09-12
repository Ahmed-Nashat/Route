import express from "express";
import config from "./config/config.service.js";
import { checkdb } from "./db/connection.js";
import { setupAssociations } from "./db/model/index.js";
import * as routes from "./module/index.js";
import { errorHandler } from "./middleware/index.js";

const app = express();
const port = config.port;

app.use(express.json());

setupAssociations();
await checkdb();

app.use("/user", routes.userRouter);
app.use("/post", routes.postRouter);
app.use("/comment", routes.commentRouter);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
