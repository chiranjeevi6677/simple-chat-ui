# Simple Chat UI

A responsive chat interface with AI-powered responses.

## Features

- 💬 Clean, modern chat interface
- 📱 Mobile responsive design
- ⚡ Real-time message handling
- 🤖 AI assistant responses
- ⌨️ Enter key support
- 🔄 Typing indicators

## Files

- `index.html` - Main chat interface
- `style.css` - Styling and responsive design
- `app.js` - Chat functionality and AI responses
- `server.py` - Flask backend for Groq API (optional)

## Quick Start

1. **Basic Setup:**
   ```bash
   # Open index.html in browser or use Live Server
   ```

2. **With AI API (Optional):**
   ```bash
   pip install flask flask-cors requests
   python server.py
   ```

## Usage

- Type messages in the input field
- Press Enter or click Send
- Chat responds with AI-powered answers
- Works on desktop and mobile

## Customization

- Change colors in `style.css` (search for `#007bff`)
- Modify responses in `app.js` 
- Add new topics in `getGroqResponse()` function

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge)

---

**Ready to chat!** 🚀