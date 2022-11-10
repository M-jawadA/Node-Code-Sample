const express = require("express");
const {
  registerUser,
  authUser,
  forgetPassword,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/forgetPassword", forgetPassword);

module.exports = router;
