import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const Typewriter = ({ text, delay = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        // Find the next space or boundary to keep the typing feel rhythmic
        const nextChar = text[currentIndex];
        setDisplayedText((prev) => prev + nextChar);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return (
    <div className="prose-tactical max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]}
      >
        {displayedText}
      </ReactMarkdown>
      {currentIndex < text.length && (
        <span className="inline-block w-1 h-3 ml-1 bg-primary animate-pulse align-middle" />
      )}
    </div>
  );
};

export default Typewriter;
