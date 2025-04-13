const express = require("express");
const { loginUser, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
