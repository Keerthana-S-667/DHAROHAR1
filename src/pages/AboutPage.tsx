import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Sparkles, 
  Landmark, 
  Layers, 
  Compass, 
  ShieldCheck, 
  Globe2, 
  Bot, 
  Eye, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language].about;

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/50 text-xs text-[#b65a3a] font-semibold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Platform Manifesto</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#4b2f23]">
            About DHAROHAR
          </h1>

          <p className="font-subheading text-xl sm:text-2xl text-[#b65a3a] italic">
            “Explore the past. Experience it in 3D. Preserve it for the future.”
          </p>
        </div>

        {/* Mission Manifesto Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 shadow-2xl space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4b2f23]">
            {t.missionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#4b2f23]/90 leading-relaxed font-subheading italic text-lg text-[#b65a3a]">
            {t.missionText}
          </p>
          <p className="text-xs sm:text-sm text-[#4b2f23]/80 leading-relaxed">
            India is home to thousands of monolithic rock-cut shrines, structural vimanas, stepwells, and fortified palaces created over three millennia. Yet traditional tourism often flattens these masterworks into casual photo ops. DHAROHAR synthesizes architectural archaeology, sub-millimeter 3D scanning, epigraphical knowledge graphs, and conservation stewardship into one singular digital sanctuary.
          </p>
        </div>

        {/* 4 Architectural Pillars Grid */}
        <div className="space-y-4">
          <h3 className="font-display text-2xl font-bold text-[#4b2f23]">
            Core Technological Innovations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#b65a3a] font-bold text-sm">
                <Eye className="w-4 h-4" />
                <span>Real-Time 3D Spatial Geometry</span>
              </div>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Native WebGL rendering of complex Dravidian vimanas with dynamic solar angle simulations and architectural hotspot telemetry.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#b65a3a] font-bold text-sm">
                <Bot className="w-4 h-4" />
                <span>Dharohar AI: Cultural AI Guide</span>
              </div>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Scholarly, contextual, non-hallucinatory curation trained on dynastic epigraphy, Sanskrit shilpa shastras, and ASI conservation reports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#b65a3a] font-bold text-sm">
                <Compass className="w-4 h-4" />
                <span>Personalized Chrono-Trails</span>
              </div>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Algorithmic field routing that adapts to visitor dwell times, photography goals, and architectural interests.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#b65a3a] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Conservation Charter & Stewardship</span>
              </div>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Educating visitors on environmental salt weathering, chemical desalination, and crowd impact to protect heritage forever.
              </p>
            </div>
          </div>
        </div>

        {/* Hackathon Call to Action */}
        <div className="p-8 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f] text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-[#4b2f23]">
            Experience the Complete Digital Museum
          </h3>
          <p className="text-xs text-[#4b2f23]/70 max-w-xl mx-auto">
            Ready to explore India's sacred monuments in full 3D?
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 rounded-full bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#f5f0e6] transition-colors flex items-center gap-1.5 shadow"
            >
              <span>Explore All 5 States</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('3d-explorer')}
              className="px-6 py-3 rounded-full bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] font-semibold text-xs uppercase tracking-wider hover:bg-[#ede3d1]"
            >
              <span>Launch 3D Viewer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
