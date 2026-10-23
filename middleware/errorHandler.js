/**
 * Production-ready Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let errors = undefined;

  // Mongoose buffering timeout (database temporarily unavailable)
  if (err.message && err.message.includes('buffering timed out')) {
    statusCode = 503;
    message = 'Database service is temporarily unavailable. Please retry in a few moments.';
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field '${err.path}': ${err.value}`;
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired.';
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for field '${field}'. A record with this value already exists.`;
  }

  // In production, mask unexpected 500 errors to prevent leaking internal details
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    console.error(`[Server Error 500]:`, err);
    message = 'An unexpected internal server error occurred.';
  }

  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
