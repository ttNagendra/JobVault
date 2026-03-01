/**
 * Job Controller
 * ----------------
 * CRUD operations for job postings.
 * Supports search by title/location, pagination, and sorting.
 */

const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

// ──── Get All Jobs (public, paginated, searchable) ──
exports.getJobs = catchAsync(async (req, res) => {
    const { keyword, location, category, sort, page, limit } = req.query;

    // Build filter object
    const filter = {};
    if (keyword) {
        filter.title = { $regex: keyword, $options: "i" };
    }
    if (location) {
        filter.location = { $regex: location, $options: "i" };
    }
    if (category) {
        filter.category = { $regex: category, $options: "i" };
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const perPage = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * perPage;

    // Sorting (default: newest first)
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "salary") sortOption = { salary: -1 };

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
        .populate("createdBy", "name email")
        .sort(sortOption)
        .skip(skip)
        .limit(perPage);

    res.status(200).json({
        success: true,
        count: jobs.length,
        total,
        totalPages: Math.ceil(total / perPage),
        currentPage: pageNum,
        jobs,
    });
});

// ──── Get Single Job ────────────────────────────────
exports.getJob = catchAsync(async (req, res, next) => {
    const job = await Job.findById(req.params.id).populate(
        "createdBy",
        "name email"
    );
    if (!job) return next(new ApiError("Job not found", 404));
    res.status(200).json({ success: true, job });
});

// ──── Create Job (Recruiter) ────────────────────────
exports.createJob = catchAsync(async (req, res) => {
    req.body.createdBy = req.user._id;
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, message: "Job posted", job });
});

// ──── Update Job (Recruiter — own jobs only) ────────
exports.updateJob = catchAsync(async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError("Job not found", 404));

    // Only the creator can update
    if (job.createdBy.toString() !== req.user._id.toString()) {
        return next(new ApiError("Not authorized to update this job", 403));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, message: "Job updated", job });
});

// ──── Delete Job (Recruiter — own jobs, or Admin) ───
exports.deleteJob = catchAsync(async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError("Job not found", 404));

    // Allow creator or admin
    if (
        job.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        return next(new ApiError("Not authorized to delete this job", 403));
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: "Job deleted" });
});

// ──── Get Recruiter's Own Jobs ──────────────────────
exports.getMyJobs = catchAsync(async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({
        createdAt: -1,
    });
    res.status(200).json({ success: true, count: jobs.length, jobs });
});
