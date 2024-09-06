const UserModel = require("../Models/UserModel");


const allUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await UserModel.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
}

module.exports = { allUsers }