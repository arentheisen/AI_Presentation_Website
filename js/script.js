const OPENAI_API_KEY = "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";  


const SYSTEM_PROMPT = `
You are an AI chatbot designed for a school presentation on AI in business.
Answer only related questions and avoid unrelated topics.
`;

function toggleChatbot() {
    let chatbot = document.getElementById("chat-container");
    let content = document.getElementById("content-container");
    let button = document.getElementById("toggle-chatbot");

    if (chatbot.style.display === "none" || chatbot.style.display === "") {
        chatbot.style.display = "flex";
        document.body.classList.add("chatbot-open"); // Ensure content resizes
        button.textContent = "Close Chatbot";
    } else {
        chatbot.style.display = "none";
        document.body.classList.remove("chatbot-open");
        button.textContent = "Launch Chatbot";
    }
}

async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    appendMessage("You", userInput);
    document.getElementById("user-input").value = "";  // Clear input after sending

    let botResponse = await getAIResponse(userInput);
    appendMessage("Chatbot", botResponse);
}

async function getAIResponse(userInput) {
    try {
        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userInput }]
            })
        });

        let data = await response.json();
        return data.choices[0]?.message?.content || "Error retrieving response.";
    } catch (error) {
        return "Error: Unable to connect to OpenAI API.";
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
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
