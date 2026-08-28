import React, { useState, useMemo, useEffect } from 'react';
import { heritageService } from '../services/heritageService';
import { Language, GalleryImage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HeritageImage } from '../components/HeritageImage';
import { DharoharAIChat } from '../components/DharoharAIChat';
import { VoiceNarrationButton } from '../components/VoiceNarrationButton';
import { aiService } from '../services/aiService';
import { voiceService } from '../services/voiceService';
import { AIAudioHeritageGuide } from '../components/AIAudioHeritageGuide';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Crown, 
  Landmark, 
  ShieldCheck, 
  Volume2, 
  Eye, 
  Flame, 
  BookOpen, 
  AlertTriangle,
  Compass,
  Layers,
  Share2,
  CheckCircle2,
  Navigation,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  HardHat,
  Award,
  Maximize2
} from 'lucide-react';

interface MonumentDetailPageProps {
  monumentId: string;
  onNavigate: (route: string) => void;
  language: Language;
}

export const MonumentDetailPage: React.FC<MonumentDetailPageProps> = ({
  monumentId,
  onNavigate,
  language
}) => {
  const monument = heritageService.getMonumentById(monumentId, language) || heritageService.getMonumentById('shore-temple', language)!;
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDharoharAI, setShowDharoharAI] = useState(false);
  const [showAIAudioModal, setShowAIAudioModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'architecture' | 'gallery'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const t = TRANSLATIONS[language].monument;

  const dharoharAIContext = useMemo(() => aiService.buildContext(monument as any, {
    researchMode: 'traveller'
  }), [monument]);

  // Gallery items normalization
  const galleryItems: GalleryImage[] = useMemo(() => {
    if (monument.imageGallery && monument.imageGallery.length > 0) {
      return monument.imageGallery;
    }
    const urls = monument.galleryImages && monument.galleryImages.length > 0
      ? monument.galleryImages
      : [monument.heroImage];
      
    return urls.map((url, idx) => ({
      url,
      title: `${monument.name} - View ${idx + 1}`,
      caption: `Architectural vista of ${monument.name} located in ${monument.location.city}, ${monument.location.state}.`,
      source: 'Dharohar Cultural Heritage Archive',
      photographer: 'Archaeological Documentation Team'
    }));
  }, [monument]);

  // Build narration text from monument data for voice guide
  const narrationText = useMemo(() => [
    `Welcome to ${monument.name}.`,
    `Located in ${monument.location.city}, ${monument.location.state}.`,
    `Historical period: ${monument.period}.`,
    monument.dynasty ? `Built under the ${monument.dynasty} dynasty, patronised by ${monument.ruler}.` : '',
    monument.historicalOverview || monument.culturalSignificance,
    monument.history.slice(0, 600),
    monument.stories[0] ? `${monument.stories[0].title}: ${monument.stories[0].narrative.slice(0, 300)}` : ''
  ].filter(Boolean).join(' '), [monument]);

  // Stop narration when language changes
  useEffect(() => {
    voiceService.stop();
  }, [language]);

  // Keyboard navigation for photo lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev !== null && prev < galleryItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryItems.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, galleryItems.length]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryItems.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev !== null && prev < galleryItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 text-xs text-[#b65a3a]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(`destination/${monument.destinationId}`)}
              className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {monument.location.city}
            </button>
            <span className="text-[#4b2f23]/40">/</span>
            <span className="text-[#4b2f23] font-bold">
              {(language === 'ta' || language === 'hi') && monument.nativeName ? monument.nativeName : monument.name}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/30 text-[#b65a3a] hover:bg-[#b65a3a] hover:text-white transition-all text-xs cursor-pointer"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (language === 'ta' ? 'இணைப்பு நகலெடுக்கப்பட்டது' : language === 'hi' ? 'लिंक कॉपी हो गया' : 'Link Copied') : (language === 'ta' ? 'பகிருங்கள்' : language === 'hi' ? 'साझा करें' : 'Share Monument')}</span>
          </button>
        </div>

        {/* Hero Showcase Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#aa7b3f]/50 bg-[#ede3d1] shadow-2xl">
          <div className="relative h-96 sm:h-[500px] w-full">
            <HeritageImage
              src={monument.heroImage}
              alt={monument.name}
              fallbackName={monument.name}
              className="w-full h-full object-cover filter brightness-105 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130F]/90 via-[#17130F]/45 to-transparent" />
            
            {/* Top Badges */}
            <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#f5f0e6]/95 backdrop-blur-md border border-[#aa7b3f] text-xs font-bold text-[#b65a3a] shadow-md">
                {monument.dynasty}
              </span>
              {monument.unescoYear && (
                <span className="px-3 py-1 rounded-full bg-[#f5f0e6]/95 backdrop-blur-md border border-[#B58A52]/50 text-xs font-bold text-[#4b2f23] shadow-md">
                  UNESCO World Heritage ({monument.unescoYear})
                </span>
              )}
            </div>

            {/* Bottom Details & Hero Title */}
            <div className="absolute bottom-8 left-6 sm:left-10 right-6 space-y-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#D4A85A] drop-shadow-sm">
                  {monument.location.city}, {monument.location.state} • {monument.period}
                </div>
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mt-1 drop-shadow-lg tracking-tight">
                  {(language === 'ta' || language === 'hi') && monument.nativeName ? (
                    <>
                      {monument.nativeName} <span className="text-[#D4A85A] font-normal text-3xl sm:text-4xl">({monument.name})</span>
                    </>
                  ) : (
                    monument.name
                  )}
                </h1>
                <p className="font-subheading text-2xl sm:text-3xl text-[#F3EBDD] italic mt-1 font-semibold drop-shadow-md">
                  “{monument.tagline}”
                </p>
              </div>

              {/* Action Triggers */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="monument-start-journey-btn"
                  onClick={() => onNavigate(`traveller/navigation/${monument.id}`)}
                  className="px-6 py-3.5 rounded-full bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9a472a] transition-all flex items-center gap-2 shadow-2xl shadow-[#D4A85A]/40 group cursor-pointer"
                >
                  <Navigation className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>START JOURNEY</span>
                </button>

                {monument.has3DModel && (
                  <button
                    id="monument-hero-explore-3d-btn"
                    onClick={() => onNavigate(`monument/${monument.id}/3d`)}
                    className="px-6 py-3.5 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/40 text-[#b65a3a] font-bold text-xs uppercase tracking-wider hover:bg-[#b65a3a] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{t.explore3DBtn}</span>
                  </button>
                )}

                <button
                  id="monument-open-research-btn"
                  onClick={() => onNavigate(`research/monument/${monument.id}`)}
                  className="px-6 py-3.5 rounded-full bg-[#f5f0e6]/90 backdrop-blur-md border border-[#aa7b3f]/60 text-[#b65a3a] font-bold text-xs uppercase tracking-wider hover:bg-[#ede3d1] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#b65a3a]" />
                  <span>RESEARCH DOSSIER</span>
                </button>

                <button
                  id="monument-ask-dharoharAI-btn"
                  onClick={() => setShowDharoharAI(true)}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4A85A] to-amber-600 text-white font-bold text-xs uppercase tracking-wider hover:from-[#F3EBDD] hover:to-[#D4A85A] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4A85A]/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI Guide</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Architectural Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#f5f0e6] border-t border-[#aa7b3f]/30">
            <div className="p-3.5 rounded-xl bg-[#ede3d1]/60 border border-[#aa7b3f]/20">
              <div className="text-[10px] uppercase font-bold text-[#b65a3a] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {t.period}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#4b2f23] mt-1">{monument.period}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#ede3d1]/60 border border-[#aa7b3f]/20">
              <div className="text-[10px] uppercase font-bold text-[#b65a3a] flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                {t.ruler}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#4b2f23] mt-1">{monument.ruler}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#ede3d1]/60 border border-[#aa7b3f]/20">
              <div className="text-[10px] uppercase font-bold text-[#b65a3a] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                {t.style}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#4b2f23] mt-1 truncate">{monument.architectureStyle}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#ede3d1]/60 border border-[#aa7b3f]/20">
              <div className="text-[10px] uppercase font-bold text-[#b65a3a] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Coordinates
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#4b2f23] mt-1 truncate">{monument.location.coordinates}</div>
            </div>
          </div>
        </div>

        {/* Real Voice Audio Narration Player Bar */}
        <div className="p-6 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#b65a3a]/20 border border-[#aa7b3f]/50 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-[#b65a3a]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider">
                {t.audioGuideTitle} ({monument.audioGuide.duration})
              </div>
              <p className="text-xs text-[#4b2f23]/70 mt-0.5">
                Narrated by {monument.audioGuide.narrator}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-xs text-[#4b2f23]/80 bg-[#f5f0e6] px-4 py-2.5 rounded-xl border border-[#aa7b3f]/20 max-w-sm italic font-subheading">
              "{monument.audioGuide.transcript.slice(0, 110)}..."
            </div>
            <VoiceNarrationButton
              text={narrationText}
              language={language}
              ariaLabel={`Listen to the heritage story of ${monument.name}`}
              variant="full"
            />
          </div>
        </div>

        {/* AI Audio Heritage Guide Card */}
        <div className="p-6 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#b65a3a]/15 border border-[#aa7b3f]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#b65a3a]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider">
                AI AUDIO HERITAGE GUIDE
              </div>
              <p className="text-xs text-[#4b2f23]/70 mt-0.5">
                Personalized audio storytelling for your heritage journey &bull; Listen • Learn • Experience
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setShowAIAudioModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold bg-[#b65a3a] hover:bg-[#9a472a] text-white transition-all cursor-pointer shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to this Monument</span>
            </button>
          </div>
        </div>

        {/* Quick Navigation Tabs */}
        <div className="sticky top-20 z-30 p-2 rounded-2xl bg-[#ede3d1]/90 backdrop-blur-md border border-[#aa7b3f]/40 shadow-lg flex items-center justify-around gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('overview');
              document.getElementById('section-historical-overview')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#b65a3a] text-white shadow-md'
                : 'text-[#4b2f23]/80 hover:bg-[#f5f0e6]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Historical Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('timeline');
              document.getElementById('section-historical-timeline')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-[#b65a3a] text-white shadow-md'
                : 'text-[#4b2f23]/80 hover:bg-[#f5f0e6]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>2. Historical Timeline</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('architecture');
              document.getElementById('section-architecture')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-[#b65a3a] text-white shadow-md'
                : 'text-[#4b2f23]/80 hover:bg-[#f5f0e6]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Architecture</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('gallery');
              document.getElementById('section-photo-gallery')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#b65a3a] text-white shadow-md'
                : 'text-[#4b2f23]/80 hover:bg-[#f5f0e6]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>4. Photo Gallery ({galleryItems.length})</span>
          </button>
        </div>

        {/* FULL WIDTH BALANCED SECTIONS */}
        <div className="space-y-12">

          {/* SECTION 1: HISTORICAL OVERVIEW */}
          <section id="section-historical-overview" className="p-8 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/40 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#aa7b3f]/25">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#b65a3a]/15 text-[#b65a3a]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-widest block">Topic I</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4b2f23]">Historical Overview</h2>
                </div>
              </div>
              
              <VoiceNarrationButton
                text={`Historical Overview of ${monument.name}. ${monument.historicalOverview || monument.history}`}
                language={language}
                ariaLabel="Listen to Historical Overview"
                variant="compact"
              />
            </div>

            {/* 2 Balanced Grid Columns Inside Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Narrative */}
              <div className="lg:col-span-8 space-y-6">
                {/* Cultural Significance Banner */}
                <div className="p-5 rounded-2xl bg-[#f5f0e6] border-l-4 border-[#b65a3a] space-y-2">
                  <div className="text-[11px] font-bold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    Core Cultural Heritage Significance
                  </div>
                  <p className="text-sm sm:text-base text-[#4b2f23] font-subheading italic leading-relaxed">
                    "{monument.culturalSignificance}"
                  </p>
                </div>

                {/* Elaborate History Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm text-[#4b2f23]/90 leading-relaxed">
                  <p className="font-medium text-[#4b2f23]">
                    {monument.historicalOverview || monument.history}
                  </p>
                  <p>
                    {monument.history}
                  </p>
                </div>
              </div>

              {/* Right Column: Royal Patronage & Preservation Matrix */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/25 space-y-3">
                  <div className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#aa7b3f]/20 pb-2">
                    <Crown className="w-4 h-4" />
                    Dynastic & Royal Credentials
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#b65a3a]/70 block">Royal Dynasty</span>
                      <span className="font-bold text-[#4b2f23]">{monument.dynasty}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#b65a3a]/70 block">Patron Ruler</span>
                      <span className="font-bold text-[#4b2f23]">{monument.ruler}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#b65a3a]/70 block">Construction Era</span>
                      <span className="font-bold text-[#4b2f23]">{monument.period}</span>
                    </div>
                  </div>
                </div>

                {/* Preservation Health Bar */}
                <div className="p-5 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/25 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#b65a3a] uppercase">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Preservation Score
                    </span>
                    <span className="text-base font-display font-bold text-[#b65a3a]">
                      {monument.preservationStatus.healthScore}%
                    </span>
                  </div>
                  <div className="w-full bg-[#ede3d1] h-2 rounded-full overflow-hidden border border-[#aa7b3f]/30">
                    <div 
                      className="bg-gradient-to-r from-[#B58A52] to-[#D4A85A] h-full rounded-full" 
                      style={{ width: `${monument.preservationStatus.healthScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#4b2f23]/75 pt-1">
                    <strong className="text-[#b65a3a]">ASI Initiative: </strong>
                    {monument.preservationStatus.currentInitiatives}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: HISTORICAL TIMELINE */}
          <section id="section-historical-timeline" className="p-8 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/40 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#aa7b3f]/25">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#b65a3a]/15 text-[#b65a3a]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-widest block">Topic II</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4b2f23]">Historical Timeline & Chronology</h2>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#f5f0e6] border border-[#aa7b3f]/30 text-[10px] font-bold text-[#b65a3a] uppercase">
                {monument.historicalTimeline?.length || 4} Key Eras
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4b2f23]/80 leading-relaxed">
              Trace the chronological evolution of {monument.name} from its original royal commission to modern UNESCO inscription and 3D digital twin scanning:
            </p>

            {/* Chronological Timeline Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {monument.historicalTimeline?.map((evt, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/25 space-y-3 hover:border-[#b65a3a] transition-all shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-lg bg-[#b65a3a] text-white text-xs font-mono font-bold">
                        {evt.year}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider px-2.5 py-0.5 rounded bg-[#b65a3a]/10">
                        {evt.period}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-[#4b2f23]">
                      {evt.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4b2f23]/80 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#aa7b3f]/15 flex items-center gap-2 text-[10px] text-[#b65a3a] font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#b65a3a]" />
                    <span>Chronological Milestone #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: ARCHITECTURE & ENGINEERING */}
          <section id="section-architecture" className="p-8 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/40 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#aa7b3f]/25">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#b65a3a]/15 text-[#b65a3a]">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-widest block">Topic III</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4b2f23]">Architecture & Construction Technique</h2>
                </div>
              </div>
            </div>

            {/* Architectural Overview */}
            <p className="text-xs sm:text-sm text-[#4b2f23]/90 leading-relaxed">
              {monument.architecturalDetails?.overview || `Designed as a masterwork of ${monument.architectureStyle}, constructed using ${monument.material}.`}
            </p>

            {/* Key Technical Specifications Grid (3 Equal Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/25 space-y-2">
                <div className="flex items-center gap-2 text-[#b65a3a] text-xs font-bold uppercase tracking-wider">
                  <Landmark className="w-4 h-4" />
                  Architectural Style
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#4b2f23]">
                  {monument.architecturalDetails?.style || monument.architectureStyle}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/25 space-y-2">
                <div className="flex items-center gap-2 text-[#b65a3a] text-xs font-bold uppercase tracking-wider">
                  <HardHat className="w-4 h-4" />
                  Construction Material
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#4b2f23]">
                  {monument.architecturalDetails?.materials || monument.material}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/25 space-y-2">
                <div className="flex items-center gap-2 text-[#b65a3a] text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  Engineering & Masonry
                </div>
                <p className="text-xs text-[#4b2f23]/85 leading-relaxed font-medium">
                  {monument.architecturalDetails?.techniques || monument.constructionTechnique || 'Interlocking stone masonry, load-bearing arches, carved motifs, and stress-distributing plinths.'}
                </p>
              </div>
            </div>

            {/* Structural Highlights List */}
            {monument.architecturalDetails?.highlights && monument.architecturalDetails.highlights.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-display font-bold text-sm text-[#4b2f23] uppercase tracking-wider">
                  Structural Highlights & Design Feats
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monument.architecturalDetails.highlights.map((feat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#f5f0e6]/90 border border-[#aa7b3f]/20 flex items-start gap-3 text-xs text-[#4b2f23]/85">
                      <span className="w-2 h-2 rounded-full bg-[#b65a3a] shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 4: PHOTO GALLERY WITH INTERACTIVE LIGHTBOX */}
          <section id="section-photo-gallery" className="p-8 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/40 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#aa7b3f]/25">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#b65a3a]/15 text-[#b65a3a]">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-widest block">Topic IV</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4b2f23]">High-Resolution Photo Gallery</h2>
                </div>
              </div>

              <span className="text-xs font-bold text-[#b65a3a] bg-[#f5f0e6] px-3 py-1 rounded-full border border-[#aa7b3f]/30">
                {galleryItems.length} Photographs
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4b2f23]/80">
              Click on any photo below to open in full-resolution interactive viewer with captions and metadata:
            </p>

            {/* Photo Grid (Balanced 3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className="group relative rounded-2xl overflow-hidden border border-[#aa7b3f]/30 bg-[#f5f0e6] h-64 shadow-md cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <HeritageImage
                    src={img.url}
                    alt={img.title || `${monument.name} Gallery ${i + 1}`}
                    fallbackName={`${monument.name} Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17130F]/90 via-[#17130F]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-white mb-1">
                      <span className="font-bold text-xs truncate">{img.title || monument.name}</span>
                      <Maximize2 className="w-4 h-4 text-[#D4A85A]" />
                    </div>
                    <p className="text-[10px] text-white/80 line-clamp-2">{img.caption}</p>
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                    Photo #{i + 1}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BOTTOM BALANCED GRID: STORIES & 3D LAUNCHER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stories & Oral Legends */}
            {monument.stories && monument.stories.length > 0 && (
              <div className="p-8 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-[#4b2f23] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#b65a3a]" />
                    Oral Legends & Traditional Chronicles
                  </h3>

                  <div className="space-y-3">
                    {monument.stories.map((story, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/20 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-[#b65a3a]/15 text-[#b65a3a]">
                            {story.type.replace('_', ' ')}
                          </span>
                          <h4 className="font-bold text-[#4b2f23] truncate">
                            {story.title}
                          </h4>
                        </div>
                        <p className="text-[#4b2f23]/80 leading-relaxed italic">
                          "{story.narrative}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick 3D Launch Action Widget */}
            {monument.has3DModel && (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#B58A52]/20 to-[#D4A85A]/10 border border-[#aa7b3f] text-center space-y-5 shadow-xl flex flex-col justify-center items-center">
                <Sparkles className="w-10 h-10 text-[#b65a3a]" />
                <div className="space-y-2">
                  <h4 className="font-display text-2xl font-bold text-[#4b2f23]">
                    Explore 3D Digital Twin Model
                  </h4>
                  <p className="text-xs text-[#4b2f23]/80 max-w-md mx-auto leading-relaxed">
                    Inspect high-fidelity sub-millimeter 3D spatial geometry and interactive architectural hotspots in real-time.
                  </p>
                </div>
                <button
                  id="side-explore-3d-btn"
                  onClick={() => onNavigate(`monument/${monument.id}/3d`)}
                  className="px-8 py-4 rounded-2xl bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9a472a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4A85A]/30"
                >
                  <Eye className="w-4 h-4" />
                  <span>Launch 3D Explorer</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* PHOTO GALLERY LIGHTBOX MODAL */}
      {selectedImageIndex !== null && galleryItems[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Header Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white z-10">
            <div>
              <h3 className="font-display font-bold text-base sm:text-xl text-amber-200">
                {galleryItems[selectedImageIndex].title || `${monument.name} Photograph`}
              </h3>
              <p className="text-xs text-white/70">
                Image {selectedImageIndex + 1} of {galleryItems.length}
              </p>
            </div>

            <button
              onClick={() => setSelectedImageIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close viewer (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Area with Navigation Controls */}
          <div
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Nav Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-amber-600 transition-colors cursor-pointer shadow-2xl"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo Image */}
            <div className="relative max-h-[72vh] max-w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-black">
              <HeritageImage
                src={galleryItems[selectedImageIndex].url}
                alt={galleryItems[selectedImageIndex].title || monument.name}
                fallbackName={monument.name}
                className="max-h-[72vh] w-auto object-contain mx-auto"
              />
            </div>

            {/* Right Nav Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-amber-600 transition-colors cursor-pointer shadow-2xl"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Caption Bar */}
          <div
            className="w-full max-w-4xl bg-stone-900/90 border border-amber-500/30 rounded-2xl p-4 text-center text-xs text-white/90 space-y-1.5 z-10 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-subheading text-sm text-amber-100">
              {galleryItems[selectedImageIndex].caption}
            </p>
            <div className="flex items-center justify-center gap-4 text-[10px] text-white/60">
              <span>Source: {galleryItems[selectedImageIndex].source || 'Dharohar Archive'}</span>
              <span>•</span>
              <span>Photographer: {galleryItems[selectedImageIndex].photographer || 'Archaeological Surveyor'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Inline Dharohar AI Chat Overlay Panel */}
      {showDharoharAI && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDharoharAI(false); }}
        >
          <div className="w-full max-w-xl animate-in slide-in-from-bottom duration-300">
            <DharoharAIChat
              context={dharoharAIContext}
              onClose={() => setShowDharoharAI(false)}
              embedded={true}
              language={language}
            />
          </div>
        </div>
      )}

      {/* AI Audio Heritage Guide Modal */}
      {showAIAudioModal && (
        <AIAudioHeritageGuide
          monument={monument as any}
          language={language}
          onClose={() => setShowAIAudioModal(false)}
        />
      )}
    </div>
  );
};
