import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Volume2, VolumeX, Play, Pause, 
  Clock, Languages, AlertCircle, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';
import { Language } from '../types';

interface AIAudioHeritageGuideProps {
  monument: {
    id: string;
    name: string;
    nativeName?: string;
    location: { city: string; state: string };
    period: string;
    dynasty: string;
    ruler?: string;
    architectureStyle?: string;
    material?: string;
    culturalSignificance?: string;
    history: string;
    stories?: { title: string; narrative: string }[];
    historicalTimeline?: { year: string; period: string; description: string }[];
  };
  language: Language;
  onClose: () => void;
}

const MODES = [
  { id: 'quick', title: 'Quick Tour', duration: '1 min', desc: 'Short introduction, key highlights, and one memorable fact.' },
  { id: 'detailed', title: 'Detailed Tour', duration: '3-5 mins', desc: 'Comprehensive coverage of history, construction, architecture, and preservation.' },
  { id: 'story', title: 'Story Mode', duration: '2-3 mins', desc: 'Engaging narrative that weaves history and architectural features into a story.' },
  { id: 'architecture', title: 'Architecture Mode', duration: '2-3 mins', desc: 'Focus on architectural style, construction techniques, and design elements.' },
  { id: 'history', title: 'History Mode', duration: '2-3 mins', desc: 'Focus on dynastic chronology, rulers, and significant historical transitions.' },
  { id: 'student', title: 'Student Mode', duration: '1-2 mins', desc: 'Simple educational explanation containing memorable facts and points.' },
  { id: 'accessible', title: 'Accessible Mode', duration: '2-3 mins', desc: 'Detailed descriptions of visual elements using a slightly slower speech rate.' }
];

export const AIAudioHeritageGuide: React.FC<AIAudioHeritageGuideProps> = ({
  monument,
  language: initialLanguage,
  onClose
}) => {
  const [step, setStep] = useState<'select' | 'loading' | 'player'>('select');
  const [selectedMode, setSelectedMode] = useState<string>('story');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(initialLanguage);
  
  // Loading sub-state
  const [loadingPhase, setLoadingPhase] = useState<'gemini' | 'tts'>('gemini');
  
  // Audio state
  const [transcript, setTranscript] = useState<string>('');
  const [audioDurationStr, setAudioDurationStr] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [audioError, setAudioError] = useState<boolean>(false);

  // HTML5 audio elements control
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Sync speed for accessible mode default
  useEffect(() => {
    if (selectedMode === 'accessible') {
      setPlaybackSpeed(0.8);
    } else {
      setPlaybackSpeed(1.0);
    }
  }, [selectedMode]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleGenerate = async () => {
    setErrorMsg('');
    setAudioError(false);
    setStep('loading');
    setLoadingPhase('gemini');

    // Build payload using monument context data
    const payload = {
      monumentId: monument.id,
      monumentName: monument.name,
      location: `${monument.location.city}, ${monument.location.state}`,
      period: monument.period,
      dynasty: monument.dynasty,
      ruler: monument.ruler || '',
      architecturalStyle: monument.architectureStyle || '',
      constructionMaterial: monument.material || '',
      culturalSignificance: monument.culturalSignificance || '',
      history: monument.history,
      stories: monument.stories || [],
      timeline: monument.historicalTimeline || [],
      mode: selectedMode,
      language: selectedLanguage
    };

    try {
      // 1. Fetch Narration Text (Gemini)
      const narrationRes = await fetch('/api/heritage-audio/narration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!narrationRes.ok) {
        throw new Error('Narration generation failed');
      }

      const narrationData = await narrationRes.json();
      setTranscript(narrationData.text);
      setAudioDurationStr(narrationData.duration);

      // Transition to TTS phase
      setLoadingPhase('tts');

      // Create audio element
      const audioUrl = `/api/heritage-audio/speech?monumentId=${monument.id}&mode=${selectedMode}&language=${selectedLanguage}`;
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Attach audio events
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      audio.onvolumechange = () => {
        setIsMuted(audio.muted);
        setVolume(audio.volume);
      };
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onloadedmetadata = () => setDuration(audio.duration);
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setAudioError(true);
        setErrorMsg('Unable to play the audio guide. You can still read the transcript below.');
      };

      // Apply default speed
      audio.playbackRate = selectedMode === 'accessible' ? 0.8 : playbackSpeed;

      // Start loading audio
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        // Set a timeout of 15 seconds for TTS synthesis
        const timeout = setTimeout(() => {
          reject(new Error('Audio loading timeout'));
        }, 15000);
        
        audio.onloadstart = () => {
          // ensure timeout keeps tracking
        };
      });

      setStep('player');
      audio.play().catch(err => {
        console.warn('Auto-play blocked by browser. User must click Play.', err);
      });

    } catch (err) {
      console.error('AI Guide generation error:', err);
      setStep('player');
      setAudioError(true);
      setErrorMsg('Unable to generate the audio guide right now. Please try again.');
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || audioError) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error(err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    audioRef.current.muted = newVolume === 0;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleBackToSelect = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setStep('select');
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Section */}
        <div className="px-6 py-4 bg-[#ede3d1] border-b border-[#aa7b3f]/25 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#b65a3a]" />
              <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-widest">
                Dharohar AI Experience
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#4b2f23] mt-0.5 font-bold">
              AI Audio Heritage Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-300/20 text-[#4b2f23]/60 hover:text-[#4b2f23] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: SELECTOR STATE */}
          {step === 'select' && (
            <div className="space-y-6">
              
              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold text-[#b65a3a] flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  Select Audio Language
                </label>
                <div className="flex gap-2">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'ta', label: 'தமிழ் (Tamil)' },
                    { code: 'hi', label: 'हिन्दी (Hindi)' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code as Language)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedLanguage === lang.code
                          ? 'bg-[#b65a3a] border-[#b65a3a] text-white shadow-md'
                          : 'bg-[#ede3d1] border-[#aa7b3f]/30 text-[#4b2f23] hover:bg-[#ede3d1]/70'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-3">
                <label className="text-[11px] uppercase font-bold text-[#b65a3a] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  How would you like to experience this monument?
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer hover:shadow-md h-28 ${
                        selectedMode === mode.id
                          ? 'bg-[#ede3d1] border-[#b65a3a] ring-2 ring-[#b65a3a]/20'
                          : 'bg-[#ede3d1]/40 border-[#aa7b3f]/25 text-[#4b2f23] hover:bg-[#ede3d1]/60'
                      }`}
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold text-xs text-[#4b2f23]">{mode.title}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#b65a3a]/10 text-[#b65a3a] font-bold">
                            {mode.duration}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#4b2f23]/70 mt-1 line-clamp-2 leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                      <div className="w-full text-right mt-1">
                        <span className={`text-[9px] font-bold ${selectedMode === mode.id ? 'text-[#b65a3a]' : 'text-[#4b2f23]/40'}`}>
                          Select Mode &rarr;
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  className="w-full py-4 rounded-2xl bg-[#b65a3a] hover:bg-[#9a472a] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#b65a3a]/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Audio Guide</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOADING STATE */}
          {step === 'loading' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#b65a3a]/20 border-t-[#b65a3a] animate-spin" />
                <Sparkles className="w-6 h-6 text-[#b65a3a] absolute inset-0 m-auto animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-display font-bold text-sm text-[#4b2f23]">
                  {loadingPhase === 'gemini' 
                    ? 'Creating your heritage story...'
                    : 'Preparing your audio guide...'
                  }
                </h4>
                <p className="text-xs text-[#4b2f23]/60 max-w-xs mx-auto leading-relaxed">
                  {loadingPhase === 'gemini'
                    ? 'Consulting historical chronicles and crafting customized narration scripts.'
                    : 'Converting script text into clear, high-fidelity neural audio guidance.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: PLAYER STATE */}
          {step === 'player' && (
            <div className="space-y-6">
              
              {/* Back Link */}
              <button
                onClick={handleBackToSelect}
                className="text-xs font-bold text-[#b65a3a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                &larr; Choose a different mode or language
              </button>

              {/* Error Callout if applicable */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-900/10 border border-red-900/20 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Player Card */}
              <div className="p-6 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/30 space-y-4 shadow-sm">
                
                {/* Header Information */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-wider block">
                      AI Generated Narration
                    </span>
                    <h4 className="font-bold text-sm text-[#4b2f23] mt-0.5">
                      {monument.name}
                    </h4>
                    <p className="text-[10px] text-[#4b2f23]/60 mt-0.5">
                      {MODES.find(m => m.id === selectedMode)?.title} &bull; {selectedLanguage === 'ta' ? 'Tamil' : selectedLanguage === 'hi' ? 'Hindi' : 'English'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#b65a3a] bg-[#f5f0e6] px-2.5 py-1 rounded-lg border border-[#aa7b3f]/25">
                    {audioDurationStr || formatTime(duration || 0)}
                  </span>
                </div>

                {/* Progress Bar */}
                {!audioError && (
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full accent-[#b65a3a] h-1 bg-[#f5f0e6] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-[#4b2f23]/60">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}

                {/* Primary Audio Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  
                  {/* Play & Speed */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      disabled={audioError}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow ${
                        audioError 
                          ? 'bg-stone-400 cursor-not-allowed opacity-50' 
                          : 'bg-[#b65a3a] hover:bg-[#9a472a] cursor-pointer'
                      }`}
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
                    </button>
                    
                    {/* Playback Speed Option */}
                    {!audioError && (
                      <div className="flex bg-[#f5f0e6] rounded-xl p-0.5 border border-[#aa7b3f]/20">
                        {[0.8, 1.0, 1.25, 1.5].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                              playbackSpeed === speed
                                ? 'bg-[#b65a3a] text-white shadow-sm'
                                : 'text-[#4b2f23]/65 hover:text-[#4b2f23]'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Volume Control */}
                  {!audioError && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="text-[#4b2f23]/70 hover:text-[#b65a3a] transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-20 accent-[#b65a3a] h-1 bg-[#f5f0e6] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}

                </div>

              </div>

              {/* Transcript Section */}
              {transcript && (
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold text-[#b65a3a] block">
                    Audio Transcript
                  </label>
                  <div className="p-5 rounded-2xl bg-[#ede3d1]/40 border border-[#aa7b3f]/20 max-h-60 overflow-y-auto text-xs leading-relaxed text-[#4b2f23] font-subheading space-y-3">
                    {transcript.split('\n\n').map((para, index) => (
                      <p key={index}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
