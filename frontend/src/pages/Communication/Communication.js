import styles from "./Communication.module.css";
import MessageList from "../../components/MessageList/MessageList";
import ChatArea from "../../components/ChatArea/ChatArea";
import { useState } from "react";

const Communication = () => {
    const [chats, setChats] = useState([
        {
            id: 1, name: 'Victor', messages: [
                { sender: 'Victor', content: "Hello, Sir! My name is Victor Chong, and I'm currently in year 3." },
                { sender: 'Victor', content: "I want to learn Probability & Statistic from you. Could you please help me?" },
                { sender: 'Tutor', content: "Good evening, Victor. I hope you're doing well. I would be delighted to teach you Probability and Statistics. How about we start with a session focused on solving problems to assess your current level and identify areas to improve?" },
                { sender: 'Tutor', content: "Are you free on Saturday at 11:00 am?" },
                { sender: 'Victor', content: "Yes Sir! I'm free." },
            ]
        },
        {
            id: 2, name: 'John', messages: [
                { sender: 'John', content: "Hi, I'm having trouble with calculus. Can you help?" },
                { sender: 'Tutor', content: "Of course, John. What specific topic in calculus are you struggling with?" },
            ]
        },
        {
            id: 3, name: 'Amy', messages: [
                { sender: 'Amy', content: "Hello! I'm preparing for my physics exam. Any tips?" },
                { sender: 'Tutor', content: "Hi Amy! Let's start by reviewing the main concepts. What chapters are covered in your exam?" },
            ]
        },
        {
            id: 4, name: 'Sarah', messages: [
                { sender: 'Sarah', content: "Good morning! I need help with my chemistry homework." },
                { sender: 'Tutor', content: "Good morning, Sarah! I'd be happy to help. What's the topic of your homework?" },
            ]
        },
    ]);

    const [selectedChat, setSelectedChat] = useState(chats[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSelectChat = (chatId) => {
        const chat = chats.find(c => c.id === chatId);
        setSelectedChat(chat);
    };

    const handleSendMessage = (content) => {
        const newMessage = { sender: 'Tutor', content };
        const updatedChats = chats.map(chat =>
            chat.id === selectedChat.id
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
        );
        setChats(updatedChats);
        setSelectedChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, newMessage]
        }));
    };

    return (
        <div className={styles.container}>
            <MessageList
                chats={filteredChats}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
                onSearch={handleSearch}
            />
            <ChatArea
                chat={selectedChat}
                onSendMessage={handleSendMessage}
                username={'Tutor'}
            />
        </div>
    );
};

export default Communication;