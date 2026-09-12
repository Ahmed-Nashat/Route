// import { logModel } from "../../db/model/log.model.js";
import { bookModel } from "../../db/model/index.js";
import { ObjectId } from "mongodb";
// import { createLogsCollection } from "../../db/connection.js";

export const creatCappedLogs = async () => {
  await createLogsCollection();
  return { ok: 1 };
};

export const creatLog = async (data) => {
  const exists = await bookModel.findOne({ _id: new ObjectId(data.book) });
  if (!exists) throw new Error("Book not exists", { cause: 404 });

  const log = prepareLog(data);
  await logModel.insertOne(log);
  return log;
};
