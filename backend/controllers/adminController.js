/**
 * Admin Controller
 * -----------------
 * Admin-only operations: manage users and jobs.
 */

const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

// ──── Get All Users ────────────────────────────────
exports.getAllUsers = catchAsync(async (_req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
});

// ──── Delete User ──────────────────────────────────
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ApiError("User not found", 404));

    // Don't allow deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
        return next(new ApiError("Cannot delete your own account", 400));
    }

    // Also remove related applications
    await Application.deleteMany({ applicant: user._id });
    // Also remove jobs created by this user (if recruiter)
    await Job.deleteMany({ createdBy: user._id });

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
});

// ──── Get All Jobs (Admin view) ────────────────────
exports.getAllJobs = catchAsync(async (_req, res) => {
    const jobs = await Job.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
});

// ──── Delete Any Job ───────────────────────────────
exports.deleteAnyJob = catchAsync(async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError("Job not found", 404));

    // Remove related applications
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.status(200).json({ success: true, message: "Job deleted by admin" });
});
