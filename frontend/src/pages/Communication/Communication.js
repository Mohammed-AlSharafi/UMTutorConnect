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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showMessageList, setShowMessageList] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // get chats from backend
        async function fetchChats() {
            try {
                const chats = await getChats(loggedInUser._id, loggedInUser.role);
                console.log("chats: ", chats);
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
        const key = process.env.REACT_APP_PUSHER_API_KEY;
        const cluster = process.env.REACT_APP_PUSHER_CLUSTER;

        const pusher = new Pusher(key, {
            cluster: cluster,
            useTLS: true
        });

        // subscribe to chats channel
        const channel = pusher.subscribe("chats");
        channel.bind("send-message-event", function (data) {
            console.log("Received message:", data.message);

            if (data.message.sender.id !== loggedInUser._id) {
                setChats(prevChats => {
                    const updatedChats = prevChats.map(chat =>
                        chat._id === data.message.chatId
                            ? {
                                ...chat,
                                messages: [...chat.messages, data.message],
                                lastMessage: data.message.timestamp
                            }
                            : chat
                    );
                    updatedChats.sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage));

                    setSelectedChat(prevSelectedChat => {
                        const updatedSelectedChat = updatedChats.find(chat => chat._id === prevSelectedChat._id);
                        return updatedSelectedChat;
                    })

                    return updatedChats;
                });

            }
            return data;
        });
        console.log("Subscribed to chats channel");

        // clean up function
        return () => {
            pusher.unsubscribe("chats");
            pusher.disconnect();
            console.log("Unsubscribed from chats channel");
        }

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
        if (isMobile) {
            setShowMessageList(false);
        }
    };

    const handleBackToList = () => {
        setShowMessageList(true);
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
            {chats && chats.length > 0 ? (
                <>
                    {(!isMobile || (isMobile && showMessageList)) && (
                        <MessageList
                            chats={filteredChats}
                            selectedChat={selectedChat}
                            onSelectChat={handleSelectChat}
                            onSearch={handleSearch}
                        />
                    )}
                    {(!isMobile || (isMobile && !showMessageList)) && (
                        <ChatArea
                            chat={selectedChat}
                            onSendMessage={handleSendMessage}
                            userId={loggedInUser._id}
                            onBackToList={handleBackToList}
                            isMobile={isMobile}
                        />
                    )}
                </>
            ) : (
                <div className={styles.placeholder}>
                    <div className={styles.placeholderContent}>
                        <h2>No Messages Yet</h2>
                        <p>Start a conversation to see your messages here.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Communication;

