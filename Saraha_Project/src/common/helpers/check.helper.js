import { error } from "../utils/index.js";

export const checkExistence = async ({
  model,
  searchParameter,
  option,
  selectQuery,
  isTrue = false,
  msg = `${model?.modelName || "Document"} not found`,
  statusCode = 404,
}) => {
  const object = await model
    .findOne(searchParameter, option)
    .select(selectQuery);
  if (isTrue) {
    if (object) error(msg, { cause: statusCode });
  }
  if (!isTrue && !object) error(msg, { cause: statusCode });

  return object;
};

export const checkExistenceById = async ({
  model,
  searchParameter,
  selectQuery,
  isTrue = false,
  msg = `${model?.modelName || "Document"} not found`,
  statusCode = 404,
}) => {
  const object = await model.findById(searchParameter).select(selectQuery);
  if (isTrue) {
    if (object) error(msg, { cause: statusCode });
  }
  if (!isTrue && !object) error(msg, { cause: statusCode });

  return object;
};
