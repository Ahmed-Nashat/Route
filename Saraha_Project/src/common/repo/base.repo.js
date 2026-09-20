import { isValidObjectId } from "mongoose";
import { badRequestException } from "../exceptions/index.js";

export default class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async find(filter = {}, projection = null, options = {}) {
    return await this.model.find(filter, projection, options);
  }

  async findOne(filter = {}, projection = null, options = {}) {
    return await this.model.findOne(filter, projection, options);
  }

  async findById(id, projection = null, options = {}) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    return await this.model.findById(id, projection, options);
  }

  async updateOne(filter = {}, data = {}, options = {}) {
    return await this.model.updateOne(filter, data, options);
  }

  async findByIdAndUpdate(id, data = {}, options = { new: true }) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    return await this.model.findByIdAndUpdate(id, data, options);
  }

  async findByIdAndDelete(id, options = {}) {
    if (!isValidObjectId(id)) {
      badRequestException("Invalid ID");
    }
    return await this.model.findByIdAndDelete(id, options);
  }

  async deleteOne(filter = {}, options = {}) {
    return await this.model.deleteOne(filter, options);
  }
}
