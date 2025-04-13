const express = require("express");
const {
  createShortUrl,
  getUrls,
  getUrlAnalytics,
  deleteUrl,
} = require("../controllers/urlController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createShortUrl);
router.get("/", protect, getUrls);
router.get("/:id/analytics", protect, getUrlAnalytics);
router.delete("/:id", protect, deleteUrl);

module.exports = router;
