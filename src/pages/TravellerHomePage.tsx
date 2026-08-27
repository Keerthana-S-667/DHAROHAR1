import React, { useState, useEffect } from 'react';
import { MapPin, Search, ArrowLeft, Navigation, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { useStore } from '../store/store';
import { locationService } from '../services/locationService';

interface TravellerHomePageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const TravellerHomePage: React.FC<TravellerHomePageProps> = ({
  onNavigate,
  language
}) => {
  const t = TRANSLATIONS[language].hero;
  const userLocation = useStore((state) => state.userLocation);
  const setUserLocation = useStore((state) => state.setUserLocation);
  const setLocationPermissionState = useStore((state) => state.setLocationPermissionState);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'denied' | 'error'>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mockLat = params.get('lat') || params.get('latitude');
    const mockLng = params.get('lng') || params.get('longitude');
    if (mockLat && mockLng) {
      const latVal = parseFloat(mockLat);
      const lngVal = parseFloat(mockLng);
      if (!isNaN(latVal) && !isNaN(lngVal)) {
        setUserLocation({ latitude: latVal, longitude: lngVal });
        setLocationPermissionState('granted');
        setStatus('success');
      }
    }
  }, []);

  const handleRequestLocation = async () => {
    setStatus('loading');
    try {
      const position = await locationService.getCurrentPosition();
      setUserLocation({
        latitude: position.lat,
        longitude: position.lng
      });
      setLocationPermissionState('granted');
      setStatus('success');
    } catch (err: any) {
      console.error('Location Error:', err);
      // Map error to correct feedback status
      // GeolocationPositionError.PERMISSION_DENIED is 1
      if (err.code === 1 || err.message?.toLowerCase().includes('denied') || err.message?.toLowerCase().includes('allow')) {
        setLocationPermissionState('denied');
        setStatus('denied');
      } else {
        setLocationPermissionState('denied');
        setStatus('error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#D4A85A]">
          <button
            onClick={() => onNavigate('landing')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <span className="text-[#F3EBDD]/40">/</span>
          <span className="text-[#F3EBDD] font-bold">Traveller Home</span>
        </div>

        {/* Cinematic Header Block */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#2B2118] to-[#17130F] border border-[#D4A85A]/40 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A85A]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17130F] border border-[#D4A85A]/30 text-[10px] text-[#D4A85A] font-semibold uppercase tracking-widest">
            <Navigation className="w-3 h-3 animate-pulse" />
            <span>Traveller & Tourist Sanctuary</span>
          </div>

          {status === 'idle' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
                  Discover Heritage Around You
                </h1>
                <p className="text-xs sm:text-sm text-[#F3EBDD]/70 max-w-lg mx-auto leading-relaxed pt-2">
                  Let DHAROHAR use your location to discover heritage sites near you and help you plan your journey.
                </p>
              </div>

              {/* Core Decision CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                {/* Primary: Use Location */}
                <button
                  id="traveller-use-location-btn"
                  onClick={handleRequestLocation}
                  className="py-4 px-6 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#D4A85A]/15 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Use My Location</span>
                </button>

                {/* Secondary: Search Destination */}
                <button
                  id="traveller-search-dest-btn"
                  onClick={() => onNavigate('traveller/search')}
                  className="py-4 px-6 rounded-xl bg-[#2B2118] border border-[#D4A85A]/50 text-[#F3EBDD] font-semibold text-xs uppercase tracking-wider hover:border-[#D4A85A] hover:bg-[#B58A52]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#D4A85A]" />
                  <span>Search for a Destination</span>
                </button>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div className="space-y-4 py-8 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full border-2 border-[#D4A85A]/20 border-t-[#D4A85A] animate-spin mx-auto" />
              <p className="font-subheading text-lg text-[#D4A85A] italic">
                Finding your location...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 py-4 animate-in fade-in duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4A85A]/20 border border-[#D4A85A] text-[#D4A85A] mx-auto">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-[#F3EBDD]">
                  Location detected
                </h3>
                {userLocation && (
                  <div className="p-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/30 max-w-xs mx-auto text-xs text-[#D4A85A] font-mono tracking-wider">
                    {userLocation.latitude.toFixed(6)}° N, {userLocation.longitude.toFixed(6)}° E
                  </div>
                )}
              </div>
              <p className="text-xs text-[#F3EBDD]/70 max-w-md mx-auto leading-relaxed">
                Your location is used to discover nearby heritage experiences.
              </p>
              <button
                onClick={() => onNavigate('traveller/preferences')}
                className="py-3 px-6 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer"
              >
                Configure Travel Preferences
              </button>
            </div>
          )}

          {status === 'denied' && (
            <div className="space-y-5 py-4 animate-in fade-in duration-300">
              <h3 className="font-display text-2xl font-bold text-[#F3EBDD]">
                Location access was not allowed.
              </h3>
              <p className="text-xs text-[#F3EBDD]/70 max-w-md mx-auto leading-relaxed">
                To discover nearby stepwells, astronomical guides, and architectural assets automatically, please enable location permission or proceed using manual search parameters.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={handleRequestLocation}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={() => onNavigate('traveller/search')}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#2B2118] border border-[#D4A85A]/50 text-[#F3EBDD] font-semibold text-xs uppercase tracking-wider hover:border-[#D4A85A] hover:bg-[#B58A52]/20 transition-all cursor-pointer"
                >
                  Search a Destination Instead
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5 py-4 animate-in fade-in duration-300">
              <h3 className="font-display text-2xl font-bold text-[#F3EBDD]">
                We couldn't determine your location.
              </h3>
              <p className="text-xs text-[#F3EBDD]/70 max-w-md mx-auto leading-relaxed">
                A browser error occurred or Geolocation services are temporarily offline. You can try again or use the search option.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={handleRequestLocation}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={() => onNavigate('traveller/search')}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#2B2118] border border-[#D4A85A]/50 text-[#F3EBDD] font-semibold text-xs uppercase tracking-wider hover:border-[#D4A85A] hover:bg-[#B58A52]/20 transition-all cursor-pointer"
                >
                  Search a Destination Instead
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Informative Status Tracker */}
        <div className="p-6 rounded-2xl bg-[#2B2118]/40 border border-[#D4A85A]/20 flex items-center gap-4 text-xs text-[#F3EBDD]/80">
          <ShieldCheck className="w-6 h-6 text-[#D4A85A] shrink-0" />
          <div className="leading-relaxed">
            <span className="text-[#D4A85A] font-bold">Stewardship Status:</span> Active GPS cartography database mapped for 5 key states. Turn on your location permission inside browser settings to reveal nearby sites.
          </div>
        </div>
      </div>
    </div>
  );
};
