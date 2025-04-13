const asyncHandler = require("express-async-handler");
const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const Analytics = require("../models/Analytics");
const UAParser = require("ua-parser-js");

// @desc    Create a short URL
// @route   POST /api/urls
// @access  Private
const createShortUrl = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  // Validate URL
  try {
    new URL(originalUrl);
  } catch (err) {
    res.status(400);
    throw new Error("Invalid URL");
  }

  // Check if custom alias is already taken
  if (customAlias) {
    const existingUrl = await Url.findOne({ customAlias });
    if (existingUrl) {
      res.status(400);
      throw new Error("Custom alias is already in use");
    }
  }

  const urlData = {
    userId: req.user._id,
    originalUrl,
    shortCode: customAlias || nanoid(6),
  };

  if (expiresAt) {
    urlData.expiresAt = new Date(expiresAt);
  }

  const url = await Url.create(urlData);

  res.status(201).json(url);
});

// @desc    Get all URLs for the current user
// @route   GET /api/urls
// @access  Private
const getUrls = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const skip = (page - 1) * limit;

  const query = {
    userId: req.user._id,
  };

  if (search) {
    query.$or = [
      { originalUrl: { $regex: search, $options: "i" } },
      { shortCode: { $regex: search, $options: "i" } },
      { customAlias: { $regex: search, $options: "i" } },
    ];
  }

  const urls = await Url.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Url.countDocuments(query);

  res.json({
    urls,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
  });
});

// @desc    Get analytics for a URL
// @route   GET /api/urls/:id/analytics
// @access  Private
const getUrlAnalytics = asyncHandler(async (req, res) => {
  const url = await Url.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!url) {
    res.status(404);
    throw new Error("URL not found");
  }

  const analytics = await Analytics.find({ urlId: url._id });

  // Process analytics data for charts
  const clicksOverTime = {};
  const deviceData = {};
  const browserData = {};

  analytics.forEach((record) => {
    // Format date for daily clicks (YYYY-MM-DD)
    const date = new Date(record.timestamp).toISOString().split("T")[0];
    clicksOverTime[date] = (clicksOverTime[date] || 0) + 1;

    // Count device types
    deviceData[record.device] = (deviceData[record.device] || 0) + 1;

    // Count browser types
    browserData[record.browser] = (browserData[record.browser] || 0) + 1;
  });

  // Convert to array format for charts
  const clicksData = Object.entries(clicksOverTime)
    .map(([date, clicks]) => ({
      date,
      clicks,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const deviceChartData = Object.entries(deviceData).map(([device, count]) => ({
    name: device || "Unknown",
    value: count,
  }));

  const browserChartData = Object.entries(browserData).map(
    ([browser, count]) => ({
      name: browser || "Unknown",
      value: count,
    })
  );

  res.json({
    url,
    analytics: {
      totalClicks: url.clicks,
      clicksData,
      deviceData: deviceChartData,
      browserData: browserChartData,
      rawData: analytics,
    },
  });
});

// @desc    Delete a URL
// @route   DELETE /api/urls/:id
// @access  Private
const deleteUrl = asyncHandler(async (req, res) => {
  const url = await Url.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!url) {
    res.status(404);
    throw new Error("URL not found");
  }

  await url.deleteOne();
  await Analytics.deleteMany({ urlId: url._id });

  res.json({ message: "URL removed" });
});

module.exports = { createShortUrl, getUrls, getUrlAnalytics, deleteUrl };
