async function sendMessage(message, conversation_id) {
    console.log(`${message}, ${conversation_id}`); // debug

    const res = await fetch("http://localhost:5500/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message, conversation_id })
    });

    const data = await res.json();

    return data.response;
}

async function createConversation(conversation_id) {
    const res = await fetch("http://localhost:5500/create_conversation", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ conversation_id })
    });
}

async function getConversation(conversation_id){
    const res = await fetch(`/get_conversation/${conversation_id}`);

    return res.json();
}

async function loadConversations() {
    const res = await fetch("/get_conversation_ids");
    const data = await res.json();

    const list = document.getElementById("conversation-list");

    conversation_ids = data.conversation_ids;

    conversation_ids.forEach(id => {
        const li = document.createElement("li");
        li.innerText = `Chat ${id}`;
        li.dataset.id = id;

        li.addEventListener("click", async () => {
            if (is_loading_conversation) return;

            setActiveConversation(li);

            is_loading_conversation = true;
            responseDiv.innerHTML = "Loading...";

            conversation_id = Number(li.dataset.id);
            console.log("Switched to conversation:", conversation_id); // debug

            const data = await getConversation(conversation_id);

            responseDiv.innerHTML = "";
            data.messages.forEach(msg => {
                responseDiv.appendChild(createMessage(msg.content, msg.role));
            });
            is_loading_conversation = false;
        });

        list.appendChild(li);
    });

    return conversation_ids;
}

function createMessage(text, css_class) {
    const icon = document.createElement("i");

    if (css_class === "user") {
        icon.className = "fa-solid fa-circle-user";
    } else {
        icon.className = "fa-solid fa-robot";
    }

    const span = document.createElement("span");
    span.innerText = text;

    const div = document.createElement("div");
    div.appendChild(icon);
    div.appendChild(span);

    return div;
}

function setActiveConversation(active_chat) {
    document.querySelectorAll("#conversation-list li").forEach(li => {
        li.classList.remove("active");
    });

    active_chat.classList.add("active");
}

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const responseDiv = document.getElementById("response");

let conversation_ids = [];
let conversation_id = 0;
let is_loading_conversation = false;

async function init() {
    conversation_ids = await loadConversations();

    // TODO: Make a welcome banner visilbe only when page is loaded
    //      if the user doesnt have any chats, welcome message and provide instructions
    //      if the user does have chats, "welcome back"
    if (conversation_ids.length > 0) {
        
    }
}

// disable FORM until user creates/selects a chat
input.disabled = true;
init()

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = input.value;
    if (!message) return;

    // loading
    input.disabled = true;
    const loading = document.createElement("p");
    loading.innerText = "Thinking...";
    responseDiv.appendChild(loading);

    let reply = "";
    try {
        reply = await sendMessage(message, conversation_id);
    } catch (err) {
        reply = "Ups, an error occurred: " + err;
    }

    // display text after response
    responseDiv.removeChild(loading); // remove loading
    responseDiv.appendChild(createMessage(message, "user"));
    responseDiv.appendChild(createMessage(reply, "bot"));
    responseDiv.scrollTop = responseDiv.scrollHeight;

    // clear input
    input.disabled = false;
    input.value = "";
});

const newChatBTN = document.getElementById("createChat");
const conversationList = document.getElementById("conversation-list");

newChatBTN.addEventListener("click", async (e) => {
    let new_id;
    
    if (conversation_ids.length > 0) {
        new_id = Math.max(...conversation_ids) + 1;
    } else {
        new_id = 0;
        input.disabled = false;
    }

    await createConversation(new_id);
    conversation_id = new_id;
    conversation_ids.push(new_id);
    responseDiv.innerHTML = "";
    console.log(conversation_ids); // debug
    
    const li = document.createElement("li");
    li.innerText = `Chat ${new_id}`;
    li.dataset.id = new_id;

    // switch conversation
    li.addEventListener("click", async () => {
        if (is_loading_conversation) return;

        setActiveConversation(li);

        is_loading_conversation = true;
        responseDiv.innerHTML = "Loading...";

        conversation_id = Number(li.dataset.id);
        console.log("Switched to conversation:", conversation_id); // debug

        const data = await getConversation(conversation_id);
        console.log(data); // debug

        responseDiv.innerHTML = "";
        data.messages.forEach(msg => {
            responseDiv.appendChild(createMessage(msg.content, msg.role));
        });
        is_loading_conversation = false;
    });

    conversationList.appendChild(li);
    setActiveConversation(li);
});
