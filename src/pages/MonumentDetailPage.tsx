import React, { useState, useMemo, useEffect } from 'react';
import { heritageService } from '../services/heritageService';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HeritageImage } from '../components/HeritageImage';
import { SutradharChat } from '../components/SutradharChat';
import { VoiceNarrationButton } from '../components/VoiceNarrationButton';
import { aiService } from '../services/aiService';
import { voiceService } from '../services/voiceService';
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
  X
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
  const monument = heritageService.getMonumentById(monumentId) || heritageService.getMonumentById('shore-temple')!;
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSutradhar, setShowSutradhar] = useState(false);
  const t = TRANSLATIONS[language].monument;

  const sutradharContext = useMemo(() => aiService.buildContext(monument as any, {
    researchMode: 'traveller'
  }), [monument]);

  // Build narration text from monument data for voice guide
  const narrationText = useMemo(() => [
    `Welcome to ${monument.name}.`,
    `Located in ${monument.location.city}, ${monument.location.state}.`,
    `Historical period: ${monument.period}.`,
    monument.dynasty ? `Built under the ${monument.dynasty} dynasty, patronised by ${monument.ruler}.` : '',
    monument.culturalSignificance,
    monument.history.slice(0, 600),
    monument.stories[0] ? `${monument.stories[0].title}: ${monument.stories[0].narrative.slice(0, 300)}` : ''
  ].filter(Boolean).join(' '), [monument]);

  // Stop narration when language changes
  useEffect(() => {
    voiceService.stop();
  }, [language]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 text-xs text-[#D4A85A]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(`destination/${monument.destinationId}`)}
              className="hover:underline flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {monument.location.city}
            </button>
            <span className="text-[#F3EBDD]/40">/</span>
            <span className="text-[#F3EBDD] font-bold">{monument.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B2118] border border-[#D4A85A]/30 text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-all text-xs"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Monument'}</span>
          </button>
        </div>

        {/* Hero Showcase with Prominent "Explore in 3D" Button */}
        <div className="relative rounded-3xl overflow-hidden border border-[#D4A85A]/50 bg-[#2B2118] shadow-2xl">
          <div className="relative h-96 sm:h-[480px] w-full">
            <HeritageImage
              src={monument.heroImage}
              alt={monument.name}
              fallbackName={monument.name}
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130F] via-[#17130F]/60 to-transparent" />
            
            {/* Top Badges */}
            <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#17130F]/90 backdrop-blur-md border border-[#D4A85A] text-xs font-bold text-[#D4A85A]">
                {monument.dynasty}
              </span>
              {monument.unescoYear && (
                <span className="px-3 py-1 rounded-full bg-[#17130F]/90 backdrop-blur-md border border-[#B58A52]/40 text-xs font-semibold text-[#F3EBDD]">
                  UNESCO World Heritage ({monument.unescoYear})
                </span>
              )}
            </div>

            {/* Bottom Details & Hero Title */}
            <div className="absolute bottom-8 left-6 sm:left-10 right-6 space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#D4A85A]">
                  {monument.location.city}, {monument.location.state} • {monument.period}
                </div>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#F3EBDD] mt-1">
                  {monument.name}
                </h1>
                <p className="font-subheading text-2xl sm:text-3xl text-[#D4A85A] italic mt-1">
                  “{monument.tagline}”
                </p>
              </div>

              {/* Action Triggers */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  id="monument-start-journey-btn"
                  onClick={() => onNavigate(`traveller/navigation/${monument.id}`)}
                  className="px-8 py-4 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-sm uppercase tracking-wider hover:bg-[#F3EBDD] transition-all flex items-center gap-2.5 shadow-2xl shadow-[#D4A85A]/40 group cursor-pointer"
                >
                  <Navigation className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  <span>START JOURNEY TO {monument.name.toUpperCase()}</span>
                </button>

                {monument.has3DModel && (
                  <button
                    id="monument-hero-explore-3d-btn"
                    onClick={() => onNavigate(`monument/${monument.id}/3d`)}
                    className="px-6 py-4 rounded-full bg-[#2B2118] border border-[#D4A85A]/40 text-[#D4A85A] font-semibold text-xs uppercase tracking-wider hover:bg-[#D4A85A] hover:text-[#17130F] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{t.explore3DBtn}</span>
                  </button>
                )}

                <button
                  id="monument-open-research-btn"
                  onClick={() => onNavigate(`research/monument/${monument.id}`)}
                  className="px-6 py-4 rounded-full bg-[#17130F]/90 backdrop-blur-md border border-[#D4A85A]/60 text-[#D4A85A] font-semibold text-xs uppercase tracking-wider hover:bg-[#2B2118] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#D4A85A]" />
                  <span>OPEN RESEARCH VIEW</span>
                </button>

                <button
                  id="monument-ask-sutradhar-btn"
                  onClick={() => setShowSutradhar(true)}
                  className="px-6 py-4 rounded-full bg-gradient-to-r from-[#D4A85A] to-amber-600 text-[#17130F] font-bold text-xs uppercase tracking-wider hover:from-[#F3EBDD] hover:to-[#D4A85A] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4A85A]/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask Sutradhar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Facts Architectural Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#17130F] border-t border-[#D4A85A]/30">
            <div className="p-3.5 rounded-xl bg-[#2B2118]/60 border border-[#D4A85A]/20">
              <div className="text-[10px] uppercase font-bold text-[#D4A85A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {t.period}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#F3EBDD] mt-1">{monument.period}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#2B2118]/60 border border-[#D4A85A]/20">
              <div className="text-[10px] uppercase font-bold text-[#D4A85A] flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                {t.ruler}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#F3EBDD] mt-1">{monument.ruler}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#2B2118]/60 border border-[#D4A85A]/20">
              <div className="text-[10px] uppercase font-bold text-[#D4A85A] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                {t.style}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#F3EBDD] mt-1 truncate">{monument.architectureStyle}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#2B2118]/60 border border-[#D4A85A]/20">
              <div className="text-[10px] uppercase font-bold text-[#D4A85A] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Coordinates
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#F3EBDD] mt-1 truncate">{monument.location.coordinates}</div>
            </div>
          </div>
        </div>

        {/* Audio Guide Player Bar — Real Voice Narration */}
        <div className="p-6 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4A85A]/20 border border-[#D4A85A]/50 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-[#D4A85A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#D4A85A] uppercase tracking-wider">
                {t.audioGuideTitle} ({monument.audioGuide.duration})
              </div>
              <p className="text-xs text-[#F3EBDD]/70 mt-0.5">
                Narrated by {monument.audioGuide.narrator}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-xs text-[#F3EBDD]/80 bg-[#17130F] px-4 py-2.5 rounded-xl border border-[#D4A85A]/20 max-w-sm italic font-subheading">
              "{monument.audioGuide.transcript.slice(0, 120)}..."
            </div>
            <VoiceNarrationButton
              text={narrationText}
              language={language}
              ariaLabel={`Listen to the heritage story of ${monument.name}`}
              variant="full"
            />
          </div>
        </div>

        {/* In-depth Chronicle and Cultural Significance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Cultural Significance */}
            <div className="p-8 rounded-3xl bg-[#2B2118]/70 border border-[#D4A85A]/30 space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#F3EBDD] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#D4A85A]" />
                {t.significance}
              </h2>
              <p className="text-sm text-[#F3EBDD]/90 leading-relaxed font-subheading italic text-lg text-[#D4A85A]">
                {monument.culturalSignificance}
              </p>
            </div>

            {/* History */}
            <div className="p-8 rounded-3xl bg-[#2B2118]/70 border border-[#D4A85A]/30 space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#F3EBDD] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4A85A]" />
                {t.historyTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#F3EBDD]/80 leading-relaxed">
                {monument.history}
              </p>
            </div>

            {/* Stories and Revelations */}
            <div className="p-8 rounded-3xl bg-[#2B2118]/70 border border-[#D4A85A]/30 space-y-6">
              <h2 className="font-display text-2xl font-bold text-[#F3EBDD] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4A85A]" />
                {t.storiesTitle}
              </h2>

              <div className="space-y-4">
                {monument.stories.map((story, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#17130F] border border-[#D4A85A]/20 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#D4A85A]/20 text-[#D4A85A]">
                        {story.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-display text-base font-bold text-[#F3EBDD]">
                        {story.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#F3EBDD]/80 leading-relaxed">
                      {story.narrative}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monument Image Gallery */}
            {monument.imageGallery && monument.imageGallery.length > 0 && (
              <div className="p-8 rounded-3xl bg-[#2B2118]/70 border border-[#D4A85A]/30 space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#F3EBDD] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4A85A]" />
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monument.imageGallery.map((img, i) => (
                    <div key={i} className="group relative rounded-2xl overflow-hidden border border-[#D4A85A]/30 bg-[#17130F] h-60 shadow-lg">
                      <HeritageImage
                        src={img.url}
                        alt={`${monument.name} Gallery ${i + 1}`}
                        fallbackName={`${monument.name} Gallery ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17130F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Preservation Health Status & Guidelines */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4A85A]/20">
                <div className="text-xs font-bold text-[#D4A85A] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Preservation Health
                </div>
                <div className="text-xl font-display font-bold text-[#D4A85A]">
                  {monument.preservationStatus.healthScore}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#17130F] h-2.5 rounded-full overflow-hidden border border-[#D4A85A]/30">
                <div 
                  className="bg-gradient-to-r from-[#B58A52] to-[#D4A85A] h-full rounded-full" 
                  style={{ width: `${monument.preservationStatus.healthScore}%` }}
                />
              </div>

              {/* Threats */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-[#D4A85A] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Environmental Pressures
                </div>
                <ul className="space-y-1 text-[11px] text-[#F3EBDD]/70">
                  {monument.preservationStatus.threats.map((threat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-400" />
                      <span>{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Current Initiative */}
              <div className="p-3.5 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 text-xs space-y-1">
                <div className="text-[10px] font-bold text-[#D4A85A] uppercase">Active ASI Initiative</div>
                <p className="text-[11px] text-[#F3EBDD]/80">
                  {monument.preservationStatus.currentInitiatives}
                </p>
              </div>

              {/* Digital Scan Record */}
              <div className="p-3.5 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 text-xs space-y-1">
                <div className="text-[10px] font-bold text-[#D4A85A] uppercase">LiDAR 3D Status</div>
                <p className="text-[11px] text-emerald-400 font-medium">
                  {monument.preservationStatus.digitalScanStatus}
                </p>
              </div>

              {/* Visitor Guidelines */}
              <div className="space-y-2 pt-2 border-t border-[#D4A85A]/20 text-xs">
                <div className="font-semibold text-[#F3EBDD]">Responsible Visitor Code</div>
                <ul className="space-y-1 text-[11px] text-[#F3EBDD]/70">
                  {monument.preservationStatus.visitorGuidelines.map((guide, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#D4A85A] font-bold">•</span>
                      <span>{guide}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick 3D Launch Action Widget */}
            {monument.has3DModel && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#B58A52]/20 to-[#D4A85A]/10 border border-[#D4A85A] text-center space-y-4">
                <Sparkles className="w-8 h-8 text-[#D4A85A] mx-auto" />
                <div>
                  <h4 className="font-display text-lg font-bold text-[#F3EBDD]">
                    Experience in 3D Spatial Canvas
                  </h4>
                  <p className="text-xs text-[#F3EBDD]/70 mt-1">
                    Examine the Dravidian vimana pyramid, Nandi bull enclosure, and sacred sanctum.
                  </p>
                </div>
                <button
                  id="side-explore-3d-btn"
                  onClick={() => onNavigate('3d-explorer')}
                  className="w-full py-3 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Launch 3D Explorer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline Sutradhar Chat Overlay Panel */}
      {showSutradhar && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSutradhar(false); }}
        >
          <div className="w-full max-w-xl animate-in slide-in-from-bottom duration-300">
            <SutradharChat
              context={sutradharContext}
              onClose={() => setShowSutradhar(false)}
              embedded={true}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};
