const Chat = require("../models/Chat");
const Analytics = require("../models/Analytics");
const { callNlpService } = require("../services/nlpService");

exports.sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Save user message
    const userChat = new Chat({
      userId,
      message,
      isUser: true,
      timestamp: new Date(),
    });
    await userChat.save();

    // Get bot response from NLP service
    const botResponse = await callNlpService(message);

    // Save bot response
    const botChat = new Chat({
      userId,
      message: botResponse.text,
      isUser: false,
      intent: botResponse.intent,
      confidence: botResponse.confidence,
      sentiment: botResponse.sentiment,
      timestamp: new Date(),
    });
    await botChat.save();

    // Update analytics
    await Analytics.updateOne(
      { userId },
      {
        $push: {
          interactions: {
            intent: botResponse.intent,
            sentiment: botResponse.sentiment,
          },
        },
      },
      { upsert: true }
    );

    res.json(botChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId }).sort({ timestamp: 1 });
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
