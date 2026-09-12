import * as productService from "./products.service.js";
import { Router } from "express";
import { utils } from "../../common/index.js";
import { asyncErrorHandler } from "../../common/middelware/index.js";

export const productsRouter = Router();

// ---------------------- CREATE ----------------------
productsRouter.post(
  "/create",
  asyncErrorHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);

    return utils.success({
      res,
      msg: "product created",
      data: product,
      status: 201,
    });
  }),
);

// ---------------------- GET PRODUCTS ----------------
productsRouter.get(
  "/getProduct/:id?",
  asyncErrorHandler(async (req, res) => {
    const productID = req.params.id;
    const product = await productService.getAllProducts(productID);

    return utils.success({
      res,
      msg: "product found",
      data: product,
    });
  }),
);

// ---------------------- UPDATE ----------------------
productsRouter.patch(
  "/update/:id",
  asyncErrorHandler(async (req, res) => {
    const productID = req.params.id;
    const product = await productService.updateProduct(req.body, productID);

    return utils.success({
      res,
      msg: "product updated",
      data: product,
    });
  }),
);

// ---------------------- DELETE ----------------------
productsRouter.delete(
  "/delete/:id",
  asyncErrorHandler(async (req, res) => {
    const productID = req.params.id;
    const product = await productService.deleteProduct(productID);

    return utils.success({
      res,
      msg: "product deleted",
      data: product,
    });
  }),
);

// ---------------------- ADD CATEGORY COLUMN ---------
productsRouter.patch(
  "/addCategory",
  asyncErrorHandler(async (req, res) => {
    const result = await productService.addCategoryColumn();
    return utils.success({
      res,
      msg: result.msg,
    });
  }),
);

// ---------------------- DROP CATEGORY COLUMN --------
productsRouter.patch(
  "/removeCategory",
  asyncErrorHandler(async (req, res) => {
    const result = await productService.removeCategoryColumn();
    return utils.success({
      res,
      msg: result.msg,
    });
  }),
);

// ---------------------- MODIFY PRODUCT NAME  --------
productsRouter.patch(
  "/modifyProductName",
  asyncErrorHandler(async (req, res) => {
    const result = await productService.modifyProductNameNotNull();
    return utils.success({
      res,
      msg: result.msg,
    });
  }),
);

// ---------------------- HIGHEST STOCK  --------
productsRouter.get(
  "/highestStock",
  asyncErrorHandler(async (req, res) => {
    const data = await productService.getHighestStockProduct();
    return utils.success({ res, msg: "Highest stock product retrieved", data });
  }),
);