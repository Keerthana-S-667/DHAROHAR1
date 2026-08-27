import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Compass, 
  Landmark, 
  Camera, 
  Sparkles, 
  Flame, 
  Footprints, 
  History, 
  Accessibility, 
  Heart,
  AlertCircle
} from 'lucide-react';
import { Language, TravellerPreferences } from '../types';
import { useStore } from '../store/store';

interface TravellerPreferencesPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const TravellerPreferencesPage: React.FC<TravellerPreferencesPageProps> = ({
  onNavigate,
  language
}) => {
  const savedPrefs = useStore((state) => state.travellerPreferences);
  const setTravellerPreferences = useStore((state) => state.setTravellerPreferences);

  // Initialize with previously saved store preferences to support clean back/forward navigation
  const [timeAvailable, setTimeAvailable] = useState<TravellerPreferences['timeAvailable'] | null>(
    savedPrefs?.timeAvailable || null
  );
  const [interests, setInterests] = useState<TravellerPreferences['interests']>(
    savedPrefs?.interests || []
  );
  const [mobility, setMobility] = useState<TravellerPreferences['mobilityPreference'] | undefined>(
    savedPrefs?.mobilityPreference
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInterestToggle = (interest: TravellerPreferences['interests'][number]) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
    setValidationError(null);
  };

  const handleTimeSelect = (time: TravellerPreferences['timeAvailable']) => {
    setTimeAvailable(time);
    setValidationError(null);
  };

  const handleContinue = () => {
    if (!timeAvailable) {
      setValidationError('Please specify how much time you have available.');
      return;
    }
    if (interests.length === 0) {
      setValidationError('Please select at least one experience interest.');
      return;
    }

    // Save state in store and proceed
    setTravellerPreferences({
      timeAvailable,
      interests,
      mobilityPreference: mobility
    });
    setValidationError(null);
    onNavigate('traveller/nearby');
  };

  // Selection configurations
  const timeOptions: { id: TravellerPreferences['timeAvailable']; label: string; desc: string }[] = [
    { id: '30min', label: '30 Minutes', desc: 'Express visit' },
    { id: '1hour', label: '1 Hour', desc: 'Core highlights' },
    { id: '2hours', label: '2 Hours', desc: 'Detailed walk' },
    { id: 'halfday', label: 'Half Day', desc: 'Complete exploration' },
    { id: 'fullday', label: 'Full Day', desc: 'Deep dive sanctuary' }
  ];

  const interestOptions: { id: TravellerPreferences['interests'][number]; label: string; icon: React.ReactNode }[] = [
    { id: 'Architecture', label: 'Architecture', icon: <Landmark className="w-4 h-4" /> },
    { id: 'History', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'Culture', label: 'Culture', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'Photography', label: 'Photography', icon: <Camera className="w-4 h-4" /> },
    { id: 'Spiritual Heritage', label: 'Spiritual Heritage', icon: <Flame className="w-4 h-4" /> }
  ];

  const mobilityOptions: { id: TravellerPreferences['mobilityPreference']; label: string; icon: React.ReactNode }[] = [
    { id: 'walking', label: 'Standard Walking', icon: <Footprints className="w-4 h-4" /> },
    { id: 'lowwalking', label: 'Low Walking / Leisurely', icon: <Heart className="w-4 h-4" /> },
    { id: 'accessible', label: 'Accessible Route Only', icon: <Accessibility className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#D4A85A]">
            <button
              onClick={() => onNavigate('traveller')}
              className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <span className="text-[#F3EBDD]/40">/</span>
            <span className="text-[#F3EBDD]/70">Traveller Home</span>
            <span className="text-[#F3EBDD]/40">/</span>
            <span className="text-[#F3EBDD] font-bold">Preferences</span>
          </div>
        </div>

        {/* Form Card container */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A85A]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F3EBDD]">
              Shape Your Heritage Journey
            </h1>
            <p className="text-xs sm:text-sm text-[#F3EBDD]/70 max-w-xl leading-relaxed">
              Tell us a little about your visit and we'll help you discover experiences that fit your time and interests.
            </p>
          </div>

          <div className="space-y-6">
            {/* Section 1: Time selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4A85A] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>How much time do you have?</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {timeOptions.map((opt) => {
                  const isSelected = timeAvailable === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`time-opt-${opt.id}`}
                      onClick={() => handleTimeSelect(opt.id)}
                      className={`p-3.5 rounded-xl border text-center transition-all flex flex-col justify-center items-center space-y-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-md shadow-[#D4A85A]/25'
                          : 'bg-[#17130F] text-[#F3EBDD]/90 border-[#D4A85A]/20 hover:border-[#D4A85A]/60'
                      }`}
                    >
                      <span className="text-xs font-bold whitespace-nowrap">{opt.label}</span>
                      <span className={`text-[9px] ${isSelected ? 'text-[#17130F]/80' : 'text-[#F3EBDD]/50'}`}>
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Interests selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4A85A] flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>What would you like to experience?</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {interestOptions.map((opt) => {
                  const isSelected = interests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`interest-opt-${opt.id.toLowerCase().replace(' ', '-')}`}
                      onClick={() => handleInterestToggle(opt.id)}
                      className={`p-3.5 rounded-xl border text-center transition-all flex flex-col justify-center items-center space-y-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-md shadow-[#D4A85A]/25'
                          : 'bg-[#17130F] text-[#F3EBDD]/90 border-[#D4A85A]/20 hover:border-[#D4A85A]/60'
                      }`}
                    >
                      <div className={isSelected ? 'text-[#17130F]' : 'text-[#D4A85A]'}>
                        {opt.icon}
                      </div>
                      <span className="text-xs whitespace-nowrap">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Mobility preference */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4A85A] flex items-center gap-2">
                <Footprints className="w-4 h-4" />
                <span>How would you like to explore? <span className="text-[10px] text-[#F3EBDD]/50 lowercase font-normal italic">(optional)</span></span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {mobilityOptions.map((opt) => {
                  const isSelected = mobility === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`mobility-opt-${opt.id}`}
                      onClick={() => setMobility(mobility === opt.id ? undefined : opt.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-md shadow-[#D4A85A]/25'
                          : 'bg-[#17130F] text-[#F3EBDD]/90 border-[#D4A85A]/20 hover:border-[#D4A85A]/60'
                      }`}
                    >
                      <div className={isSelected ? 'text-[#17130F]' : 'text-[#D4A85A]'}>
                        {opt.icon}
                      </div>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2 animate-in slide-in-from-top duration-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Continue button */}
          <div className="pt-2 flex justify-end">
            <button
              id="preferences-submit-btn"
              onClick={handleContinue}
              className="py-4 px-8 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors shadow-lg shadow-[#D4A85A]/15 cursor-pointer"
            >
              Discover Heritage Nearby
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
