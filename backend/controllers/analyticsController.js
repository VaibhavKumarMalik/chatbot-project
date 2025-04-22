const Analytics = require("../models/Analytics");
const Chat = require("../models/Chat");

exports.getAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get analytics data
    const analytics = await Analytics.findOne({ userId });
    const chats = await Chat.find({ userId }).sort({ timestamp: -1 }).limit(50);

    // Process data for charts
    const intents = {};
    const sentiments = {};

    if (analytics) {
      analytics.interactions.forEach((interaction) => {
        intents[interaction.intent] = (intents[interaction.intent] || 0) + 1;
        sentiments[interaction.sentiment] =
          (sentiments[interaction.sentiment] || 0) + 1;
      });
    }

    res.json({
      intents,
      sentiments,
      recentChats: chats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
