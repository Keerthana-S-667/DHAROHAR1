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
    <footer className="bg-[#17130F] border-t border-[#D4A85A]/30 text-[#F3EBDD] relative overflow-hidden">
      {/* Decorative Golden Ambient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#D4A85A] to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4A85A] p-0.5 shadow-lg flex items-center justify-center">
                <span className="font-display font-black text-lg text-[#17130F]">ध</span>
              </div>
              <span className="font-display text-2xl font-bold tracking-widest text-[#F3EBDD]">
                DHAROHAR
              </span>
            </div>
            
            <p className="font-subheading italic text-lg text-[#D4A85A]">
              {t.tagline}
            </p>

            <p className="text-xs text-[#F3EBDD]/70 leading-relaxed max-w-sm">
              {t.desc}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate('preservation')}
                className="px-3.5 py-1.5 rounded-full bg-[#2B2118] border border-[#D4A85A]/40 text-xs text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.charterBtn}
              </button>
              <button
                onClick={() => onNavigate('3d-explorer')}
                className="px-3.5 py-1.5 rounded-full bg-[#D4A85A]/10 border border-[#D4A85A]/40 text-xs text-[#F3EBDD] hover:border-[#D4A85A] transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A85A]" />
                {t.spatialBtn}
              </button>
            </div>
          </div>

          {/* Regional Heritage Destinations */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#D4A85A] mb-4">
              {t.regionalTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {statesData.map((state) => (
                <li key={state.id}>
                  <button
                    onClick={() => onNavigate(`state/${state.id}`)}
                    className="text-[#F3EBDD]/70 hover:text-[#D4A85A] transition-colors flex items-center justify-between w-full text-left"
                  >
                    <span>{state.name}</span>
                    <span className="text-[10px] text-[#D4A85A]/60 font-subheading italic">{state.nativeName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Experiences */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#D4A85A] mb-4">
              {t.experiencesTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#F3EBDD]/70">
              <li>
                <button onClick={() => onNavigate('3d-explorer')} className="hover:text-[#D4A85A] transition-colors">
                  Shore Temple 3D Spatial Scan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trails')} className="hover:text-[#D4A85A] transition-colors">
                  Pallava Architecture Trail
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-guide')} className="hover:text-[#D4A85A] transition-colors">
                  Sutradhar AI Cultural Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('heritage-map')} className="hover:text-[#D4A85A] transition-colors">
                  Interactive Heritage Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('personalized-trail')} className="hover:text-[#D4A85A] transition-colors">
                  Personalized Route Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Stewardship */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#D4A85A] mb-4">
              {t.stewardshipTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#F3EBDD]/70">
              <li>
                <button onClick={() => onNavigate('preservation')} className="hover:text-[#D4A85A] transition-colors">
                  Responsible Visitor Code
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('preservation')} className="hover:text-[#D4A85A] transition-colors">
                  Sub-millimeter LiDAR Twins
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#D4A85A] transition-colors">
                  The DHAROHAR Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#D4A85A] transition-colors">
                  Epigraphy & Research
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-[#D4A85A]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F3EBDD]/50">
          <p>
            {t.copyright}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              {t.reverence}
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#2B2118] border border-[#D4A85A]/30 text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-colors"
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

