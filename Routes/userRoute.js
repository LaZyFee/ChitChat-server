const express = require("express");
const router = express.Router();

const signupController = require("../Controller/signupController");
const loginController = require("../Controller/loginController");
const { protect } = require("../Middlewares/authenticateToken");
const { allUsers } = require("../Controller/userController");

router.post("/signup", signupController.signUp);
router.post("/login", loginController.login);
router.get("/users", protect, allUsers);

module.exports = router;