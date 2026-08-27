import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Compass, 
  Layers, 
  Calendar, 
  Search, 
  ChevronRight, 
  Navigation,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Map
} from 'lucide-react';
import { Language } from '../types';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';
import { HeritageImage } from '../components/HeritageImage';

interface TravellerNearbyPlaceholderPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const TravellerNearbyPlaceholderPage: React.FC<TravellerNearbyPlaceholderPageProps> = ({
  onNavigate,
  language
}) => {
  const userLocation = useStore((state) => state.userLocation);
  const setUserLocation = useStore((state) => state.setUserLocation);
  const setLocationPermissionState = useStore((state) => state.setLocationPermissionState);
  const travellerPreferences = useStore((state) => state.travellerPreferences);

  // Initialize coordinates from URL query parameters if present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mockLat = params.get('lat') || params.get('latitude');
    const mockLng = params.get('lng') || params.get('longitude');
    if (mockLat && mockLng) {
      const latVal = parseFloat(mockLat);
      const lngVal = parseFloat(mockLng);
      if (!isNaN(latVal) && !isNaN(lngVal)) {
        setUserLocation({ latitude: latVal, longitude: lngVal });
        setLocationPermissionState('granted');
      }
    }
  }, []);

  // 1. Location Missing Guard
  if (!userLocation) {
    return (
      <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#D4A85A]/15 border border-[#D4A85A]/40 text-[#D4A85A] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-[#F3EBDD]">
              Location is needed
            </h2>
            <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
              We need coordinates to calculate distances and determine nearby heritage monuments.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => onNavigate('traveller')}
              className="py-3 px-6 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer"
            >
              Enable Location
            </button>
            <button
              onClick={() => onNavigate('traveller/search')}
              className="py-3 px-6 rounded-xl bg-[#2B2118] border border-[#D4A85A]/40 text-[#D4A85A] font-semibold text-xs uppercase tracking-wider hover:bg-[#17130F] transition-colors cursor-pointer"
            >
              Search a Destination
            </button>
          </div>
        </div>
      </div>
    );
  }

  const defaultPrefs = { timeAvailable: '2hours' as const, interests: ['Architecture' as const] };
  const activePrefs = travellerPreferences || defaultPrefs;

  // 2. Fetch Distance Calculations
  const results = heritageService.getNearbyHeritage(userLocation, activePrefs);

  // 3. Fallback Mode: Destination Discovery if no monuments nearby
  if (results.length === 0) {
    const states = heritageService.getStates();
    const allDestinations = states.flatMap(s => s.destinations.map(d => ({ ...d, stateName: s.name })));

    return (
      <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D4A85A]/20">
            <div className="space-y-2">
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#D4A85A] tracking-wider">
                <Navigation className="w-3 h-3 text-[#D4A85A]" />
                Explorer Discovery Hub
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
                Explore Destinations
              </h1>
              <p className="text-xs sm:text-sm text-[#F3EBDD]/70 font-subheading italic text-lg text-[#D4A85A]">
                Explore India's historic temple systems and dynastic capitals.
              </p>
            </div>
            <button
              onClick={() => onNavigate('traveller/search')}
              className="px-4 py-2 rounded-xl bg-[#2B2118] border border-[#D4A85A]/30 text-xs text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Search Destination
            </button>
          </div>

          {/* Help/Notice banner */}
          <div className="p-6 rounded-2xl bg-[#2B2118]/80 border border-[#D4A85A]/40 shadow-xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#D4A85A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#F3EBDD] uppercase tracking-wider">No heritage experiences are close enough for a quick visit.</h4>
              <p className="text-[11px] text-[#F3EBDD]/75 leading-relaxed">
                There are no prototype monuments located within a 50 km discovery radius of your coordinates. You can explore these rich cultural regions below virtually.
              </p>
            </div>
          </div>

          {/* Destination grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allDestinations.map((dest) => (
              <div 
                key={dest.id}
                className="group rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 overflow-hidden shadow-2xl flex flex-col justify-between hover:border-[#D4A85A] transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-[#17130F]">
                  <HeritageImage
                    src={dest.heroImage}
                    alt={dest.name}
                    fallbackName={dest.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118] via-[#2B2118]/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-[#17130F]/90 border border-[#D4A85A]/30 text-[10px] text-[#D4A85A] font-semibold backdrop-blur-sm">
                    {dest.stateName}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-[#F3EBDD]">
                      {dest.name}
                    </h3>
                    <p className="text-[11px] text-[#D4A85A] font-semibold italic">
                      “{dest.tagline}”
                    </p>
                    <p className="text-xs text-[#F3EBDD]/70 leading-relaxed line-clamp-3">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate(`destination/${dest.id}`)}
                      className="w-full py-3 rounded-xl bg-[#2B2118] border border-[#D4A85A]/40 text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore Destination</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. Mode 1: Nearby Heritage Display
  const recommendedResults = results.slice(0, 2);
  const otherResults = results.slice(2);

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#D4A85A]/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#D4A85A] pb-1">
              <span className="flex items-center gap-1 font-medium bg-[#2B2118] px-2.5 py-1 rounded-full border border-[#D4A85A]/30">
                <MapPin className="w-3 h-3 text-[#D4A85A]" />
                Using your current location
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
              Heritage Near You
            </h1>
            <p className="text-xs sm:text-sm text-[#F3EBDD]/70 font-subheading italic text-lg text-[#D4A85A]">
              Discover places worth experiencing around your current location.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('traveller/preferences')}
              className="px-4 py-2 rounded-xl bg-[#2B2118] border border-[#D4A85A]/30 text-xs text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Adjust Preferences
            </button>
          </div>
        </div>

        {/* SECTION 1: RECOMMENDED FOR YOU */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4A85A]" />
            <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-[#F3EBDD]">
              Recommended for You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedResults.map(({ monument, distanceKm, estimatedMinutes, matchingInterests, recommendationReason }) => (
              <div 
                key={monument.id}
                className="group rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 overflow-hidden shadow-2xl flex flex-col justify-between hover:border-[#D4A85A] transition-all duration-300"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden bg-[#17130F]">
                  <HeritageImage
                    src={monument.heroImage}
                    alt={monument.name}
                    fallbackName={monument.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118] via-[#2B2118]/30 to-transparent" />
                  
                  {/* Category reason badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#17130F]/90 border border-[#D4A85A]/40 text-[10px] text-[#D4A85A] font-semibold uppercase tracking-wider backdrop-blur-sm">
                    {recommendationReason}
                  </div>

                  {/* Distance coordinates badge */}
                  <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-[#D4A85A] text-[#17130F] text-[10px] font-bold tracking-wider font-sans">
                    Distance: ~{distanceKm.toFixed(1)} km
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#D4A85A] font-medium">
                      <span>{monument.location.city}, {monument.location.state}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Est. Walk Time: ~{estimatedMinutes} min
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#F3EBDD] group-hover:text-[#D4A85A] transition-colors">
                      {monument.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-[#D4A85A]/10 text-[11px] text-[#F3EBDD]/60 font-medium">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#D4A85A]/60" />
                        {monument.architectureStyle.split(' ')[0]} style
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#D4A85A]/60" />
                        {monument.period}
                      </span>
                    </div>

                    <p className="text-xs text-[#F3EBDD]/80 leading-relaxed pt-1 line-clamp-3">
                      {monument.culturalSignificance}
                    </p>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => onNavigate(`traveller/navigation/${monument.id}`)}
                      className="w-full py-3 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Start Journey</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate(`traveller/map?monumentId=${monument.id}`)}
                        className="flex-1 py-2.5 rounded-xl bg-[#2B2118] border border-[#D4A85A]/40 text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Map</span>
                      </button>
                      <button
                        id={`explore-btn-${monument.id}`}
                        onClick={() => onNavigate(`monument/${monument.id}`)}
                        className="flex-1 py-2.5 rounded-xl bg-[#2B2118]/80 border border-[#D4A85A]/30 text-[#F3EBDD] hover:border-[#D4A85A] hover:bg-[#2B2118] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Explore</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: MORE HERITAGE NEARBY */}
        {otherResults.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#D4A85A]/10">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#D4A85A]" />
              <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-[#F3EBDD]">
                More Heritage Nearby
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherResults.map(({ monument, distanceKm, estimatedMinutes, recommendationReason }) => (
                <div 
                  key={monument.id}
                  onClick={() => onNavigate(`monument/${monument.id}`)}
                  className="p-5 rounded-2xl bg-[#2B2118]/60 border border-[#D4A85A]/20 hover:border-[#D4A85A]/50 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#D4A85A] font-semibold">
                      <span>{monument.location.city}</span>
                      <span>Distance: ~{distanceKm.toFixed(1)} km</span>
                    </div>

                    <h4 className="font-display text-base font-bold text-[#F3EBDD] group-hover:text-[#D4A85A] transition-colors line-clamp-1">
                      {monument.name}
                    </h4>

                    <p className="text-[11px] text-[#F3EBDD]/60 line-clamp-2 leading-relaxed">
                      {monument.tagline}
                    </p>
                  </div>

                  <div className="text-[10px] text-[#D4A85A] border-t border-[#D4A85A]/10 pt-2 flex justify-between items-center">
                    <span>{recommendationReason}</span>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-[#F3EBDD] group-hover:translate-x-0.5 transition-transform">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
