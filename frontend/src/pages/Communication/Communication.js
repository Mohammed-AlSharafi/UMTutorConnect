import styles from "./Communication.module.css";
import MessageList from "../../components/MessageList/MessageList";
import ChatArea from "../../components/ChatArea/ChatArea";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";

import { getChats, sendMessage } from "../../proxies/chats";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Communication = () => {
    const navigate = useNavigate();
    const { loggedInUser } = useAuth();
    const { chatId } = useParams();

    const [chats, setChats] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredChats, setFilteredChats] = useState([]);

    useEffect(() => {
        // get chats from backend
        async function fetchChats() {
            try {
                const chats = await getChats(loggedInUser._id, loggedInUser.role);
                console.log(chats);
                if (chats) {
                    setChats(chats);

                    // if chatId is provided, select that chat
                    if (chatId) {
                        const chat = chats.find(c => c._id === chatId);
                        setSelectedChat(chat);
                    }
                    else {
                        // if no chatId is provided, select the first chat from the list
                        setSelectedChat(chats[0]);
                    }
                }
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 403) {
                        alert(`${error.response.data.message}`)
                    }
                }
                else {

                }
                navigate("/");
            }
        }
        fetchChats();

        // initalise pusher
        const key = process.env.REACT_APP_PUSHER_KEY;
        const cluster = process.env.REACT_APP_PUSHER_CLUSTER;

        const pusher = new Pusher(key, {
            cluster: cluster,
            useTLS: true
        });

        const channel = pusher.subscribe("chats");
        channel.bind("send-message-event", function (data) {
            return data;
        });

    }, [chatId, loggedInUser, navigate]);

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