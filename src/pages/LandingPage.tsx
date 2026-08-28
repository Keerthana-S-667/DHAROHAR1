import React from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Navigation, 
  Layers, 
  Eye, 
  Volume2, 
  CheckCircle2,
  ChevronRight,
  Globe2,
  BookOpen,
  User,
  Shield,
  HelpCircle
} from 'lucide-react';
import { heritageService } from '../services/heritageService';
import { useStore } from '../store/store';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HeritageImage } from '../components/HeritageImage';
import { TajMahalViewer } from '../components/hero/TajMahalViewer';

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

  const handleRoleSelect = (role: 'traveller' | 'researcher') => {
    setSelectedUserRole(role);
    if (role === 'traveller') {
      onNavigate('traveller');
    } else {
      onNavigate('research');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] overflow-hidden stone-pattern font-body">
      
      {/* ==================================================
          1. HERO SECTION WITH 3D TAJ MAHAL
          ================================================== */}
      <section className="relative min-h-screen flex items-center pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        
        {/* Left Side: Vertical Scroll To Discover Indicator */}
        <div className="absolute left-4 bottom-24 hidden lg:flex flex-col items-center gap-12 pointer-events-none z-20">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#4b2f23]/40 origin-left -rotate-90 transform -translate-x-1.5 whitespace-nowrap">
            Scroll To Discover
          </span>
          <div className="w-[1px] h-16 bg-[#d5b990] animate-pulse" />
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left Column - Story and Actions */}
          <div className="lg:col-span-5 space-y-8 text-left animate-fade-in-up">
            
            {/* Fine Header Line */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[#b65a3a]" />
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#b65a3a] font-body">
                Digital Indian Heritage
              </span>
            </div>

            {/* Display Headline */}
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] sm:leading-[1.15]">
                Explore the past.<br />
                <em>Experience it in 3D.</em><br />
                Preserve it for the future.
              </h1>

            {/* Paragraph Subtitle */}
            <p className="text-sm sm:text-base text-[#4b2f23]/80 leading-relaxed font-body max-w-xl">
              {t.heroSubtitle}
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-btn-begin-exploration"
                onClick={handleBeginExploration}
                className="px-7 py-3.5 rounded bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#4b2f23] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group cursor-pointer"
              >
                <span>{t.btnExplore}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-btn-explore-heritage"
                onClick={() => onNavigate('explore')}
                className="px-6 py-3.5 rounded-full hover:bg-[#F4EFE6] border border-[#d5b990] text-[#4b2f23] font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full border border-[#b65a3a] flex items-center justify-center text-[#b65a3a]">
                  <span className="text-[10px] ml-0.5">▶</span>
                </div>
                <span>Explore Heritage</span>
              </button>
            </div>

            {/* Supporting Quick Jump Cards */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#d5b990]">
              <button
                onClick={() => onNavigate('heritage-map')}
                className="p-4 rounded-xl bg-[#ede3d1] border border-[#d5b990] hover:border-[#b65a3a] text-left transition-all duration-300 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#f5f0e6] border border-[#d5b990] flex items-center justify-center text-[#b65a3a] mb-3">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4b2f23] group-hover:text-[#b65a3a] transition-colors">
                  Explore Map
                </h4>
                <p className="text-[10px] text-[#4b2f23]/60 mt-1">Interactive geographical monument trails.</p>
              </button>

              <button
                onClick={() => onNavigate('3d-explorer')}
                className="p-4 rounded-xl bg-[#ede3d1] border border-[#d5b990] hover:border-[#b65a3a] text-left transition-all duration-300 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#f5f0e6] border border-[#d5b990] flex items-center justify-center text-[#b65a3a] mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4b2f23] group-hover:text-[#b65a3a] transition-colors">
                  3D Explorer
                </h4>
                <p className="text-[10px] text-[#4b2f23]/60 mt-1">High-fidelity sub-millimeter 3D scans.</p>
              </button>
            </div>

            {/* Bottom curations index */}
            <div className="pt-4 flex items-center gap-4 text-[#4b2f23]/60 text-[11px] font-semibold tracking-wider">
              <span className="text-[#b65a3a] font-display text-sm font-extrabold">01 / 08</span>
              <div className="w-12 h-[1px] bg-[#d5b990]" />
              <span>CURATED PLACES, DEEPER STORIES</span>
            </div>

          </div>

          {/* Right Column - Beautiful 3D Model Centerpiece */}
          <div className="lg:col-span-7 relative flex items-center justify-center animate-fade-in delay-200">
            {/* Subtle rotating glow backdrop behind 3D */}
            <div className="absolute w-[80%] h-[80%] bg-[#d5b990]/10 rounded-full blur-[80px] pointer-events-none" />
            
            {/* Interactive Taj Mahal Viewer — Aligned up and right a little on desktop for better spacing */}
            <div className="w-full relative z-10 lg:-mt-12 lg:-mr-16 lg:translate-x-8 lg:-translate-y-4">
              <TajMahalViewer />
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          2. THE PATHWAY SELECTION SECTION
          ================================================== */}
      <section id="role-selection-section" className="pathways-section scroll-mt-24">
        <div className="section-shell max-w-7xl mx-auto">
          
          {/* Header Area */}
          <div className="pathways-header">
            <p className="section-kicker pathways-kicker">
              <Compass size={13} strokeWidth={1.7} />
              {t.selectPathwayBadge}
            </p>
            <h2 className="pathways-heading">
              How would you like<br />
              <em>to explore?</em>
            </h2>
            <p className="pathways-sub">
              {t.pathwaySubtitle}
            </p>
          </div>

          {/* 2-Column Grid */}
          <div className="pathways-grid">
            
            {/* Card 1: Traveller / Tourist */}
            <div className="pathway-card-wrap">
              <div className="pathway-card">
                <div className="pathway-card-top">
                  <span className="pathway-number">01</span>
                  <span className="pathway-icon-circle">
                    <User size={17} strokeWidth={1.25} />
                  </span>
                </div>
                <h3 className="pathway-title">{t.roleTravellerTitle}</h3>
                <p className="pathway-desc">{t.roleTravellerDesc}</p>
                <button 
                  onClick={() => handleRoleSelect('traveller')}
                  className="button button-primary pathway-btn"
                >
                  {t.roleTravellerBtn} <ArrowRight size={14} strokeWidth={1.6} />
                </button>
              </div>
            </div>

            {/* Card 2: Student / Researcher */}
            <div className="pathway-card-wrap">
              <div className="pathway-card">
                <div className="pathway-card-top">
                  <span className="pathway-number">02</span>
                  <span className="pathway-icon-circle">
                    <BookOpen size={17} strokeWidth={1.25} />
                  </span>
                </div>
                <h3 className="pathway-title">{t.roleResearcherTitle}</h3>
                <p className="pathway-desc">{t.roleResearcherDesc}</p>
                <button 
                  onClick={() => handleRoleSelect('researcher')}
                  className="button button-primary pathway-btn"
                >
                  {t.roleResearcherBtn} <ArrowRight size={14} strokeWidth={1.6} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          3. EXPLORE INDIA BY HERITAGE REGION
          ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#d5b990]">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-[#d5b990]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b65a3a] mb-2 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-[#b65a3a]" />
              <span>{t.atlasBadge}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4b2f23]">
              {t.atlasTitle}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-bold uppercase tracking-widest text-[#b65a3a] hover:text-[#4b2f23] flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>{t.atlasViewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic State Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statesData.map((state) => (
            <div
              key={state.id}
              onClick={() => onNavigate(`state/${state.id}`)}
              className="group relative rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/20 overflow-hidden cursor-pointer hover:border-[#b65a3a]/60 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative h-52 overflow-hidden bg-[#f5f0e6]">
                <HeritageImage
                  src={state.heroImage}
                  alt={state.name}
                  fallbackName={state.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ede3d1]/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded bg-[#f5f0e6]/90 border border-[#d5b990] text-[9px] text-[#b65a3a] uppercase tracking-wider font-extrabold shadow-sm">
                  {state.destinations[0]?.name}
                </div>
              </div>

              {/* Info content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-[#4b2f23] group-hover:text-[#b65a3a] transition-colors">
                      {state.name}
                    </h3>
                    <span className="text-[13px] font-subheading italic text-[#b65a3a] font-semibold">{state.nativeName}</span>
                  </div>
                  <p className="text-xs text-[#4b2f23]/70 mt-2 line-clamp-2 leading-relaxed">
                    {state.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#d5b990]/60 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#4b2f23]/60 tracking-wider uppercase font-body">{state.dynasties[0]}</span>
                  <span className="flex items-center gap-1 text-[#b65a3a] font-extrabold tracking-wider group-hover:translate-x-1 transition-transform">
                    {t.exploreStateBtn} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          6. AI HERITAGE GUIDE INTRO (SUTRADHAR)
          ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#d5b990]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Details (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#ede3d1] border border-[#d5b990] text-[9px] uppercase font-bold tracking-widest text-[#b65a3a]">
              <span>AI Cultural Assistant</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4b2f23] leading-tight">
              Dharohar AI: <br />
              <span className="italic text-[#b65a3a] font-subheading font-normal">An erudite cultural guide conversing with you.</span>
            </h2>
            
            <p className="text-sm text-[#4b2f23]/75 leading-relaxed font-body">
              Named after the traditional orchestrators of classical theater, Dharohar AI is a localized agent conversant in Indian architecture, dynastic lineages, epigraphy records, and materials.
            </p>

            {/* Simulated chat queries */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4b2f23]/50 block">Suggested Inquiries</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-[#ede3d1] border border-[#d5b990] rounded-xl text-[#4b2f23]/80 font-medium hover:border-[#b65a3a] cursor-pointer transition-colors" onClick={() => onNavigate('ai-guide')}>
                  "Why was this monument built?"
                </div>
                <div className="p-3 bg-[#ede3d1] border border-[#d5b990] rounded-xl text-[#4b2f23]/80 font-medium hover:border-[#b65a3a] cursor-pointer transition-colors" onClick={() => onNavigate('ai-guide')}>
                  "What makes its architectural style unique?"
                </div>
                <div className="p-3 bg-[#ede3d1] border border-[#d5b990] rounded-xl text-[#4b2f23]/80 font-medium hover:border-[#b65a3a] cursor-pointer transition-colors" onClick={() => onNavigate('ai-guide')}>
                  "Who commissioned the Shore Temple?"
                </div>
                <div className="p-3 bg-[#ede3d1] border border-[#d5b990] rounded-xl text-[#4b2f23]/80 font-medium hover:border-[#b65a3a] cursor-pointer transition-colors" onClick={() => onNavigate('ai-guide')}>
                  "Explain the relief works in Tamil."
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('ai-guide')}
                className="px-6 py-3.5 rounded bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#4b2f23] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Consult Dharohar AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat graphic mock (Right) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/25 space-y-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#d5b990]">
              <div className="w-8 h-8 rounded-full bg-[#b65a3a] flex items-center justify-center text-white text-xs font-bold font-display">
                ध
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#4b2f23] tracking-wider uppercase">Dharohar AI Guide</h4>
                <span className="text-[9px] text-[#b65a3a] font-semibold uppercase tracking-wider">Online • Heritage Expert</span>
              </div>
            </div>

            {/* Chat Messages Mock */}
            <div className="space-y-3 h-44 overflow-y-auto pr-1 text-[11px]">
              <div className="bg-[#f5f0e6] border border-[#d5b990] p-3 rounded-2xl rounded-tl-none text-[#4b2f23]/85 leading-relaxed max-w-[85%]">
                Greetings, researcher. I am Dharohar AI. Ask me about the architectural geometry, rulers, epigraphs, or cosmic alignments of Indian monuments.
              </div>
              <div className="bg-[#b65a3a] text-white p-3 rounded-2xl rounded-tr-none leading-relaxed max-w-[85%] ml-auto text-right">
                What is the significane of the fluted black basalt lingam inside Shore Temple?
              </div>
              <div className="bg-[#f5f0e6] border border-[#d5b990] p-3 rounded-2xl rounded-tl-none text-[#4b2f23]/85 leading-relaxed max-w-[85%]">
                The sixteen-sided basalt Dharalinga represents the supreme cosmic axis. Its fluted design reflects Pallava mastery over hard stone, crafted in 700 CE...
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          7. DIGITAL PRESERVATION AND STEWARDSHIP
          ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-8 border-t border-[#d5b990]">
        <div className="space-y-4 animate-fade-in-up">
          <ShieldCheck className="w-12 h-12 text-[#b65a3a] mx-auto" />
          
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4b2f23] tracking-wide uppercase">
            {t.preserveTitle}
          </h2>
          
          <p className="text-sm text-[#4b2f23]/75 leading-relaxed font-body max-w-2xl mx-auto">
            {t.preserveDesc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-[#4b2f23]/60 max-w-3xl mx-auto pt-4">
            <div className="p-3 bg-[#ede3d1] border border-[#d5b990] rounded-xl text-center">
              <span>Digital Archiving</span>
            </div>
            <div className="p-3 bg-[#ede3d1] border border-[#d5b990] rounded-xl text-center">
              <span>Weather Monitoring</span>
            </div>
            <div className="p-3 bg-[#ede3d1] border border-[#d5b990] rounded-xl text-center">
              <span>LiDAR Scans</span>
            </div>
            <div className="p-3 bg-[#ede3d1] border border-[#d5b990] rounded-xl text-center">
              <span>Heritage Pledging</span>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onNavigate('preservation')}
              className="px-8 py-3.5 rounded bg-[#4b2f23] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#b65a3a] transition-colors cursor-pointer"
            >
              {t.btnPreserveGuidelines}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
