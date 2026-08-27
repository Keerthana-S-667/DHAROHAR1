import React, { useState } from 'react';
import { heritageService } from '../services/heritageService';
import { Language } from '../types';
import { HeritageMap } from '../components/HeritageMap';
import { 
  MapPin, 
  Compass, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  Search,
  Eye
} from 'lucide-react';

interface HeritageMapPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const HeritageMapPage: React.FC<HeritageMapPageProps> = ({
  onNavigate,
  language
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('tamil-nadu');
  const [activePin, setActivePin] = useState<string>('shore-temple');
  const [searchQuery, setSearchQuery] = useState('');

  const monuments = heritageService.getMonuments();
  const selectedMonument = monuments[activePin] || monuments['shore-temple'];

  const regions = [
    { id: 'tamil-nadu', name: 'Tamil Nadu (Mahabalipuram)', coords: '12.6163° N, 80.1994° E' },
    { id: 'karnataka', name: 'Karnataka (Hampi)', coords: '15.3350° N, 76.4600° E' },
    { id: 'rajasthan', name: 'Rajasthan (Jaipur)', coords: '26.9239° N, 75.8267° E' },
    { id: 'delhi', name: 'Delhi NCR', coords: '28.5933° N, 77.2507° E' },
    { id: 'odisha', name: 'Odisha (Konark)', coords: '19.8876° N, 86.0945° E' }
  ];

  // Filter monuments from existing database
  const allMonumentsList = Object.values(monuments);
  const filteredMonuments = allMonumentsList.filter((mon) =>
    mon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mon.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mon.location.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D4A85A]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B2118] border border-[#D4A85A]/40 text-xs text-[#D4A85A] font-semibold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              Pan-India Spatial Cartography
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
              Interactive Heritage Map
            </h1>
            <p className="text-xs sm:text-sm text-[#F3EBDD]/80 font-subheading italic text-lg text-[#D4A85A] mt-1">
              Locate, examine, and plan routing to historical monuments across India.
            </p>
          </div>
        </div>

        {/* Map Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Monument Search & List (lg:col-span-3) */}
          <div className="lg:col-span-3 p-5 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 shadow-2xl space-y-4 max-h-[580px] flex flex-col">
            <div>
              <h3 className="text-xs font-bold text-[#D4A85A] uppercase tracking-wider">Heritage Sites</h3>
              <p className="text-[10px] text-[#F3EBDD]/60 mt-0.5">Select a monument to focus the map</p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search monuments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#17130F] border border-[#D4A85A]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/35 focus:outline-none focus:border-[#D4A85A] transition-all"
              />
              <Search className="w-4 h-4 text-[#D4A85A]/50 absolute left-3 top-2.5" />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-[#D4A85A]/20">
              {filteredMonuments.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#F3EBDD]/40">No monuments match search.</div>
              ) : (
                filteredMonuments.map((mon) => {
                  const isSelected = activePin === mon.id;
                  return (
                    <button
                      key={mon.id}
                      onClick={() => {
                        setActivePin(mon.id);
                        setActiveRegion(mon.stateId);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-md'
                          : 'bg-[#17130F]/45 text-[#F3EBDD]/80 border-[#D4A85A]/15 hover:border-[#D4A85A]/55 hover:bg-[#17130F]/80'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-[#17130F]' : 'text-[#D4A85A]'}`} />
                      <div className="truncate">
                        <div className="font-semibold truncate">{mon.name}</div>
                        <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-[#17130F]/70' : 'text-[#F3EBDD]/50'}`}>
                          {mon.location.city}, {mon.location.state}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Map Stage: (lg:col-span-6) */}
          <div className="lg:col-span-6 relative rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 overflow-hidden shadow-2xl min-h-[580px] flex flex-col justify-between p-6 space-y-4">
            
            {/* Top Region Navigation Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#D4A85A]/20">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  id={`map-reg-btn-${reg.id}`}
                  onClick={() => {
                    setActiveRegion(reg.id);
                    const mon = Object.values(monuments).find((m) => m.stateId === reg.id);
                    if (mon) setActivePin(mon.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                    activeRegion === reg.id
                      ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-md'
                      : 'bg-[#17130F] text-[#F3EBDD]/80 border-[#D4A85A]/20 hover:border-[#D4A85A]/60'
                  }`}
                >
                  {reg.name}
                </button>
              ))}
            </div>

            {/* Real Interactive Google Map */}
            <div className="flex-1 w-full relative">
              <HeritageMap
                selectedMonumentId={activePin}
                onSelectMonument={(id) => {
                  setActivePin(id);
                  const mon = monuments[id];
                  if (mon) setActiveRegion(mon.stateId);
                }}
                onNavigate={onNavigate}
              />
            </div>

            {/* Bottom Coordinates info */}
            <div className="flex items-center justify-between text-xs text-[#F3EBDD]/60 pt-2 border-t border-[#D4A85A]/20">
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <Compass className="w-3.5 h-3.5 text-[#D4A85A]" />
                <span>Focus: {regions.find((r) => r.id === activeRegion)?.coords || '20.5937° N, 78.9629° E'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#D4A85A] uppercase font-bold">WGS-84 Survey Datum</span>
              </div>
            </div>
          </div>

          {/* Right Inspector & Journey Context Card (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4A85A]/20">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4A85A]/20 text-[#D4A85A] text-[10px] uppercase font-bold tracking-wider">
                  Selected Landmark
                </span>
                <span className="text-xs font-mono text-[#F3EBDD]/60">{selectedMonument.period}</span>
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden border border-[#D4A85A]/30">
                <img
                  src={selectedMonument.heroImage}
                  alt={selectedMonument.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17130F] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display text-lg font-bold text-[#F3EBDD] truncate">
                    {selectedMonument.name}
                  </h3>
                  <p className="text-[11px] text-[#D4A85A] font-subheading italic truncate">
                    {selectedMonument.tagline}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#F3EBDD]/80">
                <p className="line-clamp-3 leading-relaxed">
                  {selectedMonument.culturalSignificance}
                </p>
                <div className="p-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 space-y-1">
                  <div className="text-[10px] font-bold text-[#D4A85A] uppercase">Dynasty & Architecture</div>
                  <div className="text-xs font-semibold text-[#F3EBDD]">{selectedMonument.dynasty} • {selectedMonument.architectureStyle}</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="map-view-monument-detail-btn"
                  onClick={() => onNavigate(`monument/${selectedMonument.id}`)}
                  className="w-full py-2.5 rounded-xl bg-[#17130F] border border-[#D4A85A]/40 text-[#F3EBDD] text-xs font-bold uppercase tracking-wider hover:border-[#D4A85A] hover:bg-[#2B2118] transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Full Chronicle</span>
                  <ChevronRight className="w-4 h-4 text-[#D4A85A]" />
                </button>

                {selectedMonument.has3DModel && (
                  <button
                    id="map-launch-3d-btn"
                    onClick={() => onNavigate(`monument/${selectedMonument.id}/3d`)}
                    className="w-full py-2.5 rounded-xl bg-[#D4A85A] text-[#17130F] text-xs font-bold uppercase tracking-wider hover:bg-[#F3EBDD] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4A85A]/20"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Launch 3D Spatial Twin</span>
                  </button>
                )}
              </div>
            </div>

            {/* Next Demo Step Bridge */}
            <div className="p-5 rounded-2xl bg-[#17130F] border border-[#D4A85A]/30 space-y-2">
              <div className="text-xs font-bold text-[#D4A85A] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Final Demo Step
              </div>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                Discover the DHAROHAR Preservation Framework, responsible guidelines, and digital guardian pledge.
              </p>
              <button
                id="map-to-preservation-btn"
                onClick={() => onNavigate('preservation')}
                className="w-full mt-2 py-2 rounded-xl bg-[#2B2118] border border-[#D4A85A]/50 text-xs font-bold text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Go to Preservation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
