const UserModel = require('../Models/UserModel');

const searchUSer = async (req, res) => {
    try {
        const { search } = req.body;
        const query = new RegExp(search, 'i', 'g');
        const users = await UserModel.find({
            "$or": [
                { name: query },
                { email: query }
            ]
        });

        return res.json({
            message: 'all user',
            data: users,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })

    }
}

module.exports = { searchUSer };