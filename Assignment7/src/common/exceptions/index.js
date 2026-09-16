export const conflict = (msg) => {
  throw new Error(msg, { cause: 409 });
};

export const notFound = (msg) => {
  throw new Error(msg, { cause: 404 });
};

export const forbidden = (msg) => {
  throw new Error(msg, { cause: 403 });
};
