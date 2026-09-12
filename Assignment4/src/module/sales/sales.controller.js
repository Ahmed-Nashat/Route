import * as salesService from "./sales.service.js";
import { Router } from "express";
import { utils } from "../../common/index.js";
import { asyncErrorHandler } from "../../common/middelware/index.js";

export const salesRouter = Router();

// ---------------------- GET SALES ----------------------
salesRouter.get(
  "/getSales",
  asyncErrorHandler(async (req, res) => {
    const sales = await salesService.getAllSales();

    return utils.success({
      res,
      msg: "All sales retrived",
      data: sales,
    });
  }),
);

// ---------------------- RECORD A SALE ------------------
salesRouter.post(
  "/recordSale/:productID",
  asyncErrorHandler(async (req, res) => {
    const productID = req.params.productID;
    const sale = await salesService.recordSale(req.body, productID);

    return utils.success({
      res,
      msg: "sale done",
      data: sale,
    });
  }),
);

// ---------------------- TOTAL SOLD ---------------------
salesRouter.get(
  "/totalQuantitySold",
  asyncErrorHandler(async (req, res) => {
    const data = await salesService.totalQuantitySoldPerProduct();
    return utils.success({
      res,
      msg: "Total quantity per product retrieved",
      data,
    });
  }),
);

// ---------------------- UNSOLD PRODUCT ------------------
salesRouter.get(
  "/unsoldProducts",
  asyncErrorHandler(async (req, res) => {
    const data = await salesService.getUnSoldProduct();
    return utils.success({ res, msg: "Unsold products retrieved", data });
  }),
);

// ---------------------- DETAILS SALES -------------------
salesRouter.get(
  "/detailedSales",
  asyncErrorHandler(async (req, res) => {
    const data = await salesService.getAllSalesWithProductDetails();
    return utils.success({
      res,
      msg: "Detailed sales retrieved",
      data,
    });
  }),
);
