const BACKEND_URL = "https://ai-presentation-website.vercel.app/api/chat";

function toggleChatbot() {
    let chatbot = document.getElementById("chat-container");
    let content = document.getElementById("content-container");
    let button = document.getElementById("toggle-chatbot");

    if (chatbot.style.display === "none" || chatbot.style.display === "") {
        chatbot.style.display = "flex";
        document.body.classList.add("chatbot-open");
        button.textContent = "Close Chatbot";
    } else {
        chatbot.style.display = "none";
        document.body.classList.remove("chatbot-open");
        button.textContent = "Launch Chatbot";
    }
}

async function sendMessage() {
    const inputElement = document.getElementById("user-input");
    const userInput = inputElement.value.trim();
    if (!userInput) return;

    appendMessage("You", userInput);
    inputElement.value = "";

    appendMessage("Chatbot", "<em>Thinking...</em>");

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: userInput })
        });

        const data = await response.json();
        removeLastMessage();
        appendMessage("Chatbot", data.message);
    } catch (error) {
        removeLastMessage();
        appendMessage("Chatbot", "⚠️ Error: Unable to connect to server.");
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function appendMessage(sender, message) {
    let chatBox = document.getElementById("chat-box");
    let msgDiv = document.createElement("div");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    msgDiv.style.padding = "5px";
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLastMessage() {
    let chatBox = document.getElementById("chat-box");
    if (chatBox.lastChild) {
        chatBox.removeChild(chatBox.lastChild);
    }
}
