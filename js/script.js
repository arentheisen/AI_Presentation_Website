// Store chatbot knowledge
let chatbotMemory = {};

// Load chatbot memory from local storage (if available)
if (localStorage.getItem("chatbotMemory")) {
    chatbotMemory = JSON.parse(localStorage.getItem("chatbotMemory"));
}

function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim().toLowerCase();
    if (userInput === "") return;

    appendMessage("You", userInput);

    let botResponse = getBotResponse(userInput);
    appendMessage("AI", botResponse);

    document.getElementById("user-input").value = "";
}

// Handle "Enter" key press
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Function to append messages to chat
function appendMessage(sender, message) {
    let chatBox = document.getElementById("chat-box");

    let msgDiv = document.createElement("div");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    msgDiv.style.padding = "5px";
    msgDiv.style.borderBottom = "1px solid #ddd";
    chatBox.appendChild(msgDiv);

    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
}

// Function to get AI response
function getBotResponse(input) {
    if (chatbotMemory[input]) {
        return chatbotMemory[input]; // Return stored response
    }

    return `I don't know how to respond to that. Type "train [your response]" to teach me!`;
}

// Training function (User types: train [response])
document.addEventListener("keydown", function(event) {
    let userInput = document.getElementById("user-input").value.trim().toLowerCase();
    if (event.key === "Enter" && userInput.startsWith("train ")) {
        let response = userInput.replace("train ", "").trim();
        let chatBoxMessages = document.querySelectorAll("#chat-box div");
        
        if (chatBoxMessages.length >= 2) {
            let lastUserInput = chatBoxMessages[chatBoxMessages.length - 2].innerText.replace("You:", "").trim();
            chatbotMemory[lastUserInput] = response;
            localStorage.setItem("chatbotMemory", JSON.stringify(chatbotMemory));
            appendMessage("AI", "Thanks! I learned a new response.");
        }
        
        document.getElementById("user-input").value = "";
    }
});
