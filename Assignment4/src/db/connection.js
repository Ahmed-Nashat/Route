import { createPool } from "mysql2/promise";
import config from "../config/config.service.js";

let connect = async ()=>{
    let db = await createPool(config.DB_URI);
    return db;
}

export default await connect();
