import db from "../../db/connection.js";
import * as utils from "../../common/utils/index.js";

export const createProduct = async (productData) => {
  const { productName, price, stockQuantity, supplierID } = productData;
  const findQuery = `SELECT productName from products WHERE productName = ?`;
  const [existing] = await db.execute(findQuery, [productName]);

  if (existing.length) utils.throwError("This product is already exists", 409);

  const createQuery = `INSERT INTO products (productName, price, stockQuantity, supplierID)values(?,?,?,?)`;
  const [product] = await db.execute(createQuery, [
    productName,
    price,
    stockQuantity,
    supplierID,
  ]);

  if (!product.insertId) utils.throwError("Product not created", 500);
  return product;
};

export const getAllProducts = async (productID) => {
  if (productID) {
    const findQuery = `SELECT * FROM products WHERE productID = ?`;
    const [product] = await db.execute(findQuery, [productID]);

    if (product.length) return product;

    utils.throwError();
  }

  const findQuery = `SELECT * FROM products`;
  const [products] = await db.execute(findQuery);

  if (products.length) return products;

  utils.throwError("There are no products to return", 404);
};

export const updateProduct = async (body, productID) => {
  const { price, stockQuantity, supplierID } = body;
  const findQuery = `SELECT * FROM products WHERE productID = ?`;
  const [product] = await db.execute(findQuery, [productID]);

  if (product.length) {
    const updateQuery = `
        UPDATE products 
        SET price = ?, 
        stockQuantity = ?, 
        supplierID = ? 
        WHERE productID = ?;
        `;
    const [updatedProduct] = await db.execute(updateQuery, [
      price,
      stockQuantity,
      supplierID,
      productID,
    ]);
    if (!updatedProduct.affectedRows) {
      utils.throwError("product is not updated");
    }
    return product[0];
  }
  utils.throwError("product not found", 404);
};

export const deleteProduct = async (productID) => {
  const findQuery = `SELECT * FROM products WHERE productID = ?`;
  const [product] = await db.execute(findQuery, [productID]);

  if (product.length) {
    const deleteQuery = `DELETE FROM products WHERE productID = ?`;
    const [result] = await db.execute(deleteQuery, [productID]);

    if (!result.affectedRows) utils.throwError("product could not be deleted");

    return product[0];
  }
  utils.throwError("product not found", 404);
};

export const addCategoryColumn = async () => {
  const query = `ALTER TABLE products ADD COLUMN category VARCHAR(100);`;
  await db.execute(query);
  return { msg: "Category column added" };
};

export const removeCategoryColumn = async () => {
  const query = `ALTER TABLE products DROP COLUMN category;`;
  await db.execute(query);
  return { msg: "Category column removed" };
};

export const modifyProductNameNotNull = async () => {
  const query = `ALTER TABLE products MODIFY COLUMN productName VARCHAR(255) NOT NULL;`;
  await db.execute(query);
  return { msg: "ProductName modified to NOT NULL" };
};

export const getHighestStockProduct = async () => {
  const query = `
    SELECT * FROM products ORDER BY stockQuantity DESC LIMIT 1;
  `;
  const [products] = await db.execute(query);
  if (!products.length) utils.throwError("No products found", 404);
  return products[0];
};
