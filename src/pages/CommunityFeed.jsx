import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BadgeCheck, Send, Rocket, Flame, MessageSquare, 
  ThumbsUp, Share2, Plus, X, Globe, Sparkles 
} from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';
import './CommunityFeed.css';

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    admin: 'EDURA ADMIN',
    date: '16 Jun',
    title: '⚠️ IMPORTANT UPDATE ⚠️',
    content: `Telegram restrictions update for upcoming Re-NEET 2026. Keep revising concepts. To stay connected, join our Telegram Channel.`,
    views: '10.3K',
    likes: 135,
    liked: false,
    comments: [
      { sender: 'Aman_Prep', text: 'Thanks for the alert sir!' }
    ]
  },
  {
    id: 'ann-2',
    admin: 'EDURA ADMIN',
    date: '10 Jun',
    title: 'New Batches Launched!',
    content: 'We have launched new premium batches for JEE and NEET 2025. Make sure to check the dashboard and add your favorites. Let\'s crack it together!',
    views: '25.1K',
    likes: 420,
    liked: false,
    comments: []
  }
];

const INITIAL_DOUBTS = [
  {
    id: 'd-1',
    sender: 'Vikram_Aspirant',
    date: 'Just Now',
    title: 'Struggling with Projectile Motion equation on incline plane',
    content: 'Guys, does the range formula change if the angle of inclination of the hill matches the projection vector angle? Please verify.',
    likes: 12,
    liked: false,
    comments: [
      { sender: 'Neha_Physics', text: 'Yes, range is R = u²(sin(2a-b) - sin b) / (g cos²b).' }
    ]
  },
  {
    id: 'd-2',
    sender: 'Sonia_NEET',
    date: '2 hours ago',
    title: 'Is HC Verma Volume 2 necessary for NEET Organic chemistry?',
    content: 'Do we need to solve numericals from volume 2 for general organic chemistry or NCERT Exemplar is sufficient?',
    likes: 8,
    liked: false,
    comments: [
      { sender: 'Aman_NEET', text: 'HC Verma is only for Physics, use MS Chouhan for Organic Chemistry!' }
    ]
  }
];

const CommunityFeed = () => {
  const addNotification = useNotificationStore(s => s.addNotification);
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('announcements'); // announcements | doubts
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [doubts, setDoubts] = useState(INITIAL_DOUBTS);

  // New Post Form modal state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Comment input state
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const activePosts = activeTab === 'announcements' ? announcements : doubts;

  const handleLikePost = (id) => {
    const updateLikes = (list) => 
      list.map(p => {
        if (p.id === id) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      });

    if (activeTab === 'announcements') {
      setAnnouncements(updateLikes);
    } else {
      setDoubts(updateLikes);
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostItem = {
      id: `d-${Date.now()}`,
      sender: user?.username || 'Guest Scholar',
      date: 'Just Now',
      title: newTitle,
      content: newContent,
      likes: 0,
      liked: false,
      comments: []
    };

    setDoubts(prev => [newPostItem, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsPostModalOpen(false);
    setActiveTab('doubts');
    addNotification({ message: 'Doubt post published to community feed!', type: 'success' });
  };

  const handleAddComment = (postId) => {
    if (!commentInput.trim()) return;

    const newComment = {
      sender: user?.username || 'You',
      text: commentInput
    };

    const addCommentToList = (list) =>
      list.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      });

    if (activeTab === 'announcements') {
      setAnnouncements(addCommentToList);
    } else {
      setDoubts(addCommentToList);
    }

    setCommentInput('');
    addNotification({ message: 'Comment posted!', type: 'success' });
  };

  return (
    <div className="community-feed-container">
      {/* Header Banner */}
      <div className="community-header-banner glass-panel">
        <div className="banner-glow-effects" />
        <div className="banner-icon">
          <img src="/images/edura-logo-new.png" alt="Logo" onError={(e) => { e.target.src = '/logo.jpg'; e.target.onerror = () => e.target.style.display='none'; }} />
        </div>
        <div className="banner-text">
          <div className="flex items-center gap-2">
            <h2>Edura Scholar Hub</h2>
            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/20" />
          </div>
          <p>Join the discussion feed, share organic doubts, and see verified announcements.</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="community-navigation-toolbar">
        <div className="feed-tabs">
          <button className={`feed-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
            📢 Announcements
          </button>
          <button className={`feed-tab-btn ${activeTab === 'doubts' ? 'active' : ''}`} onClick={() => setActiveTab('doubts')}>
            💬 Aspirant Doubts
          </button>
        </div>
        
        {activeTab === 'doubts' && (
          <button className="create-doubt-btn" onClick={() => setIsPostModalOpen(true)}>
            <Plus size={14} /> Ask Doubt
          </button>
        )}
      </div>

      {/* Posts list */}
      <div className="posts-container">
        {activePosts.map(post => (
          <div key={post.id} className="post-card glass-panel">
            <div className="post-header">
              <div className="post-avatar">
                {activeTab === 'announcements' ? (
                  <img src="/images/edura-logo-new.png" alt="Admin" onError={(e) => { e.target.src = '/logo.jpg'; e.target.onerror = () => e.target.style.display='none'; }} />
                ) : (
                  <div className="user-text-avatar">{post.sender.substring(0, 2).toUpperCase()}</div>
                )}
              </div>
              <div className="post-author-info">
                <div className="flex items-center gap-2">
                  <h3 className="post-author-name">{post.sender || post.admin}</h3>
                  {activeTab === 'announcements' && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/20" />}
                </div>
                <span className="post-date">{post.date}</span>
              </div>
            </div>

            <div className="post-body">
              <h4 className="post-title">{post.title}</h4>
              <p className="post-content">{post.content}</p>
            </div>

            {/* Interaction Row */}
            <div className="post-interaction-row">
              <button 
                className={`interact-btn ${post.liked ? 'liked' : ''}`} 
                onClick={() => handleLikePost(post.id)}
              >
                <ThumbsUp size={14} /> {post.likes} Likes
              </button>
              <button 
                className="interact-btn"
                onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
              >
                <MessageSquare size={14} /> {post.comments.length} Comments
              </button>
              <button className="interact-btn" onClick={() => addNotification({ message: 'Feed share link copied to clipboard', type: 'info' })}>
                <Share2 size={14} /> Share
              </button>
            </div>

            {/* Comments Expanded Section */}
            <AnimatePresence>
              {activeCommentPostId === post.id && (
                <motion.div 
                  className="post-comments-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="comments-list">
                    {post.comments.map((c, cIdx) => (
                      <div key={cIdx} className="comment-row">
                        <span className="comment-sender">{c.sender}:</span>
                        <span className="comment-text">{c.text}</span>
                      </div>
                    ))}
                    {post.comments.length === 0 && (
                      <div className="no-comments-msg">No comments yet. Write the first response!</div>
                    )}
                  </div>
                  
                  <div className="comment-input-form">
                    <input 
                      type="text" 
                      placeholder="Write comment..."
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                    />
                    <button onClick={() => handleAddComment(post.id)}>Post</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Ask Doubt Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <motion.div 
            className="post-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="post-modal-card glass-panel"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="modal-header">
                <h3>Post Community Doubt</h3>
                <button className="close-modal-btn" onClick={() => setIsPostModalOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="modal-form">
                <div className="form-group">
                  <label>Title / Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Incline plane range vector" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Describe your doubt</label>
                  <textarea 
                    placeholder="Describe what conceptual calculation you are facing difficulty in..." 
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-post-btn">
                  Publish Doubt
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityFeed;
