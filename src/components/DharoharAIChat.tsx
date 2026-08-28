import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RefreshCw, MapPin, Crown, Layers, Crosshair } from 'lucide-react';
import { aiService, HeritageAIContext } from '../services/aiService';
import { VoiceNarrationButton } from './VoiceNarrationButton';
import { TRANSLATIONS } from '../data/translations';
import { Language } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'dharoharAI';
  text: string;
  timestamp: string;
}

interface DharoharAIChatProps {
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
  const langSuggestions = TRANSLATIONS[language]?.dharoharAIQuestions;
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

export const DharoharAIChat: React.FC<DharoharAIChatProps> = ({
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
      sender: 'dharoharAI',
      text: context.monument
        ? `Namaste! I am Dharohar AI — your heritage guide for **${context.monument}**${context.selectedFeature ? `, with focus on the **${context.selectedFeature}**` : ''}. Ask me anything about its history, architecture, legends, or cultural significance.`
        : 'Namaste! I am Dharohar AI, your AI heritage guide for Indian monuments. Ask me anything about history, architecture, dynasties, or cultural significance.',
      timestamp: 'Now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll only the inner messages container — not the whole page
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
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
      const answer = await aiService.askDharoharAI(question, { ...context, language });
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'dharoharAI',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'dharoharAI',
        text: 'Dharohar AI is temporarily unavailable. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    aiService.clearHistory(context);
    setMessages([{
      id: `welcome-${Date.now()}`,
      sender: 'dharoharAI',
      text: context.monument
        ? `Conversation cleared. I am ready to answer your questions about **${context.monument}**.`
        : 'Conversation cleared. Ask me anything about Indian heritage.',
      timestamp: 'Now'
    }]);
  };

  return (
    <div className={`flex flex-col bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-3xl overflow-hidden shadow-2xl ${embedded ? 'h-[700px] max-h-[85vh]' : 'h-[700px]'}`}>

      {/* Header */}
      <div className="px-5 py-4 bg-[#ede3d1] border-b border-[#aa7b3f]/25 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#b65a3a] text-white font-bold text-base flex items-center justify-center shadow-md shrink-0">
              सू
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-[#4b2f23]">Dharohar AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] text-[#b65a3a]">
                {mode === 'researcher' ? 'Research Assistant Mode' : 'Heritage Guide Mode'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClear}
              title="Clear conversation"
              className="p-1.5 rounded-lg hover:bg-[#f5f0e6] text-[#4b2f23]/50 hover:text-[#4b2f23] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-[#f5f0e6] text-[#4b2f23]/50 hover:text-[#4b2f23] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Context header strip */}
        {context.monument && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
            <span className="flex items-center gap-1 text-[#b65a3a]/80">
              <Layers className="w-3 h-3" />
              <span className="font-bold text-[#4b2f23]">{context.monument}</span>
            </span>
            {context.location && (
              <span className="flex items-center gap-1 text-[#4b2f23]/55">
                <MapPin className="w-3 h-3" />
                {context.location}{context.state ? `, ${context.state}` : ''}
              </span>
            )}
            {context.dynasty && (
              <span className="flex items-center gap-1 text-[#4b2f23]/55">
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
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'dharoharAI' && (
              <div className="w-7 h-7 rounded-full bg-[#b65a3a] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                सू
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                msg.sender === 'user'
                  ? 'bg-[#b65a3a] text-white font-medium rounded-tr-none'
                  : 'bg-[#ede3d1] text-[#4b2f23]/90 border border-[#aa7b3f]/20 rounded-tl-none'
              }`}
            >
              {/* Render bold markdown-lite */}
              <div className="whitespace-pre-line">
                {msg.text.split('**').map((part, i) =>
                  i % 2 === 1
                    ? <strong key={i} className={msg.sender === 'user' ? 'text-white' : 'text-[#b65a3a]'}>{part}</strong>
                    : <span key={i}>{part}</span>
                )}
              </div>

              {/* Listen button on Dharohar AI responses */}
              {msg.sender === 'dharoharAI' && (
                <div className="mt-2 pt-2 border-t border-[#aa7b3f]/10 flex items-center justify-between gap-2">
                  <VoiceNarrationButton
                    text={stripBoldMarkdown(msg.text)}
                    language={language}
                    ariaLabel={tVoice.listenResponse}
                    variant="compact"
                  />
                  <div className={`text-[9px] text-[#4b2f23]/35`}>
                    {msg.timestamp}
                  </div>
                </div>
              )}

              {/* Timestamp for user messages */}
              {msg.sender === 'user' && (
                <div className="text-[9px] mt-1.5 text-right text-white/60">
                  {msg.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#b65a3a] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
              सू
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/20 rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b65a3a] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#b65a3a] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#b65a3a] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Language-aware suggested question chips */}
      <div className="px-4 py-2 border-t border-[#aa7b3f]/15 flex gap-2 overflow-x-auto shrink-0 bg-[#f5f0e6]/60">
        {suggestions.slice(0, 4).map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={isTyping}
            className="px-2.5 py-1 rounded-full border border-[#aa7b3f]/30 text-[10px] text-[#4b2f23]/70 hover:text-[#b65a3a] hover:border-[#aa7b3f] shrink-0 transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            {q.length > 45 ? q.substring(0, 42) + '...' : q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-[#aa7b3f]/25 flex gap-2 shrink-0 bg-[#ede3d1]">
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
          className="flex-1 bg-[#f5f0e6] border border-[#aa7b3f]/30 rounded-xl px-3 py-2.5 text-xs text-[#4b2f23] placeholder-[#F3EBDD]/35 focus:outline-none focus:border-[#aa7b3f] disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-[#b65a3a] text-white font-bold text-xs disabled:opacity-40 hover:bg-[#f5f0e6] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
