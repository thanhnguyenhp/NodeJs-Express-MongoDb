const User = require("../models/user");

const userController = {
    //GET USER
    getAllUsers: async (req, res) => {
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    //DELETE USER
    deleteUser: async (req, res) => {
        try {
            const user = User.findById("req.params.id");
            res.status(200).json("User has been deleted...");
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = userController;