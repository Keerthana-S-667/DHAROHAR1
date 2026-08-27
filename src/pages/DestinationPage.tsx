import React from 'react';
import { heritageService } from '../services/heritageService';
import { Destination, Language, StateData } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Navigation, 
  ChevronRight, 
  Eye, 
  Landmark,
  Compass
} from 'lucide-react';
import { HeritageImage } from '../components/HeritageImage';

interface DestinationPageProps {
  destinationId: string;
  onNavigate: (route: string) => void;
  language: Language;
}

export const DestinationPage: React.FC<DestinationPageProps> = ({
  destinationId,
  onNavigate
}) => {
  const statesData = heritageService.getStates();
  const monuments = heritageService.getMonuments();

  // Find destination across states
  let currentDest: Destination | undefined;
  let currentState: StateData | undefined;

  for (const s of statesData) {
    const found = s.destinations.find((d) => d.id === destinationId);
    if (found) {
      currentDest = found;
      currentState = s;
      break;
    }
  }

  // Fallback to Mahabalipuram if not found
  if (!currentDest || !currentState) {
    currentDest = statesData[0].destinations[0];
    currentState = statesData[0];
  }

  const destinationMonuments = currentDest.monumentIds
    .map((id) => monuments[id])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#D4A85A]">
          <button
            onClick={() => onNavigate(`state/${currentState?.id}`)}
            className="hover:underline flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {currentState.name}
          </button>
          <span className="text-[#F3EBDD]/40">/</span>
          <span className="text-[#F3EBDD] font-bold">{currentDest.name}</span>
        </div>

        {/* Destination Header with Heading: "Where Stone Became Story" */}
        <div className="relative rounded-3xl overflow-hidden border border-[#D4A85A]/40 bg-[#2B2118] shadow-2xl">
          <div className="relative h-80 sm:h-[400px] w-full">
            <HeritageImage
              src={currentDest.heroImage}
              alt={currentDest.name}
              fallbackName={currentDest.name}
              className="w-full h-full object-cover filter brightness-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17130F] via-[#17130F]/60 to-transparent" />
            
            <div className="absolute bottom-8 left-6 sm:left-10 right-6 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17130F]/90 border border-[#D4A85A]/40 text-xs text-[#D4A85A] font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                {currentState.name} • UNESCO Cultural Heritage
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
                {currentDest.name}
              </h1>

              <p className="font-subheading text-2xl sm:text-3xl text-[#D4A85A] italic font-semibold">
                “{currentDest.tagline}”
              </p>
            </div>
          </div>

          {/* Destination Narrative and Travel Context */}
          <div className="p-6 sm:p-10 space-y-8 bg-[#17130F]/95">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-display text-xl font-bold text-[#F3EBDD]">
                  The Maritime & Architectural Chronicle
                </h3>
                <p className="text-xs sm:text-sm text-[#F3EBDD]/80 leading-relaxed">
                  {currentDest.description}
                </p>
                <p className="text-xs sm:text-sm text-[#F3EBDD]/70 leading-relaxed pt-2 border-t border-[#D4A85A]/10">
                  <span className="text-[#D4A85A] font-semibold">Historical Context: </span>
                  {currentDest.historicalContext}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-[#D4A85A] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Optimal Visiting Window
                  </div>
                  <p className="text-xs text-[#F3EBDD]/80">
                    {currentDest.bestTimeToVisit}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-[#D4A85A]/20">
                  <div className="text-xs font-bold text-[#D4A85A] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    Geographical Setting
                  </div>
                  <p className="text-xs text-[#F3EBDD]/80">
                    {currentDest.geographicHighlight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Image Gallery */}
        {currentDest.imageGallery && currentDest.imageGallery.length > 0 && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-6">
            <h3 className="font-display text-xl font-bold text-[#F3EBDD] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4A85A]" />
              Photo Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentDest.imageGallery.map((img, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden border border-[#D4A85A]/30 bg-[#17130F] h-56 shadow-lg">
                  <HeritageImage
                    src={img.url}
                    alt={`${currentDest.name} Gallery ${i + 1}`}
                    fallbackName={`${currentDest.name} Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17130F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monuments Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D4A85A]/20">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4A85A]">
                Living Epigraphs & Masonry
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F3EBDD]">
                Monuments of {currentDest.name.split('(')[0]}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinationMonuments.map((monument) => (
              <div
                key={monument.id}
                id={`monument-card-${monument.id}`}
                className="group rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 overflow-hidden hover:border-[#D4A85A] transition-all hover:shadow-2xl hover:shadow-[#D4A85A]/20 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <HeritageImage
                      src={monument.heroImage}
                      alt={monument.name}
                      fallbackName={monument.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B2118] via-[#2B2118]/40 to-transparent" />
                    
                    {monument.has3DModel && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#17130F]/90 backdrop-blur-md border border-[#D4A85A] text-xs font-bold text-[#D4A85A] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        3D Model Ready
                      </div>
                    )}

                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[11px] font-bold text-[#D4A85A] uppercase tracking-wider">
                        {monument.period} • {monument.dynasty}
                      </div>
                      <h3 className="font-display text-2xl font-bold text-[#F3EBDD] group-hover:text-[#D4A85A] transition-colors">
                        {monument.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="font-subheading text-base italic text-[#D4A85A]">
                      {monument.tagline}
                    </p>
                    <p className="text-xs text-[#F3EBDD]/70 line-clamp-3 leading-relaxed">
                      {monument.culturalSignificance}
                    </p>

                    <div className="p-3 rounded-xl bg-[#17130F]/80 border border-[#D4A85A]/20 text-xs space-y-1">
                      <div className="text-[10px] uppercase text-[#D4A85A] font-semibold">Architectural Style</div>
                      <div className="text-xs font-medium text-[#F3EBDD]">{monument.architectureStyle}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-3">
                  <button
                    id={`view-monument-btn-${monument.id}`}
                    onClick={() => onNavigate(`monument/${monument.id}`)}
                    className="flex-1 py-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/40 text-[#F3EBDD] text-xs font-bold uppercase tracking-wider hover:border-[#D4A85A] hover:bg-[#2B2118] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Chronicle</span>
                    <ChevronRight className="w-4 h-4 text-[#D4A85A]" />
                  </button>

                  {monument.has3DModel ? (
                    <button
                      id={`explore-3d-btn-${monument.id}`}
                      onClick={() => onNavigate('3d-explorer')}
                      className="px-5 py-3 rounded-xl bg-[#D4A85A] text-[#17130F] text-xs font-bold uppercase tracking-wider hover:bg-[#F3EBDD] transition-all flex items-center gap-1.5 shadow-lg shadow-[#D4A85A]/20"
                    >
                      <Eye className="w-4 h-4" />
                      <span>3D</span>
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
