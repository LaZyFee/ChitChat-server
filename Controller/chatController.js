const ChatModel = require("../Models/ChatModel");
const UserModel = require("../Models/UserModel");

// Access a single chat
const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).send("User ID is required");
        }

        let isChat = await ChatModel.findOne({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");

        isChat = await UserModel.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            try {
                const createdChat = await ChatModel.create(chatData);
                const FullChat = await ChatModel.findById(createdChat._id).populate("users", "-password");
                res.status(200).json(FullChat);
            } catch (error) {
                res.status(400).send({ error: error.message });
            }
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Fetch all chats for the user
const fetchChats = async (req, res) => {
    try {
        ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await UserModel.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


module.exports = {
    accessChat,
    fetchChats,
};
