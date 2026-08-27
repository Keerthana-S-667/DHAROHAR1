import React from 'react';
import { heritageService } from '../services/heritageService';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, MapPin, ArrowRight, Layers, Landmark, History, ChevronRight } from 'lucide-react';
import { HeritageImage } from '../components/HeritageImage';

interface ExplorePageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language].explore;
  const statesData = heritageService.getStates();


  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2B2118] border border-[#D4A85A]/40 text-xs text-[#D4A85A] font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Pan-Indian Architectural Regions
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD] tracking-tight">
            India's Heritage Destinations
          </h1>
          <p className="text-sm sm:text-base text-[#F3EBDD]/80 leading-relaxed font-subheading italic text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* 7 Premium State Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statesData.map((state) => {
            const monumentCount = state.destinations.reduce((acc, dest) => acc + dest.monumentIds.length, 0);
            return (
              <div
                key={state.id}
                id={`state-card-${state.id}`}
                onClick={() => onNavigate(`state/${state.id}`)}
                className="group relative rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 overflow-hidden cursor-pointer hover:border-[#D4A85A] transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4A85A]/20 flex flex-col"
              >
                {/* Image Showcase */}
                <div className="relative h-60 overflow-hidden">
                  <HeritageImage
                    src={state.heroImage}
                    alt={state.name}
                    fallbackName={state.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118] via-[#2B2118]/44 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#17130F]/90 backdrop-blur-md border border-[#D4A85A]/40 text-xs font-bold text-[#D4A85A]">
                      {state.capital}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="text-xs text-[#F3EBDD]/90 bg-[#17130F]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#D4A85A]/20">
                      {monumentCount} {monumentCount === 1 ? 'Monument' : 'Monuments'}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-display text-2xl font-bold text-[#F3EBDD] group-hover:text-[#D4A85A] transition-colors">
                        {state.name}
                      </h2>
                      <span className="font-subheading text-base italic text-[#D4A85A]/80">
                        {state.nativeName}
                      </span>
                    </div>

                    <p className="text-xs text-[#F3EBDD]/70 line-clamp-2 leading-relaxed">
                      {state.tagline}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[#D4A85A] font-semibold">
                        <History className="w-3.5 h-3.5" />
                        <span>Dynastic Lineage:</span>
                      </div>
                      <p className="text-[11px] text-[#F3EBDD]/80 truncate">
                        {state.dynasties.join(' • ')}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[#B58A52] font-semibold">
                        <Landmark className="w-3.5 h-3.5" />
                        <span>Architectural Style:</span>
                      </div>
                      <p className="text-[11px] text-[#F3EBDD]/80 line-clamp-2">
                        {state.architecturalHeritage}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-[#D4A85A]/20 flex items-center justify-between text-xs font-bold text-[#D4A85A] group-hover:text-[#F3EBDD] transition-colors">
                    <span>{t.viewState}</span>
                    <div className="w-7 h-7 rounded-full bg-[#17130F] flex items-center justify-center group-hover:bg-[#D4A85A] group-hover:text-[#17130F] transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
