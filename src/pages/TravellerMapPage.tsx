import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass, Search, HelpCircle, Navigation } from 'lucide-react';
import { Language } from '../types';
import { HeritageMap } from '../components/HeritageMap';
import { heritageService } from '../services/heritageService';

interface TravellerMapPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const TravellerMapPage: React.FC<TravellerMapPageProps> = ({
  onNavigate,
  language
}) => {
  const [selectedMonId, setSelectedMonId] = useState<string | null>(null);

  // Initialize selected monument from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const monId = params.get('monumentId');
    if (monId && heritageService.getMonumentById(monId)) {
      setSelectedMonId(monId);
    } else {
      // Default to Shore Temple if none provided
      setSelectedMonId('shore-temple');
    }
  }, []);

  const handleSelectMonument = (id: string) => {
    setSelectedMonId(id);
  };

  const handleNavigateHere = (id: string) => {
    onNavigate(`traveller/navigate/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#b65a3a]">
          <button
            onClick={() => onNavigate('traveller/nearby')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Nearby Heritage
          </button>
          <span className="text-[#4b2f23]/40">/</span>
          <span className="text-[#4b2f23] font-bold">Spatial Map Explorer</span>
        </div>

        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#aa7b3f]/20">
          <div className="space-y-2">
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Cartographic Navigation
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#4b2f23]">
              Spatial Explorer Map
            </h1>
            <p className="text-xs sm:text-sm text-[#4b2f23]/70 font-subheading italic text-lg text-[#b65a3a]">
              Locate, review, and initiate navigation trails to historical monuments.
            </p>
          </div>
        </div>

        {/* Map Stage Container */}
        <div className="grid grid-cols-1 gap-6">
          <HeritageMap
            selectedMonumentId={selectedMonId}
            onSelectMonument={handleSelectMonument}
            onNavigateHere={handleNavigateHere}
          />
        </div>

        {/* Map Legend/Guide card */}
        <div className="p-5 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/30 flex items-start gap-4 text-xs max-w-2xl">
          <HelpCircle className="w-5 h-5 text-[#b65a3a] shrink-0 mt-0.5" />
          <div className="space-y-1.5 leading-relaxed text-[#4b2f23]/80">
            <h4 className="font-bold text-[#4b2f23]">How to use spatial navigation</h4>
            <p>
              Click any gold heritage pin on the map to select it and review its details, relative distance, and estimated walk time. Clicking <strong>"Navigate Here"</strong> will trigger the navigation tracking screen for arrival detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
