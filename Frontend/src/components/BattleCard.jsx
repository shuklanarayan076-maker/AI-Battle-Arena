import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from './Typewriter';
import { Shield, Target, Award, BrainCircuit } from 'lucide-react';

const BattleCard = ({ 
  modelName, 
  content, 
  score, 
  reasoning, 
  isWinner, 
  isJudging, 
  isComplete 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden glass-card transition-all duration-500 ${
        isWinner ? 'border-primary/50 glow-border-primary' : 'border-white/5'
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isWinner ? 'bg-primary/20' : 'bg-white/5'}`}>
            <BrainCircuit className={`w-5 h-5 ${isWinner ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase">
            {modelName}
          </h3>
        </div>
        
        {isWinner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 bg-primary/20 px-3 py-1 rounded-full border border-primary/30"
          >
            <Award className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-orbitron font-black text-primary uppercase">Dominant</span>
          </motion.div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 font-inter text-sm leading-relaxed text-gray-300 overflow-y-auto max-h-[400px]">
        {content ? (
          <Typewriter text={content} delay={5} />
        ) : (
          <div className="flex flex-col items-center justify-center h-40 opacity-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="mt-4 text-xs font-orbitron">Calculating...</p>
          </div>
        )}
      </div>

      {/* Judge reasoning Overlay (reveals when judging complete) */}
      <AnimatePresence>
        {isComplete && reasoning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 border-t border-primary/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-orbitron text-primary/70 uppercase font-bold">Judge Verdict</span>
            </div>
            <p className="text-xs text-primary/80 italic line-clamp-3 hover:line-clamp-none transition-all">
              "{reasoning}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score Reveal */}
      <div className="absolute top-4 right-4 group">
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-secondary border-2 border-primary shadow-lg shadow-primary/20"
            >
              <span className="text-lg font-orbitron font-black text-primary leading-none">{score}</span>
              <span className="text-[8px] font-bold text-primary/50">/10</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BattleCard;
