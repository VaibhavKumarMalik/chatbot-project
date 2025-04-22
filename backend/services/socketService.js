const Chat = require("../models/Chat");
const Analytics = require("../models/Analytics");
const { callNlpService } = require("./nlpService");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("send_message", async (data) => {
      try {
        const { userId, message } = data;

        // Save user message
        const userChat = new Chat({
          userId,
          message,
          isUser: true,
          timestamp: new Date(),
        });
        await userChat.save();

        // Get bot response
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

        // Emit response to the user's room
        io.to(userId).emit("receive_message", botChat);
      } catch (error) {
        console.error("Socket error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
