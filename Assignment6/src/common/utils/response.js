export const response = ({ res, status, msg = " done", data = undefined }) => {
  return res.status(status).json({
    msg,
    data,
  });
};
