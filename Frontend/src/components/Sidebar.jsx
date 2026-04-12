import React from 'react';

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onCloseSidebar,
  sidebarOpen,
}) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-80 bg-zinc-950/95 border-r border-zinc-800 p-4 space-y-6 transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Chat History</p>
          <h2 className="text-2xl font-semibold mt-2">AI Arena</h2>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-100 hover:bg-zinc-800 md:hidden"
          onClick={onCloseSidebar}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full rounded-2xl border border-zinc-700 bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New Chat
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 cursor-pointer transition-colors ${chat.id === activeChatId ? 'bg-blue-600 text-white' : 'bg-zinc-950 text-zinc-200 hover:bg-zinc-900'}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{chat.title}</p>
              <p className="text-xs text-zinc-400">{chat.messages.length} message{chat.messages.length === 1 ? '' : 's'}</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
              className="text-zinc-400 hover:text-red-400"
              aria-label="Delete chat"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
