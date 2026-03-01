/**
 * Resume Upload Middleware
 * -------------------------
 * Uses multer with Cloudinary storage to handle resume file uploads.
 *
 * Security checks:
 * 1. File type validation — only application/pdf is accepted
 * 2. File size limit    — maximum 5 MB
 *
 * After this middleware runs, req.file contains the Cloudinary upload
 * result, with req.file.path holding the secure URL.
 */

const multer = require("multer");
const { storage } = require("../config/cloudinary");

// ── Step 1: Define a file filter to accept only PDF files ───
const fileFilter = (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);   // Accept the file
    } else {
        // Reject with a descriptive error message
        cb(new Error("Only PDF files are allowed"), false);
    }
};

// ── Step 2: Create the multer instance with storage + limits ─
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB max file size
    },
});

// ── Step 3: Export single-file upload middleware ─────────────
// The field name "resume" must match the FormData key from the frontend.
module.exports = upload.single("resume");
