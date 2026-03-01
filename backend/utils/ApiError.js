/**
 * ApiError
 * --------
 * Custom error class that carries an HTTP status code.
 * Thrown inside controllers and caught by the global error handler.
 */

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ApiError;
