import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { Flame, Crown, Target, Map, Sparkles, Brain, Play, Coins } from 'lucide-react';
import AspirantInsight from './AspirantInsight';
import './GamifiedDashboard.css';

const GamifiedDashboard = () => {
  const navigate = useNavigate();
  const { user, currentStreak, totalXP, isFrozen, freezeStreak } = useAuthStore();
  const [questionsToday] = useState(42);
  const [questionsGoal] = useState(50);
  const [lecturesWatched] = useState(0);
  const currentCoins = user?.coins || 0;
  const goalPercent = Math.min(100, Math.round((questionsToday / questionsGoal) * 100));

  const [lastLecture, setLastLecture] = useState(() => {
    try {
      const data = localStorage.getItem('edura_last_lecture');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const handleFreeze = () => {
    if (isFrozen) return;
    if (currentCoins < 50) {
      alert("Not enough coins! You need 50 🪙 to freeze your streak.");
      return;
    }
    freezeStreak();
  };

  // 🎉 Fire confetti on active streak >= 1 (once per session)
  useEffect(() => {
    if (currentStreak >= 1 && !isFrozen) {
      const alreadyFired = sessionStorage.getItem('edura_streak_confetti');
      if (!alreadyFired) {
        sessionStorage.setItem('edura_streak_confetti', 'true');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('edura-confetti'));
        }, 800);
      }
    }
  }, [currentStreak, isFrozen]);

  // 👋 Show personalized welcome modal on first login
  useEffect(() => {
    const welcomed = localStorage.getItem('edura_welcomed');
    if (!welcomed) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('edura-welcome', { detail: { name: user?.name || user?.username || 'Aspirant' } }));
      }, 1200);
    }
  }, [user]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="gamified-dashboard max-w-7xl mx-auto pb-20 px-6 mt-8">
      
      {/* Top Header */}
      <motion.div 
        className="flex justify-between items-end mb-8"
        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">Welcome back, {user?.name || 'Aspirant'}</h1>
          <p className="font-light text-gray-400 text-lg leading-relaxed">Let's conquer today's goals.</p>
        </div>
      </motion.div>

      {/* MASONRY GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 1. STREAK CARD (Col Span 1) */}
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="col-span-1 bg-[#121212] rounded-3xl p-6 border border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              {currentStreak >= 30 ? <Crown size={24} className="text-yellow-500" /> : <Flame size={24} className="text-orange-500" />}
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded-md text-orange-400">{isFrozen ? 'FROZEN' : 'ACTIVE'}</span>
          </div>
          <h3 className="text-4xl font-black tracking-tighter text-white mb-1">{currentStreak} <span className="text-lg text-gray-500 font-medium">Days</span></h3>
          <p className="text-sm font-light text-gray-400">Current Study Streak</p>
          
          {/* Hover Freeze Action */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-[#18181b]/90 backdrop-blur-md border-t border-white/10 flex justify-between items-center">
            <span className="text-sm font-bold text-yellow-500 flex items-center gap-1" style={{ filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.4))' }}>
              {currentCoins} <Coins size={16} className="text-yellow-400" />
            </span>
            <button onClick={handleFreeze} className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded hover:bg-blue-600/40 transition-colors">
              Freeze (50)
            </button>
          </div>
        </motion.div>

        {/* 2. XP CARD (Col Span 1) */}
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="col-span-1 bg-[#121212] rounded-3xl p-6 border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Sparkles size={24} className="text-purple-400" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-green-500/10 rounded-md text-green-400">↑ 12%</span>
          </div>
          <h3 className="text-4xl font-black tracking-tighter text-white mb-1">{user?.xp || totalXP}</h3>
          <p className="text-sm font-light text-gray-400">Total Experience Points</p>
        </motion.div>

        {/* 3. GOAL TRACKER (Col Span 2, Row Span 2) */}
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="col-span-1 md:col-span-2 row-span-2 bg-[#121212] rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-colors flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2"><Target className="text-cyan-400" /> Today's Objectives</h3>
          
          <div className="space-y-8 flex-1 flex flex-col justify-center">
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-300 font-medium">Questions Progress</span>
                <span className="text-cyan-400 font-bold">{questionsToday}/{questionsGoal}</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${goalPercent}%` }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-300 font-medium">Lectures Progress</span>
                <span className="text-purple-400 font-bold">{lecturesWatched}/4</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '50%' }} transition={{ duration: 1.5, delay: 0.7 }} className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
              </div>
            </div>
          </div>
        </motion.div>



        {/* 5. ASPIRANT ROADMAP (Col Span 2, Row Span 2) */}
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="col-span-1 md:col-span-2 row-span-2 bg-[#121212] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2"><Map className="text-emerald-400" /> Syllabus Roadmap</h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-200 font-medium">Physics (Mechanics)</span>
                <span className="text-blue-400 font-bold">75%</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1, delay: 0.8 }} className="h-full bg-blue-500" />
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-200 font-medium">Chemistry (Organic)</span>
                <span className="text-orange-400 font-bold">40%</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1, delay: 0.9 }} className="h-full bg-orange-500" />
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-200 font-medium">Math (Calculus)</span>
                <span className="text-emerald-400 font-bold">90%</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 1, delay: 1 }} className="h-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 6. ASPIRANT INSIGHT (Col Span 4 - Full Width) */}
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
          <AspirantInsight />
        </motion.div>

      </div>


    </div>
  );
};

export default GamifiedDashboard;
