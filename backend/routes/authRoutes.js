/**
 * Auth Routes
 * ─────────────
 * POST /api/v1/auth/register
 * POST /api/v1/auth/login
 * GET  /api/v1/auth/logout
 * GET  /api/v1/auth/me
 */

const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/authController");
const isAuthenticated = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getMe);

module.exports = router;
