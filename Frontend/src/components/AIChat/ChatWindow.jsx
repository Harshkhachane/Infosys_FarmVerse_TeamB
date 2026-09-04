import React, { useEffect, useRef } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import logo from '../../assets/logo.png';

const SUGGESTIONS = [
  'Mere khet ke liye kya fertilizer best hai?',
  'Aaj ka mausam kaisa hai?',
  'Pest attack se kaise bachein?',
  'Irrigation ka sahi samay kab hai?'
];

const ChatWindow = ({ messages = [], onSendMessage, onClose, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <img
            src={logo}
            alt="FarmVerse AI"
            className="chat-header-logo"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="chat-header-text">
            <h3>FarmVerse AI</h3>
            <p>
              <span className="chat-status-dot" />
              Kisan Mitra — Online
            </p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose} title="Close">✕</button>
      </div>

      {/* Body */}
      <div className="chat-body">
        {/* Welcome / empty state */}
        {messages.length === 0 && !loading && (
          <div className="fv-welcome">
            <div className="fv-welcome-icon">🌾</div>
            <h4>Namaste! Main hoon Kisan Mitra 🤖</h4>
            <p>Apni kheti se judi koi bhi sawaal poochein.<br/>I'm here to help you grow better!</p>
            <div className="fv-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="fv-suggestion-chip"
                  onClick={() => onSendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="fv-typing-row">
            <div className="fv-avatar fv-avatar-bot">🌾</div>
            <div className="fv-typing-bubble">
              <span className="fv-typing-dot" />
              <span className="fv-typing-dot" />
              <span className="fv-typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} loading={loading} />
    </div>
  );
};

export default ChatWindow;