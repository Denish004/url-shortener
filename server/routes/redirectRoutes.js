const express = require("express");
const { redirectUrl } = require("../controllers/redirectController");

const router = express.Router();

router.get("/:code", redirectUrl);

module.exports = router;
