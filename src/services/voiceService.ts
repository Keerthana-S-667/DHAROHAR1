/**
 * DHAROHAR Voice Service — Browser TTS Wrapper
 * Centralises all speechSynthesis logic. Pages must NOT call speechSynthesis directly.
 */

export interface VoiceServiceOptions {
  text: string;
  language: 'en' | 'ta' | 'hi';
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onEnd?: () => void;
}

/** Language-code to BCP-47 locale preference order */
const LANG_LOCALES: Record<string, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
  ta: ['ta-IN', 'ta'],
  hi: ['hi-IN', 'hi']
};

/** Pick the best available SpeechSynthesisVoice for a given language */
function pickVoice(lang: 'en' | 'ta' | 'hi'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferred = LANG_LOCALES[lang];
  for (const locale of preferred) {
    const match = voices.find((v) => v.lang === locale || v.lang.startsWith(locale));
    if (match) return match;
  }
  return null;
}

/** Check if a language has any available voice on this device */
function hasVoice(lang: 'en' | 'ta' | 'hi'): boolean {
  return pickVoice(lang) !== null;
}

export const voiceService = {
  /**
   * Triggers text-to-speech using native browser SpeechSynthesis.
   * Always cancels any currently-playing narration before starting a new one.
   */
  speak(options: VoiceServiceOptions) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Non-browser fallback (SSR safety)
      if (options.onStart) options.onStart();
      setTimeout(() => { if (options.onEnd) options.onEnd(); }, 3000);
      return;
    }

    // Stop anything currently playing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(options.text);

    // Prefer a detected regional voice, fall back to lang string only
    const voice = pickVoice(options.language);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = LANG_LOCALES[options.language][0];
    }

    utterance.rate = 0.9;  // Slightly slower for heritage context
    utterance.pitch = 1.0;

    utterance.onstart = () => { if (options.onStart) options.onStart(); };
    utterance.onend   = () => { if (options.onEnd)   options.onEnd();   };
    utterance.onerror = (e) => {
      console.error('[voiceService] SpeechSynthesis error:', e.error);
      if (options.onStop) options.onStop();
    };

    // Chrome fix: voices may not be loaded yet on first call
    const startSpeech = () => window.speechSynthesis.speak(utterance);
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = startSpeech;
    } else {
      startSpeech();
    }
  },

  pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  },

  resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  },

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  },

  isPaused(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.paused;
  },

  /** Returns true if the device has any voice for the given language. */
  isLanguageSupported(lang: 'en' | 'ta' | 'hi'): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    // English fallback always assumed available even if no exact locale
    if (lang === 'en') return true;
    return hasVoice(lang);
  },

  /** Returns true if browser TTS is available at all. */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
};
