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
import { AdminLoginPage } from './pages/AdminLoginPage';
import { TravellerSearchPage } from './pages/TravellerSearchPage';
import { TravellerPreferencesPage } from './pages/TravellerPreferencesPage';
import { TravellerNearbyPlaceholderPage } from './pages/TravellerNearbyPlaceholderPage';
import { TravellerMapPage } from './pages/TravellerMapPage';
import { TravellerNavigationPage } from './pages/TravellerNavigationPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Bind Zustand global state
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  // Derived currentRoute string to preserve existing component logic (e.g. active indicators)
  const currentRoute = location.pathname === '/' ? 'landing' : location.pathname.substring(1);

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    return <ResearchMonumentPage onNavigate={handleNavigate} language={language} />;
  };

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] flex flex-col font-body selection:bg-[#D4A85A] selection:text-[#17130F]">
      {/* Top Architectural Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

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
          <Route path="/ai-guide" element={<AIGuidePage onNavigate={handleNavigate} language={language} />} />
          <Route path="/trails" element={<HeritageTrailsPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/personalized-trail" element={<PersonalizedTrailPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/heritage-map" element={<HeritageMapPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/preservation" element={<PreservationPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/about" element={<AboutPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/traveller" element={<TravellerHomePage onNavigate={handleNavigate} language={language} />} />
          <Route path="/traveller/search" element={<TravellerSearchPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/traveller/preferences" element={<TravellerPreferencesPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/traveller/nearby" element={<TravellerNearbyPlaceholderPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/traveller/map" element={<TravellerMapPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/traveller/navigation/:monumentId" element={<TravellerNavigationPage onNavigate={handleNavigate} language={language} />} />
          <Route path="/research" element={<ResearchHomePage onNavigate={handleNavigate} language={language} />} />
          <Route path="/research/monument/:monumentId" element={<ResearchMonumentPageWrapper />} />
          <Route path="/research/compare" element={<ResearchComparePage onNavigate={handleNavigate} language={language} />} />
          <Route path="/admin/login" element={<AdminLoginPage onNavigate={handleNavigate} language={language} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Architectural Footer */}
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
