import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Users, ShieldAlert, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import EduraLogo from '../components/ui/EduraLogo';

const ChallengeArena = () => {
  const { user, addXP } = useAuthStore();
  const [matchState, setMatchState] = useState('lobby'); // lobby -> searching -> playing -> result
  const [opponent, setOpponent] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const MOCK_QUESTIONS = [
    { q: "What is the unit of Electric Flux?", options: ["V m", "N m/C", "V/m", "Both A and B"], a: 3 },
    { q: "Which of the following is NOT an electrophile?", options: ["H+", "BF3", "NH3", "AlCl3"], a: 2 },
    { q: "The value of limits x->0 (sin x / x) is?", options: ["0", "1", "Infinity", "Undefined"], a: 1 }
  ];

  // Matchmaking simulation
  useEffect(() => {
    if (matchState === 'searching') {
      const timer = setTimeout(() => {
        setOpponent({ name: 'Rahul_AIR_Under_100', rank: 'Legend', avatar: '😎' });
        setMatchState('playing');
        setTimeLeft(30);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [matchState]);

  // Quiz timer
  useEffect(() => {
    let timer;
    if (matchState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (matchState === 'playing' && timeLeft === 0) {
      handleAnswer(-1); // timeout
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchState, timeLeft]);

  const startMatch = () => setMatchState('searching');

  const handleAnswer = (index) => {
    const isCorrect = index === MOCK_QUESTIONS[currentQ].a;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    // Simulate opponent answering
    const opponentCorrect = Math.random() > 0.5;
    if (opponentCorrect) setOpponentScore(prev => prev + 10);

    if (currentQ < MOCK_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setMatchState('result');
      if (score + (isCorrect ? 10 : 0) > opponentScore + (opponentCorrect ? 10 : 0)) {
        addXP(250); // Winner gets huge XP
      } else {
        addXP(50); // Participation
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <EduraLogo size={42} subview="CHALLENGE ARENA" />
          <p className="text-gray-400 mt-2">1v1 Peer Battles. Winner takes the glory.</p>
        </div>
        <div className="px-4 py-2 bg-[#18181b] rounded-xl border border-white/10 flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Your XP</div>
            <div className="text-purple-400 font-bold">{user?.xp || 0}</div>
          </div>
          <Trophy className="text-yellow-500" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {matchState === 'lobby' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-[#121212] border border-white/5 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            
            <ShieldAlert size={80} className="mx-auto text-red-500/20 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to test your limits?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Enter the arena to battle a random opponent in a fast-paced 3-question quiz. Win to earn massive XP and climb the global leaderboards.
            </p>
            
            <button 
              onClick={startMatch}
              className="px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-105 transition-all text-lg flex items-center justify-center gap-3 mx-auto"
            >
              <Swords size={24} />
              Find Opponent
            </button>
          </motion.div>
        )}

        {matchState === 'searching' && (
          <motion.div 
            key="searching"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center h-64"
          >
            <div className="w-24 h-24 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin mb-6"></div>
            <h3 className="text-xl font-bold animate-pulse">Matching with a worthy opponent...</h3>
            <p className="text-gray-500 mt-2">Searching the Aspirant League...</p>
          </motion.div>
        )}

        {matchState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Match HUD */}
            <div className="lg:col-span-3 flex justify-between items-center bg-[#18181b] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center text-2xl">😎</div>
                <div>
                  <div className="font-bold">{user?.username || 'You'}</div>
                  <div className="text-xs text-purple-400">Score: {score}</div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Time</div>
                <div className={`text-3xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  0:{timeLeft.toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="font-bold text-red-400">{opponent?.name}</div>
                  <div className="text-xs text-gray-400">Score: {opponentScore}</div>
                </div>
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center text-2xl border border-red-500/30">🔥</div>
              </div>
            </div>

            {/* Question Area */}
            <div className="lg:col-span-3 bg-[#121212] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Question {currentQ + 1} of 3</div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-10">{MOCK_QUESTIONS[currentQ].q}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_QUESTIONS[currentQ].options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="p-6 text-left rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all font-medium text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {matchState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] border border-white/5 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden max-w-2xl mx-auto"
          >
            {score > opponentScore ? (
              <>
                <div className="absolute inset-0 bg-green-500/10 pointer-events-none animate-pulse" />
                <Trophy size={100} className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]" />
                <h2 className="text-5xl font-bold text-green-400 mb-2">VICTORY</h2>
                <p className="text-gray-400 mb-8">+250 XP Awarded</p>
              </>
            ) : score === opponentScore ? (
              <>
                <Users size={100} className="mx-auto text-blue-500 mb-6" />
                <h2 className="text-5xl font-bold text-blue-400 mb-2">DRAW</h2>
                <p className="text-gray-400 mb-8">+50 XP Awarded</p>
              </>
            ) : (
              <>
                <XCircle size={100} className="mx-auto text-red-500 mb-6" />
                <h2 className="text-5xl font-bold text-red-400 mb-2">DEFEAT</h2>
                <p className="text-gray-400 mb-8">+50 XP for trying</p>
              </>
            )}

            <div className="flex justify-center items-center gap-12 mb-10">
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase tracking-widest mb-1">You</div>
                <div className="text-4xl font-bold">{score}</div>
              </div>
              <div className="w-px h-16 bg-white/10"></div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase tracking-widest mb-1">{opponent?.name}</div>
                <div className="text-4xl font-bold">{opponentScore}</div>
              </div>
            </div>

            <button 
              onClick={() => {
                setMatchState('lobby');
                setScore(0);
                setOpponentScore(0);
                setCurrentQ(0);
              }}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold transition-all"
            >
              Back to Lobby
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChallengeArena;
