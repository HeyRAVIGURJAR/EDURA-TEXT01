import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BackgroundBlob from './components/layout/BackgroundBlob';
import ContextMenu from './components/layout/ContextMenu';
import CommandPalette from './components/layout/CommandPalette';
import SwipeToUnlock from './components/layout/SwipeToUnlock';
import PageTransition from './components/ui/PageTransition';
import ToastNotification from './components/ui/ToastNotification';
import SupportWidget from './components/ui/SupportWidget';
import Spotlight from './components/layout/Spotlight';
import GlobalAudioPlayer from './components/layout/GlobalAudioPlayer';
import PomodoroEngine from './components/features/PomodoroEngine';
import SmoothScroll from './components/motion/SmoothScroll';
import LoadingScreen from './components/motion/LoadingScreen';
import MouseGlow from './components/layout/MouseGlow';

// Layout & Features
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';
import FeedbackPortal from './components/features/FeedbackPortal';

// Lazy-loaded Pages & Heavy Components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GamifiedDashboard = lazy(() => import('./components/features/GamifiedDashboard'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const CommunityFeed = lazy(() => import('./pages/CommunityFeed'));
const StudyBuddyAI = lazy(() => import('./components/features/StudyBuddyAI'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const GhostPage = lazy(() => import('./pages/GhostPage'));
const BatchDetail = lazy(() => import('./pages/BatchDetail'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AppsPage = lazy(() => import('./pages/AppsPage'));
const TermsOfMaster = lazy(() => import('./pages/TermsOfMaster'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ChallengeArena = lazy(() => import('./pages/ChallengeArena'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const OttPage = lazy(() => import('./pages/OttPage'));
const LiveClassesPage = lazy(() => import('./pages/LiveClassesPage'));
const PracticeHubPage = lazy(() => import('./pages/PracticeHubPage'));
const RevisionPage = lazy(() => import('./pages/RevisionPage'));
const AiPlannerPage = lazy(() => import('./pages/AiPlannerPage'));

// Store
import { useAuthStore } from './store/useAuthStore';

/* ========================================
   ROUTE GUARD COMPONENTS
   ======================================== */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loginError = useAuthStore((s) => s.loginError);

  if (loginError === 'blocked') {
    return <Navigate to="/ghost" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/ghost" replace />;
  }

  return children;
};

/* ========================================
   DASHBOARD LAYOUT COMPONENT
   ======================================== */
const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Close mobile sidebar on route change
  const location = useLocation();
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-container dashboard-layout">
      {/* Sidebar & Navigation */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <BottomNav />
      
      {/* Mobile Top Bar */}
      <div className="mobile-topbar" style={{ display: 'none', padding: '1rem', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/artifacts/media__1782815915641.png" alt="EDURA" style={{ width: 32, height: 32, borderRadius: 8, filter: 'invert(1)', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-primary)', display: 'none', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>E</div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 800 }}>EDURA</span>
        </div>
        <button onClick={() => setMobileSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.5rem', cursor: 'pointer' }}>☰</button>
      </div>

      {/* Main Content Area */}
      <main 
        className="dashboard-main-content" 
        style={{ 
          flex: 1, 
          marginLeft: sidebarCollapsed ? '72px' : '260px', 
          transition: 'margin-left var(--transition-smooth)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header />
        
        <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '80px' }}>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>

      <FeedbackPortal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-main-content {
            margin-left: 0 !important;
          }
          .mobile-topbar {
            display: flex !important;
          }
          .floating-feedback-btn {
            bottom: 5.5rem !important;
          }
          .top-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};


/* ========================================
   MAIN APP ROUTER
   ======================================== */
function App() {
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';
  const isAdminLoginPage = location.pathname === '/admin-login';
  const isGhostPage = location.pathname === '/ghost';
  const isStandalonePage = isLandingPage || isAuthPage || isAdminLoginPage || isGhostPage;
  const hydrate = useAuthStore((s) => s.hydrate);

  // Hydrate auth from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Apply layout-specific classes to body
  useEffect(() => {
    if (isLandingPage) {
      document.body.classList.add('landing-mode');
      document.body.classList.remove('dashboard-mode');
    } else {
      document.body.classList.add('dashboard-mode');
      document.body.classList.remove('landing-mode');
    }
  }, [isLandingPage]);

  return (
    <>
      <MouseGlow />
      <SmoothScroll />
      {isLandingPage && !isUnlocked && <SwipeToUnlock onUnlock={() => setIsUnlocked(true)} />}
      {!isStandalonePage && <BackgroundBlob />}
      {!isStandalonePage && <ContextMenu />}
      {!isStandalonePage && <CommandPalette />}
      
      {/* Global Toast Notifications & Support Bot */}
      <ToastNotification />
      {!isStandalonePage && <SupportWidget />}
      
      <Spotlight />
      <GlobalAudioPlayer />
      {!isStandalonePage && <PomodoroEngine />}

      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={
              <PageTransition>
                <div className="app-container landing-layout">
                  <LandingPage />
                </div>
              </PageTransition>
            } />

            <Route path="/auth" element={
              <PageTransition>
                <AuthPage />
              </PageTransition>
            } />

            <Route path="/admin-login" element={
              <PageTransition>
                <AdminLogin />
              </PageTransition>
            } />

            <Route path="/ghost" element={
              <PageTransition>
                <GhostPage />
              </PageTransition>
            } />

            <Route path="/terms-of-master" element={
              <PageTransition>
                <TermsOfMaster />
              </PageTransition>
            } />

            <Route path="/privacy-policy" element={
              <PageTransition>
                <PrivacyPolicy />
              </PageTransition>
            } />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<GamifiedDashboard />} />
              <Route path="apps" element={<AppsPage />} />
              <Route path="arena" element={<ChallengeArena />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="batches" element={<Dashboard />} />
              <Route path="favorites" element={<RevisionPage />} />
              <Route path="bookmarks" element={<RevisionPage />} />
              <Route path="downloads" element={<RevisionPage />} />
              <Route path="batch/:batchId" element={<BatchDetail />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="ott" element={<OttPage />} />
              <Route path="live" element={<LiveClassesPage />} />
              <Route path="dpp" element={<PracticeHubPage />} />
              <Route path="tests" element={<PracticeHubPage />} />
              <Route path="pyqs" element={<PracticeHubPage />} />
              <Route path="assignments" element={<PracticeHubPage />} />
              <Route path="ai-quiz" element={<AiPlannerPage />} />
              <Route path="ai-planner" element={<AiPlannerPage />} />
              <Route path="ai-buddy" element={
                <div style={{ padding: '1rem' }}>
                  <StudyBuddyAI />
                </div>
              } />
              <Route path="community" element={<CommunityFeed />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="*" element={
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <h2>Page Under Construction 🚧</h2>
                  <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>This feature is part of our upcoming release.</p>
                </div>
              } />
            </Route>

            {/* Protected Admin Route */}
            <Route path="/admin-dashboard" element={
              <AdminRoute>
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </AdminRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/ghost" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}

export default App;
