import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, PenTool, Search, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const PdfViewer = ({ title, fileUrl, onClose }) => {
  const [note, setNote] = useState("");
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const addXP = useAuthStore(state => state.addXP);

  const handleSaveNote = () => {
    if (note.trim().length > 0) {
      setIsNoteSaved(true);
      addXP(10); // Reward for taking notes
      setTimeout(() => setIsNoteSaved(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex flex-col md:flex-row"
      >
        {/* PDF Area (Simulated iframe) */}
        <div className="flex-1 h-full flex flex-col bg-[#0A0A0B]">
          {/* Toolbar */}
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#121212]">
            <h2 className="text-white font-bold truncate max-w-[300px]">{title}</h2>
            <div className="flex items-center gap-4 text-gray-400">
              <button className="hover:text-white transition-colors"><Search size={20} /></button>
              <div className="w-px h-6 bg-white/10" />
              <button className="hover:text-white transition-colors"><ZoomOut size={20} /></button>
              <span className="text-sm font-mono text-white">100%</span>
              <button className="hover:text-white transition-colors"><ZoomIn size={20} /></button>
              <div className="w-px h-6 bg-white/10" />
              <button className="hover:text-white transition-colors"><Download size={20} /></button>
            </div>
          </div>
          
          {/* Document Container */}
          <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#050505]">
            <div className="w-full max-w-4xl bg-white aspect-[1/1.4] shadow-2xl rounded-sm p-12 text-black relative">
              {/* Simulated PDF Content */}
              <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
              <div className="space-y-4 text-gray-800 leading-relaxed font-serif">
                <p>This is a simulated interactive PDF document. In a production environment, this would be rendered using a library like <code className="bg-gray-100 px-1 rounded">react-pdf</code> or an embedded iframe to the actual PDF source.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                {/* Highlight simulation */}
                <p>Duis aute irure dolor in reprehenderit in <span className="bg-yellow-200 px-1 rounded">voluptate velit esse cillum dolore</span> eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                
                <h2 className="text-xl font-bold mt-8 mb-4 border-b pb-2">Important Concepts</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Active Recall is essential for long-term retention.</li>
                  <li>Spaced Repetition prevents the forgetting curve.</li>
                  <li>Focus blocks (Pomodoro) enhance cognitive endurance.</li>
                </ul>
              </div>

              {/* Watermark */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
                <span className="text-6xl font-bold rotate-45 select-none">EDURA PREMIUM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar for Notes */}
        <div className="w-full md:w-80 h-full bg-[#18181B] border-l border-white/10 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#121212]">
            <h3 className="text-white font-bold flex items-center gap-2">
              <PenTool size={18} className="text-purple-400" />
              My Notes
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col">
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider font-semibold">Saved to Profile</p>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type your notes here while reading. They will be saved to your profile automatically..."
              className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
            />
            <button 
              onClick={handleSaveNote}
              className="mt-4 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              <Save size={18} />
              {isNoteSaved ? 'Saved!' : 'Save Note (+10 XP)'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PdfViewer;
