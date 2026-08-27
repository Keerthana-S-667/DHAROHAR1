import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Compass, ShieldAlert, Navigation } from 'lucide-react';
import { Language } from '../types';
import { heritageService } from '../services/heritageService';

interface TravellerNavigatePlaceholderPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const TravellerNavigatePlaceholderPage: React.FC<TravellerNavigatePlaceholderPageProps> = ({
  onNavigate,
  language
}) => {
  const { monumentId } = useParams<{ monumentId: string }>();
  const monument = monumentId ? heritageService.getMonumentById(monumentId) : undefined;

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#D4A85A]/15 border border-[#D4A85A]/40 text-[#D4A85A] flex items-center justify-center mx-auto">
          <Navigation className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#F3EBDD]">
            Navigation Active
          </h2>
          <p className="text-xs text-[#D4A85A] font-semibold italic">
            Routing to {monument?.name || 'Heritage Monument'}...
          </p>
          <p className="text-[11px] text-[#F3EBDD]/70 leading-relaxed pt-2">
            Step 6 Placeholder: Digital companion setup in progress. Real-time GPS arrival detection is configured for coordinates {monument?.location.lat.toFixed(4)}° N, {monument?.location.lng.toFixed(4)}° E.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => onNavigate('traveller/map')}
            className="py-3 px-6 rounded-xl bg-[#2B2118] border border-[#D4A85A]/40 text-[#D4A85A] font-bold text-xs uppercase tracking-wider hover:bg-[#17130F] transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Map
          </button>
        </div>
      </div>
    </div>
  );
};
