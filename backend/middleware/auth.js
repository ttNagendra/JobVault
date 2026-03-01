/**
 * Authentication Middleware
 * --------------------------
 * Extracts the JWT from the cookie (or Authorization header),
 * verifies it, and attaches the user to req.user.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const isAuthenticated = catchAsync(async (req, _res, next) => {
    // 1. Get token from cookie or header
    let token = req.cookies?.token;
    if (
        !token &&
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ApiError("Please login to access this resource", 401));
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user
    req.user = await User.findById(decoded.id);
    if (!req.user) {
        return next(new ApiError("User no longer exists", 401));
    }

    next();
});

module.exports = isAuthenticated;
