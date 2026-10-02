module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  let message = err.message;
  if (err.code === 11000) { status = 409; message = 'Resource already exists'; }
  if (err.name === 'CastError') { status = 400; message = 'Invalid resource ID'; }
  if (err.name === 'ValidationError') { status = 422; message = 'Database validation failed'; }
  if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(err.name)) {
    status = 401; message = 'Invalid or expired authentication token';
  }
  if (status >= 500) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    message = 'Internal server error';
  }
  res.status(status).json({ success: false, message, ...(err.errors && status < 500 ? { errors: err.errors } : {}) });
};
