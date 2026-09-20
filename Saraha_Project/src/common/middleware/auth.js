import * as enums from "../enum/index.js";
import { verifyToken } from "../utils/index.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  // inject new property into request
  req.user = await verifyToken({
    token,
    tokenType: enums.tokenTypesEnum.access,
  });
  next();
};
