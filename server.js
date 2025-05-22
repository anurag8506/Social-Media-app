const express = require('express')
const path=require('path')
const app = express()
const adminRoutes = require('./routers/adminRoutes')
const websiteRoute = require('./routers/apiRoutes')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const connectDB = require('./config/DB');


require('dotenv').config()


const PORT = process.env.PORT
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, "*");
        }
        callback(null, origin);
    },
    methods: "GET,POST,PATCH,DELETE,PUT",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, 
};

app.use(cors(corsOptions));


app.use(express.json())
app.use((req, res, next) => {
    console.log('Incoming Request:', req.method, req.url);
    console.log("Req Body :",req.body)
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, "/public")));


app.use('/api/admin', adminRoutes)

app.use('/api', websiteRoute)



app.listen(PORT, () => {
    connectDB()
    // migrateCategories();
    console.log('server running on port', PORT);

})