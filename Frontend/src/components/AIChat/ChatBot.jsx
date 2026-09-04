import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import './chatbot.css';
import logo from '../../assets/logo.png';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // 1. User Message UI me Append karein
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // 2. Spring Boot Backend Endpoint Call (DTOChatRequest matched)
      const response = await fetch("http://localhost:8081/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();

      // 3. Extract AI Reply (DTOChatResponse matched)
      const botReply = data.response || "Maaf kijiyega, main samajh nahi paya.";

      setMessages([...newMessages, { sender: 'bot', text: botReply }]);

    } catch (error) {
      console.error("ChatBot Frontend Error:", error);
      setMessages([
        ...newMessages,
        { sender: 'bot', text: `Error: ${error.message}. Kripya check karein ki Spring Boot backend running hai ya nahi.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmverse-chatbot-container">
      {isOpen && (
        <ChatWindow 
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={toggleChat}
          loading={loading}
        />
      )}
      
      <button className="chat-floating-btn" onClick={toggleChat} title="FarmVerse AI">
        <img 
          src={logo} 
          alt="AI" 
          className="chat-logo-img" 
          onError={(e) => { 
            e.target.src = "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"; 
          }}
        />
      </button>
    </div>
  );
};

export default ChatBot;