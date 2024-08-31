const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.log(err);
  console.log(err.message);

  return res.status(400).json({ message: "Error OCcured, check console" });
};

module.exports = { notFound, errorHandler };
