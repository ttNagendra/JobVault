/**
 * Application Controller
 * -----------------------
 * Handles all job application operations following clean MVC structure.
 *
 * Endpoints:
 * - applyToJob             — Seeker submits application with PDF resume
 * - getMyApplications      — Seeker views their own applications
 * - getJobApplicants       — Recruiter views applicants for their job
 * - updateApplicationStatus — Recruiter accepts/rejects an application
 */

const Application = require("../models/Application");
const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

// ═══════════════════════════════════════════════════════════
// ──── Apply to a Job (Seeker) ─────────────────────────────
// ═══════════════════════════════════════════════════════════
// POST /api/v1/applications/apply/:jobId
// Protected: isAuthenticated → authorizeRoles("seeker") → uploadResume
//
// Steps:
// 1. Verify the user is a job seeker (defense-in-depth)
// 2. Check that the job exists
// 3. Prevent duplicate applications
// 4. Validate that a resume PDF was uploaded
// 5. Save the application with the Cloudinary resume URL
// 6. Return success response with application data
// ═══════════════════════════════════════════════════════════
exports.applyToJob = catchAsync(async (req, res, next) => {
    const { jobId } = req.params;

    // Step 1: Verify user role (defense-in-depth, route also checks)
    if (req.user.role !== "seeker") {
        return next(
            new ApiError("Only job seekers can apply to jobs", 403)
        );
    }

    // Step 2: Check that the job exists in the database
    const job = await Job.findById(jobId);
    if (!job) {
        return next(new ApiError("Job not found", 404));
    }

    // Step 3: Prevent duplicate applications to the same job
    const existing = await Application.findOne({
        job: jobId,
        applicant: req.user._id,
    });
    if (existing) {
        return next(
            new ApiError("You have already applied to this job", 400)
        );
    }

    // Step 4: Validate that a resume file was uploaded via multer
    if (!req.file) {
        return next(
            new ApiError("Please upload your resume (PDF only, max 5MB)", 400)
        );
    }

    // Step 5: Create the application record
    // req.file.path contains the Cloudinary secure URL
    const application = await Application.create({
        job: jobId,
        applicant: req.user._id,
        resume: req.file.path,
        status: "pending",
    });

    // Step 6: Return success response with application data
    res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        resumeUrl: req.file.path,
        application,
    });
});

// ═══════════════════════════════════════════════════════════
// ──── Get My Applications (Seeker) ────────────────────────
// ═══════════════════════════════════════════════════════════
// GET /api/v1/applications/me
// Returns all applications submitted by the logged-in seeker
// ═══════════════════════════════════════════════════════════
exports.getMyApplications = catchAsync(async (req, res) => {
    const applications = await Application.find({ applicant: req.user._id })
        .populate({
            path: "job",
            select: "title company location salary",
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications,
    });
});

// ═══════════════════════════════════════════════════════════
// ──── Get Applicants for a Job (Recruiter) ────────────────
// ═══════════════════════════════════════════════════════════
// GET /api/v1/applications/job/:jobId
// Only the recruiter who posted the job can view its applicants
// ═══════════════════════════════════════════════════════════
exports.getJobApplicants = catchAsync(async (req, res, next) => {
    // Verify the job exists
    const job = await Job.findById(req.params.jobId);
    if (!job) {
        return next(new ApiError("Job not found", 404));
    }

    // Only the recruiter who posted the job can view applicants
    if (job.createdBy.toString() !== req.user._id.toString()) {
        return next(
            new ApiError("Not authorized to view these applicants", 403)
        );
    }

    const applications = await Application.find({ job: req.params.jobId })
        .populate("applicant", "name email phone")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications,
    });
});

// ═══════════════════════════════════════════════════════════
// ──── Update Application Status (Recruiter) ───────────────
// ═══════════════════════════════════════════════════════════
// PUT /api/v1/applications/:id
// Recruiter can update status to: accepted / rejected
// ═══════════════════════════════════════════════════════════
exports.updateApplicationStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    // Validate the status value
    if (!["pending", "accepted", "rejected"].includes(status)) {
        return next(new ApiError("Invalid status value", 400));
    }

    // Find the application and populate the job details
    const application = await Application.findById(req.params.id).populate(
        "job"
    );
    if (!application) {
        return next(new ApiError("Application not found", 404));
    }

    // Only the recruiter who posted the job can update the status
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
        return next(
            new ApiError("Not authorized to update this application", 403)
        );
    }

    // Update and save
    application.status = status;
    await application.save();

    res.status(200).json({
        success: true,
        message: `Application ${status}`,
        application,
    });
});
