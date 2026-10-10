import { isValidObjectId } from "mongoose";
import { badRequestException, notFoundException } from "../exceptions/index.js";

export default class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      return await this.model.create(data);
    } catch (e) {
      badRequestException("Something went wrong");
    }
  }

  async find(where = {}, projection = null, options = {}, skip, limit) {
    const object = await this.model.find(where).skip(skip).limit(limit);
    return object;
  }

  async findOne({ filter = {}, projection = null, options = {} }) {
    const object = await this.model.findOne(filter, projection, options);
    return object;
  }

  async findById({ id, projection = null, options = {}, select }) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    const object = await this.model.findById(id).select(select);
    return object;
  }

  async updateOne({ filter = {}, data = {}, options = {} }) {
    const object = await this.model.updateOne(filter, data, {
      returnDocument: "after",
    });
    if (!object) notFoundException("Object not found");
    return object;
  }

  async findByIdAndUpdate({ id, data = {}, options = { new: true } }) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    const object = await this.model.findByIdAndUpdate(id, data, options);
    if (!object) notFoundException("Object not found");
    return object;
  }

  async findByIdAndDelete({ id, options = {} }) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    const object = await this.model.findByIdAndDelete(id, options);
    if (!object) notFoundException("Object not found");
    return object;
  }

  async deleteOne({ filter = {}, options = {} }) {
    const object = await this.model.deleteOne(filter, options);
    if (!object) notFoundException("Object not found");
    return object;
  }
}
