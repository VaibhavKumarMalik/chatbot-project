const axios = require("axios");
const config = require("../config/config");

exports.callNlpService = async (message) => {
  try {
    const response = await axios.post(`${config.nlpService.url}/process`, {
      message,
    });
    return response.data;
  } catch (error) {
    console.error("NLP Service error:", error);
    return {
      text: "I'm having trouble understanding. Please try again later.",
      intent: "error",
      confidence: 0,
      sentiment: "neutral",
    };
  }
};
