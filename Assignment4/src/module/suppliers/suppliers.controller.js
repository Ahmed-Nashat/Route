import * as suppliersService from "./suppliers.service.js";
import { Router } from "express";
import { utils } from "../../common/index.js";
import { asyncErrorHandler } from "../../common/middelware/index.js";

export const suppliersRouter = Router();

// ----------------------  CREATE ----------------------
suppliersRouter.post(
  "/create",
  asyncErrorHandler(async (req, res) => {
    const supplier = await suppliersService.createSupplier(req.body);

    return utils.success({
      res,
      msg: "supplier created",
      data: supplier,
      status: 201,
    });
  }),
);

// ----------------------  GET SUPPLIERS ---------------
suppliersRouter.get(
  "/getSuppliers",
  asyncErrorHandler(async (req, res) => {
    const suppliers = await suppliersService.getAllSuppliers();

    return utils.success({
      res,
      msg: "done",
      data: suppliers,
    });
  }),
);

// ----------------------  UPDATE SUPPLIERS ------------

suppliersRouter.patch(
  "/update/:id",
  asyncErrorHandler(async (req, res) => {
    const supplierID = req.params.id;
    const supplier = await suppliersService.updateSupplier(
      req.body,
      supplierID,
    );

    return utils.success({
      res,
      msg: "supplier updated",
      data: supplier,
    });
  }),
);

// ----------------------  DELETE SUPPLIERS ------------
suppliersRouter.delete(
  "/delete/:id",
  asyncErrorHandler(async (req, res) => {
    const supplierID = req.params.id;
    const supplier = await suppliersService.deleteSupplier(supplierID);

    return utils.success({
      res,
      msg: "supplier deleted",
      data: supplier,
    });
  }),
);

// ---------------------- MODIFY CONTACT NUMBER --------
suppliersRouter.patch(
  "/modifyContactNumber",
  asyncErrorHandler(async (req, res) => {
    const result = await suppliersService.modifyContactNumber();
    return utils.success({
      res,
      msg: result.msg,
    });
  }),
);

// ---------------------- START WITH F --------
suppliersRouter.get(
  "/searchSupplier",
  asyncErrorHandler(async (req, res) => {
    const data = await suppliersService.getSuppliersStartingWithF();
    return utils.success({
      res,
      msg: "Suppliers starting with F retrieved",
      data,
    });
  }),
);
