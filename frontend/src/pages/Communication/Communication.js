import styles from "./Communication.module.css";
import MessageList from "../../components/MessageList/MessageList";
import ChatArea from "../../components/ChatArea/ChatArea";
import { useEffect, useState } from "react";

import { getChats, sendMessage } from "../../proxies/chats";

const Communication = () => {
    // temporary logged in user state for testing
    const [loggedInUser, setLoggedInUser] = useState({
        "_id": "674ea3a9ed69105352b6470d",
        "username": "ahmad_rahman",
        "password": "password123",
        "email": "ahmad.rahman@example.com",
        "firstName": "Ahmad",
        "lastName": "Rahman",
        "bio": "Seasoned teacher in Physics and Engineering.",
        "subjects": [
            "Physics",
            "Thermodynamics"
        ],
        "rate": 55,
        "role": "Tutor",
        "fullName": "Ahmad Rahman",
    });
    // const [loggedInUser, setLoggedInUser] = useState({
    //     "_id": "674ea3a8ed69105352b64704",
    //     "username": "aisha_yusof",
    //     "password": "password123",
    //     "email": "aisha.yusof@example.com",
    //     "firstName": "Aisha",
    //     "lastName": "Yusof",
    //     "role": "Student",
    //     "fullName": "Aisha Yusof",
    // });
    const [chats, setChats] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredChats, setFilteredChats] = useState([]);

    useEffect(() => {
        // get chats from backend
        async function fetchChats() {
            const chats = await getChats(loggedInUser._id, loggedInUser.role);
            console.log(chats);
            if (chats) {
                setChats(chats);
                setSelectedChat(chats[0]);
            }
        }
        fetchChats();
    }, [loggedInUser]);

    useEffect(() => {
        if (chats) {
            const filteredChats = chats.filter(chat =>
                chat.fullName.toLowerCase().includes(searchTerm.toLowerCase())
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
        const newMessage = await sendMessage(selectedChat._id, loggedInUser, content);

        console.log(newMessage);

        const updatedSelectedChat = {
            ...selectedChat,
            messages: [...selectedChat.messages, newMessage],
            lastMessage: newMessage.timestamp
        }

        const updatedChats = chats.map(chat =>
            chat._id === selectedChat._id
                ? updatedSelectedChat
                : chat
        );

        updatedChats.sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage))

        console.log(updatedChats);
        setChats(updatedChats);
        setSelectedChat(updatedSelectedChat);
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
                        userId={loggedInUser._id}
                    />
                </>
            )}
        </div>
    );
};

export default Communication;