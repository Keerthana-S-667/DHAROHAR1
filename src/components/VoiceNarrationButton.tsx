import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Square, Play } from 'lucide-react';
import { voiceService } from '../services/voiceService';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface VoiceNarrationButtonProps {
  /** The text to narrate */
  text: string;
  /** Current app language */
  language: Language;
  /** Optional accessible label override */
  ariaLabel?: string;
  /** Compact = icon-only pill; full = icon + label */
  variant?: 'compact' | 'full';
  /** Extra className for the button */
  className?: string;
}

type PlayState = 'idle' | 'playing' | 'paused';

export const VoiceNarrationButton: React.FC<VoiceNarrationButtonProps> = ({
  text,
  language,
  ariaLabel,
  variant = 'full',
  className = ''
}) => {
  const [state, setState] = useState<PlayState>('idle');
  const t = TRANSLATIONS[language].voice;

  const isAvailable = voiceService.isAvailable();
  const isLangSupported = voiceService.isLanguageSupported(language);

  // Stop narration when component unmounts (page navigation)
  useEffect(() => {
    return () => {
      voiceService.stop();
    };
  }, []);

  // Stop narration when text changes (hotspot switch)
  useEffect(() => {
    if (state !== 'idle') {
      voiceService.stop();
      setState('idle');
    }
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = useCallback(() => {
    if (!isAvailable) return;

    if (state === 'paused') {
      voiceService.resume();
      setState('playing');
      return;
    }

    setState('playing');
    voiceService.speak({
      text,
      language,
      onStart: () => setState('playing'),
      onEnd:   () => setState('idle'),
      onStop:  () => setState('idle')
    });
  }, [state, text, language, isAvailable]);

  const handlePause = useCallback(() => {
    voiceService.pause();
    setState('paused');
  }, []);

  const handleStop = useCallback(() => {
    voiceService.stop();
    setState('idle');
  }, []);

  // Not available at all
  if (!isAvailable) {
    return (
      <span className={`text-[10px] text-[#F3EBDD]/40 italic ${className}`}>
        {t.notAvailable}
      </span>
    );
  }

  // Language not supported — show faded button with tooltip
  const langUnsupported = language !== 'en' && !isLangSupported;

  const label = state === 'playing' ? t.playing : state === 'paused' ? t.paused : t.listen;
  const ariaLabelFinal = ariaLabel ?? `${t.listen} narration`;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {state === 'playing' ? (
          <>
            <button
              onClick={handlePause}
              aria-label={t.pause}
              title={t.pause}
              className="p-1.5 rounded-lg bg-[#D4A85A]/20 hover:bg-[#D4A85A]/30 text-[#D4A85A] transition-colors cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleStop}
              aria-label={t.stop}
              title={t.stop}
              className="p-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/30 text-red-400 transition-colors cursor-pointer"
            >
              <Square className="w-3 h-3" />
            </button>
          </>
        ) : (
          <button
            onClick={handlePlay}
            disabled={langUnsupported}
            aria-label={ariaLabelFinal}
            title={langUnsupported ? t.notAvailable : ariaLabelFinal}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              state === 'paused'
                ? 'bg-amber-700/30 hover:bg-amber-700/40 text-amber-400'
                : 'bg-[#D4A85A]/15 hover:bg-[#D4A85A]/25 text-[#D4A85A]'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {state === 'paused' ? <Play className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {state === 'idle' || state === 'paused' ? (
        <button
          onClick={handlePlay}
          disabled={langUnsupported}
          aria-label={ariaLabelFinal}
          title={langUnsupported ? t.notAvailable : ariaLabelFinal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
            state === 'paused'
              ? 'bg-amber-800/30 border-amber-600/40 text-amber-400 hover:bg-amber-800/50'
              : 'bg-[#2B2118] border-[#D4A85A]/40 text-[#D4A85A] hover:bg-[#D4A85A]/10'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          {state === 'paused'
            ? <><Play className="w-3.5 h-3.5" /><span>{t.resume}</span></>
            : <><Volume2 className="w-3.5 h-3.5" /><span>{label}</span></>
          }
        </button>
      ) : (
        <>
          <button
            onClick={handlePause}
            aria-label={t.pause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D4A85A] text-[#17130F] cursor-pointer hover:bg-amber-400 transition-colors"
          >
            <Pause className="w-3.5 h-3.5 animate-pulse" style={{ animationDuration: '1.5s' }} />
            <span>{t.pause}</span>
          </button>
          <button
            onClick={handleStop}
            aria-label={t.stop}
            className="p-1.5 rounded-full bg-[#2B2118] border border-red-900/40 text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <Square className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
};
