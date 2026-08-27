import React, { useState } from 'react';
import { Language, TrailPreferences } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Sliders, 
  Clock, 
  Sparkles, 
  Camera, 
  Landmark, 
  History, 
  Heart, 
  Navigation, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Download,
  Share2,
  Calendar,
  Layers
} from 'lucide-react';

interface PersonalizedTrailPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const PersonalizedTrailPage: React.FC<PersonalizedTrailPageProps> = ({
  onNavigate,
  language
}) => {
  const [duration, setDuration] = useState<TrailPreferences['duration']>('30min');
  const [selectedInterests, setSelectedInterests] = useState<('Architecture' | 'History' | 'Culture' | 'Photography')[]>([
    'Architecture',
    'Photography'
  ]);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'brisk'>('moderate');
  const [generated, setGenerated] = useState(false);
  const [downloadedPass, setDownloadedPass] = useState(false);

  const t = TRANSLATIONS[language].trails;

  const durationOptions: { id: TrailPreferences['duration']; label: string; desc: string }[] = [
    { id: '15min', label: '15 Minutes', desc: 'Express Highlights' },
    { id: '30min', label: '30 Minutes', desc: 'Essential Stories & Visuals' },
    { id: '1hour', label: '1 Hour', desc: 'In-Depth Architectural Circuit' },
    { id: '2hours', label: '2 Hours', desc: 'Complete Scholar Expedition' }
  ];

  const interestOptions = [
    { id: 'Architecture' as const, label: 'Dravidian Architecture & Vimana Geometry', icon: Landmark },
    { id: 'History' as const, label: 'Dynastic Chronicles & Monarch Inscriptions', icon: History },
    { id: 'Culture' as const, label: 'Myths, Legends & Living Traditions', icon: Heart },
    { id: 'Photography' as const, label: 'Golden Hour Angles & Frame Perspectives', icon: Camera }
  ];

  const toggleInterest = (interest: 'Architecture' | 'History' | 'Culture' | 'Photography') => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleDownloadPass = () => {
    setDownloadedPass(true);
    setTimeout(() => setDownloadedPass(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B2118] border border-[#D4A85A]/50 text-xs text-[#D4A85A] font-semibold uppercase tracking-widest shadow-lg">
            <Sliders className="w-4 h-4" />
            <span>Algorithmic Itinerary Engine</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
            {t.builderTitle}
          </h1>

          <p className="font-subheading text-lg sm:text-xl text-[#D4A85A] italic">
            “Calibrated to your available time, stride pace, and architectural passions.”
          </p>
        </div>

        {/* Trail Customizer Form Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl space-y-8">
          {/* Step 1: Duration Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#D4A85A] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Step 1: Available Exploration Window</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {durationOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDuration(opt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    duration === opt.id
                      ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-lg shadow-[#D4A85A]/20 scale-[1.02]'
                      : 'bg-[#17130F] text-[#F3EBDD] border-[#D4A85A]/30 hover:border-[#D4A85A]/60'
                  }`}
                >
                  <div className="text-sm font-display font-bold">{opt.label}</div>
                  <div className={`text-[11px] mt-0.5 ${duration === opt.id ? 'text-[#17130F]/80' : 'text-[#D4A85A]'}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Primary Interests */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#D4A85A] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Step 2: Curated Thematic Interests</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {interestOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-[#17130F] border-[#D4A85A] shadow-md shadow-[#D4A85A]/10'
                        : 'bg-[#17130F]/50 border-[#D4A85A]/20 text-[#F3EBDD]/60 hover:text-[#F3EBDD]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#D4A85A] text-[#17130F]' : 'bg-[#2B2118] text-[#D4A85A]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-bold ${isSelected ? 'text-[#F3EBDD]' : 'text-[#F3EBDD]/70'}`}>
                        {opt.id}
                      </div>
                      <div className="text-[11px] text-[#D4A85A] font-subheading italic">
                        {opt.label}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4A85A] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Walking Pace */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#D4A85A] uppercase tracking-wider">
              <Navigation className="w-4 h-4" />
              <span>Step 3: Stride Pace</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { id: 'relaxed', label: 'Relaxed (Leisurely Contemplation)' },
                { id: 'moderate', label: 'Moderate (Standard Guided Pace)' },
                { id: 'brisk', label: 'Brisk (Quick Landmark Hop)' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPace(p.id as typeof pace)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                    pace === p.id
                      ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold'
                      : 'bg-[#17130F] text-[#F3EBDD]/80 border-[#D4A85A]/30 hover:border-[#D4A85A]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4 border-t border-[#D4A85A]/30 flex justify-center">
            <button
              id="generate-personalized-trail-btn"
              onClick={handleGenerate}
              className="px-8 py-4 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-sm uppercase tracking-wider hover:bg-[#F3EBDD] transition-all flex items-center gap-2.5 shadow-xl shadow-[#D4A85A]/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Custom Itinerary</span>
            </button>
          </div>
        </div>

        {/* Generated Custom Trail Results */}
        {generated && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#17130F] border border-[#D4A85A] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Trail Pass Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D4A85A]/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-bold tracking-wider">
                    Itinerary Optimized
                  </span>
                  <span className="text-xs text-[#D4A85A] font-mono">Mahabalipuram Coast</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F3EBDD] mt-1">
                  Custom {duration === '15min' ? '15-Min Express' : duration === '30min' ? '30-Min Pallava Panorama' : duration === '1hour' ? '1-Hour Deep Architectural Walk' : '2-Hour Complete Pilgrim Odyssey'}
                </h3>
                <p className="text-xs text-[#D4A85A] font-subheading italic text-base mt-0.5">
                  Focus: {selectedInterests.join(', ')} • {pace.toUpperCase()} Pace
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPass}
                  className="px-4 py-2 rounded-xl bg-[#2B2118] border border-[#D4A85A]/40 text-xs text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-all flex items-center gap-1.5"
                >
                  {downloadedPass ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{downloadedPass ? 'Pass Saved' : 'Export Trail Pass'}</span>
                </button>

                <button
                  onClick={() => onNavigate('heritage-map')}
                  className="px-4 py-2 rounded-xl bg-[#D4A85A] text-[#17130F] text-xs font-bold uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors flex items-center gap-1.5 shadow"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>
              </div>
            </div>

            {/* Generated Waypoint Breakdown */}
            <div className="space-y-4">
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#D4A85A]">
                Calibrated Waypoint Timeline
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-2">
                  <div className="text-[11px] font-bold text-[#D4A85A] uppercase flex items-center justify-between">
                    <span>Stop 1 • 00:00</span>
                    <span>12 Mins</span>
                  </div>
                  <h5 className="font-display text-base font-bold text-[#F3EBDD]">
                    Shore Temple: Eastern Vimana
                  </h5>
                  <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                    Capture the early morning sun striking the basalt Shiva Lingam through the ocean breakwater portal.
                  </p>
                  <div className="text-[10px] text-amber-300 font-medium">📸 Photo Spot: Groyne rock vantage</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-2">
                  <div className="text-[11px] font-bold text-[#D4A85A] uppercase flex items-center justify-between">
                    <span>Stop 2 • +15:00</span>
                    <span>10 Mins</span>
                  </div>
                  <h5 className="font-display text-base font-bold text-[#F3EBDD]">
                    Arjuna's Penance Bas-Relief
                  </h5>
                  <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                    Examine the central natural rainwater fissure depicting the descent of the sacred Ganga river from the heavens.
                  </p>
                  <div className="text-[10px] text-amber-300 font-medium">📜 Inscription Fact: Over 100 celestial figures</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-2">
                  <div className="text-[11px] font-bold text-[#D4A85A] uppercase flex items-center justify-between">
                    <span>Stop 3 • +25:00</span>
                    <span>15 Mins</span>
                  </div>
                  <h5 className="font-display text-base font-bold text-[#F3EBDD]">
                    Pancha Rathas (Five Chariots)
                  </h5>
                  <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                    Walk clockwise around the monolithic Dharmaraja and Bhima Rathas to observe 7th-century quarry tool marks.
                  </p>
                  <div className="text-[10px] text-amber-300 font-medium">🏛️ Architecture: Monolithic granite prototype</div>
                </div>
              </div>
            </div>

            {/* Next Demo Navigation */}
            <div className="pt-4 border-t border-[#D4A85A]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#F3EBDD]/70">
                Next in the main demo journey: Inspect the spatial route on the <span className="text-[#D4A85A] font-semibold">Interactive Heritage Map</span>.
              </div>

              <button
                id="btn-trail-to-map"
                onClick={() => onNavigate('heritage-map')}
                className="px-6 py-2.5 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Proceed to Heritage Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
