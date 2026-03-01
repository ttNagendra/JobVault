/**
 * catchAsync
 * -----------
 * Wraps an async controller function so that any thrown error
 * is automatically forwarded to Express's next() error handler.
 */

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
