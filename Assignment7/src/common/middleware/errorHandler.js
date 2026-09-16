export const errorHandler = async (err, req, res, next) => {
  return res.status(Number(err.cause) || Number(err.statusCode) || 500).json({
    msg: err.message,
    // stack: err.stack,
  });
};
