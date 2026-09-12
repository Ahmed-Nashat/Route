export const errorHandler = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(error.cause || 422).json({
      msg: error.message || "Validation Error",
    });
  }

  console.log(error);
  res.status(error.cause || 500).json({
    msg: error.message || "Internal server error",
  });
};
