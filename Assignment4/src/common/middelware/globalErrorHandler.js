export let errorHandler = (err, req, res, next) => {
  res.status(Number(err.cause) || 500).json({
    msg: err.message,
    err,
    stack: err.stack,
  });
};

// resolve the async errors and throw the error to the global error handler
export let asyncErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
