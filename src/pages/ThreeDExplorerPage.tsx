import React, { useState } from 'react';
import { ThreeDViewer } from '../components/3d/ThreeDViewer';
import { ShoreTempleViewer } from '../components/3d/ShoreTempleViewer';
import { heritageService } from '../services/heritageService';
import { Hotspot, MonumentHotspot, Language, Monument } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Sparkles, 
  Layers, 
  Bot, 
  Navigation, 
  MapPin, 
  ArrowRight,
  ChevronDown,
  Box,
  Globe,
  ExternalLink,
  ShieldCheck,
  Volume2,
  Calendar,
  Crown,
  BookOpen
} from 'lucide-react';

interface ThreeDExplorerPageProps {
  onNavigate: (route: string) => void;
  language: Language;
  monumentId?: string;
}

export const ThreeDExplorerPage: React.FC<ThreeDExplorerPageProps> = ({
  onNavigate,
  language,
  monumentId
}) => {
  const monumentsMap = heritageService.getMonuments();
  const monumentsList = Object.values(monumentsMap);

  // Default to monumentId prop if provided, else 'taj-mahal'
  const [selectedMonumentId, setSelectedMonumentId] = useState<string>(monumentId || 'taj-mahal');
  const [viewMode, setViewMode] = useState<'sketchfab' | 'webgl'>('sketchfab');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  // Sync selected monument when prop changes (from route navigation)
  React.useEffect(() => {
    if (monumentId && monumentsMap[monumentId]) {
      setSelectedMonumentId(monumentId);
      setSelectedHotspotId(null); // Reset hotspots on change
    }
  }, [monumentId, monumentsMap]);

  const selectedMonument: Monument = monumentsMap[selectedMonumentId] || monumentsList[0];
  const t = TRANSLATIONS[language].threeD;

  const hotspotsList: MonumentHotspot[] = (selectedMonument.hotspots as MonumentHotspot[]) || [];
  const activeHotspot = hotspotsList.find(h => h.id === selectedHotspotId) || null;

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#aa7b3f]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/40 text-xs text-[#b65a3a] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Sub-Millimeter 3D Architectural Digital Twin Explorer
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#4b2f23]">
              3D Monument Viewer & Spatial Explorer
            </h1>
            <p className="text-xs sm:text-sm text-[#4b2f23]/80 font-subheading italic text-lg text-[#b65a3a] mt-1">
              Select any of India’s 25 iconic heritage monuments to orbit and inspect its 3D model
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(`monument/${selectedMonument.id}`)}
              className="px-4 py-2 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/30 text-xs text-[#4b2f23] hover:border-[#aa7b3f] transition-colors"
            >
              View Historical Chronicle
            </button>
            <button
              onClick={() => onNavigate('ai-guide')}
              className="px-4 py-2 rounded-full bg-[#b65a3a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9a472a] transition-colors flex items-center gap-1.5 shadow-md shadow-[#D4A85A]/20 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              Ask AI Guide
            </button>
          </div>
        </div>

        {/* 25 Monument Selection Controls */}
        <div className="space-y-3 p-5 rounded-2xl bg-[#ede3d1]/80 border border-[#aa7b3f]/30 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#aa7b3f]/20">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-[#b65a3a]" />
              <span className="font-bold text-sm text-[#4b2f23]">Select Monument (25 Available):</span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#f5f0e6] p-1 rounded-xl border border-[#aa7b3f]/30 text-xs">
              <button
                onClick={() => setViewMode('sketchfab')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'sketchfab'
                    ? 'bg-[#b65a3a] text-white shadow-sm'
                    : 'text-[#4b2f23]/70 hover:text-[#4b2f23]'
                }`}
              >
                Live 3D Model
              </button>
              {selectedMonument.id === 'shore-temple' && (
                <button
                  onClick={() => setViewMode('webgl')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    viewMode === 'webgl'
                      ? 'bg-[#b65a3a] text-white shadow-sm'
                      : 'text-[#4b2f23]/70 hover:text-[#4b2f23]'
                  }`}
                >
                  Procedural WebGL Twin
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Horizontal Scroll Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#D4A85A]/40">
            {monumentsList.map((m) => {
              const isSelected = m.id === selectedMonument.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMonumentId(m.id);
                    setSelectedHotspotId(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#b65a3a] text-white border-[#aa7b3f] font-bold shadow-md shadow-[#D4A85A]/20 scale-105'
                      : 'bg-[#f5f0e6] text-[#4b2f23]/80 border-[#aa7b3f]/30 hover:border-[#aa7b3f] hover:bg-[#ede3d1]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${m.sketchfabId ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Currently Active Monument Banner & 3D Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 3D Stage Viewer */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[#4b2f23]">
                  {selectedMonument.name} <span className="text-xs text-[#b65a3a] font-subheading">({selectedMonument.nativeName})</span>
                </h2>
              </div>
              <p className="text-xs text-[#b65a3a] font-subheading italic">
                {selectedMonument.location.city}, {selectedMonument.location.state} • {selectedMonument.period} ({selectedMonument.dynasty})
              </p>
            </div>

            {/* Interactive 3D Viewer Container */}
            <div className="w-full">
              {viewMode === 'webgl' && selectedMonument.id === 'shore-temple' ? (
                <ShoreTempleViewer
                  onSelectHotspot={(hotspot) => setSelectedHotspotId(hotspot.id)}
                  activeHotspotId={selectedHotspotId}
                />
              ) : (
                <ThreeDViewer
                  modelUrl={selectedMonument.threeDModelUrl}
                  sketchfabId={selectedMonument.sketchfabId}
                  sketchfabUrl={selectedMonument.sketchfabUrl}
                  monumentId={selectedMonument.id}
                  hotspots={hotspotsList}
                  selectedHotspotId={selectedHotspotId}
                  onSelectHotspot={(hotspot) => setSelectedHotspotId(hotspot.id)}
                />
              )}
            </div>

            {/* Instruction Tip */}
            <div className="p-4 rounded-2xl bg-[#ede3d1]/60 border border-[#aa7b3f]/30 flex items-start gap-3">
              <Box className="w-5 h-5 text-[#b65a3a] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-[#4b2f23]">Interactive 3D Controls</h4>
                <p className="text-[#4b2f23]/70 leading-relaxed">
                  Left-click and drag inside the 3D window to orbit 360°. Scroll to zoom in on structural reliefs, arches, and carvings.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Info & Details Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 shadow-2xl space-y-5">
              <div className="pb-4 border-b border-[#aa7b3f]/20 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider block">
                  Monument Overview
                </span>
                <h3 className="font-display text-xl font-bold text-[#4b2f23]">
                  {selectedMonument.tagline}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#aa7b3f]/10">
                  <span className="text-[#4b2f23]/60 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#b65a3a]" /> Period:
                  </span>
                  <span className="font-semibold text-[#4b2f23]">{selectedMonument.period}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#aa7b3f]/10">
                  <span className="text-[#4b2f23]/60 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#b65a3a]" /> Dynasty / Ruler:
                  </span>
                  <span className="font-semibold text-[#4b2f23]">{selectedMonument.dynasty}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#aa7b3f]/10">
                  <span className="text-[#4b2f23]/60 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#b65a3a]" /> Architecture Style:
                  </span>
                  <span className="font-semibold text-[#4b2f23] text-right max-w-[180px]">{selectedMonument.architectureStyle}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#aa7b3f]/10">
                  <span className="text-[#4b2f23]/60 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#b65a3a]" /> UNESCO Status:
                  </span>
                  <span className="font-semibold text-emerald-400">
                    {selectedMonument.unescoYear ? `Inscribed ${selectedMonument.unescoYear}` : 'Protected Site'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider">Cultural Significance</h4>
                <p className="text-xs text-[#4b2f23]/80 leading-relaxed bg-[#f5f0e6] p-3 rounded-xl border border-[#aa7b3f]/20">
                  {selectedMonument.culturalSignificance}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate(`monument/${selectedMonument.id}`)}
                  className="w-full py-3 rounded-xl bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9a472a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4A85A]/20 cursor-pointer"
                >
                  <span>Explore Full History & Audio Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Demo Next Steps Journey Carousel */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#2B2118] via-[#17130F] to-[#2B2118] border border-[#aa7b3f]/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#b65a3a]">
                Digital Heritage Exploration
              </div>
              <h3 className="font-display text-2xl font-bold text-[#4b2f23] mt-1">
                Continue the Heritage Experience
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-next-to-ai-guide"
                onClick={() => onNavigate('ai-guide')}
                className="px-5 py-2.5 rounded-full bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9a472a] transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Guide</span>
              </button>

              <button
                id="btn-next-to-trails"
                onClick={() => onNavigate('trails')}
                className="px-5 py-2.5 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/40 text-[#4b2f23] text-xs font-semibold uppercase tracking-wider hover:border-[#aa7b3f] transition-colors flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4 text-[#b65a3a]" />
                <span>Heritage Trails</span>
              </button>

              <button
                id="btn-next-to-map"
                onClick={() => onNavigate('heritage-map')}
                className="px-5 py-2.5 rounded-full bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] text-xs font-semibold uppercase tracking-wider hover:bg-[#ede3d1] transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                <span>Interactive Map</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
