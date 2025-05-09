const AdminSchema = require("../models/admin")
const jwt = require("jsonwebtoken")

module.exports = {
    signin: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log("get the request");
    
            const auth = await AdminSchema.findOne({ email: email });
            if (!auth) {
                return res.status(404).json({ status: false, message: "Can't find the admin" });
            }
    
            if (auth.password !== password) {
                return res.status(401).json({ status: false, message: "Incorrect Password" });
            }
    
            const token = jwt.sign({ id: auth._id }, process.env.JWTSCRET, {
                expiresIn: "30d",
            });
    
            // Store token in the database
            auth.token = token; // assuming you have a `token` field in your Admin schema
            await auth.save();
    
            // Optional: Set token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
                sameSite: "strict",
            });
    
            return res.status(200).json({
                status: true,
                message: "Login successful",
                token: token,
                user: {
                    id: auth._id,
                    email: auth.email
                }
            });
    
        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
     getAdminDetails : async (req, res) => {
        try {
            res.status(200).json({
                name: req.user.name,
                email: req.user.email,
            });
        } catch (error) {
            console.error("Error fetching admin details:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    logoutAdmin:async(req,res)=>{
        try {
    
            res.cookie("token","",{
                maxAge:1
            })
    
            res.status(204).json({message:"Logout Completed"})
        } catch (error) {
            return NextResponse.json({ message: "Logout failed" }, { status: 500 });
        }
    }
,  registerA: async (req, res) => {
    try {
        const { email, password } = req.body;
        const exists = await AdminSchema.findOne({ email });

        if (exists) {
            return res.status(409).json({ status: false, message: "Admin already exists" });
        }

        const newAdmin = new AdminSchema({ email, password });
        await newAdmin.save();

        res.status(200).json({ status: true, message: "Admin registered successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: "Registration failed" });
    }
},
}