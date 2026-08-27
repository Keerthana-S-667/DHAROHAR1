import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RefreshCw, MapPin, Crown, Layers, Crosshair } from 'lucide-react';
import { aiService, HeritageAIContext } from '../services/aiService';
import { VoiceNarrationButton } from './VoiceNarrationButton';
import { TRANSLATIONS } from '../data/translations';
import { Language } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'sutradhar';
  text: string;
  timestamp: string;
}

interface SutradharChatProps {
  context: HeritageAIContext;
  initialQuestion?: string;
  onClose?: () => void;
  embedded?: boolean;
  language?: Language;
}

/** Build mode-aware + language-aware suggestions */
function buildSuggestions(
  mode: 'traveller' | 'researcher',
  language: Language,
  featureName?: string
): string[] {
  if (featureName) {
    return [
      `Why is the ${featureName} architecturally important?`,
      `Explain the historical significance of the ${featureName}.`,
      `What construction technique was used for the ${featureName}?`,
      `What legends are associated with the ${featureName}?`
    ];
  }
  // Language-aware suggestions from translations
  const langSuggestions = TRANSLATIONS[language]?.sutradharQuestions;
  if (langSuggestions?.length) return langSuggestions;

  // English fallback per mode
  return mode === 'researcher'
    ? [
        'Explain the architectural style.',
        'Describe the construction technique.',
        'What dynasty commissioned this?',
        'What is its cultural significance?'
      ]
    : [
        'Tell me the story behind this monument.',
        'What should I see first here?',
        'Why was this built?',
        'Explain this simply.'
      ];
}

/** Strip simple markdown bold (**text**) to plain text for narration */
function stripBoldMarkdown(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

export const SutradharChat: React.FC<SutradharChatProps> = ({
  context,
  initialQuestion,
  onClose,
  embedded = false,
  language = 'en'
}) => {
  const mode = context.researchMode || 'traveller';
  const suggestions = buildSuggestions(mode, language as Language, context.selectedFeature);
  const tVoice = TRANSLATIONS[language as Language].voice;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'sutradhar',
      text: context.monument
        ? `Namaste! I am Sutradhar — your heritage guide for **${context.monument}**${context.selectedFeature ? `, with focus on the **${context.selectedFeature}**` : ''}. Ask me anything about its history, architecture, legends, or cultural significance.`
        : 'Namaste! I am Sutradhar, your AI heritage guide for Indian monuments. Ask me anything about history, architecture, dynasties, or cultural significance.',
      timestamp: 'Now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasApiKey] = useState(() => !!(import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuestion) handleSend(initialQuestion);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (questionOverride?: string) => {
    const question = (questionOverride ?? input).trim();
    if (!question || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionOverride) setInput('');
    setIsTyping(true);

    try {
      const answer = await aiService.askSutradhar(question, { ...context, language });
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'sutradhar',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'sutradhar',
        text: 'Sutradhar is temporarily unavailable. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([{
      id: `welcome-${Date.now()}`,
      sender: 'sutradhar',
      text: context.monument
        ? `Conversation cleared. I am ready to answer your questions about **${context.monument}**.`
        : 'Conversation cleared. Ask me anything about Indian heritage.',
      timestamp: 'Now'
    }]);
  };

  return (
    <div className={`flex flex-col bg-[#17130F] border border-[#D4A85A]/40 rounded-3xl overflow-hidden shadow-2xl ${embedded ? 'h-[580px] max-h-[85vh]' : 'h-[600px]'}`}>

      {/* Header */}
      <div className="px-5 py-4 bg-[#2B2118] border-b border-[#D4A85A]/25 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-base flex items-center justify-center shadow-md shrink-0">
              सू
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-[#F3EBDD]">Sutradhar</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] text-[#D4A85A]">
                {mode === 'researcher' ? 'Research Assistant Mode' : 'Heritage Guide Mode'}
                {!hasApiKey && ' • Demo Mode'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClear}
              title="Clear conversation"
              className="p-1.5 rounded-lg hover:bg-[#17130F] text-[#F3EBDD]/50 hover:text-[#F3EBDD] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-[#17130F] text-[#F3EBDD]/50 hover:text-[#F3EBDD] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Context header strip */}
        {context.monument && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
            <span className="flex items-center gap-1 text-[#D4A85A]/80">
              <Layers className="w-3 h-3" />
              <span className="font-bold text-[#F3EBDD]">{context.monument}</span>
            </span>
            {context.location && (
              <span className="flex items-center gap-1 text-[#F3EBDD]/55">
                <MapPin className="w-3 h-3" />
                {context.location}{context.state ? `, ${context.state}` : ''}
              </span>
            )}
            {context.dynasty && (
              <span className="flex items-center gap-1 text-[#F3EBDD]/55">
                <Crown className="w-3 h-3" />
                {context.dynasty}
              </span>
            )}
            {context.selectedFeature && (
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Crosshair className="w-3 h-3" />
                Focus: {context.selectedFeature}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Messages area — min-h-0 is critical for flex-child scroll containment */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'sutradhar' && (
              <div className="w-7 h-7 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                सू
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                msg.sender === 'user'
                  ? 'bg-[#D4A85A] text-[#17130F] font-medium rounded-tr-none'
                  : 'bg-[#2B2118] text-[#F3EBDD]/90 border border-[#D4A85A]/20 rounded-tl-none'
              }`}
            >
              {/* Render bold markdown-lite */}
              <div className="whitespace-pre-line">
                {msg.text.split('**').map((part, i) =>
                  i % 2 === 1
                    ? <strong key={i} className={msg.sender === 'user' ? 'text-[#17130F]' : 'text-[#D4A85A]'}>{part}</strong>
                    : <span key={i}>{part}</span>
                )}
              </div>

              {/* Listen button on Sutradhar responses */}
              {msg.sender === 'sutradhar' && (
                <div className="mt-2 pt-2 border-t border-[#D4A85A]/10 flex items-center justify-between gap-2">
                  <VoiceNarrationButton
                    text={stripBoldMarkdown(msg.text)}
                    language={language}
                    ariaLabel={tVoice.listenResponse}
                    variant="compact"
                  />
                  <div className={`text-[9px] text-[#F3EBDD]/35`}>
                    {msg.timestamp}
                  </div>
                </div>
              )}

              {/* Timestamp for user messages */}
              {msg.sender === 'user' && (
                <div className="text-[9px] mt-1.5 text-right text-[#17130F]/60">
                  {msg.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-[11px] flex items-center justify-center shrink-0">
              सू
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/20 rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A85A] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A85A] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A85A] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Language-aware suggested question chips */}
      <div className="px-4 py-2 border-t border-[#D4A85A]/15 flex gap-2 overflow-x-auto shrink-0 bg-[#17130F]/60">
        {suggestions.slice(0, 4).map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={isTyping}
            className="px-2.5 py-1 rounded-full border border-[#D4A85A]/30 text-[10px] text-[#F3EBDD]/70 hover:text-[#D4A85A] hover:border-[#D4A85A] shrink-0 transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            {q.length > 45 ? q.substring(0, 42) + '...' : q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-[#D4A85A]/25 flex gap-2 shrink-0 bg-[#2B2118]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
          placeholder={
            context.selectedFeature
              ? `Ask about the ${context.selectedFeature}...`
              : mode === 'researcher'
              ? 'Ask about architecture, dynasty, construction...'
              : 'Ask about this monument...'
          }
          disabled={isTyping}
          className="flex-1 bg-[#17130F] border border-[#D4A85A]/30 rounded-xl px-3 py-2.5 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/35 focus:outline-none focus:border-[#D4A85A] disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs disabled:opacity-40 hover:bg-[#F3EBDD] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
