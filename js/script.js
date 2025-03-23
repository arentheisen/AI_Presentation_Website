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

// --- AI Image Activity ---
const images = [
  {
    src: "images/AIActivity1.png",
    isAI: true,
    explanation: "The image of a dawn marine layer of fog hovering in a valley was AI-generated."
  },
  {
    src: "images/AIActivity2.png",
    isAI: false,
    explanation: "The tasty-looking avocado toast on the white paper plate is a real image."
  },
  {
    src: "images/AIActivity3.png",
    isAI: true,
    explanation: "The skier standing in the freshly fallen powder in Mott Canyon at Heavenly Resort in Lake Tahoe, Nevada, is AI-generated."
  },
  {
    src: "images/AIActivity4.png",
    isAI: false,
    explanation: "This is a 100% real photograph of Lake Tahoe taken in Incline Village, Nevada."
  },
  {
    src: "images/AIActivity5.png",
    isAI: true,
    explanation: "The image of the rocky lakeshore, though very much looking like the eastern shore of Lake Tahoe, was AI-generated."
  },
  {
    src: "images/AIActivity6.png",
    isAI: true,
    explanation: "The delicious-looking avocado toast on the dark stoneware plate is nearly perfect, and also AI-generated."
  },
  {
    src: "images/AIActivity7.png",
    isAI: false,
    explanation: "The image of an enthusiastic crowd at a Classixx show at the Outside Lands music festival in San Francisco in 2015 is a real photograph."
  }
];

let currentImage = 0;
let score = 0;

window.launchImageActivity = function () {
  document.getElementById("launch-activity-btn").style.display = "none";
  document.getElementById("activity-container").style.display = "block";
  showImage();
};

function showImage() {
  const imgData = images[currentImage];
  document.getElementById("activity-image").src = imgData.src;
  document.getElementById("feedback").textContent = "";
}

window.handleGuess = function (guessIsAI) {
  const imgData = images[currentImage];
  const feedback = document.getElementById("feedback");

  if (guessIsAI === imgData.isAI) {
    score++;
    feedback.innerHTML = `<span style="color: green;">✅ Correct! ${imgData.explanation}</span>`;
  } else {
    const correct = imgData.isAI ? "an AI-generated image" : "a real image";
    feedback.innerHTML = `<span style="color: red;">❌ Incorrect. This was ${correct}.</span>`;
  }

  currentImage++;
  if (currentImage < images.length) {
    setTimeout(() => showImage(), 2500);
  } else {
    setTimeout(() => {
      document.getElementById("activity-container").style.display = "none";
      document.getElementById("launch-activity-btn").style.display = "inline-block";
      document.getElementById("launch-activity-btn").textContent = `Restart Image Activity`;
      alert(`You got ${score}/${images.length} correct!`);
      currentImage = 0;
      score = 0;
    }, 3000);
  }
};
