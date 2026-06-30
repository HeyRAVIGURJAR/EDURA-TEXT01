import React, { useState } from "react";
import { Play, Pause, Music } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="absolute bottom-6 left-4 right-4 bg-[#18181B] border border-white/10 p-3 rounded-xl flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-purple-500/20 text-purple-400 ${isPlaying ? 'animate-pulse' : ''}`}>
          <Music size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Lofi Beats</p>
          <p className="text-[10px] text-gray-400">Admin Track</p>
        </div>
      </div>
      <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-purple-400 transition-colors">
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </div>
  );
}
