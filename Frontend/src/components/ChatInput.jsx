import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="p-6 bg-surface/80 backdrop-blur-md border-t border-white/5">
      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto relative group"
      >
        <div className={`
          relative flex items-center gap-2 p-2 rounded-2xl bg-secondary/30 border transition-all duration-300
          ${isLoading ? 'border-primary/20 opacity-50' : 'border-white/10 group-hover:border-primary/40'}
        `}>
          <div className="pl-4 opacity-40">
            <Zap className={`w-5 h-5 ${isLoading ? 'animate-pulse text-primary' : ''}`} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Battle in progress..." : "Initiate a combat query..."}
            className="flex-1 bg-transparent py-3 px-2 outline-none text-sm font-inter text-gray-200 placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
              p-3 rounded-xl transition-all
              ${input.trim() && !isLoading 
                ? 'bg-primary text-secondary hover:scale-110 active:scale-95 shadow-lg shadow-primary/20' 
                : 'bg-white/5 text-gray-600 cursor-not-allowed'}
            `}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute -bottom-4 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </form>
    </div>
  );
};

export default ChatInput;
