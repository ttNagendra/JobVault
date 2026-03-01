/**
 * Global Error Handler
 * ---------------------
 * Catches all errors thrown in the app and returns
 * a consistent JSON response.
 *
 * Handles:
 * - Mongoose errors (CastError, duplicate key, validation)
 * - JWT errors (invalid token, expired token)
 * - Multer errors (file too large, unexpected field)
 * - Custom file validation errors (wrong file type)
 */

const multer = require("multer");

const errorHandler = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // ── Mongoose bad ObjectId ──────────────────────
    if (err.name === "CastError") {
        message = `Resource not found. Invalid: ${err.path}`;
        statusCode = 400;
    }

    // ── Mongoose duplicate key ─────────────────────
    if (err.code === 11000) {
        message = `Duplicate value entered for ${Object.keys(err.keyValue).join(
            ", "
        )}`;
        statusCode = 400;
    }

    // ── Mongoose validation error ──────────────────
    if (err.name === "ValidationError") {
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(". ");
        statusCode = 400;
    }

    // ── JWT errors ─────────────────────────────────
    if (err.name === "JsonWebTokenError") {
        message = "Invalid token. Please login again.";
        statusCode = 401;
    }
    if (err.name === "TokenExpiredError") {
        message = "Token has expired. Please login again.";
        statusCode = 401;
    }

    // ── Multer errors (file upload) ────────────────
    if (err instanceof multer.MulterError) {
        statusCode = 400;
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File too large. Maximum size is 5MB";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected file field. Use 'resume' as the field name";
        } else {
            message = `Upload error: ${err.message}`;
        }
    }

    // ── Custom file type validation error ──────────
    // Thrown by multer fileFilter when file is not PDF
    if (err.message === "Only PDF files are allowed") {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
