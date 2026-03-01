/**
 * Job Model
 * ----------
 * Represents a job posting created by a recruiter.
 * Linked to the User who created it via `createdBy`.
 */

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a job title"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Please provide a job description"],
        },
        company: {
            type: String,
            required: [true, "Please provide the company name"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Please provide the job location"],
            trim: true,
        },
        salary: {
            type: String,
            default: "Not disclosed",
        },
        category: {
            type: String,
            default: "General",
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
