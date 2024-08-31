// Routes/userRoute.js
const express = require("express");
const router = express.Router();

const signupController = require("../Controller/signupController");
const loginController = require("../Controller/loginController");
const { protect } = require("../Middlewares/authenticateToken");
const { allUsers } = require("../Controller/userController");

router.post("/signup", signupController.signUp); // Use signUp as a method from signupController
router.post("/login", loginController.login);    // Use login as a method from loginController
router.get("/users", protect, allUsers);

module.exports = router;
