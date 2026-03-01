/**
 * Send Token Response
 * --------------------
 * Generates a JWT, sets it as an httpOnly cookie, and sends
 * a JSON response with the user object and token.
 */

const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();

    // Cookie options
    const cookieExpire = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;
    const options = {
        expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
        user,
        token,
    });
};

module.exports = sendToken;
