import React from 'react';
import { BadgeCheck, Send, Rocket, Flame } from 'lucide-react';
import './CommunityFeed.css';

const MOCK_POSTS = [
  {
    id: 1,
    admin: 'EDURA ADMIN',
    date: '16 Jun',
    title: '⚠️ IMPORTANT UPDATE ⚠️',
    content: `As per reports circulating online, Telegram may face restrictions in India until 22 June 2026 due to the Re-NEET 2026 examination process. Please note that users should verify such information through official government announcements before relying on it.\n\nTo stay connected and receive all future updates without interruption, join our Telegram Channel.\n\n📱 Telegram Channel Link:\nhttps://t.me/InEducationAORAFarming\n\n✅ Latest Updates\n✅ Important Announcements\n✅ Instant Notifications\n✅ Exam & Educational News\n\nJoin now and stay updated! <ROCKET_PLACEHOLDER>`,
    views: '10.3K',
    reactions: [
      { emoji: '❤️', count: 135 },
      { emoji: '👍', count: 35 },
      { emoji: '🎉', count: 8 },
      { emoji: '💯', count: 6 },
    ]
  },
  {
    id: 2,
    admin: 'EDURA ADMIN',
    date: '10 Jun',
    title: 'New Batches Launched!',
    content: 'We have successfully launched our new premium batches for JEE and NEET 2025. Make sure to check the dashboard and add your favorites. Let\'s crack it together! 📚<FLAME_PLACEHOLDER>',
    views: '25.1K',
    reactions: [
      { emoji: <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20 drop-shadow-[0_0_12px_rgba(249,115,22,0.9)] animate-[pulse_2s_ease-in-out_infinite]" />, count: 420 },
      { emoji: '❤️', count: 89 },
    ]
  }
];

const CommunityFeed = () => {
  return (
    <div className="community-feed-container">
      <div className="community-header-banner">
        <div className="banner-icon">
          <img src="/images/edura-logo-new.png" alt="Logo" onError={(e) => { e.target.src = '/logo.jpg'; e.target.onerror = () => e.target.style.display='none'; }} />
        </div>
        <div className="banner-text">
          <div className="flex items-center gap-2">
            <h2>Edura Official</h2>
            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/20 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
          <p>Official Announcements</p>
        </div>
      </div>

      <div className="posts-container">
        {MOCK_POSTS.map(post => (
          <div key={post.id} className="post-card bg-[#18181b]/80 backdrop-blur-md border-l-4 border-purple-500">
            <div className="post-header">
              <div className="post-avatar">
                <img src="/images/edura-logo-new.png" alt="Admin" onError={(e) => { e.target.src = '/logo.jpg'; e.target.onerror = () => e.target.style.display='none'; }} />
              </div>
              <div className="post-author-info">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold text-white tracking-wide">EDURA ADMIN</h2>
                  <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/20 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                </div>
                <span className="post-date">{post.date}</span>
              </div>
            </div>
            
            <div className="post-body">
              <h3 className="post-title">{post.title}</h3>
              <div className="post-content">
                {post.content.split('\n').map((line, i) => {
                  if (line.includes('https://t.me/InEducationAORAFarming')) {
                    return (
                      <p key={i} className="flex items-center gap-2 mt-2">
                        <a 
                          href="https://t.me/InEducationAORAFarming" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold underline"
                        >
                          <Send size={16} /> Join Telegram Channel
                        </a>
                      </p>
                    );
                  }
                  let cleanLine = line;
                  let icon = null;
                  if (line.includes('<ROCKET_PLACEHOLDER>')) {
                    cleanLine = line.replace('<ROCKET_PLACEHOLDER>', '');
                    icon = <Rocket className="w-5 h-5 text-purple-400 fill-purple-400/20 drop-shadow-[0_0_12px_rgba(168,85,247,0.9)] animate-[pulse_2s_ease-in-out_infinite]" />;
                  } else if (line.includes('<FLAME_PLACEHOLDER>')) {
                    cleanLine = line.replace('<FLAME_PLACEHOLDER>', '');
                    icon = <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20 drop-shadow-[0_0_12px_rgba(249,115,22,0.9)] animate-[pulse_2s_ease-in-out_infinite]" />;
                  }
                  
                  return (
                    <p key={i} className={icon ? "flex items-center gap-2" : ""}>
                      {cleanLine}
                      {icon}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="post-footer">
              <div className="post-views">👁 {post.views}</div>
              <div className="post-reactions">
                {post.reactions.map((react, i) => (
                  <button key={i} className="reaction-btn flex items-center gap-2">
                    {react.emoji} {react.count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
