export const success = ({
  res,
  msg = "done",
  status = 200,
  data = undefined,
}) => {
  res.status(status).json({
    msg,
    data,
  });
};
