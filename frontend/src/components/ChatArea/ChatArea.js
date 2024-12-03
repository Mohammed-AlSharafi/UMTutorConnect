import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatArea.module.css';

function ChatArea({ chat, onSendMessage, userId }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chat.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className={styles.chatArea}>
      <div className={styles.chatHeader}>
        <span className={styles.name}>{chat.name}</span>
      </div>
      <div className={styles.messages}>
        {chat.messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${message.sender.id === userId ? styles.tutor : ''}`}>
            <div className={styles.messageContent}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Type a message" 
          className={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
}

export default ChatArea;

