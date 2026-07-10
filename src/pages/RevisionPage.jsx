import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Bookmark, Download, ArrowLeft, Trash2, 
  BookOpen, FolderHeart, ShieldAlert 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import { useOptimisticLike } from '../hooks/useOptimisticLike';
import { batchCache } from '../utils/batch-cache';
import BadgeCard from '../components/features/BadgeCard';
import EduraLogo from '../components/ui/EduraLogo';
import './RevisionPage.css';

// BadgeCard Item Wrapper for Favorites List
const FavBadgeItem = React.memo(({ batch, onUnliked }) => {
  const { isLiked, toggleLike } = useOptimisticLike(batch._id);

  // If user toggles like off, trigger state update in parent
  const handleLikeToggle = (id) => {
    toggleLike();
    if (onUnliked) onUnliked(id);
  };

  const badgeData = {
    id: batch._id, 
    name: batch.name, 
    description: batch.byName,
    image: batch.previewImage || batch.photo || "/images/hero-2.png", 
    feeTotal: 0, 
    amount: 0,
    byName: batch.byName, 
    subjects: batch.subjects, 
    subjectCount: batch.subjectCount,
  };
  return <BadgeCard badge={badgeData} isLiked={isLiked} onLike={handleLikeToggle} />;
});

const RevisionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addNotification = useNotificationStore(s => s.addNotification);

  // Map route to active tab
  const getTabFromPath = (path) => {
    if (path.includes('favorites')) return 'favorites';
    if (path.includes('bookmarks')) return 'bookmarks';
    if (path.includes('downloads')) return 'downloads';
    return 'favorites';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Favorites List state
  const [favoriteBatches, setFavoriteBatches] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  // Load actual favorites from batchCache and localStorage
  const loadFavorites = async () => {
    try {
      setLoadingFavs(true);
      const likes = JSON.parse(localStorage.getItem('edura_likes')) || {};
      const all = await batchCache.getAllBatches();
      const filtered = all.filter(b => likes[b._id] || likes[b.batch_id]);
      setFavoriteBatches(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFavs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'favorites') {
      loadFavorites();
    }
  }, [activeTab]);

  const handleFavoriteUnliked = (id) => {
    setFavoriteBatches(prev => prev.filter(b => b._id !== id && b.batch_id !== id));
    addNotification({ message: 'Removed from Favorites locker', type: 'info' });
  };

  // Mock Bookmarks State
  const [bookmarks, setBookmarks] = useState([
    { id: 'b-1', topic: 'Loop Rule vs Junction Rule', lecture: 'Current Electricity 04', time: '12:45', chapter: 'Current Electricity' },
    { id: 'b-2', topic: 'Coulomb\'s vector notation derivation', lecture: 'Electrostatics 02', time: '42:10', chapter: 'Electrostatics' }
  ]);

  const handleDeleteBookmark = (id) => {
    setBookmarks(p => p.filter(x => x.id !== id));
    addNotification({ message: 'Bookmark removed', type: 'info' });
  };

  // Mock Downloads State
  const [downloads, setDownloads] = useState([
    { id: 'd-1', title: 'Kirchhoff Laws Formulas PDF', size: '2.4 MB', type: 'PDF Sheet' },
    { id: 'd-2', title: 'Electrostatics One-Shot Video', size: '280 MB', type: 'Offline Video' }
  ]);

  const handleDeleteDownload = (id) => {
    setDownloads(p => p.filter(x => x.id !== id));
    addNotification({ message: 'Offline media file deleted from browser cache', type: 'success' });
  };

  return (
    <div className="revision-page-container">
      {/* Back Link */}
      <div className="revision-back-row">
        <button className="revision-back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div className="revision-header-row">
        <div>
          <EduraLogo size={42} subview={activeTab.toUpperCase()} />
          <p className="revision-subtitle">Access your bookmarked keynotes, favorite courses, and offline study cache.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="revision-tabs">
        <button className={`rev-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
          <Heart size={15} /> Favorites
        </button>
        <button className={`rev-tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`} onClick={() => setActiveTab('bookmarks')}>
          <Bookmark size={15} /> Bookmarks
        </button>
        <button className={`rev-tab-btn ${activeTab === 'downloads' ? 'active' : ''}`} onClick={() => setActiveTab('downloads')}>
          <Download size={15} /> Downloads
        </button>
      </div>

      {/* Tab Contents */}
      <div className="revision-tab-content-wrap">
        
        {/* ---- TAB: FAVORITES ---- */}
        {activeTab === 'favorites' && (
          <div className="rev-pane-list">
            <div className="rev-desc-row">
              <h3>Enrolled & Favorite Batches</h3>
              <p>Quick access to your core study portals.</p>
            </div>

            {loadingFavs ? (
              <div className="rev-loading">Loading favorites...</div>
            ) : favoriteBatches.length > 0 ? (
              <div className="fav-batches-grid">
                {favoriteBatches.map(batch => (
                  <FavBadgeItem 
                    key={batch._id || batch.batch_id} 
                    batch={batch} 
                    onUnliked={handleFavoriteUnliked} 
                  />
                ))}
              </div>
            ) : (
              <div className="empty-rev-state glass-panel">
                <FolderHeart size={44} className="text-purple-400" />
                <h4>No Favorite Batches Added</h4>
                <p>Bookmark classes inside All Batches by tapping the Heart or clicking Enroll to place them here.</p>
                <button className="goto-batches-btn" onClick={() => navigate('/dashboard/batches')}>
                  Browse Batches
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---- TAB: BOOKMARKS ---- */}
        {activeTab === 'bookmarks' && (
          <div className="rev-pane-list">
            <div className="rev-desc-row">
              <h3>Timestamp Bookmarks</h3>
              <p>Key checkpoints you highlighted inside video lectures for revision.</p>
            </div>

            {bookmarks.length > 0 ? (
              <div className="bookmarks-list">
                {bookmarks.map((bm) => (
                  <div key={bm.id} className="bookmark-card glass-panel">
                    <div className="bm-left">
                      <Bookmark size={20} className="text-purple-400" />
                      <div className="bm-info">
                        <h4>{bm.topic}</h4>
                        <p>{bm.chapter} · {bm.lecture} at <span className="text-purple-400 font-bold">{bm.time}</span></p>
                      </div>
                    </div>
                    <div className="bm-right">
                      <button className="bm-action-btn view" onClick={() => addNotification({ message: 'Navigating to bookmarked video timestamp...', type: 'info' })}>
                        Resume Video
                      </button>
                      <button className="bm-action-btn delete" onClick={() => handleDeleteBookmark(bm.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-rev-state glass-panel">
                <Bookmark size={44} className="text-purple-400" />
                <h4>No Timestamp Bookmarks</h4>
                <p>Click "Bookmark" inside a lecture player sidebar to save key formulas here.</p>
              </div>
            )}
          </div>
        )}

        {/* ---- TAB: DOWNLOADS ---- */}
        {activeTab === 'downloads' && (
          <div className="rev-pane-list">
            <div className="rev-desc-row">
              <h3>Downloaded Media Cache</h3>
              <p>Offline booklets and videos saved in your client browser sandbox.</p>
            </div>

            {downloads.length > 0 ? (
              <div className="bookmarks-list">
                {downloads.map((dl) => (
                  <div key={dl.id} className="bookmark-card glass-panel">
                    <div className="bm-left">
                      <Download size={20} className="text-cyan-400" />
                      <div className="bm-info">
                        <h4>{dl.title}</h4>
                        <p>{dl.type} · Size: {dl.size}</p>
                      </div>
                    </div>
                    <div className="bm-right">
                      <button className="bm-action-btn view" onClick={() => addNotification({ message: 'Opening offline file...', type: 'success' })}>
                        Open
                      </button>
                      <button className="bm-action-btn delete" onClick={() => handleDeleteDownload(dl.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-rev-state glass-panel">
                <Download size={44} className="text-purple-400" />
                <h4>No Offline Cache Files</h4>
                <p>Download study PDFs inside classroom details to view them when offline.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default RevisionPage;
