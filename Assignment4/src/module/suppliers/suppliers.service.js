import * as utils from "../../common/utils/index.js";
import db from "../../db/connection.js";

export const createSupplier = async (body) => {
  const { supplierName, contactNumber } = body;
  const findQuery = `SELECT * FROM suppliers WHERE SupplierName = ?`;
  const [supplier] = await db.execute(findQuery, [supplierName]);

  if (supplier.length) utils.throwError("Supplier is already exists", 409);

  const insertQuery = ` INSERT INTO suppliers (SupplierName, ContactNumber)values(?,?)`;
  const [result] = await db.execute(insertQuery, [supplierName, contactNumber]);

  if (!result.insertId) utils.throwError("Supplier could not be created", 500);

  return { supplierID: result.insertId, supplierName, contactNumber };
};

export const getAllSuppliers = async () => {
  const findQuery = `SELECT * FROM suppliers`;
  const [suppliers] = await db.execute(findQuery);

  if (!suppliers.length) {
    utils.throwError("There is no suppliers to return", 404);
  }
  return suppliers;
};

export const updateSupplier = async (body, supplierID) => {
  const { supplierName, contactNumber } = body;
  const findQuery = `SELECT * FROM suppliers WHERE supplierID = ?`;
  const [supplier] = await db.execute(findQuery, [supplierID]);

  if (supplier.length) {
    const updateQuery = `
    UPDATE suppliers 
    SET supplierName = ?,
    contactNumber = ?
    WHERE supplierID = ?
    `;
    const [updatedSupplier] = await db.execute(updateQuery, [
      supplierName,
      contactNumber,
      supplierID,
    ]);
    if (!updatedSupplier.changedRows) {
      utils.throwError("supplier is not updated");
    }

    return supplier[0];
  }
  utils.throwError("Suuplier not found", 404);
};

export const deleteSupplier = async (supplierID) => {
  const findQuery = `SELECT * FROM suppliers WHERE supplierID = ?`;
  const [supplier] = await db.execute(findQuery, [supplierID]);

  if (supplier.length) {
    const deleteQuery = `DELETE FROM suppliers WHERE supplierID = ?`;
    const [result] = await db.execute(deleteQuery, [supplierID]);
    if (!result.affectedRows) utils.throwError("supplier could not be deleted");
    return supplier[0];
  }
  utils.throwError("supplier not found", 404);
};

export const modifyContactNumber = async () => {
  const query = `ALTER TABLE suppliers MODIFY COLUMN contactNumber VARCHAR(15);`;
  await db.execute(query);
  return { msg: "ContactNumber modified to VARCHAR(15)" };
};

export const getSuppliersStartingWithF = async () => {
  const query = `
    SELECT * FROM suppliers WHERE supplierName LIKE 'F%';
  `;
  const [suppliers] = await db.execute(query);
  return suppliers;
};
