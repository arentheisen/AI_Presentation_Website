// Update this with your actual Vercel deployment URL
const BACKEND_URL = "https://ai-presentation-website.vercel.app/api/chat";

// Toggle chatbot visibility and page resizing
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

// Send message to the backend and handle response
async function sendMessage() {
    let userInputEl = document.getElementById("user-input");
    let userInput = userInputEl.value.trim();
    if (userInput === "") return;

    appendMessage("You", userInput);
    userInputEl.value = "";

    appendMessage("Chatbot", "<em>Thinking...</em>");

    try {
        let response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: userInput })
        });

        let data = await response.json();

        // Remove the "Thinking..." message
        removeLastMessage();

        appendMessage("Chatbot", data.message);
    } catch (error) {
        removeLastMessage();
        appendMessage("Chatbot", "⚠️ Error: Failed to reach backend.");
    }
}

// Handle pressing "Enter" in the input box
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Append a message to the chat window
function appendMessage(sender, message) {
    let chatBox = document.getElementById("chat-box");
    let msgDiv = document.createElement("div");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    msgDiv.style.padding = "5px";
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove the last message from the chat (used for removing "Thinking...")
function removeLastMessage() {
    let chatBox = document.getElementById("chat-box");
    if (chatBox.lastChild) {
        chatBox.removeChild(chatBox.lastChild);
    }
}
