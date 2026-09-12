import express from "express";
import cors from "cors";
import config from "./config/config.service.js";
import * as routers from "./module/index.js";
import * as middelware from "./common/middelware/index.js";

const app = express();

app.use(cors(), express.json());
app.use("/products", routers.productsRouter);
app.use("/sales", routers.salesRouter);
app.use("/suppliers", routers.suppliersRouter);

app.get("/", (req, res) => {
  res.end("Hello");
});

app.use(middelware.errorHandler);

app.listen(config.port, () => {
  console.log(`server is running on port ${config.port}`);
});
