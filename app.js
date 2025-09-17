const messages = document.getElementById("chat-messages");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatContainer = document.getElementById("chat-container");
const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");

let isOpen = false;

function addMessage(text, isUser = true) {
  const msg = document.createElement("div");
  msg.classList.add("msg", isUser ? "user" : "bot");
  msg.innerHTML = text; // Use innerHTML to handle quotes properly
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// Enhanced AI responses
async function getGroqResponse(userMessage) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Programming languages
  if (lowerMessage.includes('python')) {
    return 'Python is a popular programming language known for its simple syntax and readability. It\'s great for beginners and used in web development, data science, AI, and automation.';
  }
  if (lowerMessage.includes('javascript')) {
    return 'JavaScript is a programming language that runs in web browsers and servers. It\'s used to make websites interactive and build web applications.';
  }
  if (lowerMessage.includes('java')) {
    return 'Java is a robust, object-oriented programming language used for building enterprise applications, Android apps, and web services.';
  }
  
  // Greetings
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
    return 'Hello! I\'m an AI assistant. How can I help you today?';
  }
  
  // Common questions
  if (lowerMessage.includes('how are you')) {
    return 'I\'m doing great! Thanks for asking. How are you?';
  }
  if (lowerMessage.includes('help')) {
    return 'I\'m here to help! You can ask me about programming, technology, or general questions.';
  }
  if (lowerMessage.includes('joke')) {
    return 'Why don\'t scientists trust atoms? Because they make up everything! 😄';
  }
  if (lowerMessage.includes('bye')) {
    return 'Goodbye! It was nice chatting with you!';
  }
  if (lowerMessage.includes('thanks')) {
    return 'You\'re welcome! Feel free to ask me anything else.';
  }
  
  // Default intelligent response
  return `I understand you\'re asking about "${userMessage}". While I don\'t have specific information about that right now, I\'d be happy to help you explore the topic further. Could you be more specific about what you\'d like to know?`;
}

async function handleSendMessage() {
  const text = input.value.trim();
  if (!text) return;

  sendBtn.disabled = true;
  addMessage(text, true);
  input.value = "";

  // Show typing indicator
  const typingMsg = document.createElement('div');
  typingMsg.classList.add('msg', 'bot', 'loading');
  typingMsg.textContent = '...';
  messages.appendChild(typingMsg);
  messages.scrollTop = messages.scrollHeight;

  // Get AI response
  const response = await getGroqResponse(text);
  
  // Remove typing indicator
  typingMsg.remove();
  
  // Add AI response
  addMessage(response, false);
  sendBtn.disabled = false;
}

// Toggle chat functions
function openChat() {
  isOpen = true;
  chatContainer.classList.add('open');
  input.focus();
}

function closeChat() {
  isOpen = false;
  chatContainer.classList.remove('open');
}

function toggleChat() {
  if (isOpen) {
    closeChat();
  } else {
    openChat();
  }
}

// Initialize chat
function initializeChat() {
  // Clear connecting message
  messages.innerHTML = "";
  addMessage("Hi! How can I help you today?", false);
  
  // Setup event listeners
  sendBtn.addEventListener("click", handleSendMessage);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") handleSendMessage();
  });
  
  // Toggle functionality
  chatToggle.addEventListener("click", toggleChat);
  chatClose.addEventListener("click", closeChat);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChat);
} else {
  initializeChat();
}
