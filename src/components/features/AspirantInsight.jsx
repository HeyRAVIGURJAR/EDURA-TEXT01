import React from 'react';
import { Target, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const AspirantInsight = () => {
  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 mt-8 shadow-2xl relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Target className="text-purple-400" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Aspirant Insight</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Strategic analytics to give you the topper's edge.</p>
        </div>
        <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest">
          Pro Feature
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Weak Topics Analysis */}
        <div className="bg-[#18181b] p-6 rounded-xl border border-white/5 shadow-inner flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-orange-400" />
              Weak Topics Alert
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Based on your last 3 mock tests, your accuracy in <strong className="text-orange-400">Rotational Dynamics</strong> and <strong className="text-orange-400">Thermodynamics</strong> is below 40%.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg flex justify-between items-center border border-white/5 hover:border-purple-500/30 transition-colors">
              <div>
                <span className="text-sm font-semibold text-white block">Rotational Dynamics</span>
                <span className="text-xs text-gray-500">Suggested: Watch 1-Shot Video</span>
              </div>
              <button 
                onClick={() => alert("Loading 1-Shot Video for Rotational Dynamics...")}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-md shadow-md"
              >
                Fix Now
              </button>
            </div>
            <div className="bg-white/5 p-4 rounded-lg flex justify-between items-center border border-white/5 hover:border-purple-500/30 transition-colors">
              <div>
                <span className="text-sm font-semibold text-white block">Thermodynamics</span>
                <span className="text-xs text-gray-500">Suggested: Solve 20 PYQs</span>
              </div>
              <button 
                onClick={() => alert("Loading Previous Year Questions...")}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-md shadow-md"
              >
                Practice
              </button>
            </div>
          </div>
        </div>

        {/* Time Spent per Question */}
        <div className="bg-[#18181b] p-6 rounded-xl border border-white/5 shadow-inner flex flex-col">
          <h3 className="text-white font-bold flex items-center gap-2 mb-4">
            <Clock size={18} className="text-cyan-400" />
            Time Strategy Analysis
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            You are spending an average of <strong className="text-red-400">3m 15s</strong> per Physics question. Top rankers average <strong className="text-green-400">1m 45s</strong>.
          </p>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400 font-semibold">Physics (Avg Time)</span>
                <span className="text-red-400 font-bold">195s</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400 font-semibold">Chemistry (Avg Time)</span>
                <span className="text-green-400 font-bold">45s</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400 font-semibold">Biology/Math (Avg Time)</span>
                <span className="text-blue-400 font-bold">120s</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
            <TrendingUp size={14} />
            <span>Tip: Switch to reading theory for Physics before attempting numericals to increase speed.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AspirantInsight;
