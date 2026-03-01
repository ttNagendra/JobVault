/**
 * User Model
 * -----------
 * Stores user accounts with role-based access.
 * Passwords are hashed before saving.
 * Includes a helper to compare passwords and generate JWT tokens.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your name"],
            trim: true,
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // exclude from queries by default
        },
        role: {
            type: String,
            enum: ["seeker", "recruiter", "admin"],
            default: "seeker",
        },
        phone: {
            type: String,
            default: "",
        },
        resume: {
            public_id: { type: String, default: "" },
            url: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

// ──── Hash password before save ────────────────────
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// ──── Compare entered password with hashed password ─
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ──── Generate JWT token ───────────────────────────
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model("User", userSchema);
