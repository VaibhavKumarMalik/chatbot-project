const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  isUser: { type: Boolean, required: true },
  intent: String,
  confidence: Number,
  sentiment: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
