/**
 * Application Model
 * ------------------
 * Represents a job seeker's application to a specific job.
 *
 * Fields:
 * - job       : Reference to the Job being applied for
 * - applicant : Reference to the User (seeker) who applied
 * - resume    : Cloudinary URL of the uploaded PDF resume
 * - status    : Application lifecycle — pending → accepted / rejected
 */

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        // ── Reference to the Job listing ────────────────
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job reference is required"],
        },

        // ── Reference to the applicant (seeker) ────────
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Applicant reference is required"],
        },

        // ── Cloudinary URL of the uploaded resume PDF ──
        resume: {
            type: String,
            required: [true, "Resume URL is required"],
        },

        // ── Application status tracking ────────────────
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
