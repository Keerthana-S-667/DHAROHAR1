import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Compass, Navigation, Clock, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';
import { routingService, RouteDetails } from '../services/routingService';
import { HeritageMap } from '../components/HeritageMap';
import { mapService } from '../services/mapService';

interface TravellerNavigationPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const TravellerNavigationPage: React.FC<TravellerNavigationPageProps> = ({
  onNavigate,
  language
}) => {
  const { monumentId } = useParams<{ monumentId: string }>();
  const [searchParams] = useSearchParams();

  const setUserLocation = useStore((state) => state.setUserLocation);

  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasArrived, setHasArrived] = useState(false);

  // Navigation Origin Confirmation States
  const [isOriginConfirmed, setIsOriginConfirmed] = useState(false);
  const [confirmedOrigin, setConfirmedOrigin] = useState<{ latitude: number; longitude: number; name?: string } | null>(null);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [travelMode, setTravelMode] = useState<'foot-walking' | 'two-wheeler' | 'driving-car' | 'cycling-regular'>('foot-walking');

  const monument = monumentId ? heritageService.getMonumentById(monumentId) : null;

  // Resolve simulation / testing coordinates overrides
  const testLat = searchParams.get('testLat');
  const testLng = searchParams.get('testLng');
  
  const simulatedLocation = testLat && testLng ? {
    latitude: parseFloat(testLat),
    longitude: parseFloat(testLng)
  } : null;

  // fresh call to browser geolocation
  const handleConfirmCurrentLocation = () => {
    setIsLoading(true);
    setErrorMsg(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const freshOrigin = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: 'Current location detected'
          };
          setConfirmedOrigin(freshOrigin);
          setUserLocation({ latitude: freshOrigin.latitude, longitude: freshOrigin.longitude });
          setIsOriginConfirmed(true);
          setIsLoading(false);
        },
        (error) => {
          console.error(error);
          setIsLoading(false);
          setErrorMsg("Failed to obtain location access permission. Please search for a starting location instead.");
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsLoading(false);
      setErrorMsg("Geolocation is not supported by your browser.");
    }
  };

  // geocoding search for starting location
  const handleSearchStartingLocation = async () => {
    if (!searchLocationQuery.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await mapService.loadGoogleMaps();
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: searchLocationQuery }, (results, status) => {
        setIsLoading(false);
        if (status === 'OK' && results && results.length > 0) {
          setSearchResults(results);
        } else {
          setErrorMsg(`Geocoding search failed: ${status}. Please ensure a valid VITE_GOOGLE_MAPS_API_KEY is configured in your .env file.`);
        }
      });
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setErrorMsg(`Failed to load search service: ${err.message || err}. Please ensure a valid VITE_GOOGLE_MAPS_API_KEY is configured.`);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    const loc = result.geometry.location;
    setConfirmedOrigin({
      latitude: loc.lat(),
      longitude: loc.lng(),
      name: result.formatted_address
    });
    setSearchResults([]);
    setIsOriginConfirmed(true);
  };

  // Trigger routing calculations
  const calculateRoute = async () => {
    if (!monument || !confirmedOrigin) return;

    setIsLoading(true);
    setErrorMsg(null);
    setHasArrived(false);

    try {
      const origin = { lat: confirmedOrigin.latitude, lng: confirmedOrigin.longitude };
      const dest = { lat: monument.location.lat, lng: monument.location.lng };

      // Calculate geographic distance to check arrival
      const currentDist = heritageService.calculateDistance(
        confirmedOrigin.latitude,
        confirmedOrigin.longitude,
        monument.location.lat,
        monument.location.lng
      );

      // Check arrival state (proximity threshold <= 100 meters)
      if (currentDist * 1000 <= 100) {
        setHasArrived(true);
      }

      const routeData = await routingService.getWalkingRoute(origin, dest, travelMode);
      setRoute(routeData);

    } catch (err: any) {
      console.error('Route calculation error:', err);
      setErrorMsg(`Directions calculation failed: ${err.message || err}. (Google Maps API key might be missing, invalid, or rate limited).`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (simulatedLocation && !isOriginConfirmed) {
      setConfirmedOrigin({
        latitude: simulatedLocation.latitude,
        longitude: simulatedLocation.longitude,
        name: 'Simulated coordinates active'
      });
      setIsOriginConfirmed(true);
    }
  }, [simulatedLocation, isOriginConfirmed]);

  // Recalculate route whenever confirmed origin or travel mode changes
  useEffect(() => {
    if (isOriginConfirmed && confirmedOrigin) {
      calculateRoute();
    }
  }, [isOriginConfirmed, confirmedOrigin, travelMode, monumentId]);

  if (!monument) {
    return (
      <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-[#D4A85A] mx-auto" />
          <h2 className="text-xl font-bold">Monument not found</h2>
          <button onClick={() => onNavigate('traveller/nearby')} className="px-4 py-2 bg-[#D4A85A] text-[#17130F] font-bold rounded-xl text-xs">
            Back to Nearby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#D4A85A]">
          <button
            onClick={() => onNavigate('traveller/nearby')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Nearby
          </button>
          <span className="text-[#F3EBDD]/40">/</span>
          <span className="text-[#F3EBDD] font-bold">Active Navigation Portal</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D4A85A]/20">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#D4A85A] tracking-wider">
              <Navigation className="w-3.5 h-3.5" />
              Active Route Tracking
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#F3EBDD]">
              Navigation to {monument.name}
            </h1>
          </div>
          
          {isOriginConfirmed && (
            <button
              onClick={calculateRoute}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-[#2B2118] border border-[#D4A85A]/40 text-xs font-bold text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Recenter Route
            </button>
          )}
        </div>

        {/* Confirm starting location state if not confirmed yet */}
        {!isOriginConfirmed && (
          <div className="p-8 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 text-center max-w-xl mx-auto space-y-6">
            <Navigation className="w-12 h-12 text-[#D4A85A] mx-auto animate-pulse" />
            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold">Confirm Starting Location</h3>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                Choose how to set your starting origin coordinates to plan a route directly to <strong>{monument.name}</strong>.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmCurrentLocation}
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer disabled:opacity-50"
              >
                📍 Use Current GPS Location
              </button>
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#D4A85A]/20"></div>
                <span className="flex-shrink mx-4 text-[10px] text-[#D4A85A] uppercase font-bold">Or Search Starting Point</span>
                <div className="flex-grow border-t border-[#D4A85A]/20"></div>
              </div>

              {/* Autocomplete / Geocoder Search */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type address or city (e.g. Avadi, Chennai)..."
                  value={searchLocationQuery}
                  onChange={(e) => setSearchLocationQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchStartingLocation()}
                  className="flex-1 bg-[#17130F] border border-[#D4A85A]/30 rounded-xl px-3 py-2.5 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/35 focus:outline-none focus:border-[#D4A85A]"
                />
                <button
                  onClick={handleSearchStartingLocation}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-xl bg-[#2B2118] border border-[#D4A85A]/40 text-xs font-bold text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="bg-[#17130F] border border-[#D4A85A]/30 rounded-xl max-h-40 overflow-y-auto text-left text-xs divide-y divide-[#D4A85A]/10">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full px-3 py-2.5 text-left text-[#F3EBDD]/90 hover:bg-[#2B2118] transition-colors"
                    >
                      {res.formatted_address}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-300">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {isOriginConfirmed && confirmedOrigin && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Map Frame Stage */}
            <div className="lg:col-span-8 space-y-4">
              <div className="relative">
                <HeritageMap
                  selectedMonumentId={monument.id}
                  routeGeometry={route?.geometry}
                  userLocationOverride={confirmedOrigin}
                />

                {/* Simulated Location Indicator Badge */}
                {simulatedLocation && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-amber-600/90 border border-amber-400 text-[10px] font-bold text-white shadow-xl backdrop-blur-sm">
                    Developer Mode: Coordinate Simulation Active
                  </div>
                )}
              </div>
            </div>

            {/* Side Details Panel */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Navigation Metrics Panel */}
              <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl space-y-5">
                <h3 className="font-display text-lg font-bold text-[#F3EBDD] pb-3 border-b border-[#D4A85A]/20">
                  Navigation Metrics
                </h3>

                {/* Travel Mode Selector Selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider block font-bold">Select Travel Mode</span>
                  <div className="grid grid-cols-4 gap-1.5 bg-[#17130F] p-1 rounded-xl border border-[#D4A85A]/20">
                    {(['foot-walking', 'two-wheeler', 'driving-car', 'cycling-regular'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setTravelMode(mode)}
                        className={`py-2 rounded-lg text-center text-xs transition-all flex flex-col items-center justify-center ${
                          travelMode === mode
                            ? 'bg-[#D4A85A] text-[#17130F] font-bold'
                            : 'text-[#F3EBDD]/60 hover:text-[#F3EBDD] hover:bg-[#2B2118]'
                        }`}
                        title={mode.replace('-', ' ')}
                      >
                        <span className="text-base">
                          {mode === 'foot-walking' && '🚶'}
                          {mode === 'two-wheeler' && '🏍️'}
                          {mode === 'driving-car' && '🚗'}
                          {mode === 'cycling-regular' && '🚲'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-xs pt-3 border-t border-[#D4A85A]/15">
                  <div>
                    <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider block font-bold">Starting Point</span>
                    <span className="font-medium text-[#F3EBDD] mt-0.5 block truncate" title={confirmedOrigin.name}>
                      {confirmedOrigin.name}
                    </span>
                    <button
                      onClick={() => setIsOriginConfirmed(false)}
                      className="text-[10px] text-[#D4A85A] hover:underline mt-1 block"
                    >
                      Change starting point
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider block font-bold">Destination</span>
                    <span className="font-medium text-[#F3EBDD] mt-0.5 block">{monument.name}</span>
                    <span className="text-[10px] text-[#F3EBDD]/60 mt-0.5 block">
                      {monument.location.city}, {monument.location.state}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#D4A85A]/10">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider block font-bold">Distance</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold font-mono">
                          {isLoading ? '...' : route ? (route.distanceMeters / 1000).toFixed(2) : '0.00'}
                        </span>
                        <span className="text-[10px] text-[#F3EBDD]/60 font-semibold uppercase">km</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider block font-bold">Est. Time</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold font-mono">
                          {isLoading ? '...' : route ? Math.ceil(route.durationSeconds / 60) : '0'}
                        </span>
                        <span className="text-[10px] text-[#F3EBDD]/60 font-semibold uppercase">min</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D4A85A]/10">
                    <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider block font-bold">Travel Mode</span>
                    <span className="font-medium text-[#F3EBDD] mt-0.5 block capitalize">
                      {travelMode.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Warning Box */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-xs text-red-300 space-y-2 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Routing Issue</span>
                  </div>
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Arrival State Panel */}
              {hasArrived && (
                <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/50 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-500">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-xl font-bold text-emerald-300">You have arrived!</h3>
                    <p className="text-xs text-emerald-400/90 font-semibold italic">
                      Welcome to {monument.name}
                    </p>
                    <p className="text-[10px] text-[#F3EBDD]/70 leading-relaxed pt-1.5">
                      You are within the landmark threshold. Take out your device, explore hotspots, or tap the button below to launch the high-fidelity 3D spatial model.
                    </p>
                  </div>

                  {monument.has3DModel && (
                    <button
                      onClick={() => onNavigate(`monument/${monument.id}/3d`)}
                      className="w-full py-3 rounded-xl bg-emerald-500 text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      Launch 3D Model
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
