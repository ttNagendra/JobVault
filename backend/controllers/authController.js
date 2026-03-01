/**
 * Auth Controller
 * -----------------
 * Handles user registration, login, logout, and fetching
 * the currently authenticated user.
 */

const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const sendToken = require("../utils/sendToken");

// ──── Register ─────────────────────────────────────
exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, role, phone } = req.body;

    // Prevent registering as admin through the API
    if (role === "admin") {
        return next(new ApiError("Cannot register as admin", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError("Email already registered", 400));
    }

    const user = await User.create({ name, email, password, role, phone });
    sendToken(user, 201, res, "Registered successfully");
});

// ──── Login ────────────────────────────────────────
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ApiError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ApiError("Invalid email or password", 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ApiError("Invalid email or password", 401));
    }

    sendToken(user, 200, res, "Login successful");
});

// ──── Logout ───────────────────────────────────────
exports.logout = catchAsync(async (_req, res) => {
    res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({ success: true, message: "Logged out successfully" });
});

// ──── Get Current User ─────────────────────────────
exports.getMe = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
});
