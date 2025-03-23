const BACKEND_URL = "https://ai-presentation-website.vercel.app/api/chat";

const SYSTEM_PROMPT = `
You are an AI chatbot designed for a school presentation on AI in business.
Answer only related questions and avoid unrelated topics.
`;

function toggleChatbot() {
  const chatbot = document.getElementById("chat-container");
  const button = document.getElementById("toggle-chatbot");

  if (document.body.classList.contains("chatbot-open")) {
    document.body.classList.remove("chatbot-open");
    button.textContent = "Launch Chatbot";
  } else {
    document.body.classList.add("chatbot-open");
    button.textContent = "Close Chatbot";
  }
}

async function sendMessage() {
  const inputEl = document.getElementById("user-input");
  const userInput = inputEl.value.trim();
  if (!userInput) return;

  appendMessage("You", userInput);
  inputEl.value = "";
  appendMessage("Chatbot", "<em>Thinking...</em>");

  const botResponse = await getAIResponse(userInput);
  removeLastMessage();
  appendMessage("Chatbot", botResponse);
}

async function getAIResponse(userInput) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${SYSTEM_PROMPT}\nUser: ${userInput}`
      })
    });
    const data = await response.json();
    return data.message || "⚠️ No response received.";
  } catch (error) {
    console.error("Chatbot error:", error);
    return "⚠️ Error: Unable to connect to server.";
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  msgDiv.style.padding = "5px";
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLastMessage() {
  const chatBox = document.getElementById("chat-box");
  if (chatBox.lastChild) {
    chatBox.removeChild(chatBox.lastChild);
  }
}
