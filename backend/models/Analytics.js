const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
  intent: String,
  sentiment: String,
  timestamp: { type: Date, default: Date.now },
});

const analyticsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  interactions: [interactionSchema],
  sentimentTrend: [
    {
      date: Date,
      positive: Number,
      neutral: Number,
      negative: Number,
    },
  ],
});

module.exports = mongoose.model("Analytics", analyticsSchema);
