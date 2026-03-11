import { User } from "../models/user.model.js";
import { verifyTokens } from "../utils/token.utils.js";

export const authenticate = async (req, res, next) => {
    try {
        let token;
        
        //berar token in header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, token missing" });
        }
        
        //decoded token
        const decoded = verifyTokens(token, process.env.ACCESS_SCRET);
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, token invalid" });
        }

        // Attach logged-in user to req
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();

    } catch (error) {
        res.status(500).json({ message: "Server error in authentication", error: error.message });

    }

};

// Role-based authorization 
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: `User role ${req.user.role} is not allowed` });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: "Server error in role authorization", error: error.message });
        }
    };
};