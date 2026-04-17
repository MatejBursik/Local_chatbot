async function sendMessage(message) {
    const res = await fetch("http://localhost:5500/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message })
    });

    const data = await res.json();

    return data.response;
}

function createMessage(text) {
    const p = document.createElement("p");
    p.innerText = text;

    return p;
}

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const responseDiv = document.getElementById("response");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = input.value;
    if (!message) return;

    // loading
    input.disabled = true;
    const loading = document.createElement("p");
    loading.innerText = "Thinking...";
    responseDiv.appendChild(loading);

    // call API
    let reply = ""
    try {
        reply = await sendMessage(message);
    } catch (err) {
        reply = "Ups, an error occurred: " + err;
    }

    // display text after response
    responseDiv.removeChild(loading); // remove loading
    responseDiv.appendChild(createMessage("You: " + message));
    responseDiv.appendChild(createMessage("Bot: " + reply));
    responseDiv.scrollTop = responseDiv.scrollHeight;

    // clear input
    input.disabled = false;
    input.value = "";
});
