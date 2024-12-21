import axiosInstance from "./axiosHandler";

const getChat = async (user1, user2) => {
  try {
    console.log("user1: ", user1);
    console.log("user2: ", user2);

    const response = await axiosInstance.get(`/chatApi/chats`, {
      params: {
        user1: user1,
        user2: user2
      },
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
      }
    });
    return response.data.chat;
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
}

const getChats = async (userId, userRole) => {
  try {
    const response = await axiosInstance.get(`/chatApi/chats/${userRole}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
      }
    });
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
    const response = await axiosInstance.post(`/chatApi/chats/${chatId}/sendMessage`, {
      user: user,
      content: content,
    }, {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      }
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

export { getChat, getChats, sendMessage };