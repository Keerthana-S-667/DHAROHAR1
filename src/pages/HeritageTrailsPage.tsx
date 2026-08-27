import React, { useState } from 'react';
import { heritageService } from '../services/heritageService';
import { HeritageTrail, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  CheckCircle2,
  ChevronRight,
  Info,
  Footprints,
  Sliders
} from 'lucide-react';

interface HeritageTrailsPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const HeritageTrailsPage: React.FC<HeritageTrailsPageProps> = ({
  onNavigate,
  language
}) => {
  const heritageTrails = heritageService.getHeritageTrails();
  const [selectedTrail, setSelectedTrail] = useState<HeritageTrail>(heritageTrails[0]);
  const t = TRANSLATIONS[language].trails;

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D4A85A]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B2118] border border-[#D4A85A]/40 text-xs text-[#D4A85A] font-semibold uppercase tracking-wider mb-2">
              <Navigation className="w-3.5 h-3.5" />
              Thematic Field Expeditions
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#F3EBDD]/80 font-subheading italic text-lg text-[#D4A85A] mt-1">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('personalized-trail')}
            className="px-5 py-2.5 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors flex items-center gap-2 shadow-md self-start sm:self-auto"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Generate Personalized Trail</span>
          </button>
        </div>

        {/* Trail Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heritageTrails.map((trail) => {
            const isSelected = selectedTrail.id === trail.id;
            return (
              <button
                key={trail.id}
                onClick={() => setSelectedTrail(trail)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-[#2B2118] border-[#D4A85A] shadow-xl shadow-[#D4A85A]/15 scale-[1.02]'
                    : 'bg-[#17130F] border-[#D4A85A]/30 hover:border-[#D4A85A]/60 hover:bg-[#2B2118]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#D4A85A] font-semibold mb-1">
                    <span>{trail.region.split('•')[0]}</span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-[#F3EBDD]/70">
                      <Clock className="w-3 h-3 text-[#D4A85A]" />
                      {trail.duration}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#F3EBDD] leading-snug">
                    {trail.title}
                  </h3>
                  <p className="text-xs text-[#F3EBDD]/60 mt-1 line-clamp-2">
                    {trail.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D4A85A]/20 flex items-center justify-between text-xs text-[#D4A85A]">
                  <span className="text-[11px] text-[#F3EBDD]/60">{trail.stops.length} Waypoints</span>
                  <span className="font-bold flex items-center gap-1">
                    {isSelected ? 'Viewing Trail' : 'Select'} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Trail Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#D4A85A]/40 bg-[#2B2118] shadow-2xl">
          <div className="relative h-72 sm:h-80 w-full">
            <img
              src={selectedTrail.heroImage}
              alt={selectedTrail.title}
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130F] via-[#17130F]/60 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17130F]/90 border border-[#D4A85A]/40 text-xs text-[#D4A85A] font-semibold">
                <Compass className="w-3.5 h-3.5" />
                {selectedTrail.region} • {selectedTrail.distance}
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#F3EBDD]">
                {selectedTrail.title}
              </h2>
              <p className="font-subheading text-lg sm:text-xl text-[#D4A85A] italic">
                “{selectedTrail.subtitle}”
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-[#17130F] space-y-4">
            <p className="text-xs sm:text-sm text-[#F3EBDD]/80 leading-relaxed">
              {selectedTrail.description}
            </p>
            <div className="p-4 rounded-xl bg-[#2B2118] border border-[#D4A85A]/20 text-xs text-[#D4A85A] font-subheading italic text-base">
              📜 {selectedTrail.historicalNarrative}
            </div>
          </div>
        </div>

        {/* Step-by-Step Waypoints Sequence */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D4A85A]/20">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4A85A]">
                Waypoint Route Sequence
              </div>
              <h3 className="font-display text-2xl font-bold text-[#F3EBDD]">
                Step-by-Step Field Itinerary
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {selectedTrail.stops.map((stop, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#D4A85A] transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Order Number Badge */}
                  <div className="w-10 h-10 rounded-xl bg-[#17130F] border border-[#D4A85A] text-[#D4A85A] font-display font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                    0{stop.order}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-lg font-bold text-[#F3EBDD]">
                        {stop.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#D4A85A]/20 text-[#D4A85A]">
                        {stop.durationMinutes} Minutes Stay
                      </span>
                    </div>

                    <p className="text-xs text-[#F3EBDD]/80 leading-relaxed">
                      <span className="text-[#D4A85A] font-semibold">Architectural Highlight: </span>
                      {stop.keyHighlight}
                    </p>

                    {stop.distanceFromPrevious && (
                      <p className="text-[11px] text-[#B58A52] flex items-center gap-1 font-medium">
                        <Footprints className="w-3 h-3" />
                        {stop.distanceFromPrevious}
                      </p>
                    )}

                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-[#D4A85A] bg-[#17130F] px-3 py-1 rounded-lg border border-[#D4A85A]/20">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{stop.audioTrackTitle}</span>
                      </div>

                      <div className="text-[11px] text-[#F3EBDD]/60 italic">
                        Tip: {stop.tipForVisitor}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`monument/${stop.monumentId}`)}
                    className="px-4 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/40 text-[#D4A85A] text-xs font-semibold hover:bg-[#D4A85A] hover:text-[#17130F] transition-all"
                  >
                    View Monument
                  </button>
                  {stop.monumentId === 'shore-temple' && (
                    <button
                      onClick={() => onNavigate('3d-explorer')}
                      className="px-4 py-2 rounded-xl bg-[#D4A85A] text-[#17130F] text-xs font-bold uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors"
                    >
                      3D Model
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Next Action */}
        <div className="p-6 rounded-2xl bg-[#2B2118]/60 border border-[#D4A85A]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-base font-bold text-[#F3EBDD]">
              Want a trail calibrated to your exact schedule?
            </h4>
            <p className="text-xs text-[#F3EBDD]/70 mt-0.5">
              Customize 15-minute highlights, photography spots, or deep 2-hour architectural walks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('personalized-trail')}
            className="px-6 py-2.5 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors flex items-center gap-1.5 shadow"
          >
            <span>Personalized Trail Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
