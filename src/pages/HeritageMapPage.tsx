import React, { useState, useMemo } from 'react';
import { heritageService } from '../services/heritageService';
import { Language, Monument } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HeritageMap } from '../components/HeritageMap';
import { getMonumentRiskProfile, getRiskSummaryStats, RiskLevel, MonumentRiskProfile } from '../data/heritageRiskData';
import {
  MapPin,
  Compass,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Search,
  Eye,
  ShieldAlert,
  Globe,
  Navigation,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Route as RouteIcon,
  CheckCircle2,
  Building2,
  Info
} from 'lucide-react';

interface HeritageMapPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

type RiskFilterOption = 'ALL' | 'high' | 'moderate' | 'low';

export const HeritageMapPage: React.FC<HeritageMapPageProps> = ({
  onNavigate,
  language
}) => {
  const tNav = TRANSLATIONS[language]?.nav || TRANSLATIONS.en.nav;
  const tCommon = TRANSLATIONS[language]?.common || TRANSLATIONS.en.common;
  // Default state: null = Whole India overview (NO monument pre-selected!)
  const [activePin, setActivePin] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilterOption>('ALL');

  // Geolocation & Routing state
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [manualStartLocation, setManualStartLocation] = useState('');
  const [manualStartCoords, setManualStartCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; estMins: number } | null>(null);

  const monuments = heritageService.getMonuments();
  const allMonumentsList = useMemo(() => Object.values(monuments), [monuments]);

  const selectedMonument: Monument | null = activePin ? (monuments[activePin] || null) : null;
  const selectedRiskProfile: MonumentRiskProfile | null = activePin ? getMonumentRiskProfile(activePin) : null;

  const stats = useMemo(() => getRiskSummaryStats(allMonumentsList), [allMonumentsList]);

  const regions = [
    { id: 'all', name: '🇮🇳 All India (25)' },
    { id: 'tamil-nadu', name: 'Tamil Nadu' },
    { id: 'karnataka', name: 'Karnataka' },
    { id: 'rajasthan', name: 'Rajasthan' },
    { id: 'delhi', name: 'Delhi NCR' },
    { id: 'odisha', name: 'Odisha' },
    { id: 'maharashtra', name: 'Maharashtra' },
    { id: 'uttar-pradesh', name: 'Uttar Pradesh' },
    { id: 'gujarat', name: 'Gujarat' },
    { id: 'bihar', name: 'Bihar' },
    { id: 'west-bengal', name: 'West Bengal' }
  ];

  // Filter monuments by search text, region, and risk level
  const filteredMonuments = useMemo(() => {
    return allMonumentsList.filter((mon) => {
      const matchesSearch = !searchQuery ||
        mon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mon.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mon.location.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = activeRegion === 'all' || mon.stateId === activeRegion;

      const prof = getMonumentRiskProfile(mon.id);
      const matchesRisk = riskFilter === 'ALL' || prof.riskLevel === riskFilter;

      return matchesSearch && matchesRegion && matchesRisk;
    });
  }, [allMonumentsList, searchQuery, activeRegion, riskFilter]);

  // Request browser geolocation and compute route to selected monument
  const handleRequestRoute = (targetMon: Monument) => {
    setIsLocating(true);
    setLocationDenied(false);

    const computeAndSetRoute = (originLat: number, originLng: number) => {
      setUserCoords({ latitude: originLat, longitude: originLng });
      const dist = heritageService.calculateDistance(originLat, originLng, targetMon.location.lat, targetMon.location.lng);
      const mins = Math.round(dist * 1.5 + 15);
      setRouteInfo({ distanceKm: Math.round(dist * 10) / 10, estMins: mins });

      // Generate smooth arc path points for route line
      const steps = 25;
      const coords: [number, number][] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = originLat + (targetMon.location.lat - originLat) * t;
        const lng = originLng + (targetMon.location.lng - originLng) * t;
        coords.push([lng, lat]);
      }
      setRouteGeometry({ coordinates: coords });
      setIsLocating(false);
    };

    if (manualStartCoords) {
      computeAndSetRoute(manualStartCoords.latitude, manualStartCoords.longitude);
      return;
    }

    if (!navigator.geolocation) {
      setLocationDenied(true);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        computeAndSetRoute(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        setLocationDenied(true);
        setIsLocating(false);
        // Fallback default position (New Delhi)
        computeAndSetRoute(28.6139, 77.2090);
      },
      { timeout: 8000 }
    );
  };

  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStartLocation.trim() || !selectedMonument) return;

    // Simple city coordinate lookup for manual start fallback
    const cityCoords: Record<string, { lat: number; lng: number }> = {
      delhi: { lat: 28.6139, lng: 77.2090 },
      mumbai: { lat: 19.0760, lng: 72.8777 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      bengaluru: { lat: 12.9716, lng: 77.5946 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      hyderabad: { lat: 17.3850, lng: 78.4867 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      kochi: { lat: 9.9312, lng: 76.2673 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 }
    };

    const key = manualStartLocation.toLowerCase().trim();
    const found = cityCoords[key] || { lat: 28.6139, lng: 77.2090 };
    setManualStartCoords({ latitude: found.lat, longitude: found.lng });
    handleRequestRoute(selectedMonument);
  };

  const handleResetToOverview = () => {
    setActivePin(null);
    setRouteGeometry(null);
    setRouteInfo(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#aa7b3f]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/40 text-xs text-[#b65a3a] font-bold shadow-sm">
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'இந்திய அளவு மரபு வரைபடம்' : language === 'hi' ? 'अखिल भारतीय धरोहर मानचित्र' : 'Pan-India Spatial Cartography'}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#4b2f23]">
              {tNav.map}
            </h1>
            <p className="text-xs sm:text-sm text-[#4b2f23]/80 font-subheading italic text-lg text-[#b65a3a] mt-1">
              {language === 'ta' ? 'அனைத்து 25 வரலாற்றுச் சின்னங்களின் பாதுகாப்பு நிலை' : language === 'hi' ? 'सभी 25 ऐतिहासिक स्मारकों की जोखिम एवं संरक्षण स्थिति' : 'Pan-India Spatial Risk Cartography & Preservation Dashboard'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetToOverview}
              className="px-4 py-2 rounded-xl bg-[#ede3d1] border border-[#aa7b3f]/40 text-xs font-bold text-[#4b2f23] hover:bg-[#e8dbc7] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#b65a3a]" />
              <span>{language === 'ta' ? 'அனைத்து 25 சின்னங்களையும் காண்க' : language === 'hi' ? 'सभी 25 देखें' : 'View All 25 Overview'}</span>
            </button>
          </div>
        </div>

        {/* Map Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Monument Search, Filters & List (lg:col-span-3) */}
          <div className="lg:col-span-3 p-5 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/30 shadow-2xl space-y-4 max-h-[620px] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider">Heritage Monuments</h3>
              <span className="text-[10px] text-[#4b2f23]/60 font-bold">{filteredMonuments.length} of 25</span>
            </div>

            {/* Risk Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#f5f0e6] rounded-xl border border-[#aa7b3f]/20 text-[10px] font-bold text-center">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'high', label: '🔴 High' },
                { id: 'moderate', label: '🟡 Mod' },
                { id: 'low', label: '🟢 Low' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setRiskFilter(opt.id as RiskFilterOption)}
                  className={`py-1 rounded-lg transition-all cursor-pointer ${
                    riskFilter === opt.id ? 'bg-[#b65a3a] text-white shadow-sm' : 'text-[#4b2f23]/70 hover:text-[#4b2f23]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search 25 monuments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-[#4b2f23] placeholder-[#4b2f23]/40 focus:outline-none focus:border-[#aa7b3f] transition-all font-medium"
              />
              <Search className="w-4 h-4 text-[#b65a3a]/50 absolute left-3 top-2.5" />
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-[#D4A85A]/20">
              {filteredMonuments.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#4b2f23]/40">No monuments match search.</div>
              ) : (
                filteredMonuments.map((mon) => {
                  const isSelected = activePin === mon.id;
                  const riskProf = getMonumentRiskProfile(mon.id);
                  const riskEmoji = riskProf.riskLevel === 'high' ? '🔴' : riskProf.riskLevel === 'moderate' ? '🟡' : '🟢';

                  return (
                    <button
                      key={mon.id}
                      onClick={() => {
                        setActivePin(mon.id);
                        setActiveRegion(mon.stateId);
                        setRouteGeometry(null);
                        setRouteInfo(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#b65a3a] text-white border-[#aa7b3f] font-bold shadow-md'
                          : 'bg-[#f5f0e6]/60 text-[#4b2f23] border-[#aa7b3f]/15 hover:border-[#aa7b3f]/55 hover:bg-[#f5f0e6]'
                      }`}
                    >
                      <span className="text-xs shrink-0 mt-0.5">{riskEmoji}</span>
                      <div className="truncate min-w-0 flex-1">
                        <div className="font-bold truncate">{mon.name}</div>
                        <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-[#4b2f23]/60'}`}>
                          {mon.location.city}, {mon.location.state}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Map Stage (lg:col-span-5 or lg:col-span-6) */}
          <div className="lg:col-span-5 relative rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 overflow-hidden shadow-2xl min-h-[620px] flex flex-col justify-between p-5 space-y-4">
            
            {/* Top Region Navigation Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#aa7b3f]/20">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  id={`map-reg-btn-${reg.id}`}
                  onClick={() => {
                    setActiveRegion(reg.id);
                    if (reg.id === 'all') {
                      handleResetToOverview();
                    } else {
                      const mon = Object.values(monuments).find((m) => m.stateId === reg.id);
                      if (mon) setActivePin(mon.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                    activeRegion === reg.id
                      ? 'bg-[#b65a3a] text-white border-[#aa7b3f] font-bold shadow-md'
                      : 'bg-[#f5f0e6] text-[#4b2f23]/80 border-[#aa7b3f]/20 hover:border-[#aa7b3f]/60'
                  }`}
                >
                  {reg.name}
                </button>
              ))}
            </div>

            {/* Interactive Leaflet Map Component */}
            <div className="flex-1 w-full relative">
              <HeritageMap
                selectedMonumentId={activePin}
                onSelectMonument={(id) => {
                  setActivePin(id);
                  if (id) {
                    const mon = monuments[id];
                    if (mon) setActiveRegion(mon.stateId);
                  }
                  setRouteGeometry(null);
                  setRouteInfo(null);
                }}
                routeGeometry={routeGeometry}
                userLocationOverride={userCoords}
                onNavigate={onNavigate}
                onResetView={handleResetToOverview}
              />
            </div>

            {/* Bottom Coordinates & Stats Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4b2f23]/70 pt-2 border-t border-[#aa7b3f]/20">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <Compass className="w-3.5 h-3.5 text-[#b65a3a]" />
                <span>Focus: {activePin && selectedMonument ? `${selectedMonument.location.lat.toFixed(4)}° N, ${selectedMonument.location.lng.toFixed(4)}° E` : 'India Overview (22.5937° N, 78.9629° E)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#b65a3a] uppercase font-bold">WGS-84 Datum</span>
              </div>
            </div>
          </div>

          {/* Right Inspector: Risk & Preservation Panel (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">

            {/* ── DEFAULT OVERVIEW STATE (Nothing Selected) ──────────────────── */}
            {!selectedMonument || !selectedRiskProfile ? (
              <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 shadow-2xl space-y-6">
                <div className="space-y-2 border-b border-[#aa7b3f]/20 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#b65a3a]/15 text-[#b65a3a] text-[10px] uppercase font-bold tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Heritage Risk Overview</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#4b2f23]">
                    25 Monuments Monitored
                  </h2>
                  <p className="text-xs text-[#4b2f23]/75 leading-relaxed">
                    India's heritage landscape spans centuries of architecture, art and cultural history. Explore spatial preservation risks across major heritage monuments.
                  </p>
                </div>

                {/* Risk Summary Cards */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-1">
                    <div className="text-xl">🔴</div>
                    <div className="font-display text-2xl font-black text-red-600">{stats.high}</div>
                    <div className="text-[9px] uppercase font-bold text-red-700">High Risk</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                    <div className="text-xl">🟡</div>
                    <div className="font-display text-2xl font-black text-amber-600">{stats.moderate}</div>
                    <div className="text-[9px] uppercase font-bold text-amber-700">Moderate</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <div className="text-xl">🟢</div>
                    <div className="font-display text-2xl font-black text-emerald-600">{stats.low}</div>
                    <div className="text-[9px] uppercase font-bold text-emerald-700">Low Risk</div>
                  </div>
                </div>

                {/* Prompt */}
                <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/20 text-xs text-[#4b2f23]/80 space-y-2">
                  <div className="font-bold text-[#b65a3a] flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> How to investigate:
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Click any 🟢, 🟡, or 🔴 marker on the map stage or select a monument from the list to examine its preservation condition, environmental risk factors, and recommended conservation measures.
                  </p>
                </div>
              </div>
            ) : (
              /* ── DETAILED RISK & PRESERVATION PANEL (Monument Selected) ──── */
              <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 shadow-2xl space-y-5 animate-in slide-in-from-right duration-300">
                {/* Risk Level Header Tag & Score Gauge */}
                <div className="flex items-center justify-between pb-3 border-b border-[#aa7b3f]/20">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-white shadow-sm ${
                    selectedRiskProfile.riskLevel === 'high' ? 'bg-red-600'
                    : selectedRiskProfile.riskLevel === 'moderate' ? 'bg-amber-600'
                    : 'bg-emerald-600'
                  }`}>
                    {selectedRiskProfile.riskLevel === 'high' ? '🔴 HIGH RISK'
                      : selectedRiskProfile.riskLevel === 'moderate' ? '🟡 MODERATE RISK'
                      : '🟢 LOW RISK'}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-[#4b2f23]/50 uppercase font-bold tracking-wider block">Risk Score</span>
                    <span className="font-display text-xl font-black text-[#4b2f23]">{selectedRiskProfile.riskScore} / 100</span>
                  </div>
                </div>

                {/* Monument Hero Image Card */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-[#aa7b3f]/30 shadow-md">
                  <img
                    src={selectedMonument.heroImage}
                    alt={selectedMonument.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17130F] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-display text-xl font-bold truncate">{selectedMonument.name}</h3>
                    <p className="text-[11px] text-amber-300 font-medium truncate">{selectedMonument.location.city}, {selectedMonument.location.state}</p>
                  </div>
                </div>

                {/* Primary Risk & Explanation */}
                <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/20 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider block">Primary Risk Statement</span>
                  <h4 className="font-display text-base font-bold text-[#4b2f23]">{selectedRiskProfile.primaryRisk}</h4>
                  <p className="text-xs text-[#4b2f23]/80 leading-relaxed">{selectedRiskProfile.explanation}</p>
                </div>

                {/* Risk Factors */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider block">Key Risk Factors</span>
                  <div className="space-y-1.5">
                    {selectedRiskProfile.riskFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#4b2f23]/85">
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Recommended Preservation Measures */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Recommended Preservation
                  </span>
                  <ul className="space-y-1.5">
                    {selectedRiskProfile.preservationMeasures.map((measure, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#4b2f23]/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Route Calculation Section */}
                <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider flex items-center gap-1">
                      <RouteIcon className="w-3.5 h-3.5" /> Spatial Routing
                    </span>
                    {routeInfo && (
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        {routeInfo.distanceKm} km (~{routeInfo.estMins} mins)
                      </span>
                    )}
                  </div>

                  {!routeInfo ? (
                    <button
                      onClick={() => handleRequestRoute(selectedMonument)}
                      disabled={isLocating}
                      className="w-full py-2.5 rounded-xl bg-[#b65a3a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9e4a2e] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isLocating ? 'Locating Your Position…' : 'Route from My Location →'}</span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-900 font-medium space-y-1">
                      <p className="font-bold">✓ Route Active on Map Stage</p>
                      <p className="text-[11px] text-emerald-800">
                        Distance: <strong>{routeInfo.distanceKm} km</strong> · Drive/Travel: ~<strong>{routeInfo.estMins} mins</strong>
                      </p>
                    </div>
                  )}

                  {/* Geolocation Denial Fallback */}
                  {locationDenied && (
                    <form onSubmit={handleManualLocationSubmit} className="space-y-2 pt-2 border-t border-[#aa7b3f]/15">
                      <p className="text-[10px] text-amber-800 font-bold">Location access required to calculate route automatically.</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter starting city (e.g. Delhi, Mumbai)"
                          value={manualStartLocation}
                          onChange={(e) => setManualStartLocation(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#f5f0e6] border border-[#aa7b3f]/30 rounded-lg text-xs text-[#4b2f23]"
                        />
                        <button type="submit" className="px-3 py-1.5 bg-[#b65a3a] text-white rounded-lg text-xs font-bold">
                          Route
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => onNavigate(`monument/${selectedMonument.id}`)}
                    className="w-full py-3 rounded-xl bg-[#b65a3a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9e4a2e] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>View Heritage Details →</span>
                  </button>

                  {selectedMonument.has3DModel && (
                    <button
                      onClick={() => onNavigate(`monument/${selectedMonument.id}/3d`)}
                      className="w-full py-2.5 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] text-xs font-bold uppercase tracking-wider hover:bg-[#ede3d1] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Explore in 3D</span>
                    </button>
                  )}

                  <button
                    onClick={handleResetToOverview}
                    className="w-full py-2 text-center text-[10px] font-bold text-[#4b2f23]/60 hover:text-[#b65a3a] underline cursor-pointer uppercase tracking-wider"
                  >
                    View All 25 Overview
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
