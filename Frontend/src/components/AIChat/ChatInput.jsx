import React, { useState, useRef } from 'react';

const ChatInput = ({ onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    onSendMessage(text);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-area">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className="chat-input-field"
          placeholder={loading ? 'AI is thinking...' : 'Apna sawaal yahan likhein...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={1}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={loading || !input.trim()}
          title="Send (Enter)"
        >
          {loading ? '⌛' : '➤'}
        </button>
      </form>
      <p className="chat-hint">Enter to send • Shift+Enter for new line</p>
    </div>
  );
};

export default ChatInput;