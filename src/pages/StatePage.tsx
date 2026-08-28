import React, { useState } from 'react';
import { heritageService } from '../services/heritageService';
import { Language, Monument } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  MapPin, 
  ArrowLeft, 
  Compass, 
  Landmark, 
  Calendar, 
  History, 
  ChevronRight,
  Sparkles,
  Box,
  Layers,
  Eye,
  Grid,
  Map
} from 'lucide-react';
import { HeritageImage } from '../components/HeritageImage';

interface StatePageProps {
  stateId: string;
  onNavigate: (route: string) => void;
  language: Language;
}

export const StatePage: React.FC<StatePageProps> = ({ stateId, onNavigate, language }) => {
  const [activeTab, setActiveTab] = useState<'monuments' | 'destinations'>('monuments');
  const state = heritageService.getStateById(stateId, language) || heritageService.getStates(language)[0];
  const monuments = heritageService.getMonumentsByState(state.id, language);
  const t = TRANSLATIONS[language]?.state || TRANSLATIONS.en.state;
  const tNav = TRANSLATIONS[language]?.nav || TRANSLATIONS.en.nav;

  // Native state names for Tamil and Hindi
  const stateNativeNames: Record<string, Record<Language, string>> = {
    'tamil-nadu': { en: 'Tamil Nadu', ta: 'தமிழ்நாடு', hi: 'तमिलनाडु' },
    'karnataka': { en: 'Karnataka', ta: 'கர்நாடகா', hi: 'कर्नाटक' },
    'rajasthan': { en: 'Rajasthan', ta: 'ராஜஸ்தான்', hi: 'राजस्थान' },
    'delhi': { en: 'Delhi', ta: 'டெல்லி', hi: 'दिल्ली' },
    'odisha': { en: 'Odisha', ta: 'ஒடிசா', hi: 'ओडिशा' },
    'maharashtra': { en: 'Maharashtra', ta: 'மகாராஷ்டிரா', hi: 'महाराष्ट्र' },
    'uttar-pradesh': { en: 'Uttar Pradesh', ta: 'உத்தரப் பிரதேசம்', hi: 'उत्तर प्रदेश' },
    'gujarat': { en: 'Gujarat', ta: 'குஜராத்', hi: 'गुजरात' },
    'bihar': { en: 'Bihar', ta: 'பீகார்', hi: 'बिहार' },
    'west-bengal': { en: 'West Bengal', ta: 'மேற்கு வங்கம்', hi: 'पश्चिम बंगाल' }
  };

  const displayName = stateNativeNames[state.id]?.[language] || state.name;

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#b65a3a]">
          <button
            onClick={() => onNavigate('explore')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.backToExplore}
          </button>
          <span className="text-[#4b2f23]/40">/</span>
          <span className="text-[#4b2f23] font-bold">{displayName}</span>
        </div>

        {/* State Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#aa7b3f]/40 bg-[#ede3d1] shadow-2xl">
          <div className="relative h-72 sm:h-96 w-full">
            <HeritageImage
              src={state.heroImage}
              alt={displayName}
              fallbackName={displayName}
              className="w-full h-full object-cover filter brightness-105 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130F]/90 via-[#17130F]/45 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f0e6]/95 border border-[#aa7b3f]/40 text-xs text-[#b65a3a] font-bold shadow-md">
                <Compass className="w-3.5 h-3.5" />
                {t.capital} {state.capital}
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white drop-shadow-lg">
                {displayName}
              </h1>
              <p className="font-subheading text-xl sm:text-2xl text-[#F3EBDD] italic font-semibold drop-shadow-md">
                {state.tagline}
              </p>
            </div>
          </div>

          {/* Overview & Dynastic Matrix */}
          <div className="p-6 sm:p-10 space-y-8 bg-[#f5f0e6]/90">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-display text-xl font-bold text-[#4b2f23]">
                  {t.overviewTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#4b2f23]/80 leading-relaxed">
                  {state.overview}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/30 space-y-3">
                <div className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  {t.keyDynasties}
                </div>
                <ul className="space-y-2 text-xs text-[#4b2f23]/90">
                  {state.dynasties.map((dynasty, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b65a3a]" />
                      <span>{dynasty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Architectural Heritage Highlight */}
            <div className="p-5 rounded-2xl bg-[#ede3d1]/60 border border-[#B58A52]/40 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/30 text-[#b65a3a] shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#4b2f23]">
                  Architectural Idiom
                </h4>
                <p className="text-xs text-[#4b2f23]/80 mt-1 leading-relaxed">
                  {state.architecturalHeritage}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section: View Toggle */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#aa7b3f]/20">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#b65a3a]">
                Heritage Collections
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4b2f23]">
                Explore {state.name}
              </h2>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="inline-flex p-1 bg-[#ede3d1] border border-[#aa7b3f]/40 rounded-xl shadow-inner">
              <button
                onClick={() => setActiveTab('monuments')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'monuments'
                    ? 'bg-[#b65a3a] text-white shadow-md'
                    : 'text-[#4b2f23]/70 hover:text-[#4b2f23]'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Monuments ({monuments.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('destinations')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'destinations'
                    ? 'bg-[#b65a3a] text-white shadow-md'
                    : 'text-[#4b2f23]/70 hover:text-[#4b2f23]'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Destinations ({state.destinations.length})</span>
              </button>
            </div>
          </div>

          {/* Grid Render */}
          {activeTab === 'monuments' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monuments.map((monument) => (
                <div
                  key={monument.id}
                  onClick={() => onNavigate(`monument/${monument.id}`)}
                  className="group rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/30 overflow-hidden cursor-pointer hover:border-[#aa7b3f] transition-all hover:shadow-2xl hover:shadow-[#D4A85A]/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <HeritageImage
                        src={monument.heroImage}
                        alt={monument.name}
                        fallbackName={monument.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17130F]/80 via-transparent to-transparent opacity-90" />
                      
                      {monument.has3DModel && (
                        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#f5f0e6]/90 border border-[#aa7b3f] text-[10px] font-bold text-[#b65a3a] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          3D
                        </div>
                      )}

                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[10px] uppercase font-bold text-[#b65a3a]">
                          {monument.period} • {monument.dynasty}
                        </span>
                        <h3 className="font-display text-xl font-bold text-[#4b2f23] group-hover:text-[#b65a3a] transition-colors truncate">
                          {monument.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-[#4b2f23]/70 line-clamp-2 leading-relaxed">
                        {monument.culturalSignificance}
                      </p>
                      <div className="p-2.5 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/20 text-[11px] text-[#4b2f23]/80 truncate">
                        <span className="font-semibold text-[#b65a3a]">Style: </span>
                        {monument.architectureStyle}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-[#b65a3a]">
                    <span>Explore Monument</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.destinations.map((dest) => (
                <div
                  key={dest.id}
                  id={`destination-card-${dest.id}`}
                  onClick={() => onNavigate(`destination/${dest.id}`)}
                  className="group rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/30 overflow-hidden cursor-pointer hover:border-[#aa7b3f] transition-all hover:shadow-2xl hover:shadow-[#D4A85A]/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <HeritageImage
                        src={dest.heroImage}
                        alt={dest.name}
                        fallbackName={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17130F]/80 via-transparent to-transparent opacity-90" />
                      
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#f5f0e6]/90 border border-[#aa7b3f]/40 text-[10px] font-semibold text-[#b65a3a]">
                          {dest.geographicHighlight}
                        </span>
                        <h3 className="font-display text-xl font-bold text-[#4b2f23] mt-1 group-hover:text-[#b65a3a] transition-colors truncate">
                          {dest.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="font-subheading text-sm italic text-[#b65a3a]">
                        “{dest.tagline}”
                      </p>
                      <p className="text-xs text-[#4b2f23]/70 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-[#b65a3a]">
                    <span>{dest.monumentIds.length} Monuments</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Enter Destination <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
