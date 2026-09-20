import { userModel } from "../../db/model/user.model.js";
import BaseRepo from "./base.repo.js";

class UserRepo extends BaseRepo {
  constructor() {
    super(userModel);
  }

  async findByEmail(email, projection = null) {
    return await this.findOne({ email: email?.toLowerCase() }, projection);
  }
}

export const userRepo = new UserRepo();
