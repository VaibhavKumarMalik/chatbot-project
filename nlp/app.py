from flask import Flask, request, jsonify
from transformers import pipeline
from textblob import TextBlob
import threading
import time
import numpy as np
from sklearn.cluster import KMeans
import spacy

app = Flask(__name__)

# Load NLP models
nlp = spacy.load("en_core_web_sm")
sentiment_analyzer = pipeline("sentiment-analysis")

# Sample intents (replace with a trained model in production)
INTENTS = {
    "greeting": ["hello", "hi", "hey"],
    "goodbye": ["bye", "goodbye", "see you"],
    "thanks": ["thank you", "thanks", "appreciate"],
    "problem": ["issue", "problem", "not working", "broken"],
    "refund": ["refund", "return", "money back"],
    "delivery": ["shipping", "delivery", "when arrive"]
}

def get_intent(text):
    text = text.lower()
    for intent, phrases in INTENTS.items():
        if any(phrase in text for phrase in phrases):
            return intent
    return "unknown"

def analyze_sentiment(text):
    result = sentiment_analyzer(text)[0]
    return {
        "label": result["label"].lower(),
        "score": result["score"]
    }

def generate_response(intent, sentiment):
    responses = {
        "greeting": "Hello! How can I help you today?",
        "goodbye": "Goodbye! Have a great day!",
        "thanks": "You're welcome! Is there anything else I can help with?",
        "problem": "I'm sorry to hear you're having issues. Let me help with that.",
        "refund": "I can help you with a refund. Please provide your order number.",
        "delivery": "I can check your delivery status. Please provide your order number.",
        "unknown": "I'm not sure I understand. Can you please rephrase your question?"
    }
    return responses.get(intent, responses["unknown"])

@app.route('/process', methods=['POST'])
def process_message():
    data = request.get_json()
    message = data['message']
    
    # Process the message
    intent = get_intent(message)
    sentiment = analyze_sentiment(message)
    
    # Generate response
    response_text = generate_response(intent, sentiment)
    
    return jsonify({
        "text": response_text,
        "intent": intent,
        "sentiment": sentiment["label"],
        "confidence": sentiment["score"]
    })

def background_analytics():
    """Periodically analyze chat data for trends"""
    while True:
        # In production, this would query the database
        # and perform clustering/analysis
        time.sleep(3600)  # Run hourly

if __name__ == '__main__':
    # Start background thread for analytics
    threading.Thread(target=background_analytics, daemon=True).start()
    app.run(host='0.0.0.0', port=5001)