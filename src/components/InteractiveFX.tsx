import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Sparkles, Search, Bot, Trophy, ArrowUp } from 'lucide-react';

interface InteractiveFXProps {
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const InteractiveFX: React.FC<InteractiveFXProps> = ({ onNavigate, onOpenSearch }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesizer for gentle feedback clicks without external audio files
  const playSubtleClick = (freq = 600, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context fallback ignore
    }
  };

  // Sparkle ripple effect on click
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Play click sound on interactive elements
      if (target.closest('button, a, input, select, [role="button"], .cursor-pointer')) {
        playSubtleClick(750);
      }

      // Spawn subtle golden sparkle ring at click position
      const ring = document.createElement('div');
      ring.className = 'fixed pointer-events-none z-50 w-6 h-6 rounded-full border border-[#aa7b3f]/60 animate-ping opacity-75';
      ring.style.left = `${e.clientX - 12}px`;
      ring.style.top = `${e.clientY - 12}px`;
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 600);
    };

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [soundEnabled]);

  // Global keyboard shortcuts (Cmd+K or Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSubtleClick(900);
  };

  return (
    <>
      {/* Floating Quick Action & Experience Bar */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 animate-in slide-in-from-bottom duration-500">
        {/* Scroll To Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            title="Scroll to top"
            className="w-10 h-10 rounded-full bg-[#f5f0e6] border-2 border-[#aa7b3f]/40 text-[#b65a3a] flex items-center justify-center shadow-xl hover:bg-[#ede3d1] hover:border-[#b65a3a] transition-all cursor-pointer hover:scale-110"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Quick Floating Dock */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#ede3d1]/90 backdrop-blur-md border border-[#aa7b3f]/40 shadow-2xl">
          {/* Quick Search */}
          <button
            onClick={() => { playSubtleClick(800); onOpenSearch(); }}
            title="Search Monuments (Ctrl+K)"
            className="p-2 rounded-full bg-[#f5f0e6] text-[#b65a3a] hover:bg-[#b65a3a] hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold px-3 shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline-block text-[9px] px-1 rounded bg-[#ede3d1] border border-[#aa7b3f]/30">⌘K</kbd>
          </button>

          {/* Quick AI Guide */}
          <button
            onClick={() => { playSubtleClick(850); onNavigate('ai-guide'); }}
            title="Open DHAROHAR AI Guide"
            className="p-2 rounded-full bg-[#b65a3a] text-white hover:bg-[#9e4a2e] transition-all cursor-pointer flex items-center gap-1 text-xs font-bold px-3 shadow-md"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Guide</span>
          </button>

          {/* Heritage Progress */}
          <button
            onClick={() => { playSubtleClick(900); onNavigate('research/progress'); }}
            title="View Student Progress & Badges"
            className="p-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 hover:bg-amber-500 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold px-2.5"
          >
            <Trophy className="w-3.5 h-3.5" />
          </button>

          {/* Mute / Unmute Audio Feedback */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSubtleClick(1000);
            }}
            title={soundEnabled ? 'Mute Interaction Sounds' : 'Unmute Interaction Sounds'}
            className="p-2 rounded-full text-[#4b2f23]/70 hover:text-[#b65a3a] transition-all cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        </div>
      </div>
    </>
  );
};
