export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found: ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}`;
  }
  if (err.code === 11000) {
    status = 409;
    message = `${Object.keys(err.keyValue).join(', ')} already exists`;
  }

  res.status(status).json({
    success: false,
    data: null,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};