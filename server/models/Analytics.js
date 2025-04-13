const mongoose = require('mongoose');

const analyticsSchema = mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String
  },
  device: {
    type: String
  },
  browser: {
    type: String
  },
  os: {
    type: String
  },
  referrer: {
    type: String
  }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;