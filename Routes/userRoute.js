const express = require("express");
const router = express.Router();

const signupController = require("../Controller/signupController");
const loginController = require("../Controller/loginController");
const { protect } = require("../Middlewares/authenticateToken");
const { allUsers } = require("../Controller/userController");
const { updateUserDetails } = require("../Controller/updateUser");
const { searchUSer } = require("../Controller/searchUser");
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory temporarily
const upload = multer({ storage });

// Routes for signup and login  
router.post("/signup", signupController.signUp);
router.post("/login", loginController.login);

// Protected route for fetching all users
router.get("/users", protect, allUsers);

// Protected route for updating user details
router.put('/update-user', protect, upload.single('profile_pic'), updateUserDetails);

//search an user
router.post("/search-user", protect, searchUSer);

// Logout route
router.post("/logout", protect, loginController.logout);


module.exports = router;
