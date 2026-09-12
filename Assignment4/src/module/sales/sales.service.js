import * as utils from "../../common/utils/index.js";
import db from "../../db/connection.js";

export const recordSale = async (body, productID) => {
  const { quantitySold, saleDate = new Date().toLocaleTimeString() } = body;
  const findProductQuery = `SELECT * FROM products WHERE productID = ?`;
  const [product] = await db.execute(findProductQuery, [productID]);

  if (!product.length) utils.throwError("Product not found", 404);
  if (product[0].stockQuantity < quantitySold) {
    utils.throwError("Insufficient stock", 400);
  }

  const insertQuery =
    "INSERT INTO sales (productID, quantitySold, saleDate)values(?,?,?)";
  const [salesResult] = await db.execute(insertQuery, [
    productID,
    quantitySold,
    saleDate,
  ]);

  if (!salesResult.insertId) utils.throwError("could not record sale");

  const updateStockQuery = `
        UPDATE products 
        SET stockQuantity = stockQuantity - ?
        WHERE productID = ? 
    `;
  await db.execute(updateStockQuery, [quantitySold, productID]);

  return {
    saleID: salesResult.insertId,
    productID,
    quantitySold,
    saleDate,
  };
};

export const getAllSales = async () => {
  const findQuery = `SELECT * FROM sales`;
  const [sales] = await db.execute(findQuery);

  if (sales.length) {
    return sales;
  }
  utils.throwError("There are no sales to return", 404);
};

export const totalQuantitySoldPerProduct = async () => {
  const query = `
        SELECT p.productID, p.productName, 
        COALESCE(SUM(s.quantitySold), 0) AS totalQuantitySold
        FROM products p 
        LEFT JOIN sales s ON p.productID = s.productID
        GROUP BY p.productID, p.productName;
    `;
  const [results] = await db.execute(query);
  return results;
};

export const getUnSoldProduct = async () => {
  const query = `
        SELECT p.* FROM products p
        LEFT JOIN sales s ON p.productID = s.productID
        WHERE s.saleID IS NULL;
    `;
  const [products] = await db.execute(query);
  return products;
};

export const getAllSalesWithProductDetails = async () => {
  const query = `
    SELECT p.productName, s.quantitySold, s.saleDate
    FROM sales s
    INNER JOIN products p ON s.productID = p.productID;
  `;
  const [sales] = await db.execute(query);
  return sales;
};
