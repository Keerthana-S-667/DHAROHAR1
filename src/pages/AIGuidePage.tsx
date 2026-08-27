import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { heritageService } from '../services/heritageService';
import { aiService } from '../services/aiService';
import { SutradharChat } from '../components/SutradharChat';
import { ArrowLeft, ArrowRight, Bot } from 'lucide-react';

interface AIGuidePageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const AIGuidePage: React.FC<AIGuidePageProps> = ({ onNavigate, language }) => {
  const [searchParams] = useSearchParams();
  const t = TRANSLATIONS[language].guide;

  // Read context from URL params (set by monument pages)
  const monumentId = searchParams.get('monumentId');
  const feature = searchParams.get('feature');
  const topic = searchParams.get('topic');
  const researchMode = (searchParams.get('mode') as 'traveller' | 'researcher') || 'traveller';

  // Build AI context from monument data
  const aiContext = useMemo(() => {
    if (!monumentId) {
      return { researchMode, language: 'en' as const };
    }

    const monument = heritageService.getMonumentById(monumentId);
    if (!monument) {
      return { researchMode, language: 'en' as const };
    }

    return aiService.buildContext(monument as any, {
      selectedFeature: feature || undefined,
      researchMode
    });
  }, [monumentId, feature, researchMode]);

  // Build the initial auto-question when a hotspot feature is selected
  const initialQuestion = useMemo(() => {
    if (feature) {
      return `Explain the significance of the ${feature} at ${aiContext.monument || 'this monument'}.`;
    }
    if (topic) {
      return `Explain: ${topic}`;
    }
    return undefined;
  }, [feature, topic, aiContext.monument]);

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Navigation Breadcrumb */}
        {monumentId && (
          <button
            onClick={() => onNavigate(`monument/${monumentId}`)}
            className="flex items-center gap-1.5 text-xs text-[#D4A85A] font-medium hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Monument
          </button>
        )}

        {/* Cultural Guide Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B2118] border border-[#D4A85A]/50 text-xs text-[#D4A85A] font-semibold uppercase tracking-widest shadow-lg">
            <Bot className="w-4 h-4" />
            <span>Sutradhar • AI Heritage Guide</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EBDD]">
            {t.title}
          </h1>

          <p className="font-subheading text-lg sm:text-xl text-[#D4A85A] italic">
            "Ask not merely when stone was carved, but what cosmic truths it preserves."
          </p>
        </div>

        {/* Main Sutradhar Chat Interface */}
        <SutradharChat
          context={aiContext}
          initialQuestion={initialQuestion}
          embedded={true}
          language={language}
        />

        {/* Demo Bridge to Heritage Trails */}
        <div className="p-6 rounded-2xl bg-[#2B2118]/60 border border-[#D4A85A]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-display text-base font-bold text-[#F3EBDD]">
              Ready to explore step-by-step thematic itineraries?
            </h4>
            <p className="text-xs text-[#F3EBDD]/70">
              Experience the Pallava Architecture Trail linking Shore Temple to Arjuna's Penance & Pancha Rathas.
            </p>
          </div>
          <button
            onClick={() => onNavigate('personalized-trail')}
            className="px-6 py-2.5 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors shrink-0 flex items-center gap-1.5 shadow cursor-pointer"
          >
            <span>Personalized Trail Generator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
