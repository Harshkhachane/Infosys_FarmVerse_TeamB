import React from 'react';

const Message = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`fv-msg-row ${isBot ? 'fv-msg-bot' : 'fv-msg-user'}`}>
      {isBot && (
        <div className="fv-avatar fv-avatar-bot" title="FarmVerse AI">
          🌾
        </div>
      )}

      <div className={`fv-bubble ${isBot ? 'fv-bubble-bot' : 'fv-bubble-user'}`}>
        {isBot ? (
          // Bot replies may contain HTML from AI
          <div
            className="fv-html-content"
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        ) : (
          <span>{message.text}</span>
        )}
      </div>

      {!isBot && (
        <div className="fv-avatar fv-avatar-user" title="You">
          👨‍🌾
        </div>
      )}
    </div>
  );
};

export default Message;