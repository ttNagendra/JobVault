/**
 * Cloudinary Configuration
 * -------------------------
 * 1. Configures the Cloudinary SDK using environment variables.
 * 2. Creates a CloudinaryStorage instance for multer to stream
 *    uploaded files directly to the "jobportal/resumes" folder.
 * 3. Only PDF files are accepted (resource_type: "raw").
 */

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ── Step 1: Configure Cloudinary SDK with .env credentials ──
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Step 2: Create storage engine for multer ────────────────
// Files are streamed directly to Cloudinary without touching disk.
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "jobportal/resumes",        // Cloudinary folder path
        allowed_formats: ["pdf"],           // Accept only PDF files
        resource_type: "raw",               // Non-image file type
    },
});

module.exports = { cloudinary, storage };
