const UserModel = require("../Models/UserModel");

const allUsers = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const keyword = req.query.search ? {
        name: { $regex: req.query.search, $options: 'i' }
    } : {};

    try {
        const users = await UserModel.find(keyword).find({ _id: { $ne: req.user._id } });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { allUsers };
