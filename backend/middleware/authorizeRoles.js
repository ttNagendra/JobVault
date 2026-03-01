/**
 * Role Authorization Middleware
 * ------------------------------
 * Restricts access to users with specific roles.
 * Must be used AFTER the isAuthenticated middleware.
 *
 * Usage: authorizeRoles("recruiter", "admin")
 */

const ApiError = require("../utils/ApiError");

const authorizeRoles = (...roles) => {
    return (req, _res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    `Role '${req.user.role}' is not authorized to access this resource`,
                    403
                )
            );
        }
        next();
    };
};

module.exports = authorizeRoles;
