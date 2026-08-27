import React from 'react';
import { heritageService } from '../services/heritageService';
import { Language } from '../types';
import { 
  MapPin, 
  ArrowLeft, 
  ArrowRight, 
  Compass, 
  Landmark, 
  Calendar, 
  History, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { HeritageImage } from '../components/HeritageImage';

interface StatePageProps {
  stateId: string;
  onNavigate: (route: string) => void;
  language: Language;
}

export const StatePage: React.FC<StatePageProps> = ({ stateId, onNavigate }) => {
  const state = heritageService.getStateById(stateId) || heritageService.getStates()[0];

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#D4A85A]">
          <button
            onClick={() => onNavigate('explore')}
            className="hover:underline flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Explore India
          </button>
          <span className="text-[#F3EBDD]/40">/</span>
          <span className="text-[#F3EBDD] font-bold">{state.name}</span>
        </div>

        {/* State Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#D4A85A]/40 bg-[#2B2118] shadow-2xl">
          <div className="relative h-72 sm:h-96 w-full">
            <HeritageImage
              src={state.heroImage}
              alt={state.name}
              fallbackName={state.name}
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130F] via-[#17130F]/60 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17130F]/90 border border-[#D4A85A]/40 text-xs text-[#D4A85A] font-semibold">
                <Compass className="w-3.5 h-3.5" />
                Capital: {state.capital}
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
                {state.name}
              </h1>
              <p className="font-subheading text-xl sm:text-2xl text-[#D4A85A] italic">
                {state.tagline}
              </p>
            </div>
          </div>

          {/* Overview & Dynastic Matrix */}
          <div className="p-6 sm:p-10 space-y-8 bg-[#17130F]/90">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-display text-xl font-bold text-[#F3EBDD]">
                  Historical & Architectural Overview
                </h3>
                <p className="text-xs sm:text-sm text-[#F3EBDD]/80 leading-relaxed">
                  {state.overview}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-3">
                <div className="text-xs font-bold text-[#D4A85A] uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  Key Dynasties
                </div>
                <ul className="space-y-2 text-xs text-[#F3EBDD]/90">
                  {state.dynasties.map((dynasty, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A85A]" />
                      <span>{dynasty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Architectural Heritage Highlight */}
            <div className="p-5 rounded-2xl bg-[#2B2118]/60 border border-[#B58A52]/40 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/30 text-[#D4A85A] shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#F3EBDD]">
                  Architectural Idiom
                </h4>
                <p className="text-xs text-[#F3EBDD]/80 mt-1 leading-relaxed">
                  {state.architecturalHeritage}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Cards Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D4A85A]/20">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4A85A]">
                Key Heritage Cluster
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F3EBDD]">
                Destinations in {state.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.destinations.map((dest) => (
              <div
                key={dest.id}
                id={`destination-card-${dest.id}`}
                onClick={() => onNavigate(`destination/${dest.id}`)}
                className="group rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 overflow-hidden cursor-pointer hover:border-[#D4A85A] transition-all hover:shadow-2xl hover:shadow-[#D4A85A]/20"
              >
                <div className="relative h-56 overflow-hidden">
                  <HeritageImage
                    src={dest.heroImage}
                    alt={dest.name}
                    fallbackName={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#17130F]/90 border border-[#D4A85A]/40 text-[11px] font-semibold text-[#D4A85A]">
                      {dest.geographicHighlight}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#F3EBDD] mt-1 group-hover:text-[#D4A85A] transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="font-subheading text-lg italic text-[#D4A85A]">
                    “{dest.tagline}”
                  </p>
                  <p className="text-xs text-[#F3EBDD]/70 line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-3 border-t border-[#D4A85A]/20 flex items-center justify-between text-xs font-bold text-[#D4A85A]">
                    <span>{dest.monumentIds.length} Iconic Monuments</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Enter Destination <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
