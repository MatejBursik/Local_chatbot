def build_prompt(chat_history, user_input):
    chat_history_str = ""
    for msg in chat_history:
        role = msg["role"]
        content = msg["content"]

        if role == "user":
            chat_history_str += f"User: {content}\n"
        else:
            chat_history_str += f"Assistant: {content}\n"

    context = ""
    
    prompt = (
        "You are a helpful assistant. Use provided context if relevant.\n\n"
        #"[CONTEXT]\n" # Prep for RAG
        #f"{context}\n" # Prep for RAG
        "[CHAT HISTORY]\n"
        f"{chat_history_str}\n"
        "[CURRENT MESSAGE]\n"
        f"User: {user_input}\n"
        "Assistant:"
    )

    #print(prompt, flush=True)
    return prompt
