from flask import Flask, render_template, request, jsonify
import requests, os

app = Flask(__name__)

LLM_URL = os.getenv("LLM_URL")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json["message"]

    response = requests.post(LLM_URL, json={
        "model": "llama3",
        "prompt": user_input,
        "stream": False
    })

    return jsonify(response.json())

@app.route("/")
def index():
    return render_template("index.html")

app.run(host="0.0.0.0", port="5500", debug=True)