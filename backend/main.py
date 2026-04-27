from flask import Flask, render_template, request, jsonify
import requests, os

from build_prompt import build_prompt

app = Flask(__name__)

LLM_URL = os.getenv("LLM_URL")
MAX_MESSAGES = 10  # Prevents context explosion
conversations = {} # Conversation memory

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data["message"]
    session_id = data.get("session_id", "default")

    # Initialize session
    if session_id not in conversations:
        conversations[session_id] = []

    conversations[session_id] = conversations[session_id][-MAX_MESSAGES:] # Trim memory

    prompt = build_prompt(conversations[session_id], user_input)

    response = requests.post(LLM_URL, json={
        "model": "llama3",
        "prompt": prompt,
        "stream": False
    }).json()

    reply = response.get("response", "")

    # Store conversation
    conversations[session_id].append({
        "role": "user",
        "content": user_input
    })

    conversations[session_id].append({
        "role": "assistant",
        "content": reply
    })

    return jsonify({
        "response": reply,
        "session_id": session_id
    })

@app.route("/")
def index():
    return render_template("index.html")

app.run(host="0.0.0.0", port="5500", debug=True)