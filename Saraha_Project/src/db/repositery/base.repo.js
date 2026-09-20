export const findOne = async ({ model, where = {} }) => {
  return await model.findOne(where); // mongoose
};

export const findById = async ({ model, id }) => {
  return await model.findById(id); // mongoose
};

export const create = async ({ model, data }) => {
  return await model.create(data); // mongoose
};
