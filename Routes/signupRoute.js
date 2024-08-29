const express = require("express");
const router = express.Router();




const { signUp } = require("../Controller/signupController");

router.post("/", signUp);


module.exports = router;