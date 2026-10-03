import { forbiddenException } from "../exceptions/index.js";

export const roleBasedAccessMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(Number(req.user.role))) {
      forbiddenException("Authnticated users only");
    }
    next();
  };
};
