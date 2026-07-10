import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BackgroundBlob from './components/layout/BackgroundBlob';
import ContextMenu from './components/layout/ContextMenu';
import CommandPalette from './components/layout/CommandPalette';
import SwipeToUnlock from './components/layout/SwipeToUnlock';
import PageTransition from './components/ui/PageTransition';
import EduraLogo from './components/ui/EduraLogo';
import ToastNotification from './components/ui/ToastNotification';
import SupportWidget from './components/ui/SupportWidget';
import Spotlight from './components/layout/Spotlight';
import PomodoroEngine from './components/features/PomodoroEngine';
import SmoothScroll from './components/motion/SmoothScroll';
import LoadingScreen from './components/motion/LoadingScreen';
import MouseGlow from './components/layout/MouseGlow';
import NetworkStatus from './components/ui/NetworkStatus';
import CelebrationEngine from './components/ui/CelebrationEngine';
import PerformanceManager from './components/ui/PerformanceManager';

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

const MorePage = lazy(() => import('./pages/MorePage'));

// Store
import { useAuthStore } from './store/useAuthStore';

/* ========================================
   ROUTE GUARD COMPONENTS
   ======================================== */
const ProtectedRoute = ({ children }) => {
  const loginError = useAuthStore((s) => s.loginError);

  if (loginError === 'blocked') {
    return <Navigate to="/ghost" replace />;
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
  const navigate = useNavigate();
  const userObj = useAuthStore((s) => s.user);

  // Close mobile sidebar on route change
  const location = useLocation();
  const isBatchesSection = location.pathname.startsWith('/dashboard/batches') || location.pathname.startsWith('/dashboard/batch');
  
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const profilePic = localStorage.getItem(`edura_profile_pic_${userObj?.id}`) || '';

  return (
    <div className="app-container dashboard-layout cinematic-glow-bg">
      {/* Sidebar & Navigation */}
      {!isBatchesSection && (
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      )}
      <BottomNav />
      
      {/* Mobile Top Bar */}
      <div className="mobile-topbar" style={{ display: 'none', padding: '10px 16px', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10, 10, 12, 0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <EduraLogo size={28} />
        </div>
        <div 
          onClick={() => navigate('/dashboard/profile')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="My Profile"
        >
          {profilePic ? (
            <img 
              src={profilePic} 
              alt="Profile" 
              style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--color-primary)', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              border: '2px solid var(--color-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '12px'
            }}>
              {userObj?.username?.charAt(0).toUpperCase() || 'S'}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main 
        className="dashboard-main-content" 
        style={{ 
          flex: 1, 
          marginLeft: isBatchesSection ? '0' : (sidebarCollapsed ? '72px' : '260px'), 
          transition: 'margin-left var(--transition-smooth)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header />
        
        <div className="dashboard-content-wrapper" style={{ flex: 1, paddingTop: '100px', paddingBottom: '80px' }}>
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
        @media (max-width: 1024px) {
          .app-container.dashboard-layout {
            flex-direction: column !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
          }
          .dashboard-main-content {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
          .desktop-header {
            display: none !important;
          }
          .mobile-topbar {
            display: flex !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 56px !important;
            z-index: 1000 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .floating-feedback-btn {
            bottom: 5.5rem !important;
          }
          .top-header {
            display: none !important;
          }
          /* Custom mobile padding adjustments */
          .dashboard-content-wrapper {
            padding-top: 72px !important;
            padding-bottom: 90px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            box-sizing: border-box !important;
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
  const [appLoading, setAppLoading] = React.useState(true);
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
      <AnimatePresence mode="wait">
        {appLoading && (
          <LoadingScreen onComplete={() => setAppLoading(false)} />
        )}
      </AnimatePresence>
      <PerformanceManager />
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
      <NetworkStatus />
      <CelebrationEngine />
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

            <Route path="/auth" element={<Navigate to="/dashboard" replace />} />

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
              <Route path="practice" element={<PracticeHubPage />} />
              <Route path="dpp" element={<Navigate to="/dashboard/practice" replace />} />
              <Route path="pyqs" element={<Navigate to="/dashboard/practice" replace />} />
              <Route path="tests" element={<PracticeHubPage />} />
              <Route path="assignments" element={<PracticeHubPage />} />
              <Route path="ai-quiz" element={
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Coming Soon 🚀</h2>
                  <p style={{ color: '#94a3b8' }}>This feature is under development.</p>
                </div>
              } />
              <Route path="ai-planner" element={
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Coming Soon 🚀</h2>
                  <p style={{ color: '#94a3b8' }}>This feature is under development.</p>
                </div>
              } />
              <Route path="ai-buddy" element={
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Coming Soon 🚀</h2>
                  <p style={{ color: '#94a3b8' }}>This feature is under development.</p>
                </div>
              } />
              <Route path="community" element={<CommunityFeed />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="more" element={<MorePage />} />
              <Route path="notifications" element={<Navigate to="/dashboard/community" replace />} />
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
