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

// MetrAI API integration
let conversationId = null;
let sessionId = 'session_' + Date.now();

async function createConversation() {
  try {
    const response = await fetch('https://metrai.met-r.io/api/v1/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ domain: 'medical' })
    });
    
    if (response.ok) {
      const data = await response.json();
      conversationId = data.id || Math.floor(Math.random() * 1000);
    } else {
      conversationId = Math.floor(Math.random() * 1000);
    }
  } catch (error) {
    conversationId = Math.floor(Math.random() * 1000);
  }
}

async function getGroqResponse(userMessage) {
  try {
    // Create conversation if not exists
    if (!conversationId) {
      await createConversation();
    }
    
    const response = await fetch('https://metrai.met-r.io/api/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: userMessage,
        domain: 'medical',
        limit: 10,
        conversation_id: conversationId
      })
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('Non-JSON response received:', await response.text());
      throw new Error('Invalid response format');
    }
    
    if (response.ok) {
      const data = await response.json();
      return data.answer || data.response || 'I\'m here to help with your medical questions.';
    } else {
      const errorText = await response.text();
      console.log('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status}`);
    }
  } catch (error) {
    console.error('MetrAI API error:', error);
    // Fallback responses
    const fallbacks = {
      'hi': 'Hello! I\'m a medical AI assistant. How can I help you today?',
      'hello': 'Hi there! I can help with medical questions. What would you like to know?',
      'help': 'I\'m here to assist with medical information and health-related questions.',
      'thanks': 'You\'re welcome! Feel free to ask me any medical questions.',
      'bye': 'Take care! Remember to consult healthcare professionals for serious concerns.'
    };
    
    const key = userMessage.toLowerCase();
    for (const [keyword, response] of Object.entries(fallbacks)) {
      if (key.includes(keyword)) {
        return response;
      }
    }
    
    return 'I\'m having trouble connecting to the medical database. Please try again or ask a specific health question.';
  }
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
  addMessage("Hello! I'm your Medical AI Assistant. Ask me about symptoms, conditions, or health information.", false);
  
  // Setup event listeners
  sendBtn.addEventListener("click", handleSendMessage);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") handleSendMessage();
  });
  
  // Toggle functionality
  chatToggle.addEventListener("click", toggleChat);
  chatClose.addEventListener("click", closeChat);
  
  // Close on outside click
  document.addEventListener("click", (e) => {
    if (isOpen && !chatContainer.contains(e.target) && !chatToggle.contains(e.target)) {
      closeChat();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChat);
} else {
  initializeChat();
}
