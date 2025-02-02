const jwt = require("jsonwebtoken");
const { jwt: { secret } } = require('../../config/jwt.config');

module.exports = async (req, res, next) => {
    try {
        // Check if the Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                result: "Authorization header is missing"
            });
        }

        // Check if the Authorization header is in the correct format
        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                result: "Invalid Authorization format. Expected format: 'Bearer <token>'"
            });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                result: "Token is missing in the Authorization header"
            });
        }

        // Verify the token
        try {
            req.user = jwt.verify(token, secret);

            if(req.user.role !== 'admin'){
                return res.status(401).json({
                    success: false,
                    result: "You are not authorized to access this resource"
                });
            }

            next();
        } catch (error) {
            console.error("JWT verification failed:", error.message);
            return res.status(401).json({
                success: false,
                result: "Invalid or expired token"
            });
        }
    } catch (error) {
        console.error("Unexpected error in check-auth middleware:", error);
        return res.status(500).json({
            success: false,
            result: "Internal server error"
        });
    }
};
