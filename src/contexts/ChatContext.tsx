import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Message = {
  id: string;
  from: 'user' | 'gehenna';
  text: string;
  timestamp: number;
};

export type Chat = {
  id: string;
  name: string;
  messages: Message[];
  pinned: boolean;
  createdAt: number;
};

type ChatContextType = {
  chats: Chat[];
  currentChatId: string | null;
  createChat: (name?: string) => void;
  deleteChat: (id: string) => void;
  switchChat: (id: string) => void;
  renameChat: (id: string, newName: string) => void;
  togglePinChat: (id: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearChat: (chatId: string) => void;
  getCurrentChat: () => Chat | null;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('gehenna-chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'chat-1',
        name: 'Новый чат',
        messages: [{ id: 'msg-1', from: 'gehenna', text: 'Привет! Я Gehenna. Чем могу помочь?', timestamp: Date.now() }],
        pinned: false,
        createdAt: Date.now(),
      },
    ];
  });

  const [currentChatId, setCurrentChatId] = useState<string | null>(() => {
    const saved = localStorage.getItem('gehenna-current-chat');
    return saved || 'chat-1';
  });

  useEffect(() => {
    localStorage.setItem('gehenna-chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('gehenna-current-chat', currentChatId);
    }
  }, [currentChatId]);

  const createChat = (name?: string) => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: name || `Чат ${chats.length + 1}`,
      messages: [{ id: `msg-${Date.now()}`, from: 'gehenna', text: 'Привет! Я Gehenna. Чем могу помочь?', timestamp: Date.now() }],
      pinned: false,
      createdAt: Date.now(),
    };
    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      const remaining = chats.filter((chat) => chat.id !== id);
      setCurrentChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const switchChat = (id: string) => {
    setCurrentChatId(id);
  };

  const renameChat = (id: string, newName: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, name: newName.trim() || 'Новый чат' } : chat
      )
    );
  };

  const togglePinChat = (id: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
      )
    );
  };

  const addMessage = (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          // Авто-переименование (функция 3)
          let newName = chat.name;
          if (chat.name === 'Новый чат' || chat.name.startsWith('Чат ')) {
            const firstUserMsg = message.from === 'user' ? message.text : null;
            if (firstUserMsg && chat.messages.length === 0) {
              newName = firstUserMsg.slice(0, 30) + (firstUserMsg.length > 30 ? '…' : '');
            }
          }
          return {
            ...chat,
            name: newName,
            messages: [
              ...chat.messages,
              { id: `msg-${Date.now()}`, ...message, timestamp: Date.now() },
            ],
          };
        }
        return chat;
      })
    );
  };

  const clearChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                { id: `msg-${Date.now()}`, from: 'gehenna', text: 'Чат очищен. Начните новый диалог.', timestamp: Date.now() },
              ],
            }
          : chat
      )
    );
  };

  const getCurrentChat = (): Chat | null => {
    return chats.find((chat) => chat.id === currentChatId) || null;
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        createChat,
        deleteChat,
        switchChat,
        renameChat,
        togglePinChat,
        addMessage,
        clearChat,
        getCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};