const Conversation = require("../Models/Conversation");
const Chat = require("../Models/Chat");
const User = require("../Models/Users");

const allConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("receiver", "name email") // Populate receiver with the necessary fields
            .populate("chat");

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            return res.status(400).json({ error: "Invalid data passed into request" });
        }

        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };

        try {
            let message = await Conversation.create(newMessage);

            message = await message.populate("sender", "name email");
            message = await message.populate("chat");
            message = await message.populate("receiver", "name email"); // Populate receiver

            message = await User.populate(message, {
                path: "chat.users",
                select: "name email",
            });

            await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

            res.status(200).json(message);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { allConversations, sendMessage };