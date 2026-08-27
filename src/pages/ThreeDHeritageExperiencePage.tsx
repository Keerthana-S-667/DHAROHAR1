import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Box, Sparkles, Volume2, VolumeX, Play, Pause, Square, Info } from 'lucide-react';
import { Language, MonumentHotspot } from '../types';
import { heritageService } from '../services/heritageService';
import { voiceService } from '../services/voiceService';
import { aiService } from '../services/aiService';
import { DharoharAIChat } from '../components/DharoharAIChat';
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
  const [showDharoharAI, setShowDharoharAI] = useState(false);
  const [dharoharAIInitialQ, setDharoharAIInitialQ] = useState<string | undefined>();

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
      <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ArrowLeft className="w-12 h-12 text-[#b65a3a] mx-auto cursor-pointer" onClick={() => onNavigate('')} />
          <h2 className="text-xl font-bold">Monument not found</h2>
        </div>
      </div>
    );
  }

  // Generate Dharohar AI context for the current monument + selected hotspot
  const dharoharAIContext = useMemo(() => {
    if (!monument) return { researchMode: 'traveller' as const };
    return aiService.buildContext(monument as any, {
      selectedFeature: selectedHotspot?.name,
      selectedFeatureDescription: selectedHotspot?.shortDescription,
      selectedFeatureSignificance: selectedHotspot?.architecturalSignificance,
      researchMode: 'traveller'
    });
  }, [monument, selectedHotspot]);

  // Handle Ask Dharohar AI click — open inline with auto-question
  const handleAskDharoharAI = () => {
    if (selectedHotspot) {
      setDharoharAIInitialQ(`Explain the significance of the ${selectedHotspot.name} at ${monument?.name}.`);
    } else {
      setDharoharAIInitialQ(undefined);
    }
    setShowDharoharAI(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate(`monument/${monument.id}`)}
            className="hover:underline flex items-center gap-1.5 text-xs text-[#b65a3a] font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {monument.name}
          </button>

          <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider border border-[#aa7b3f]/30 px-3 py-1 rounded-full bg-[#ede3d1]/40">
            Spatial Reconstruction Studio
          </span>
        </div>

        {/* Monument Header Meta Section */}
        <div className="border-b border-[#aa7b3f]/20 pb-6 space-y-2">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#4b2f23] tracking-tight">
            {monument.name} 3D Explorer
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#4b2f23]/70">
            <span>Location: <strong className="text-[#4b2f23]">{monument.location.city}, {monument.location.state}</strong></span>
            <span className="hidden sm:inline text-[#b65a3a]/40">•</span>
            <span>Historical Period: <strong className="text-[#4b2f23]">{monument.period}</strong></span>
            <span className="hidden sm:inline text-[#b65a3a]/40">•</span>
            <span>Dynasty: <strong className="text-[#4b2f23]">{monument.dynasty}</strong></span>
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
            <div className="p-4 rounded-2xl bg-[#ede3d1]/60 border border-[#aa7b3f]/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#b65a3a] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-[#4b2f23]">Architectural Spatial Walkthrough</h4>
                <p className="text-[#4b2f23]/70 leading-relaxed">
                  Interact with the wireframe viewport using your cursor or touchscreen inputs. Selecting any floating labels will unlock deeper structural details, oral legends, and architectural context panels.
                </p>
              </div>
            </div>
          </div>

          {/* Right Architectural Data Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Hotspots Info Showcase Panel */}
            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 shadow-2xl space-y-6">
              {!selectedHotspot ? (
                <div className="text-center py-12 space-y-3">
                  <Box className="w-10 h-10 text-[#b65a3a]/30 mx-auto animate-pulse" />
                  <p className="text-xs text-[#4b2f23]/60 max-w-xs mx-auto">
                    Select a highlighted architectural feature on the 3D model to explore its design history and legends.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                  {/* Title and Audio Playback */}
                  <div className="space-y-3 pb-4 border-b border-[#aa7b3f]/20">
                    <span className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-wider block">
                      Feature Analysis
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#4b2f23]">
                      {selectedHotspot.name}
                    </h3>
                    
                    {/* Audio Controls */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#4b2f23]/60 uppercase font-semibold">Narrator Voice:</span>
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
                                  ? 'bg-[#b65a3a] text-white'
                                  : 'bg-[#f5f0e6] text-[#4b2f23]/60 hover:text-[#4b2f23]'
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
                            className="flex-1 py-2 rounded-xl bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer hover:bg-[#f5f0e6] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Listen
                          </button>
                        )}
                        
                        <button
                          onClick={handleStopAudio}
                          disabled={audioState === 'idle'}
                          className="px-3 py-2 rounded-xl bg-[#f5f0e6] border border-red-900/40 text-red-400 font-bold text-xs uppercase hover:bg-red-950/20 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Square className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Feature description blocks */}
                  <div className="space-y-4 text-xs leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#b65a3a] uppercase tracking-wider font-bold block">What is it?</span>
                      <p className="text-[#4b2f23]/90">{selectedHotspot.shortDescription}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#b65a3a] uppercase tracking-wider font-bold block">Historical Significance</span>
                      <p className="text-[#4b2f23]/80">{selectedHotspot.historicalSignificance}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#b65a3a] uppercase tracking-wider font-bold block">Architectural Design</span>
                      <p className="text-[#4b2f23]/80">{selectedHotspot.architecturalSignificance}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#b65a3a] uppercase tracking-wider font-bold block">Story & Legend</span>
                      <p className="text-[#4b2f23]/80 italic">"{selectedHotspot.story}"</p>
                    </div>
                  </div>

                  {/* Ask Dharohar AI contextual link */}
                  <button
                    onClick={handleAskDharoharAI}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4A85A] to-amber-600 text-white font-bold text-xs uppercase tracking-wider hover:from-[#F3EBDD] hover:to-[#D4A85A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4A85A]/15"
                  >
                    <Sparkles className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} />
                    <span>Ask Dharohar AI</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Dharohar AI Chat Overlay Panel */}
      {showDharoharAI && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowDharoharAI(false); setDharoharAIInitialQ(undefined); } }}
        >
          <div className="w-full max-w-xl animate-in slide-in-from-bottom duration-300">
            <DharoharAIChat
              context={dharoharAIContext}
              initialQuestion={dharoharAIInitialQ}
              onClose={() => { setShowDharoharAI(false); setDharoharAIInitialQ(undefined); }}
              embedded={true}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};
