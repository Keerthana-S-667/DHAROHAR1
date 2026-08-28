/**
 * DHAROHAR - Digital Heritage Platform
 * “Explore the past. Experience it in 3D. Preserve it for the future.”
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { useStore } from './store/store';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { StatePage } from './pages/StatePage';
import { DestinationPage } from './pages/DestinationPage';
import { MonumentDetailPage } from './pages/MonumentDetailPage';
import { ThreeDExplorerPage } from './pages/ThreeDExplorerPage';
import { AIGuidePage } from './pages/AIGuidePage';
import { HeritageTrailsPage } from './pages/HeritageTrailsPage';
import { PersonalizedTrailPage } from './pages/PersonalizedTrailPage';
import { HeritageMapPage } from './pages/HeritageMapPage';
import { PreservationPage } from './pages/PreservationPage';
import { ThreeDHeritageExperiencePage } from './pages/ThreeDHeritageExperiencePage';
import { AboutPage } from './pages/AboutPage';
import { TravellerHomePage } from './pages/TravellerHomePage';
import { ResearchHomePage } from './pages/ResearchHomePage';
import { ResearchMonumentPage } from './pages/ResearchMonumentPage';
import { ResearchComparePage } from './pages/ResearchComparePage';
import { HeritageQuestPage } from './pages/HeritageQuestPage';
import { StudentProgressPage } from './pages/StudentProgressPage';
import { InteractiveFX } from './components/InteractiveFX';
import { TravellerSearchPage } from './pages/TravellerSearchPage';
import { TravellerPreferencesPage } from './pages/TravellerPreferencesPage';
import { TravellerNearbyPlaceholderPage } from './pages/TravellerNearbyPlaceholderPage';
import { TravellerMapPage } from './pages/TravellerMapPage';
import { TravellerNavigationPage } from './pages/TravellerNavigationPage';

// Auth Imports
import { ProtectedRoute, RoleProtectedRoute } from './components/RouteGuard';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import { useAuthStore } from './store/authStore';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Bind Zustand global state
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  // Bind and initialize Zustand Auth state
  const initializeAuth = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Derived currentRoute string to preserve existing component logic (e.g. active indicators)
  const currentRoute = location.pathname === '/' ? 'landing' : location.pathname.substring(1);

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  // Navigate helper to map existing custom route calls to React Router paths
  const handleNavigate = (route: string) => {
    if (route === 'landing' || route === 'home' || route === '') {
      navigate('/');
    } else {
      navigate('/' + route);
    }
  };

  // Route parameters wrappers to pass props to pages without changing page definitions
  const StatePageWrapper = () => {
    const { stateId } = useParams<{ stateId: string }>();
    return <StatePage stateId={stateId || 'tamil-nadu'} onNavigate={handleNavigate} language={language} />;
  };

  const DestinationPageWrapper = () => {
    const { destinationId } = useParams<{ destinationId: string }>();
    return <DestinationPage destinationId={destinationId || 'mahabalipuram'} onNavigate={handleNavigate} language={language} />;
  };

  const MonumentDetailPageWrapper = () => {
    const { monumentId } = useParams<{ monumentId: string }>();
    return <MonumentDetailPage monumentId={monumentId || 'shore-temple'} onNavigate={handleNavigate} language={language} />;
  };

  const ThreeDHeritageExperiencePageWrapper = () => {
    const { monumentId } = useParams<{ monumentId: string }>();
    return <ThreeDHeritageExperiencePage onNavigate={handleNavigate} language={language} />;
  };

  const ResearchMonumentPageWrapper = () => {
    const { monumentId } = useParams<{ monumentId: string }>();
    return <ResearchMonumentPage monumentId={monumentId} onNavigate={handleNavigate} language={language} />;
  };

  const HeritageQuestPageWrapper = () => {
    const { monumentId } = useParams<{ monumentId: string }>();
    return <HeritageQuestPage monumentId={monumentId} onNavigate={handleNavigate} language={language} />;
  };

  const ThreeDExplorerPageWrapper = () => {
    const { monumentId } = useParams<{ monumentId: string }>();
    return <ThreeDExplorerPage monumentId={monumentId} onNavigate={handleNavigate} language={language} />;
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] flex flex-col font-body selection:bg-[#b65a3a] selection:text-[#f5f0e6]">
      {/* Top Architectural Navigation Bar */}
      {!currentRoute.startsWith('admin') && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          language={language}
          onLanguageChange={setLanguage}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* Main Content Area with React Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/explore" element={<ExplorePage onNavigate={handleNavigate} language={language} />} />
          <Route path="/state/:stateId" element={<StatePageWrapper />} />
          <Route path="/destination/:destinationId" element={<DestinationPageWrapper />} />
          <Route path="/monument/:monumentId" element={<MonumentDetailPageWrapper />} />
          <Route path="/monument/:monumentId/3d" element={<ThreeDHeritageExperiencePageWrapper />} />
          <Route path="/3d-explorer" element={<ThreeDExplorerPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/3d-explorer/:monumentId" element={<ThreeDExplorerPageWrapper />} />
          
          {/* Protected AI Guide Route */}
          <Route path="/ai-guide" element={
            <ProtectedRoute>
              <AIGuidePage onNavigate={handleNavigate} language={language} />
            </ProtectedRoute>
          } />

          <Route path="/trails" element={<HeritageTrailsPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/personalized-trail" element={<PersonalizedTrailPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/heritage-map" element={<HeritageMapPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/preservation" element={<PreservationPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/about" element={<AboutPage onNavigate={handleNavigate} language={language} />} />

          {/* Protected Traveller Routes */}
          <Route path="/traveller" element={
            <RoleProtectedRoute allowedRoles={['traveller']}>
              <TravellerHomePage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/traveller/search" element={
            <RoleProtectedRoute allowedRoles={['traveller']}>
              <TravellerSearchPage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/traveller/preferences" element={
            <RoleProtectedRoute allowedRoles={['traveller']}>
              <TravellerPreferencesPage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/traveller/nearby" element={
            <RoleProtectedRoute allowedRoles={['traveller']}>
              <TravellerNearbyPlaceholderPage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/traveller/map" element={
            <RoleProtectedRoute allowedRoles={['traveller']}>
              <TravellerMapPage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/traveller/navigation/:monumentId" element={
            <RoleProtectedRoute allowedRoles={['traveller']}>
              <TravellerNavigationPage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />

          {/* Protected Researcher Routes */}
          <Route path="/research" element={
            <RoleProtectedRoute allowedRoles={['researcher']}>
              <ResearchHomePage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/research/monument/:monumentId" element={
            <RoleProtectedRoute allowedRoles={['researcher']}>
              <ResearchMonumentPageWrapper />
            </RoleProtectedRoute>
          } />
          <Route path="/research/compare" element={
            <RoleProtectedRoute allowedRoles={['researcher']}>
              <ResearchComparePage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/research/quest" element={
            <RoleProtectedRoute allowedRoles={['researcher']}>
              <HeritageQuestPageWrapper />
            </RoleProtectedRoute>
          } />
          <Route path="/research/quest/:monumentId" element={
            <RoleProtectedRoute allowedRoles={['researcher']}>
              <HeritageQuestPageWrapper />
            </RoleProtectedRoute>
          } />
          <Route path="/research/progress" element={
            <RoleProtectedRoute allowedRoles={['researcher']}>
              <StudentProgressPage onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage subview="dashboard" onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage subview="reports" onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/reports/:reportId" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage subview="report-details" onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/risk-monitor" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage subview="risk-monitor" onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/contributions" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage subview="contributions" onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage subview="analytics" onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/activity" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage subview="activity" onNavigate={handleNavigate} language={language} />
            </RoleProtectedRoute>
          } />

          {/* Public Authentication Pages */}
          <Route path="/auth/traveller" element={<AuthPage mode="traveller" />} />
          <Route path="/auth/researcher" element={<AuthPage mode="researcher" />} />
          <Route path="/admin/login" element={<AuthPage mode="admin" />} />
          <Route path="/auth/forgot-password" element={<AuthPage mode="forgot-password" />} />
          <Route path="/auth/reset-password" element={<AuthPage mode="reset-password" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Interactive FX Dock, Sound & Particle Engine */}
      <InteractiveFX onNavigate={handleNavigate} onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Persistent Footer */}
      <Footer onNavigate={handleNavigate} language={language} />

      {/* Global Instant Search & Jump Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
