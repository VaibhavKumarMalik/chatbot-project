module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/chatbot",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
  nlpService: {
    url: process.env.NLP_SERVICE_URL || "http://nlp-service:5001",
  },
};
