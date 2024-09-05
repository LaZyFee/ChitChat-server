// index.js
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const cors = require("cors");
const bodyParser = require('body-parser');

// Internal imports
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoutes");
const conversationRoute = require("./Routes/conversationRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

global.io = io;
app.locals.moment = moment;

// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9e7m0jr.mongodb.net/ChitChat?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};

connectDB();

app.use("/signup", userRoute);
app.use("/login", userRoute);
app.use('/', userRoute);
app.use("/chat", chatRoute);
app.use("/", conversationRoute);

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
