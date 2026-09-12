export const throwError = (msg = "Internal server error", status = 500) => {
  throw new Error(msg, { cause: status });
};
