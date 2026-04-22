import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BattleCard from './BattleCard';
import { User, Swords, AlertCircle } from 'lucide-react';

const BattleArena = ({ messages, isLoading, error }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 relative flex flex-col overflow-hidden bg-surface">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-10 space-y-12 scrollbar-thin scrollbar-thumb-secondary/30"
      >
        <AnimatePresence mode="popLayout">
          {messages && messages.map((msg, idx) => (
            <motion.div
              key={msg.id || `msg-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}
            >
              {msg.role === 'user' ? (
                <div className="flex items-start gap-4 max-w-[85%]">
                  <div className="flex flex-col items-end">
                    <div className="bg-[#4D4746]/40 border border-[#C7C06D]/20 p-4 rounded-2xl rounded-tr-none text-gray-200 text-sm font-medium shadow-xl">
                      {msg.content}
                    </div>
                    <span className="text-[10px] font-orbitron mt-2 opacity-40 uppercase tracking-widest text-primary">Operative Alpha</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-8">
                  {/* Battle Indicator */}
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/5">
                      <Swords className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-orbitron font-bold text-primary uppercase tracking-[0.2em]">Live Engagement</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  </div>

                  {/* The Comparison Cards */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch w-full max-w-7xl mx-auto">
                    <BattleCard
                      modelName="Mistral 7B"
                      content={msg.battleData?.solution_1}
                      score={msg.battleData?.judge?.solution_1_score}
                      reasoning={msg.battleData?.judge?.solution_1_reasoning}
                      isWinner={msg.battleData?.judge?.solution_1_score > msg.battleData?.judge?.solution_2_score}
                      isComplete={!!msg.battleData?.judge}
                    />
                    <BattleCard
                      modelName="Cohere R"
                      content={msg.battleData?.solution_2}
                      score={msg.battleData?.judge?.solution_2_score}
                      reasoning={msg.battleData?.judge?.solution_2_reasoning}
                      isWinner={msg.battleData?.judge?.solution_2_score > msg.battleData?.judge?.solution_1_score}
                      isComplete={!!msg.battleData?.judge}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-2 border-primary/10 rounded-full" />
              <div className="absolute inset-0 border-2 border-t-primary rounded-full animate-spin" />
            </div>
            <p className="font-orbitron text-[10px] font-bold tracking-[0.4em] text-primary/60 uppercase animate-pulse">
              Processing Duel...
            </p>
          </motion.div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-medium uppercase tracking-wider">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
