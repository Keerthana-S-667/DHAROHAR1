import React from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Navigation, 
  Layers, 
  Clock, 
  Eye, 
  Volume2, 
  CheckCircle2,
  ChevronRight,
  Flame,
  Globe2
} from 'lucide-react';
import { heritageService } from '../services/heritageService';
import { useStore } from '../store/store';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HeritageImage } from '../components/HeritageImage';

interface LandingPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language].landing;
  const setSelectedUserRole = useStore((state) => state.setSelectedUserRole);
  const statesData = heritageService.getStates();

  const handleBeginExploration = () => {
    document.getElementById('role-selection-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoleSelect = (role: 'traveller' | 'researcher' | 'admin') => {
    setSelectedUserRole(role);
    if (role === 'traveller') {
      onNavigate('traveller');
    } else if (role === 'researcher') {
      onNavigate('research');
    } else {
      onNavigate('admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Layer with Dark Texture & Gold Lighting */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=85"
            alt="DHAROHAR Indian Temple Heritage"
            className="w-full h-full object-cover object-center opacity-25 scale-105 filter saturate-50 contrast-125"
          />
          {/* Radial Dark Vignette & Gold Atmospheric Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#17130F] via-[#17130F]/80 to-[#17130F]/60" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A85A]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Architectural Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B2118]/90 border border-[#D4A85A]/50 text-xs text-[#D4A85A] font-semibold tracking-widest uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.heroBadgeTag}</span>
            <span className="w-1 h-1 rounded-full bg-[#D4A85A]" />
            <span className="text-[#F3EBDD]/70 font-normal">{t.heroBadgeSub}</span>
          </div>

          {/* Main Display Headline */}
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F3EBDD] leading-[1.1]">
              {t.heroTitle}
            </h1>
            <p className="font-subheading text-2xl sm:text-3xl lg:text-4xl text-[#D4A85A] italic max-w-3xl mx-auto leading-snug">
              {t.heroQuote}
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#F3EBDD]/80 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              id="hero-btn-begin-exploration"
              onClick={handleBeginExploration}
              className="px-8 py-4 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-sm tracking-wider uppercase hover:bg-[#F3EBDD] hover:shadow-xl hover:shadow-[#D4A85A]/30 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>{t.btnExplore}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-btn-explore-map"
              onClick={() => onNavigate('heritage-map')}
              className="px-8 py-4 rounded-full bg-[#2B2118] border border-[#D4A85A]/50 text-[#F3EBDD] font-semibold text-sm tracking-wider uppercase hover:border-[#D4A85A] hover:bg-[#B58A52]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#D4A85A]" />
              <span>{t.btnMap}</span>
            </button>

            <button
              id="hero-btn-launch-3d"
              onClick={() => onNavigate('3d-explorer')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#B58A52]/30 to-[#D4A85A]/30 border border-[#D4A85A] text-[#D4A85A] font-semibold text-sm tracking-wider uppercase hover:bg-[#D4A85A] hover:text-[#17130F] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.btn3D}</span>
            </button>
          </div>

          {/* 2. THE USP STATEMENT SECTION */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#2B2118]/80 border border-[#D4A85A]/40 backdrop-blur-md shadow-2xl relative overflow-hidden text-center space-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A85A]/10 rounded-full blur-2xl pointer-events-none" />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B58A52]">
                {t.uspLead}
              </p>
              <p className="font-subheading text-lg sm:text-xl font-bold text-[#F3EBDD] leading-relaxed">
                {t.uspPunch}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE SELECTION SECTION */}
      <section id="role-selection-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 scroll-mt-24">
        <div className="text-center space-y-3 max-w-3xl mx-auto animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B2118] border border-[#D4A85A]/50 text-xs text-[#D4A85A] font-semibold uppercase tracking-widest shadow-lg">
            <Compass className="w-4 h-4" />
            <span>{t.selectPathwayBadge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
            {t.pathwayTitle}
          </h2>
          <p className="font-subheading text-lg sm:text-xl text-[#D4A85A] italic">
            {t.pathwaySubtitle}
          </p>
        </div>

        {/* The 3 Themed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. Traveller */}
          <div className="p-6 rounded-3xl bg-[#2B2118]/80 border border-[#D4A85A]/30 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#D4A85A] transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A85A]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#17130F] border border-[#D4A85A]/40 text-[#D4A85A] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-display text-xl font-bold text-[#F3EBDD]">
                {t.roleTravellerTitle}
              </h3>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                {t.roleTravellerDesc}
              </p>
            </div>
            <button
              onClick={() => handleRoleSelect('traveller')}
              className="w-full py-3 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer text-center shadow-md shadow-[#D4A85A]/10"
            >
              {t.roleTravellerBtn}
            </button>
          </div>

          {/* 2. Researcher */}
          <div className="p-6 rounded-3xl bg-[#2B2118]/80 border border-[#D4A85A]/30 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#D4A85A] transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A85A]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#17130F] border border-[#D4A85A]/40 text-[#D4A85A] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-display text-xl font-bold text-[#F3EBDD]">
                {t.roleResearcherTitle}
              </h3>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                {t.roleResearcherDesc}
              </p>
            </div>
            <button
              onClick={() => handleRoleSelect('researcher')}
              className="w-full py-3 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer text-center shadow-md shadow-[#D4A85A]/10"
            >
              {t.roleResearcherBtn}
            </button>
          </div>

          {/* 3. Admin */}
          <div className="p-6 rounded-3xl bg-[#2B2118]/80 border border-[#D4A85A]/30 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#D4A85A] transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A85A]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#17130F] border border-[#D4A85A]/40 text-[#D4A85A] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-display text-xl font-bold text-[#F3EBDD]">
                {t.roleAdminTitle}
              </h3>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                {t.roleAdminDesc}
              </p>
            </div>
            <button
              onClick={() => handleRoleSelect('admin')}
              className="w-full py-3 rounded-xl bg-[#2B2118] border border-[#D4A85A]/40 text-[#D4A85A] hover:bg-[#17130F] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              {t.roleAdminBtn}
            </button>
          </div>
        </div>
      </section>



      {/* 4. THE 5 STATES REGIONAL HERITAGE GATEWAY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#D4A85A]/20">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#D4A85A] mb-1">
              {t.atlasBadge}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F3EBDD]">
              {t.atlasTitle}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-bold uppercase tracking-wider text-[#D4A85A] hover:text-[#F3EBDD] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>{t.atlasViewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statesData.map((state) => (
            <div
              key={state.id}
              onClick={() => onNavigate(`state/${state.id}`)}
              className="group relative rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 overflow-hidden cursor-pointer hover:border-[#D4A85A] transition-all hover:shadow-2xl hover:shadow-[#D4A85A]/10 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <HeritageImage
                  src={state.heroImage}
                  alt={state.name}
                  fallbackName={state.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118] via-[#2B2118]/40 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#17130F]/90 backdrop-blur-md border border-[#D4A85A]/30 text-[11px] text-[#D4A85A] font-semibold">
                  {state.destinations[0]?.name}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold text-[#F3EBDD] group-hover:text-[#D4A85A] transition-colors">
                      {state.name}
                    </h3>
                    <span className="text-sm font-subheading italic text-[#D4A85A]/80">{state.nativeName}</span>
                  </div>
                  <p className="text-xs text-[#F3EBDD]/70 mt-2 line-clamp-2">
                    {state.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D4A85A]/20 flex items-center justify-between text-xs text-[#D4A85A]">
                  <span className="font-medium text-[#F3EBDD]/80">{state.dynasties[0]}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                    {t.exploreStateBtn} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HERITAGE TRAILS HIGHLIGHT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#2B2118]/60 border border-[#D4A85A]/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A85A]/20 text-[#D4A85A] text-xs font-bold uppercase tracking-wider">
              <Navigation className="w-3.5 h-3.5" />
              {t.trailsBadge}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F3EBDD]">
              {t.trailsTitle}
            </h2>
            <p className="text-sm text-[#F3EBDD]/80 leading-relaxed font-subheading italic text-lg text-[#D4A85A]">
              {t.trailsSubtitle}
            </p>
            <p className="text-xs sm:text-sm text-[#F3EBDD]/70 leading-relaxed">
              {t.trailsDesc}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('trails')}
                className="px-6 py-3 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>{t.btnWalkTrail}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('personalized-trail')}
                className="px-6 py-3 rounded-full bg-[#17130F] border border-[#D4A85A]/40 text-[#D4A85A] font-semibold text-xs uppercase tracking-wider hover:bg-[#2B2118] transition-all cursor-pointer"
              >
                <span>{t.btnCustomItinerary}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRESERVATION CHARTER CALLOUT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <ShieldCheck className="w-10 h-10 text-[#D4A85A] mx-auto" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F3EBDD]">
            {t.preserveTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#F3EBDD]/70 leading-relaxed">
            {t.preserveDesc}
          </p>
          <button
            onClick={() => onNavigate('preservation')}
            className="px-6 py-2.5 rounded-full bg-[#2B2118] border border-[#D4A85A] text-[#D4A85A] text-xs font-bold uppercase tracking-wider hover:bg-[#D4A85A] hover:text-[#17130F] transition-all cursor-pointer"
          >
            {t.btnPreserveGuidelines}
          </button>
        </div>
      </section>
    </div>
  );
};

