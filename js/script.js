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
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to get AI response
function getBotResponse(input) {
    // If chatbot has been trained with this input, return the stored response
    if (chatbotMemory[input]) {
        return chatbotMemory[input];
    }

    // Default response for unknown input
    return `I don't know how to respond to that. How should I reply? (Type: train [response])`;
}

// Training function
document.addEventListener("keydown", function(event) {
    let userInput = document.getElementById("user-input").value.trim().toLowerCase();
    if (event.key === "Enter" && userInput.startsWith("train ")) {
        let parts = userInput.split("train ");
        if (parts.length > 1) {
            let lastUserInput = document.querySelector("#chat-box div:last-child strong").nextSibling.nodeValue.trim();
            chatbotMemory[lastUserInput] = parts[1];
            localStorage.setItem("chatbotMemory", JSON.stringify(chatbotMemory));
            appendMessage("AI", "Thanks! I learned a new response.");
        }
        document.getElementById("user-input").value = "";
    }
});
