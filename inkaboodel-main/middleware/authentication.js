const jwt = require("jsonwebtoken");
const AdminSchema = require("../models/admin");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token; 
        console.log(req.cookies.token)
        if (!token) {
            console.log('Unauthorized: No token provided.')
            return res.status(401).json({ error: "Unauthorized: No token provided." });
        }


        const decoded = jwt.verify(token, process.env.JWTSCRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: "Unauthorized: Invalid token." });
        }


        const user = await AdminSchema.findOne({ email: decoded.id });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        req.user = user;
        next(); 
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token or session expired." });
    }
};

module.exports = authenticateUser;
