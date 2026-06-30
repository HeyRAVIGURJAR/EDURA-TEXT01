import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';

const Flashcard = ({ question, answer, category = "Revision" }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full h-64 md:h-80 perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative preserve-3d transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] rounded-2xl"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#18181b] to-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="absolute top-4 left-4 text-xs font-bold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {category}
          </div>
          <RotateCw className="absolute top-4 right-4 text-gray-500 opacity-50 group-hover:opacity-100 group-hover:text-purple-400 transition-all" size={20} />
          
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">{question}</h3>
          <p className="text-sm text-gray-500 mt-4 animate-pulse">Click to flip</p>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#2a1b3d] to-[#1a1025] border border-purple-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(168,85,247,0.15)]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-4 left-4 text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Answer
          </div>
          <h3 className="text-lg md:text-xl font-medium text-purple-100 leading-relaxed">{answer}</h3>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
