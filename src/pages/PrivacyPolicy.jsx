import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#09090B] min-h-screen text-white flex flex-col font-sans select-none">
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4 backdrop-blur-md bg-black/50 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight">
          <img src="/images/edura-logo-new.png" alt="Logo" className="h-8 w-auto" onError={(e) => e.target.style.display='none'} />
          EDURA
        </Link>
        <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-semibold">
          Back to Home
        </Link>
      </nav>

      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#18181B] border border-purple-500/20 rounded-2xl p-8 md:p-12 shadow-[0_0_40px_rgba(139,92,246,0.1)] relative overflow-hidden"
        >
          {/* Subtle Glow Backgrounds */}
          <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] bg-cyan-600/20 rounded-full blur-[80px] pointer-events-none" />

          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 relative z-10">
            Privacy Policy
          </h1>
          
          <section className="mb-10 relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-purple-400">01.</span> Data Protection Commitment
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              At EDURA, your educational journey and privacy are our highest priorities. 
              We operate on a zero-friction, minimal data tracking policy. We strictly collect only 
              the essential information required to run your personalized gamified dashboard, track 
              your study streaks, calculate XP metrics, and secure your account from unauthorized logins.
            </p>
          </section>

          <section className="mb-10 relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-purple-400">02.</span> No-Data-Monetization Policy
            </h2>
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl mb-4">
              <p className="text-gray-300 leading-relaxed">
                Your study habits, schedules, test scores, and chat logs are strictly private. 
                EDURA **never sells, shares, or monetizes** your data or learning patterns with third-party advertisers. 
                Our platform runs entirely on premium subscriptions ("The Pro" and "The Elite"), ensuring we are completely aligned with your academic success, not ad revenues.
              </p>
            </div>
          </section>

          <section className="mb-10 relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-purple-400">03.</span> StudyBuddy AI & Integrations
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Our StudyBuddy AI doubt-solving assistant utilizes Google Gemini APIs to fetch dynamic, 
              detailed study explanations. During your query processing, only the concept query text is securely passed. 
              Any personal profiles, names, or device identifiers are strictly filtered out to maintain complete compliance with global privacy regulations.
            </p>
          </section>

          <section className="mb-10 relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-purple-400">04.</span> Local Security & Storage
            </h2>
            <ul className="list-none text-gray-400 leading-relaxed space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✦</span>
                <span>**Local DB**: Your batch history and library uploads are cached locally inside your browser's Secure LocalStorage.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✦</span>
                <span>**JWT-like Auths**: Authentication tokens are base64 encrypted and managed strictly inside client-side session states.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✦</span>
                <span>**IP Auditing**: In order to prevent account abuse and unauthorized access, we trace device IPs only to verify login locations.</span>
              </li>
            </ul>
          </section>
        </motion.div>
      </main>

      <footer className="text-center py-8 border-t border-white/10 text-gray-500 text-sm bg-black/50">
        <p>© 2026 EDURA Premium Learning. All rights reserved.</p>
        <p className="mt-2 text-xs">Secure. Private. Empowered.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
