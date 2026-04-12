import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import Sidebar from './Sidebar';
import axios from "axios";

const createChat = () => ({
  id: Date.now(),
  title: 'New chat',
  messages: []
});

const getChatTitle = (chat) => {
  if (!chat) return 'New chat';
  if (chat.title && chat.title !== 'New chat') return chat.title;
  if (!chat.messages.length) return 'New chat';
  return chat.messages[0].problem.slice(0, 28) + (chat.messages[0].problem.length > 28 ? '...' : '');
};

export default function ChatInterface() {
  const [ chats, setChats ] = useState([createChat()]);
  const [ activeChatId, setActiveChatId ] = useState(chats[0].id);
  const [ inputValue, setInputValue ] = useState('');
  const [ isSending, setIsSending ] = useState(false);
  const [ sidebarOpen, setSidebarOpen ] = useState(false);
  const endOfMessagesRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0];

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ activeChat?.messages ]);

  const handleNewChat = () => {
    const newChat = createChat();
    setChats((prevChats) => [newChat, ...prevChats]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
    setInputValue('');
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId) => {
    setChats((prevChats) => {
      const remaining = prevChats.filter((chat) => chat.id !== chatId);
      if (!remaining.length) {
        const fallback = createChat();
        setActiveChatId(fallback.id);
        return [fallback];
      }
      if (chatId === activeChatId) {
        setActiveChatId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const prompt = inputValue.trim();
    if (!prompt || isSending) return;

    const messageId = Date.now();
    const pendingMessage = {
      id: messageId,
      problem: prompt,
      solution_1: null,
      solution_2: null,
      judge: null,
      status: 'pending'
    };

    setChats((prevChats) => prevChats.map((chat) => {
      if (chat.id !== activeChat.id) return chat;
      return {
        ...chat,
        title: prompt.slice(0, 28) + (prompt.length > 28 ? '...' : ''),
        messages: [...chat.messages, pendingMessage]
      };
    }));

    setInputValue('');
    setIsSending(true);

    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: prompt
      });

      const data = response.data;
      setChats((prevChats) => prevChats.map((chat) => {
        if (chat.id !== activeChat.id) return chat;
        return {
          ...chat,
          messages: chat.messages.map((msg) => {
            if (msg.id !== messageId) return msg;
            return {
              ...msg,
              ...data.result,
              status: 'done'
            };
          })
        };
      }));
    } catch (error) {
      console.error(error);
      setChats((prevChats) => prevChats.map((chat) => {
        if (chat.id !== activeChat.id) return chat;
        return {
          ...chat,
          messages: chat.messages.map((msg) => {
            if (msg.id !== messageId) return msg;
            return {
              ...msg,
              status: 'error',
              error: 'Unable to fetch AI responses. Please try again.'
            };
          })
        };
      }));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onCloseSidebar={() => setSidebarOpen(false)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-zinc-200/50 bg-white/90 px-4 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">AI Chat Arena</p>
              <h1 className="text-xl font-semibold">{getChatTitle(activeChat)}</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {activeChat.messages.length === 0 ? (
            <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/80 p-12 text-center text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Welcome to the Arena</h2>
                <p>Type a problem below to see two AI solutions go head-to-head.</p>
              </div>
            </div>
          ) : (
            activeChat.messages.map((msg) => (
              <div key={msg.id} className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                <UserMessage message={msg.problem} />
                <ArenaResponse
                  solution1={msg.solution_1}
                  solution2={msg.solution_2}
                  judge={msg.judge}
                  status={msg.status}
                  error={msg.error}
                />
              </div>
            ))
          )}
          <div ref={endOfMessagesRef} />
        </main>

        <div className="border-t border-zinc-200 bg-white/90 px-4 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a coding question..."
                className="w-full rounded-full border border-zinc-200 bg-zinc-100 py-4 pl-6 pr-20 text-lg text-zinc-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
              />
              <button
                type="submit"
                className="absolute right-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!inputValue.trim() || isSending}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
