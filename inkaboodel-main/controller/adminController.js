const AdminSchema = require("../models/admin")
const jwt = require("jsonwebtoken")

module.exports = {
    signin: async (req, res) => {
        try {
            const { email, password } = req.body
            console.log("get the request")

            const auth = await AdminSchema.findOne({ email: email })
            if (!auth) {
                res.status(404).json({ status: false, message: "can't find the admin" })
            }
            console.log(password,auth)
            if (auth.password !== password) {
                res.status(404).josn({ status: false, message: "Incorect Password" })
            }

            const token = jwt.sign({ id: auth.email }, process.env.JWTSCRET, {
                expiresIn: "30d",
            });

            res.cookie("token", token, {
                httpOnly: true,
            });

            res.status(200).json({ message: "login successfull ", status: true })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "internal server error" })

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

}