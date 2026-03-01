/**
 * Application Routes
 * ────────────────────
 * POST /api/v1/applications/apply/:jobId   — seeker applies with resume upload
 * GET  /api/v1/applications/me             — seeker's applications
 * GET  /api/v1/applications/job/:jobId     — recruiter views applicants
 * PUT  /api/v1/applications/:id            — recruiter updates status
 */

const express = require("express");
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
} = require("../controllers/applicationController");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const uploadResume = require("../middleware/uploadResume");

// ── Seeker routes ───────────────────────────────────────

// Apply to a job with PDF resume upload
// Middleware chain: auth → role check → file upload → controller
router.post(
    "/apply/:jobId",
    isAuthenticated,
    authorizeRoles("seeker"),
    uploadResume,
    applyToJob
);

// Get all applications submitted by the logged-in seeker
router.get(
    "/me",
    isAuthenticated,
    authorizeRoles("seeker"),
    getMyApplications
);

// ── Recruiter routes ────────────────────────────────────

// View all applicants for a specific job
router.get(
    "/job/:jobId",
    isAuthenticated,
    authorizeRoles("recruiter"),
    getJobApplicants
);

// Update application status (accept / reject)
router.put(
    "/:id",
    isAuthenticated,
    authorizeRoles("recruiter"),
    updateApplicationStatus
);

module.exports = router;
