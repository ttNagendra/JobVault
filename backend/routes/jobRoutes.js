/**
 * Job Routes
 * ────────────
 * GET    /api/v1/jobs          — public, paginated, searchable
 * GET    /api/v1/jobs/:id      — public, single job
 * POST   /api/v1/jobs          — recruiter only
 * PUT    /api/v1/jobs/:id      — recruiter (own job)
 * DELETE /api/v1/jobs/:id      — recruiter (own job) or admin
 * GET    /api/v1/jobs/me/posted — recruiter's own jobs
 */

const express = require("express");
const router = express.Router();
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
} = require("../controllers/jobController");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

// Public routes
router.get("/", getJobs);
router.get("/me/posted", isAuthenticated, authorizeRoles("recruiter"), getMyJobs);
router.get("/:id", getJob);

// Protected routes (recruiter)
router.post("/", isAuthenticated, authorizeRoles("recruiter"), createJob);
router.put("/:id", isAuthenticated, authorizeRoles("recruiter"), updateJob);
router.delete(
    "/:id",
    isAuthenticated,
    authorizeRoles("recruiter", "admin"),
    deleteJob
);

module.exports = router;
