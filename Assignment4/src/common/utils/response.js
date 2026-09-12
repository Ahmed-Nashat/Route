export const success = ({
  res,
  msg = "done",
  data = undefined,
  status = 200,
}) => {
  res.status(status).json({
    msg,
    data,
    status,
  });
};
