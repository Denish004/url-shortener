const asyncHandler = require("express-async-handler");
const Url = require("../models/Url");
const Analytics = require("../models/Analytics");
const UAParser = require("ua-parser-js");

// @desc    Redirect to original URL and track analytics
// @route   GET /:code
// @access  Public
const redirectUrl = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const url = await Url.findOne({
    $or: [{ shortCode: code }, { customAlias: code }],
  });

  if (!url) {
    res.status(404);
    throw new Error("URL not found");
  }

  // Check if URL has expired
  if (url.expiresAt && url.expiresAt < new Date()) {
    res.status(410);
    throw new Error("URL has expired");
  }

  // Track analytics asynchronously (don't await it to improve response time)
  const trackAnalytics = async () => {
    try {
      // Update click count
      url.clicks += 1;
      await url.save();

      // Parse user agent
      const parser = new UAParser(req.headers["user-agent"]);
      const userAgentData = parser.getResult();

      // Create analytics entry
      await Analytics.create({
        urlId: url._id,
        ip: req.ip,
        device:
          userAgentData.device.type || userAgentData.device.vendor || "Unknown",
        browser: userAgentData.browser.name || "Unknown",
        os: userAgentData.os.name || "Unknown",
        referrer: req.headers.referer || "Direct",
      });
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  };

  // Fire and forget - don't wait for analytics to complete
  trackAnalytics();

  // Redirect to original URL
  res.redirect(url.originalUrl);
});

module.exports = { redirectUrl };
