import { authorModel, logModel } from "../../db/model/index.js";

export const addAuthor = async (data) => {
  let authorLog;
  const exists = await authorModel.findOne({ name: data.name });
  if (exists) {
    authorLog = {
      authorName: data.name,
      action: `${data.name} is already taken`,
      createdAt: new Date(),
    };
    await logModel.insertOne(authorLog);
    throw new Error(`${data.name} is already taken`, { cause: 409 });
  }

  const author = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await authorModel.insertOne(author);

  authorLog = {
    authorName: author.name,
    authorId: author._id,
    action: "Created",
    createdAt: new Date(),
  };
  await logModel.insertOne(authorLog);
  return { author, authorLog };
};
