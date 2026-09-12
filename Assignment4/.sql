CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'StorePassword123!';
GRANT SELECT, INSERT, UPDATE ON assigment_4_retail_store.* TO 'store_manager'@'localhost';
FLUSH PRIVILEGES;

REVOKE UPDATE ON assigment_4_retail_store.* FROM 'store_manager'@'localhost';
FLUSH PRIVILEGES;

GRANT DELETE ON assigment_4_retail_store.sales TO 'store_manager'@'localhost';
FLUSH PRIVILEGES;
