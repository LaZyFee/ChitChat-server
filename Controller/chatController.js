const Chat = require("../Models/Chat");
const GroupChat = require("../Models/GroupChat");

// Access a single chat
const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).send("User ID is required");
        }

        let chat = await Chat.findOne({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");

        if (chat) {
            return res.status(200).json(chat);
        }

        const newChat = await Chat.create({
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        });

        const fullChat = await Chat.findById(newChat._id)
            .populate("users", "-password");

        res.status(200).json(fullChat);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Fetch all chats for the user
const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Fetch existing group
const fetchExistingGroup = async (req, res) => {
    try {
        const allGroups = await GroupChat.find({ isGroupChat: true });
        res.status(200).json(allGroups);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Create a new group chat
const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send("Name and users are required");
    }

    let users = JSON.parse(req.body.users);
    users.push(req.user);

    try {
        const groupChat = await GroupChat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await GroupChat.findById(groupChat._id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Fetch all group chats
const fetchGroupChats = async (req, res) => {
    try {
        const groupChats = await GroupChat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password");

        res.status(200).json(groupChats);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Exit from a group chat
const groupExit = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const removed = await GroupChat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!removed) {
            return res.status(400).send("Failed to remove user from group");
        }

        res.status(200).json(removed);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Add a user to a group chat
const groupAdd = async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        if (!chatId || !userId) {
            return res.status(400).send("Chat ID and User ID are required");
        }

        const groupChat = await GroupChat.findById(chatId);
        if (!groupChat) {
            return res.status(404).send("Group chat not found");
        }

        if (groupChat.users.includes(userId)) {
            return res.status(400).send("User already in the group");
        }

        groupChat.users.push(userId);
        await groupChat.save();

        const updatedGroupChat = await GroupChat.findById(chatId)
            .populate("users", "-password");

        res.status(200).json(updatedGroupChat);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Add the user themselves to a group chat
const addSelfToGroup = async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user._id;

        const added = await GroupChat.findByIdAndUpdate(
            chatId,
            { $push: { users: userId } },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!added) {
            return res.status(400).send("Failed to add user to group");
        }

        res.status(200).json(added);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    fetchExistingGroup,
    fetchGroupChats,
    groupExit,
    groupAdd,
    addSelfToGroup,
};
