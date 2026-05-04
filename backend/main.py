from flask import Flask, render_template, request, jsonify
import requests, os

from build_prompt import build_prompt

app = Flask(__name__)

LLM_URL = os.getenv("LLM_URL")
MAX_MESSAGES = 10  # Prevents context explosion
conversations = {} # Conversation memory

@app.route("/create_conversation", methods=["POST"])
def create_conversation():
    data = request.json
    conversation_id = int(data.get("conversation_id"))

    if conversation_id not in conversations:
        conversations[conversation_id] = []

    return jsonify({"conversation_id": conversation_id})

@app.route("/get_conversation/<conversation_id>", methods=["GET"])
def get_conversation(conversation_id):
    history = conversations.get(int(conversation_id), [])

    return jsonify({
        "conversation_id": conversation_id,
        "messages": history
    })

@app.route("/get_conversation_ids", methods=["GET"])
def get_all_conversations():
    return jsonify({
        "conversation_ids": list(conversations.keys())
    })

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data["message"]
    conversation_id = int(data.get("conversation_id", "default"))

    # Error check
    if conversation_id not in conversations:
        return jsonify({"error": "conversation not found"}), 404

    conversations[conversation_id] = conversations[conversation_id][-MAX_MESSAGES:] # Trim memory

    prompt = build_prompt(conversations[conversation_id], user_input)

    response = requests.post(LLM_URL, json={
        "model": "llama3",
        "prompt": prompt,
        "stream": False
    }).json()

    reply = response.get("response", "")

    # Store conversation
    conversations[conversation_id].append({
        "role": "user",
        "content": user_input
    })

    conversations[conversation_id].append({
        "role": "assistant",
        "content": reply
    })

    return jsonify({
        "response": reply,
        "conversation_id": conversation_id
    })

@app.route("/")
def index():
    return render_template("index.html")

app.run(host="0.0.0.0", port="5500", debug=True)