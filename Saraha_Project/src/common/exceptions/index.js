import { error } from "../utils/index.js";

export const notFoundException = (msg = "Not Found") =>
  error(msg, { cause: 404 });
export const conflictException = (msg = "Conflict") =>
  error(msg, { cause: 409 });
export const forbiddenException = (msg = "Forbidden") =>
  error(msg, { cause: 403 });
export const badRequestException = (msg = "Bad Request") =>
  error(msg, { cause: 400 });
