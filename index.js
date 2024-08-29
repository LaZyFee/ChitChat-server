//external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const cors = require("cors");




//internal imports
const signUpRouter = require("./Routes/signupRoute");
const loginRouter = require("./Routes/loginRoute");






dotenv.config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

global.io = io;
app.locals.moment = moment;

// Database connection
//mongoDB atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9e7m0jr.mongodb.net/ChitChat?retryWrites=true&w=majority&appName=Cluster0`;
//local mongoDB Compass
// const uri = process.env.MONGO_CONNECTION_STRING;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};

connectDB();





app.use("/signup", signUpRouter);
app.use("/login", loginRouter);



server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
