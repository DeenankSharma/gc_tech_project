export const createChatSlice = (set:any, get:any) => ({
    selectedChatData: undefined,
    selectedChatMessages: [],
    setSelectedChatData: (selectedChatData : any) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages : any) => set({ selectedChatMessages }),
  
    closeChat: () =>
      set({
        selectedChatData: undefined,
        selectedChatMessages: [],
      }),
  
    addMessages: (message : any) => {
      const selectedChatMessages = get().selectedChatMessages;
  
      set({
        selectedChatMessages: [
          ...selectedChatMessages,
          {
            ...message,
            content:message.content,
            timestamp: message.timestamp,
            isUser: message.isUser,
          },
        ],
      });
    },
  
  });