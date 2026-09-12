export const errorHandler = (err, req, res, next) => {
  if (err.name === "SequelizeValidationError") {
    const validationErrors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      msg: "Validation error",
      errors: validationErrors,
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      msg: err.errors[0]?.message || "Duplicate field value",
    });
  }

  const statusCode = typeof err.cause === "number" ? err.cause : 500;
  return res.status(statusCode).json({
    msg: err.message,
    stack: process.env.NODE_ENV === "dev" ? err.stack : undefined,
  });
};
