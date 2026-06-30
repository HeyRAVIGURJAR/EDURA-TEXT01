import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsOfMaster = () => {
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
            Terms of Master
          </h1>
          
          <section className="mb-10 relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-purple-400">01.</span> Our Promise
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              At EDURA, we are committed to providing unparalleled educational quality. 
              Our Promise is to ensure absolute transparency in our course deliveries, 
              mock test accuracy, and mentorship commitments. We do not compromise on the 
              standards required to help you achieve top ranks. Our rigorous methodology guarantees a transformation from standard preparation to elite mastery.
            </p>
          </section>

          <section className="mb-10 relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-purple-400">02.</span> Refund Policy
            </h2>
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl mb-4">
              <p className="text-gray-300 leading-relaxed">
                We stand by the quality of our premium content. For users subscribed to <strong className="text-purple-400">"The Elite"</strong> Mastery plan, we offer a <strong className="text-white">3-day no-questions-asked money-back guarantee</strong>. 
                <br /><br />
                If the curriculum does not meet your rigorous standards, simply reach out to our priority support within 72 hours of purchase for a full refund. No hoops, no friction.
              </p>
            </div>
          </section>

          <section className="mb-10 relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-purple-400">03.</span> Membership Agreement
            </h2>
            <ul className="list-none text-gray-400 leading-relaxed space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✦</span>
                <span>Members must maintain absolute decorum in the EDURA Community Forums. Disrespect is not tolerated.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✦</span>
                <span>Account sharing is strictly prohibited and will result in immediate hardware-level suspension.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✦</span>
                <span>Study materials, exclusive PDFs, and video lectures are intellectual property and cannot be redistributed.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✦</span>
                <span>Members are expected to use StudyBuddy AI responsibly and constructively.</span>
              </li>
            </ul>
          </section>
        </motion.div>
      </main>

      <footer className="text-center py-8 border-t border-white/10 text-gray-500 text-sm bg-black/50">
        <p>© 2026 EDURA Premium Learning. All rights reserved.</p>
        <p className="mt-2 text-xs">Empowering the Elite.</p>
      </footer>
    </div>
  );
};

export default TermsOfMaster;
