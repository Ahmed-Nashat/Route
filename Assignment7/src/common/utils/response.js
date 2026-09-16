export const response = async ({
  res,
  msg = "done",
  data = undefined,
  status = 200,
}) => {
  return res.status(status).json({
    msg,
    data,
  });
};
