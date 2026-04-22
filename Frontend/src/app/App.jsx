import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BattleArena from '../components/BattleArena';
import ChatInput from '../components/ChatInput';
import api from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('arena_chats');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentChatId, setCurrentChatId] = useState(() => {
    const savedId = localStorage.getItem('arena_current_id');
    return savedId || null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('arena_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('arena_current_id', currentChatId);
    } else {
      localStorage.removeItem('arena_current_id');
    }
  }, [currentChatId]);

  const currentChat = chats.find(c => c.id === currentChatId) || { messages: [] };

  const handleNewChat = () => {
    const newId = uuidv4();
    const newChat = {
      id: newId,
      name: `Match #${chats.length + 1}`,
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newId);
  };

  const handleDeleteChat = (id) => {
    const updatedChats = chats.filter(c => c.id !== id);
    setChats(updatedChats);
    if (currentChatId === id) {
      setCurrentChatId(updatedChats[0]?.id || null);
    }
  };

  const handleSendMessage = async (input) => {
    let chatId = currentChatId;
    
    if (!chatId) {
      const newId = uuidv4();
      const newChat = {
        id: newId,
        name: input.substring(0, 30),
        messages: []
      };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newId);
      chatId = newId;
    }

    const userMessage = { role: 'user', content: input, id: uuidv4() };
    
    // Add user message to specific chat
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
          name: chat.messages.length === 0 ? input.substring(0, 30) : chat.name
        };
      }
      return chat;
    }));

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/invoke', { input });
      console.log("Battle Response:", response.data);
      
      if (response.data.success) {
        const aiMessage = {
          role: 'ai',
          battleData: response.data.result,
          id: uuidv4()
        };

        setChats(prev => prev.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, aiMessage]
            };
          }
          return chat;
        }));
      } else {
        throw new Error("Engagement failed in the graph.");
      }
    } catch (err) {
      console.error(err);
      setError("Strategic failure: Could not reach the AI models.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar 
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <BattleArena 
          messages={currentChat.messages}
          isLoading={isLoading}
          error={error}
        />
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;