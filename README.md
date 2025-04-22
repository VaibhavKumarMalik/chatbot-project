# AI-Powered Customer Support Chatbot with Analytics

![Project Screenshot](screenshot.png)

## Overview

This project is an AI-powered customer support chatbot that combines web development and data science technologies. It features:

- Real-time chat interface with a conversational AI
- Natural Language Processing (NLP) for intent recognition and sentiment analysis
- Comprehensive analytics dashboard
- Modern tech stack using Node.js, Python, and Docker

## Features

- **Real-time Chat Interface**:
  - WebSocket-based communication
  - User and bot message differentiation
  - Message history persistence

- **Natural Language Processing**:
  - Intent recognition (greetings, problems, refunds, etc.)
  - Sentiment analysis (positive, neutral, negative)
  - Dynamic response generation

- **Analytics Dashboard**:
  - Visualizations of common intents
  - Sentiment analysis trends
  - Recent conversation logs

- **Technical Highlights**:
  - Microservices architecture
  - Containerized deployment with Docker
  - Proper MVC pattern implementation
  - RESTful API design

## Technology Stack

### Backend
- **Node.js** with Express framework
- **Socket.io** for real-time communication
- **MongoDB** for data persistence

### NLP Service
- **Python** with Flask
- **spaCy** for text processing
- **Transformers** library for sentiment analysis
- **TextBlob** for additional NLP tasks

### Frontend
- **HTML5**, **CSS3**, and **JavaScript**
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Socket.io client** for real-time updates

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for orchestration
- **Nginx** as reverse proxy (for frontend)

## Project Structure

```
chatbot-project/
├── backend/                  # Node.js backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # Express routes
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── app.js               # Main application
│   └── server.js            # Server entry point
├── nlp/                     # Python NLP service
│   ├── app.py               # Flask application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # NLP service Dockerfile
├── frontend/                # HTML/CSS/JS frontend
│   ├── public/              # Static files
│   ├── views/               # HTML templates
│   ├── scripts/             # JavaScript files
│   ├── styles/              # CSS/Tailwind files
│   └── index.html           # Main HTML file
├── docker-compose.yml       # Docker configuration
├── .env                     # Environment variables
└── README.md                # Project documentation
```

## Installation

### Prerequisites

- Docker (version 20.10.0 or higher)
- Docker Compose (version 1.29.0 or higher)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/VaibhavKumarMalik/chatbot-project.git
   cd chatbot-project
   ```

2. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - NLP Service: http://localhost:5001

4. To stop the application:
   ```bash
   docker-compose down
   ```

## Configuration

Environment variables can be configured in the `.env` file:

```env
# MongoDB
MONGODB_URI=mongodb://root:example@mongodb:27017/admin

# Backend
PORT=5000
NLP_SERVICE_URL=http://nlp-service:5001

# Frontend
FRONTEND_URL=http://localhost:3000
```

## API Documentation

### Chat Endpoints

- `POST /api/chat` - Send a new message
  ```json
  {
    "userId": "string",
    "message": "string"
  }
  ```

- `GET /api/chat/:userId` - Get chat history for a user

### Analytics Endpoints

- `GET /api/analytics/:userId` - Get analytics data for a user

## Development

### Running Without Docker

1. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # NLP Service
   cd ../nlp
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

2. Start services:
   ```bash
   # Start MongoDB (in separate terminal)
   mongod

   # Backend (in backend directory)
   npm start

   # NLP Service (in nlp directory)
   python app.py

   # Frontend - serve the static files from frontend/public
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Enhancements

- Add user authentication
- Implement multi-language support
- Enhance NLP with custom-trained models
- Add support for multiple channels (email, social media)
- Implement proactive alerts for negative sentiment
- Add voice support

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
