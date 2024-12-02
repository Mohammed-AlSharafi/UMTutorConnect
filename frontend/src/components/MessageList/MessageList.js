import React from 'react';
import styles from './MessageList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function MessageList({ chats, selectedChat, onSelectChat, onSearch }) {
  return (
    <div className={styles.messageList}>
      <h2 className={styles.title}>Messages</h2>
      <div className={styles.search}>
        <input 
          type="text" 
          placeholder="Search" 
          className={styles.searchInput} 
          onChange={(e) => onSearch(e.target.value)}
        />
        <button className={styles.searchButton}><FontAwesomeIcon icon={faSearch} /></button>
      </div>
      <div className={styles.contacts}>
        {chats.map((chat) => (
          <button 
            key={chat._id} 
            className={`${styles.contact} ${selectedChat._id === chat._id ? styles.active : ''}`}
            onClick={() => onSelectChat(chat._id)}
          >
            {chat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MessageList;

