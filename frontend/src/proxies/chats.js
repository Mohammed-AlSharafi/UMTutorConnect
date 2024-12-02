import axiosInstance from "./axiosHandler";

const getChats = async (userId, userRole) => {
  try {
    const response = await axiosInstance.get(`/chatApi/chats/${userRole}/${userId}`);
    return response.data.chats;
  }
  catch (error) {
    if (error.response) {
      // error already handled by interceptor
      // no specific error handling for now
    }
    else {
      console.error(error);
    }
    throw error;
  }
};

const sendMessage = async (chatId, user, content) => {
  try {
    const response = await axiosInstance.post(`/chatApi/chats/${chatId}/messages`, {
      user: user,
      content: content,
    });

    return response.data.message;
  }
  catch (error) {
    if (error.response) {
      // error already handled by interceptor
      // no specific error handling for now
    }
    else {
      console.error(error);
    }
    throw error;
  }
};

export { getChats, sendMessage };