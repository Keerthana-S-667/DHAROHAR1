import React from 'react';
import { Compass, ShieldCheck, Sparkles, Navigation, Heart, ArrowUp } from 'lucide-react';
import { heritageService } from '../services/heritageService';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statesData = heritageService.getStates();
  const t = TRANSLATIONS[language].footer;

  return (
    <footer className="bg-[#211A16] border-t border-[#aa7b3f]/25 text-[#f5f0e6] relative overflow-hidden">
      {/* Decorative Golden Ambient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#aa7b3f] to-transparent opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="brand-wordmark !text-[#f5f0e6] !text-2xl select-none pt-1">
                dharohar
              </span>
            </div>
            
            <p className="font-subheading italic text-lg text-[#aa7b3f]">
              {t.tagline}
            </p>

            <p className="text-xs text-[#f5f0e6]/75 leading-relaxed max-w-sm font-body">
              {t.desc}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate('preservation')}
                className="px-4 py-2 rounded-full bg-[#f5f0e6]/10 border border-[#aa7b3f]/30 text-xs text-[#aa7b3f] hover:bg-[#b65a3a] hover:text-white hover:border-[#b65a3a] transition-all cursor-pointer flex items-center gap-1.5 font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.charterBtn}
              </button>
              <button
                onClick={() => onNavigate('3d-explorer')}
                className="px-4 py-2 rounded-full bg-[#f5f0e6]/10 border border-[#aa7b3f]/30 text-xs text-[#f5f0e6] hover:border-[#aa7b3f] transition-all cursor-pointer flex items-center gap-1.5 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#aa7b3f]" />
                {t.spatialBtn}
              </button>
            </div>
          </div>

          {/* Regional Heritage Destinations */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#aa7b3f] mb-4">
              {t.regionalTitle}
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {statesData.map((state) => (
                <li key={state.id}>
                  <button
                    onClick={() => onNavigate(`state/${state.id}`)}
                    className="text-[#f5f0e6]/70 hover:text-[#aa7b3f] transition-colors flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <span>{state.name}</span>
                    <span className="text-[10px] text-[#aa7b3f]/70 font-subheading italic font-normal">{state.nativeName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Experiences */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#aa7b3f] mb-4">
              {t.experiencesTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#f5f0e6]/70 font-semibold">
              <li>
                <button onClick={() => onNavigate('3d-explorer')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  Shore Temple 3D Spatial Scan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trails')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  Pallava Architecture Trail
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-guide')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  Dharohar AI Cultural Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('heritage-map')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  Interactive Heritage Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('personalized-trail')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  Personalized Route Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Stewardship */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#aa7b3f] mb-4">
              {t.stewardshipTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#f5f0e6]/70 font-semibold">
              <li>
                <button onClick={() => onNavigate('preservation')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  Responsible Visitor Code
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('preservation')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  Sub-millimeter LiDAR Twins
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  The DHAROHAR Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#aa7b3f] transition-colors cursor-pointer text-left">
                  Epigraphy & Research
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-[#f5f0e6]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#f5f0e6]/50 font-semibold">
          <p>
            {t.copyright}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 uppercase tracking-widest text-[9px] text-[#aa7b3f]">
              {t.reverence}
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#f5f0e6]/10 border border-[#aa7b3f]/30 text-[#aa7b3f] hover:bg-[#b65a3a] hover:text-white hover:border-[#b65a3a] transition-all cursor-pointer animate-pulse"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
