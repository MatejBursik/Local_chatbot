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

Locally ran web-app link: `http://localhost:5500`

Shut down the containers:
```bash
docker compose down
```

## TODO
- Move conversation memory into a database
- Add RAG implementation
- Add users with auth
