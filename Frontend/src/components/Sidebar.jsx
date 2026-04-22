import { Plus, Trash2, Shield, MessageSquare, Sword } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ chats, currentChatId, onSelectChat, onDeleteChat, onNewChat }) => {
  return (
    <aside className="w-72 h-screen flex flex-col glass-dark border-r border-[#4D4746]/50 transition-all duration-300">
      {/* Header / Logo */}
      <div className="p-6 border-b border-[#4D4746]/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Sword className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-orbitron font-bold text-xl tracking-wider text-primary uppercase">
            Arena<span className="text-gray-400">AI</span>
          </h1>
        </div>
      </div>

      {/* New Battle Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-primary text-secondary font-orbitron font-bold uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all glow-border-primary group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          New Battle
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 py-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border",
              currentChatId === chat.id
                ? "bg-primary/10 border-primary/40 text-primary"
                : "border-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200"
            )}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium truncate pr-8">
              {chat.name || "Untethered Match"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="absolute right-2 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {chats.length === 0 && (
          <div className="text-center py-10 opacity-30 px-6">
            <Shield className="w-12 h-12 mx-auto mb-3" />
            <p className="text-xs uppercase font-orbitron tracking-widest">No Active Units</p>
          </div>
        )}
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-[#4D4746]/50">
        <div className="flex items-center gap-2 text-[10px] font-orbitron text-gray-500 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          System: Optimal
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
