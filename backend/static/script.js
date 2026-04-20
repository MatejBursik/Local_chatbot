async function sendMessage(message) {
    const res = await fetch("http://localhost:5500/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message })
    });

    const data = await res.json();

    return data.response;
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
    responseDiv.appendChild(createMessage(message, "user"));
    responseDiv.appendChild(createMessage(reply, "bot"));
    responseDiv.scrollTop = responseDiv.scrollHeight;

    // clear input
    input.disabled = false;
    input.value = "";
});
