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
const messageRoute = require("./Routes/messageRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

global.io = io;
app.locals.moment = moment;

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('socket.io connection established');

    // Setup event
    socket.on('setup', (user) => {
        onlineUsers.set(user._id, socket.id); // Track user as online
        socket.join(user._id);
        socket.emit('connected');

        // Broadcast online status to other users
        socket.broadcast.emit('user online', { userId: user._id, online: true });
    });

    // Join chat event
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room: ' + room);
    });

    // New message event
    socket.on('new message', (newMessageStatus) => {
        const chat = newMessageStatus.chat;
        if (!chat || !chat.users || !Array.isArray(chat.users) || chat.users.length === 0) {
            console.log("Invalid chat object");
            return;
        }
        chat.users.forEach((user) => {
            if (user._id !== newMessageStatus.sender._id) {
                socket.to(user._id).emit('message received', newMessageStatus);
            }
        });
    });


    // Disconnect event
    socket.on('disconnect', () => {
        const userId = [...onlineUsers.entries()].find(([key, value]) => value === socket.id)?.[0];
        if (userId) {
            onlineUsers.delete(userId); // Remove from online map
            io.emit('user offline', { userId, online: false }); // Broadcast offline status
        }
    });
});








// Database connection
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9e7m0jr.mongodb.net/ChitChat?retryWrites=true&w=majority&appName=Cluster0`;
const uri = process.env.MONGO_CONNECTION_STRING;

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
app.use("/logout", userRoute);
app.use('/', userRoute);
app.use("/chat", messageRoute);
app.use("/", messageRoute);
app.use('/messages', messageRoute);



server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
