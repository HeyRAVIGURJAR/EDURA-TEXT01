import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, Bot, Palette, BarChart3, Tv, FormInput, 
  Leaf, Star, BookOpen, Trophy, Crown, Flame,
  Check, ChevronDown
} from 'lucide-react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import GlowButton from '../components/GlowButton';
import ProgressiveImage from "../components/ui/ProgressiveImage";
import StaggerContainer, { StaggerItem } from "../components/motion/StaggerReveal";
import TiltCard from "../components/motion/TiltCard";
import GhostGlowCard from '../components/ui/GhostGlowCard';
import { useAuthStore } from '../store/useAuthStore';
import './LandingPage.css';

/* ========================================
   FAQ ITEM
   ======================================== */
const FaqItem = React.memo(({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {question}
        <span className="faq-arrow"><ChevronDown size={20} /></span>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
});

/* ========================================
   LANDING PAGE COMPONENT
   ======================================== */
const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConsoleRedirect = useCallback(() => {
    setRedirecting(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  }, [navigate]);

  const FEATURES = [
    { icon: <Gamepad2 size={28} />, title: 'Gamified Dashboard', desc: 'XP engine with streaks, daily goals, and a 5-tier Aspirant League to keep you motivated every single day.' },
    { icon: <Bot size={28} />, title: 'StudyBuddy AI', desc: 'AI-powered doubt resolution chat. Ask any conceptual question and get instant, clear explanations.' },
    { icon: <Palette size={28} />, title: 'Theme Engine', desc: 'Full HSL customization with premium presets like Cyberpunk Red, Lavender Dreams, and Emerald City.' },
    { icon: <BarChart3 size={28} />, title: 'Performance Analytics', desc: 'Detailed insights into your learning patterns, test scores, and improvement areas with beautiful charts.' },
    { icon: <Tv size={28} />, title: 'EDURA OTT', desc: 'Premium video lectures with resume-from-where-you-left, chapter markers, and multi-speed playback.' },
    { icon: <FormInput size={28} />, title: 'Mock Test Engine', desc: 'Timed tests with instant analytics, question-level breakdowns, and comparative performance metrics.' },
  ];

  const TIERS = [
    { icon: <Leaf size={20} />, name: 'Beginner', xp: '0 XP', color: '#22D3EE', bg: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.5)' },
    { icon: <Star size={20} />, name: 'Achiever', xp: '1,000 XP', color: '#60A5FA', bg: 'rgba(96,165,250,0.2)', border: 'rgba(96,165,250,0.5)' },
    { icon: <BookOpen size={20} />, name: 'Scholar', xp: '5,000 XP', color: '#A78BFA', bg: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.5)' },
    { icon: <Trophy size={20} />, name: 'Ranker', xp: '15,000 XP', color: '#FBBF24', bg: 'rgba(251,191,36,0.2)', border: 'rgba(251,191,36,0.5)' },
    { icon: <Crown size={20} />, name: 'Legend', xp: '50,000 XP', color: '#F87171', bg: 'rgba(248,113,113,0.2)', border: 'rgba(248,113,113,0.5)' },
  ];

  const PRICING = [
    {
      plan: 'The Starter',
      price: '0',
      desc: 'Jumpstart your basics with core features.',
      badge: 'Limited Ads Supported',
      savings: 'Free Forever',
      cta: 'Get Started Free',
      features: ['Access to free batches', 'Community forum', 'Basic analytics', 'Daily streak tracker'],
    },
    {
      plan: 'The Pro',
      price: '99',
      desc: 'Unlock the full EDURA experience. No interruptions.',
      featured: true,
      badge: (
        <span className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20 drop-shadow-[0_0_8px_rgba(249,115,22,0.9)] animate-[pulse_2s_ease-in-out_infinite]" />
          Ads Free Experience
        </span>
      ),
      savings: 'Save 40% vs Monthly',
      cta: 'Upgrade Now',
      features: ['Everything in Starter', 'StudyBuddy AI chat for mastery', 'Mock tests to dominate exams', 'EDURA OTT premium access', 'Theme Engine customization', 'Priority 24/7 support'],
    },
    {
      plan: 'The Elite',
      price: '159',
      desc: 'For serious aspirants aiming for the top rank.',
      badge: (
        <span className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.9)] animate-[pulse_2s_ease-in-out_infinite]" />
          VIP Access
        </span>
      ),
      savings: 'Save 65% vs Monthly',
      cta: 'Join Elite Mastery',
      features: ['Everything in Pro', '1-on-1 Mentorship for results', 'Custom personalized study plan', 'Exclusive elite content', 'Offline downloads', 'Certificate of Merit', 'EDURA MEMBERSHIP'],
    },
  ];

  const TESTIMONIALS = [
    { name: 'Priya Sharma', role: 'JEE Aspirant', initials: 'PS', rating: 5.0, text: '"EDURA\'s gamified approach completely changed how I study. The streak system keeps me consistent, and the AI tutor explains concepts better than most textbooks."' },
    { name: 'Rahul Verma', role: 'SSC CGL Student', initials: 'RV', rating: 4.5, text: '"The mock tests are incredibly realistic. My test scores improved by 35% in just two months. The analytics dashboard is a game-changer."' },
    { name: 'Ananya Gupta', role: 'UPSC Aspirant', initials: 'AG', rating: 4.8, text: '"I love the theme customization — studying at night with Lavender Dreams is so calming. Plus, the OTT-style video player is world-class."' },
    { name: 'Vikram Singh', role: 'NEET Aspirant', initials: 'VS', rating: 4.7, text: '"The Pomodoro focus engine combined with the background lofi beats helps me study for 6 hours straight without burning out. Incredible UI!"' },
    { name: 'Sneha Patel', role: 'Class 12 Boards', initials: 'SP', rating: 4.9, text: '"I was struggling with Physics, but StudyBuddy AI broke down the concepts so easily. I jumped from a C grade to an A in my pre-boards!"' },
    { name: 'Amit Kumar', role: 'State PCS Aspirant', initials: 'AK', rating: 4.3, text: '"The daily streak rewards push me to login every day. The leaderboard feature makes learning feel like a fun competition rather than a chore."' },
  ];

  // Helper: render star rating with half-star support
  const StarRating = ({ rating }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.3;
    return (
      <div className="flex items-center gap-1 mb-4 relative z-10">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="relative text-yellow-500 drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]" style={{ fontSize: 20 }}>
            {i < full ? '★' : (i === full && half) ? '⯨' : '☆'}
          </span>
        ))}
        <span className="text-yellow-400 text-sm font-bold ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const FAQS = [
    { q: 'Is EDURA free to use?', a: 'Yes! EDURA offers a comprehensive free tier with access to community features, basic analytics, and free batches. Premium features are available with the Pro and Elite plans.' },
    { q: 'How does the XP and league system work?', a: 'You earn XP for daily logins (50 XP), watching videos (120 XP), and attempting tests (250 XP). Streak multipliers give +25% XP per consecutive day. As you progress through five tiers: Beginner, Achiever, Scholar, Ranker, and Legend.' },
    { q: 'What is StudyBuddy AI?', a: 'StudyBuddy AI is your personal AI tutor that can explain any concept, solve doubts, and help you understand complex topics in simple language. Available 24/7 for Pro and Elite members.' },
  ];

  // Motion reveal specs for scroll reveals
  const revealProps = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const exactButtonClassName = "relative px-8 py-3 rounded-full font-bold text-white bg-[#0A0A0B] border border-white/10 shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_40px_rgba(138,43,226,0.8)] hover:-translate-y-1 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group";

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="landing-page relative overflow-hidden bg-gradient-to-br from-black via-[#0a0514] to-black">
      {/* Interactive Particle Web Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              resize: true,
            },
            modes: {
              grab: { distance: 200, links: { opacity: 0.8, color: "#8b5cf6" } },
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.15, width: 1 },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 0.4,
              straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 40 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-[-1]"
      />

      {/* ---- NAVBAR (TRANSLUCENT GLASS) ---- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'py-2 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'py-4 bg-transparent'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Single line container with horizontal scroll on small screens */}
        <div className="flex items-center justify-between px-4 md:px-8 w-full max-w-[100vw] overflow-x-auto hide-scrollbar gap-6">
          <div className="nav-logo flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src="/images/edura-logo-new.png" alt="EDURA Logo" className="w-8 h-8 object-contain hover:rotate-12 transition-transform duration-300" onError={(e) => { e.target.src = '/logo.jpg'; e.target.onerror = () => e.target.style.display='none'; }} />
            <span className="text-xl font-black tracking-tighter text-white">EDURA</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium text-gray-300 flex-shrink-0 whitespace-nowrap">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Leagues</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0 whitespace-nowrap">
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors" onClick={handleConsoleRedirect}>Login</button>
            <GlowButton onClick={handleConsoleRedirect} className="px-5 py-2 text-sm font-bold">
              Get Started
            </GlowButton>
          </div>
        </div>
      </motion.nav>

      {/* ---- HERO ---- */}
      <section className="hero-section" id="hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center' }}>
          
          {/* Glowing floating logo */}
          <motion.div 
            className="hero-logo-container-large"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: '1.5rem', width: '100px', height: '100px' }}
          >
            <img 
              src="/images/edura-logo-new.png" 
              alt="EDURA Logo" 
              className="logo-floating-3d"
              onError={(e) => {
                e.target.src = '/logo.jpg';
                e.target.onerror = () => e.target.style.display = 'none';
              }} 
            />
          </motion.div>

          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="badge-dot"></span>
            AI-Powered Education Platform
          </motion.div>

          <motion.h1 
            className="hero-title" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.15, margin: '1rem 0' }}
          >
            Learn Smarter with <br/>
            <span className="relative inline-block mt-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 font-black tracking-tight hero-brand-text">EDURA</span>
              <span className="absolute left-1/2 bottom-[-15px] -translate-x-1/2 w-[110%] h-[16px] overflow-visible pointer-events-none block">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                  {/* Faint Background Guide Line */}
                  <path 
                    d="M 2,2 Q 50,10 98,2" 
                    fill="none" 
                    stroke="url(#heroRainbowGrad)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    className="opacity-25"
                  />
                  {/* Dynamic Glowing Laser Beam */}
                  <path 
                    d="M 2,2 Q 50,10 98,2" 
                    fill="none" 
                    stroke="url(#heroRainbowGrad)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    className="animate-flow-beam animate-rainbow-glow"
                    strokeDasharray="35 65"
                  />
                  <defs>
                    <linearGradient id="heroRainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff007f" />
                      <stop offset="20%" stopColor="#ff00ff" />
                      <stop offset="40%" stopColor="#7f00ff" />
                      <stop offset="60%" stopColor="#00f0ff" />
                      <stop offset="80%" stopColor="#00ff7f" />
                      <stop offset="100%" stopColor="#ffea00" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ maxWidth: '650px', margin: '0 auto 2rem auto', fontSize: '1rem', lineHeight: 1.6 }}
          >
            A gamified, AI-integrated learning platform designed to help you achieve your academic goals. 
            Track streaks, earn XP, compete in leagues, and get AI-powered doubt resolution — all in one premium experience.
          </motion.p>

          <motion.div 
            className="hero-actions" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
          >
            <GlowButton onClick={handleConsoleRedirect}>
              Start Learning Free →
            </GlowButton>
            
            <button className="btn-ghost-custom" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              Explore Features
            </button>
          </motion.div>

          {/* Floating Hero preview graphic */}
          <motion.div 
            className="hero-preview" 
            style={{ marginTop: '3.5rem' }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="hero-preview-images">
              <div className="hero-image-container img-back">
                <ProgressiveImage src="/images/hero-2.png" alt="Education" className="theme-matched-image" />
              </div>
              <div className="hero-image-container img-front">
                <ProgressiveImage src="/images/hero-1.png" alt="Aspirant" className="theme-matched-image main-hero-img" />
              </div>
              <div className="hero-image-container img-side">
                <ProgressiveImage src="/images/hero-3.png" alt="Growth" className="theme-matched-image" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- FEATURES (RESPONSIVE GRID) ---- */}
      <section className="features-section py-24 relative z-10 max-w-7xl mx-auto px-6" id="features">
        <motion.div className="section-header fade-up text-center mb-16" {...revealProps}>
          <div className="section-tag inline-block mb-4">✨ Features</div>
          <h2 className="section-title text-4xl md:text-5xl font-black tracking-tighter text-white leading-relaxed">
            <span className="relative inline-block pb-3">
              Everything You Need to <span className="gradient-text">Excel</span>
              <span className="absolute left-1/2 bottom-[-8px] -translate-x-1/2 w-[105%] h-[12px] overflow-visible pointer-events-none block">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                  {/* Faint Background Guide Line */}
                  <path 
                    d="M 1,1 Q 50,9 99,1" 
                    fill="none" 
                    stroke="url(#featuresRainbowGrad)" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    className="opacity-25"
                  />
                  {/* Dynamic Glowing Laser Beam */}
                  <path 
                    d="M 1,1 Q 50,9 99,1" 
                    fill="none" 
                    stroke="url(#featuresRainbowGrad)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    className="animate-flow-beam animate-rainbow-glow"
                    strokeDasharray="25 75"
                  />
                  <defs>
                    <linearGradient id="featuresRainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff007f" />
                      <stop offset="25%" stopColor="#7f00ff" />
                      <stop offset="50%" stopColor="#00f0ff" />
                      <stop offset="75%" stopColor="#00ff7f" />
                      <stop offset="100%" stopColor="#ffea00" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
          </h2>
        </motion.div>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <StaggerItem key={i} className="h-full">
              <GhostGlowCard className="stitch-border h-full" style={{ '--stitch-bg': '#0f172a' }}>
                <TiltCard 
                  tiltAmount={8}
                  className="bg-[#121212] border-none rounded-2xl p-8 relative overflow-hidden group hover:bg-[#18181b] transition-all h-full flex flex-col"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-[40px] group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none" />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:text-purple-400 transition-all">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">{f.desc}</p>
                </TiltCard>
              </GhostGlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ---- SHOWCASE LEAGUE ---- */}
      <section className="showcase-section py-24 relative z-10" id="showcase">
        <motion.div className="showcase-wrapper" {...revealProps}>
          <div className="showcase-text">
            <div className="section-tag">🏆 Competitive Leagues</div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white">Compete. <span className="gradient-text">Rise.</span> Become a Legend.</h3>
            <p>
              Our 5-tier ranking system turns learning into an adventure. Earn XP through daily activities, 
              maintain your streak for multipliers, and climb the leaderboard to legendary status.
            </p>
            <ul className="showcase-features-list">
              <li><span className="check"><Check size={14} strokeWidth={3} /></span> Daily login rewards: 50 XP</li>
              <li><span className="check"><Check size={14} strokeWidth={3} /></span> Video watch (5+ min): 120 XP</li>
              <li><span className="check"><Check size={14} strokeWidth={3} /></span> Test attempts: 250 XP</li>
              <li><span className="check"><Check size={14} strokeWidth={3} /></span> Streak multiplier: +25% XP/day</li>
            </ul>
          </div>
          <div className="showcase-visual">
            <div className="showcase-card-3d">
              <div className="tier-list">
                {TIERS.map((tier, i) => (
                  <div 
                    className="tier-item" 
                    key={i} 
                    style={{ 
                      background: tier.bg, 
                      border: `1px solid ${tier.border}`,
                      boxShadow: `0 0 20px ${tier.color}22`,
                      '--tier-glow': `0 10px 25px ${tier.color}55`,
                      '--tier-color-border': tier.color
                    }}
                  >
                    <div className="tier-badge" style={{ color: tier.color, filter: `drop-shadow(0 0 8px ${tier.color}88)` }}>{tier.icon}</div>
                    <span className="tier-name" style={{ color: tier.color, fontWeight: 700 }}>{tier.name}</span>
                    <span className="tier-xp" style={{ color: 'rgba(255,255,255,0.7)' }}>{tier.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---- TESTIMONIALS (STATIC GRID WITH HOVER EFFECTS) ---- */}
      <section className="testimonials-section relative z-10 py-24 px-6 max-w-7xl mx-auto" id="testimonials">
        <motion.div className="section-header fade-up text-center mb-16" {...revealProps}>
          <div className="section-tag inline-block mb-4">💬 Stories</div>
          <h2 className="section-title text-4xl md:text-5xl font-black mb-4">What Students <span className="gradient-text">Say</span></h2>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={i} className="h-full">
              <TiltCard 
                tiltAmount={8}
                className="bg-[#121212] border border-white/5 rounded-3xl p-8 relative overflow-hidden group cursor-pointer transition-colors hover:border-purple-500/30 hover:bg-[#18181b] h-full flex flex-col"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px] group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none" />
                
                <StarRating rating={t.rating} />
                
                <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed mb-8 relative z-10 flex-grow">
                  {t.text}
                </p>
                
                <div className="flex items-center gap-4 mt-auto relative z-10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(138,43,226,0.5)] group-hover:scale-110 transition-transform">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{t.name}</h4>
                    <p className="text-purple-400 text-sm font-semibold tracking-wide uppercase">{t.role}</p>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ---- PRICING ---- */}
      <section className="pricing-section py-24 relative z-10" id="pricing">
        <motion.div className="section-header fade-up text-center mb-16" {...revealProps}>
          <div className="section-tag inline-block mb-4">💎 Pricing</div>
          <h2 className="section-title text-4xl md:text-5xl font-black tracking-tighter text-white">Choose Your <span className="gradient-text">Plan</span></h2>
        </motion.div>
        <div className="pricing-grid">
          {PRICING.map((p, i) => (
            <div 
              className={`bg-[#121212] border border-white/5 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-[#18181b] hover:shadow-[0_10px_30px_-10px_rgba(138,43,226,0.4)] ${p.featured ? 'featured' : ''}`} 
              key={i}
            >
              {p.badge && <div className="pricing-badge">{p.badge}</div>}
              <h3 className="pricing-plan">{p.plan}</h3>
              <div className="pricing-price">
                <span className="currency">₹</span>
                <span className="amount">{p.price}</span>
                <span className="period">/month</span>
              </div>
              <div className="mt-2 mb-4 px-3 py-1 inline-block rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                {p.savings}
              </div>
              <p className="pricing-desc">{p.desc}</p>
              <ul className="pricing-features">
                {p.features.map((feat, fi) => (
                  <li key={fi}><span className="pf-check"><Check size={16} strokeWidth={3} /></span>{feat}</li>
                ))}
              </ul>
              <GlowButton onClick={handleConsoleRedirect} className="w-full mt-6">
                {p.cta}
              </GlowButton>
            </div>
          ))}
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="faq-section py-24 relative z-10" id="faq">
        <motion.div className="section-header fade-up text-center mb-16" {...revealProps}>
          <div className="section-tag inline-block mb-4">❓ FAQ</div>
          <h2 className="section-title text-4xl md:text-5xl font-black tracking-tighter text-white">Frequently Asked <span className="gradient-text">Questions</span></h2>
        </motion.div>
        <motion.div className="faq-list" {...revealProps}>
          {FAQS.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </motion.div>
      </section>

      {/* ---- CTA ---- */}
      <section className="cta-section">
        <motion.div className="cta-box" {...revealProps}>
          <h2>Ready to <span className="gradient-text">Transform</span> Your Learning?</h2>
          <p>Join thousands of students who are already learning smarter with EDURA.</p>
          <div className="cta-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <GlowButton onClick={handleConsoleRedirect}>
              Start Learning Free →
            </GlowButton>
            <button className="btn-ghost-custom" onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}>View Plans</button>
          </div>
        </motion.div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo gradient-text">EDURA</div>
          <div className="footer-links">
            <h4>Legal</h4>
            <Link to="/terms-of-master">Terms of Master</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <a href="#">Refund Policy</a>
          </div>
          <div className="footer-copy">© 2026 EDURA. All rights reserved.</div>
        </div>
      </footer>

      {/* Redirect Overlay Modal */}
      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-16 h-16 border-4 border-t-[#8B5CF6] border-r-[#06B6D4] border-b-transparent border-l-transparent rounded-full mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              />
              <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Waking up the Servers...</h2>
              <p className="text-gray-400 font-medium">Redirecting to your EDURA Console...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingPage;
