import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Box, Sparkles, Volume2, VolumeX, Play, Pause, Square, Info } from 'lucide-react';
import { Language, MonumentHotspot } from '../types';
import { heritageService } from '../services/heritageService';
import { voiceService } from '../services/voiceService';
import { aiService } from '../services/aiService';
import { SutradharChat } from '../components/SutradharChat';
import { ThreeDViewer } from '../components/3d/ThreeDViewer';
import { MONUMENT_3D_HOTSPOTS } from '../data/threeDHotspots';

interface ThreeDHeritageExperiencePageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const ThreeDHeritageExperiencePage: React.FC<ThreeDHeritageExperiencePageProps> = ({
  onNavigate,
  language
}) => {
  const { monumentId } = useParams<{ monumentId: string }>();
  const monument = monumentId ? heritageService.getMonumentById(monumentId) : null;

  const [selectedHotspot, setSelectedHotspot] = useState<MonumentHotspot | null>(null);
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [audioLang, setAudioLang] = useState<'en' | 'ta' | 'hi'>(language);
  const [showSutradhar, setShowSutradhar] = useState(false);
  const [sutradharInitialQ, setSutradharInitialQ] = useState<string | undefined>();

  // Load hotspots database for the current monument
  const hotspots: MonumentHotspot[] = (monumentId && MONUMENT_3D_HOTSPOTS[monumentId]) || [];

  // Reset selected hotspot on monument switch
  useEffect(() => {
    setSelectedHotspot(null);
    voiceService.stop();
    setAudioState('idle');
  }, [monumentId]);

  // Sync audioLang with global language; stop current narration on change
  useEffect(() => {
    voiceService.stop();
    setAudioState('idle');
    setAudioLang(language);
  }, [language]);

  // Handle voice playback triggers
  const handlePlayAudio = () => {
    if (!selectedHotspot) return;
    
    if (audioState === 'paused') {
      voiceService.resume();
      setAudioState('playing');
      return;
    }

    const narrationText = `${selectedHotspot.name}. ${selectedHotspot.shortDescription}. Architectural significance: ${selectedHotspot.architecturalSignificance}. Story: ${selectedHotspot.story}`;

    voiceService.speak({
      text: narrationText,
      language: audioLang,
      onStart: () => setAudioState('playing'),
      onEnd: () => setAudioState('idle'),
      onStop: () => setAudioState('idle')
    });
  };

  const handlePauseAudio = () => {
    voiceService.pause();
    setAudioState('paused');
  };

  const handleStopAudio = () => {
    voiceService.stop();
    setAudioState('idle');
  };

  if (!monument) {
    return (
      <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ArrowLeft className="w-12 h-12 text-[#D4A85A] mx-auto cursor-pointer" onClick={() => onNavigate('')} />
          <h2 className="text-xl font-bold">Monument not found</h2>
        </div>
      </div>
    );
  }

  // Generate Sutradhar context for the current monument + selected hotspot
  const sutradharContext = useMemo(() => {
    if (!monument) return { researchMode: 'traveller' as const };
    return aiService.buildContext(monument as any, {
      selectedFeature: selectedHotspot?.name,
      selectedFeatureDescription: selectedHotspot?.shortDescription,
      selectedFeatureSignificance: selectedHotspot?.architecturalSignificance,
      researchMode: 'traveller'
    });
  }, [monument, selectedHotspot]);

  // Handle Ask Sutradhar click — open inline with auto-question
  const handleAskSutradhar = () => {
    if (selectedHotspot) {
      setSutradharInitialQ(`Explain the significance of the ${selectedHotspot.name} at ${monument?.name}.`);
    } else {
      setSutradharInitialQ(undefined);
    }
    setShowSutradhar(true);
  };

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate(`monument/${monument.id}`)}
            className="hover:underline flex items-center gap-1.5 text-xs text-[#D4A85A] font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {monument.name}
          </button>

          <span className="text-[10px] uppercase font-bold text-[#D4A85A] tracking-wider border border-[#D4A85A]/30 px-3 py-1 rounded-full bg-[#2B2118]/40">
            Spatial Reconstruction Studio
          </span>
        </div>

        {/* Monument Header Meta Section */}
        <div className="border-b border-[#D4A85A]/20 pb-6 space-y-2">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD] tracking-tight">
            {monument.name} 3D Explorer
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#F3EBDD]/70">
            <span>Location: <strong className="text-[#F3EBDD]">{monument.location.city}, {monument.location.state}</strong></span>
            <span className="hidden sm:inline text-[#D4A85A]/40">•</span>
            <span>Historical Period: <strong className="text-[#F3EBDD]">{monument.period}</strong></span>
            <span className="hidden sm:inline text-[#D4A85A]/40">•</span>
            <span>Dynasty: <strong className="text-[#F3EBDD]">{monument.dynasty}</strong></span>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main 3D Stage Column */}
          <div className="lg:col-span-8 space-y-6">
            <ThreeDViewer
              modelUrl={monument.threeDModelUrl}
              sketchfabId={monument.sketchfabId}
              sketchfabUrl={monument.sketchfabUrl}
              monumentId={monument.id}
              hotspots={hotspots}
              selectedHotspotId={selectedHotspot?.id || null}
              onSelectHotspot={setSelectedHotspot}
            />

            {/* General instruction banner */}
            <div className="p-4 rounded-2xl bg-[#2B2118]/60 border border-[#D4A85A]/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#D4A85A] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-[#F3EBDD]">Architectural Spatial Walkthrough</h4>
                <p className="text-[#F3EBDD]/70 leading-relaxed">
                  Interact with the wireframe viewport using your cursor or touchscreen inputs. Selecting any floating labels will unlock deeper structural details, oral legends, and architectural context panels.
                </p>
              </div>
            </div>
          </div>

          {/* Right Architectural Data Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Hotspots Info Showcase Panel */}
            <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl space-y-6">
              {!selectedHotspot ? (
                <div className="text-center py-12 space-y-3">
                  <Box className="w-10 h-10 text-[#D4A85A]/30 mx-auto animate-pulse" />
                  <p className="text-xs text-[#F3EBDD]/60 max-w-xs mx-auto">
                    Select a highlighted architectural feature on the 3D model to explore its design history and legends.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                  {/* Title and Audio Playback */}
                  <div className="space-y-3 pb-4 border-b border-[#D4A85A]/20">
                    <span className="text-[9px] uppercase font-bold text-[#D4A85A] tracking-wider block">
                      Feature Analysis
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#F3EBDD]">
                      {selectedHotspot.name}
                    </h3>
                    
                    {/* Audio Controls */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#F3EBDD]/60 uppercase font-semibold">Narrator Voice:</span>
                        <div className="flex gap-1.5">
                          {(['en', 'ta', 'hi'] as const).map((lang) => (
                            <button
                              key={lang}
                              onClick={() => {
                                setAudioLang(lang);
                                if (audioState !== 'idle') {
                                  handleStopAudio();
                                }
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                audioLang === lang
                                  ? 'bg-[#D4A85A] text-[#17130F]'
                                  : 'bg-[#17130F] text-[#F3EBDD]/60 hover:text-[#F3EBDD]'
                              }`}
                            >
                              {lang === 'en' ? 'EN' : lang === 'ta' ? 'தமிழ்' : 'हिन्दी'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {audioState === 'playing' ? (
                          <button
                            onClick={handlePauseAudio}
                            className="flex-1 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Pause className="w-3.5 h-3.5" />
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={handlePlayAudio}
                            className="flex-1 py-2 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer hover:bg-[#F3EBDD] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Listen
                          </button>
                        )}
                        
                        <button
                          onClick={handleStopAudio}
                          disabled={audioState === 'idle'}
                          className="px-3 py-2 rounded-xl bg-[#17130F] border border-red-900/40 text-red-400 font-bold text-xs uppercase hover:bg-red-950/20 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Square className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Feature description blocks */}
                  <div className="space-y-4 text-xs leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider font-bold block">What is it?</span>
                      <p className="text-[#F3EBDD]/90">{selectedHotspot.shortDescription}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider font-bold block">Historical Significance</span>
                      <p className="text-[#F3EBDD]/80">{selectedHotspot.historicalSignificance}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider font-bold block">Architectural Design</span>
                      <p className="text-[#F3EBDD]/80">{selectedHotspot.architecturalSignificance}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#D4A85A] uppercase tracking-wider font-bold block">Story & Legend</span>
                      <p className="text-[#F3EBDD]/80 italic">"{selectedHotspot.story}"</p>
                    </div>
                  </div>

                  {/* Ask Sutradhar contextual link */}
                  <button
                    onClick={handleAskSutradhar}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4A85A] to-amber-600 text-[#17130F] font-bold text-xs uppercase tracking-wider hover:from-[#F3EBDD] hover:to-[#D4A85A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4A85A]/15"
                  >
                    <Sparkles className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} />
                    <span>Ask Sutradhar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Sutradhar Chat Overlay Panel */}
      {showSutradhar && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowSutradhar(false); setSutradharInitialQ(undefined); } }}
        >
          <div className="w-full max-w-xl animate-in slide-in-from-bottom duration-300">
            <SutradharChat
              context={sutradharContext}
              initialQuestion={sutradharInitialQ}
              onClose={() => { setShowSutradhar(false); setSutradharInitialQ(undefined); }}
              embedded={true}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};
