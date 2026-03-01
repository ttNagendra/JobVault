/**
 * Admin Routes
 * ──────────────
 * GET    /api/v1/admin/users       — list all users
 * DELETE /api/v1/admin/users/:id   — delete a user
 * GET    /api/v1/admin/jobs        — list all jobs
 * DELETE /api/v1/admin/jobs/:id    — delete any job
 */

const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteAnyJob,
} = require("../controllers/adminController");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

// All admin routes require authentication + admin role
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/jobs", getAllJobs);
router.delete("/jobs/:id", deleteAnyJob);

module.exports = router;
