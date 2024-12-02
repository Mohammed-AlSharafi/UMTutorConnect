import styles from "./Communication.module.css";
import MessageList from "../../components/MessageList/MessageList";
import ChatArea from "../../components/ChatArea/ChatArea";
import { useEffect, useState } from "react";

import { getChats, sendMessage } from "../../proxies/chats";

const Communication = () => {
    const [user, setUser] = useState({
        "_id": "674df9e27ef21d531febbeb3",
        "username": "tan_hock_leong",
        "password": "password123",
        "email": "tan.hockleong@example.com",
        "firstName": "Tan",
        "lastName": "Hock Leong",
        "bio": "Veteran instructor in Computer Science and Programming.",
        "subjects": [
          "Java",
          "Web Development"
        ],
        "rate": 65,
        "role": "Tutor",
        "__v": 0
      });
    const [chats, setChats] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredChats, setFilteredChats] = useState([]);

    useEffect(() => {
        // get chats from backend
        async function fetchChats() {
            const chats = await getChats(user._id, user.role);
            console.log(chats);
            if (chats) {
                setChats(chats);
                setSelectedChat(chats[0]);
            }
        }
        fetchChats();
    }, [user]);

    useEffect(() => {
        if (chats) {
            const filteredChats = chats.filter(chat =>
                chat.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredChats(filteredChats);
        }
    }, [chats, searchTerm]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSelectChat = (chatId) => {
        const chat = chats.find(c => c._id === chatId);
        setSelectedChat(chat);
    };

    const handleSendMessage = async (content) => {
        const newMessage = await sendMessage(selectedChat._id, user, content);

        console.log(newMessage);
        
        const updatedChats = chats.map(chat =>
            chat._id === selectedChat._id
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
        );
        setChats(updatedChats);
        setSelectedChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, newMessage]
        }));
    };

    // conditionally render MessageList and ChatArea components chats selectedChats and filteredChats are available
    return (
        <div className={styles.container}>
            {(chats && selectedChat && filteredChats) && (
                <>
                    <MessageList
                        chats={filteredChats}
                        selectedChat={selectedChat}
                        onSelectChat={handleSelectChat}
                        onSearch={handleSearch}
                    />
                    <ChatArea
                        chat={selectedChat}
                        onSendMessage={handleSendMessage}
                        username={user.username}
                    />
                </>
            )}
        </div>
    );
};

export default Communication;