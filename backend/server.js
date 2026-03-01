/**
 * Server Entry Point
 * ────────────────────
 * Bootstraps Express with middleware, routes, and error handling.
 * Connects to MongoDB and starts listening.
 */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// ── Load env variables ──────────────────────────────
dotenv.config();

// ── Import routes ───────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ── Core middleware ─────────────────────────────────
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health check ────────────────────────────────────
app.get("/", (_req, res) => {
    res.json({ success: true, message: "Job Portal API is running 🚀" });
});

// ── API routes ──────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/admin", adminRoutes);

// ── Global error handler (must be after routes) ─────
app.use(errorHandler);

// ── Start server ────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});

module.exports = app;
