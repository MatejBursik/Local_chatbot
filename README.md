# Local_chatbot
A simple application for running a chatbot locally

## Docker Compose
Build and run the containers:
```bash
docker compose up --build -d
```

Execute a command to pull a model for the llm container:
```bash
docker exec -it <container_id> ollama pull llama3
```

Web-app link: `http://localhost:5500`

Shut down the containers:
```bash
docker compose down
```

## TODO
- Replace "session_id" in conversation memory for "conversation_id"
- Move conversation memory into a database
- Implement functionability for multiple conversations per user (without user auth)
- Add RAG implementation
