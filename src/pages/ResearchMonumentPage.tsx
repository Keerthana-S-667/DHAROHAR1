import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Sparkles, Plus, Award, Calendar, Layers, HardHat, FileText, CheckCircle2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Language, MonumentHotspot, HistoricalTimelineEvent } from '../types';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';
import { aiService } from '../services/aiService';
import { SutradharChat } from '../components/SutradharChat';
import { VoiceNarrationButton } from '../components/VoiceNarrationButton';

interface ResearchMonumentPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const ResearchMonumentPage: React.FC<ResearchMonumentPageProps> = ({
  onNavigate,
  language
}) => {
  const { monumentId } = useParams<{ monumentId: string }>();
  const monument = monumentId ? heritageService.getMonumentById(monumentId) : null;

  const store = useStore();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    history: true,
    architecture: true,
    legends: true,
    preservation: true,
    timeline: true
  });

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState<Record<string, boolean>>({});
  const [showSutradhar, setShowSutradhar] = useState(false);
  const [sutradharSection, setSutradharSection] = useState<string | undefined>();

  const sutradharContext = useMemo(() => {
    if (!monument) return { researchMode: 'researcher' as const };
    return aiService.buildContext(monument as any, { researchMode: 'researcher' });
  }, [monument]);

  if (!monument) {
    return (
      <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ArrowLeft className="w-12 h-12 text-[#D4A85A] mx-auto cursor-pointer" onClick={() => onNavigate('research')} />
          <h2 className="text-xl font-bold">Monument research file not found</h2>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Notebook save handler
  const handleSaveToNotebook = (sectionName: string, content: string) => {
    const noteContent = notes[sectionName] || '';
    store.addSavedResearchItem({
      monumentId: monument.id,
      monumentName: monument.name,
      sectionName: sectionName,
      note: noteContent ? `${noteContent} (Snippet: ${content.substring(0, 80)}...)` : content.substring(0, 150)
    });

    setSaveSuccess(prev => ({ ...prev, [sectionName]: true }));
    setTimeout(() => {
      setSaveSuccess(prev => ({ ...prev, [sectionName]: false }));
    }, 2000);

    // Clear notes input
    setNotes(prev => ({ ...prev, [sectionName]: '' }));
  };

  // Sutradhar AI context routing
  const handleAskSutradhar = (sectionName: string) => {
    setSutradharSection(sectionName);
    setShowSutradhar(true);
  };

  const is3DModelAvailable = monument.threeDStatus === 'available' || monument.has3DModel;

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('research')}
            className="hover:underline flex items-center gap-1.5 text-xs text-[#D4A85A] font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Research Portal
          </button>
          
          <div className="flex items-center gap-2">
            {is3DModelAvailable ? (
              <button
                onClick={() => onNavigate(`monument/${monument.id}/3d`)}
                className="px-4 py-2 rounded-xl bg-[#D4A85A] text-[#17130F] text-[10px] font-bold uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer"
              >
                Explore in 3D
              </button>
            ) : (
              <span className="px-3 py-2 rounded-xl bg-[#2B2118] border border-[#D4A85A]/25 text-[#F3EBDD]/40 text-[10px] font-bold uppercase tracking-wider select-none">
                3D Model Coming Soon
              </span>
            )}
          </div>
        </div>

        {/* Scholar Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2B2118] to-[#17130F] border border-[#D4A85A]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[9px] uppercase font-bold text-[#D4A85A] tracking-wider block">Monument Dossier File</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F3EBDD]">{monument.name}</h2>
            <p className="text-xs text-[#F3EBDD]/65 mt-0.5">{monument.location.city}, {monument.location.state}</p>
          </div>
          
          <button
            onClick={() => handleAskSutradhar('Overview & Epigraphy')}
            className="px-5 py-2.5 rounded-xl bg-[#17130F] border border-[#D4A85A]/40 hover:bg-[#2B2118] text-[11px] font-bold text-[#D4A85A] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#D4A85A]" />
            Ask Sutradhar AI
          </button>
        </div>

        {/* Research content sections list */}
        <div className="space-y-6">
          
          {/* Section: Overview */}
          <div className="rounded-3xl border border-[#D4A85A]/30 bg-[#2B2118]/80 overflow-hidden shadow-xl">
            <button 
              onClick={() => toggleSection('overview')}
              className="w-full px-6 py-4 flex items-center justify-between bg-[#2B2118] border-b border-[#D4A85A]/15 text-sm font-bold text-[#F3EBDD] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4A85A]" />
                I. Scientific Overview
              </span>
              {expandedSections.overview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.overview && (
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                <p className="flex-1 text-xs sm:text-sm text-[#F3EBDD]/90 leading-relaxed">
                  {monument.culturalSignificance}
                </p>
                <div className="shrink-0 mt-0.5">
                  <VoiceNarrationButton
                    text={`Scientific Overview: ${monument.culturalSignificance}`}
                    language={language}
                    ariaLabel="Listen to Scientific Overview"
                    variant="compact"
                  />
                </div>
              </div>

                {/* Plinth details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#17130F]/80 rounded-2xl border border-[#D4A85A]/10 text-xs">
                  <div>
                    <span className="text-[10px] text-[#D4A85A] uppercase font-bold tracking-wider block">Dynasty</span>
                    <span className="font-semibold text-[#F3EBDD] mt-0.5 block">{monument.dynasty}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#D4A85A] uppercase font-bold tracking-wider block">Patron Ruler</span>
                    <span className="font-semibold text-[#F3EBDD] mt-0.5 block">{monument.ruler}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#D4A85A] uppercase font-bold tracking-wider block">Era Epoch</span>
                    <span className="font-semibold text-[#F3EBDD] mt-0.5 block">{monument.period}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#D4A85A] uppercase font-bold tracking-wider block">Heritage Status</span>
                    <span className="font-semibold text-[#F3EBDD] mt-0.5 block">{monument.unescoYear ? `UNESCO (${monument.unescoYear})` : 'State Protected'}</span>
                  </div>
                </div>

                {/* Notebook integration */}
                <div className="pt-4 border-t border-[#D4A85A]/15 space-y-3">
                  <textarea
                    rows={2}
                    placeholder="Add personal scholarly notes for this section..."
                    value={notes.overview || ''}
                    onChange={(e) => setNotes(prev => ({ ...prev, overview: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/30 focus:outline-none focus:border-[#D4A85A]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSaveToNotebook('Scientific Overview', monument.culturalSignificance)}
                      className="px-4 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/30 text-[10px] font-bold text-[#D4A85A] hover:bg-[#2B2118] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      {saveSuccess.overview ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                      {saveSuccess.overview ? 'Saved to Notebook' : 'Save Section to Notebook'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: History */}
          <div className="rounded-3xl border border-[#D4A85A]/30 bg-[#2B2118]/80 overflow-hidden shadow-xl">
            <button 
              onClick={() => toggleSection('history')}
              className="w-full px-6 py-4 flex items-center justify-between bg-[#2B2118] border-b border-[#D4A85A]/15 text-sm font-bold text-[#F3EBDD] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4A85A]" />
                II. Historical Context & Epigraphy
              </span>
              {expandedSections.history ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.history && (
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                <p className="flex-1 text-xs sm:text-sm text-[#F3EBDD]/90 leading-relaxed">
                  {monument.history}
                </p>
                <div className="shrink-0 mt-0.5">
                  <VoiceNarrationButton
                    text={`Historical Context: ${monument.history.slice(0, 800)}`}
                    language={language}
                    ariaLabel="Listen to Historical Context"
                    variant="compact"
                  />
                </div>
              </div>

                {/* Notebook integration */}
                <div className="pt-4 border-t border-[#D4A85A]/15 space-y-3">
                  <textarea
                    rows={2}
                    placeholder="Add personal scholarly notes for this section..."
                    value={notes.history || ''}
                    onChange={(e) => setNotes(prev => ({ ...prev, history: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/30 focus:outline-none focus:border-[#D4A85A]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSaveToNotebook('Historical Context', monument.history)}
                      className="px-4 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/30 text-[10px] font-bold text-[#D4A85A] hover:bg-[#2B2118] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      {saveSuccess.history ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                      {saveSuccess.history ? 'Saved to Notebook' : 'Save Section to Notebook'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Architecture */}
          <div className="rounded-3xl border border-[#D4A85A]/30 bg-[#2B2118]/80 overflow-hidden shadow-xl">
            <button 
              onClick={() => toggleSection('architecture')}
              className="w-full px-6 py-4 flex items-center justify-between bg-[#2B2118] border-b border-[#D4A85A]/15 text-sm font-bold text-[#F3EBDD] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4A85A]" />
                III. Architecture & Construction Technique
              </span>
              {expandedSections.architecture ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.architecture && (
              <div className="p-6 space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#17130F]/60 rounded-2xl border border-[#D4A85A]/10 text-xs space-y-1">
                    <span className="text-[10px] text-[#D4A85A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Construction Material
                    </span>
                    <p className="text-[#F3EBDD] font-medium pt-1">
                      {monument.constructionMaterial || monument.material}
                    </p>
                  </div>

                  <div className="p-4 bg-[#17130F]/60 rounded-2xl border border-[#D4A85A]/10 text-xs space-y-1">
                    <span className="text-[10px] text-[#D4A85A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5" />
                      Construction Technique
                    </span>
                    <p className="text-[#F3EBDD] font-medium pt-1">
                      {monument.constructionTechnique || 'Masonry joint interlocking block structural fitting.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <p className="flex-1 text-xs sm:text-sm text-[#F3EBDD]/90 leading-relaxed">
                    Designed as freestanding structural architecture. Features a multi-tiered sanctuary tower, corbel pillars, sitting-lion bases, and complex granitic gneiss joints weathering maritime salinity.
                  </p>
                  <div className="shrink-0 mt-0.5">
                    <VoiceNarrationButton
                      text={`Architecture and Construction: ${monument.constructionMaterial || monument.material}. ${monument.constructionTechnique || 'Masonry joint interlocking block structural fitting.'}. Designed as freestanding structural architecture with a multi-tiered sanctuary tower.`}
                      language={language}
                      ariaLabel="Listen to Architecture section"
                      variant="compact"
                    />
                  </div>
                </div>

                {/* Notebook integration */}
                <div className="pt-4 border-t border-[#D4A85A]/15 space-y-3">
                  <textarea
                    rows={2}
                    placeholder="Add personal scholarly notes for this section..."
                    value={notes.architecture || ''}
                    onChange={(e) => setNotes(prev => ({ ...prev, architecture: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/30 focus:outline-none focus:border-[#D4A85A]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSaveToNotebook('Architecture & Technique', monument.architectureStyle)}
                      className="px-4 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/30 text-[10px] font-bold text-[#D4A85A] hover:bg-[#2B2118] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      {saveSuccess.architecture ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                      {saveSuccess.architecture ? 'Saved to Notebook' : 'Save Section to Notebook'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Legends */}
          <div className="rounded-3xl border border-[#D4A85A]/30 bg-[#2B2118]/80 overflow-hidden shadow-xl">
            <button 
              onClick={() => toggleSection('legends')}
              className="w-full px-6 py-4 flex items-center justify-between bg-[#2B2118] border-b border-[#D4A85A]/15 text-sm font-bold text-[#F3EBDD] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4A85A]" />
                IV. Legends & Literary References
              </span>
              {expandedSections.legends ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.legends && (
              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  {monument.stories.map((story, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#17130F]/60 border border-[#D4A85A]/10 space-y-2 text-xs">
                      <span className="font-semibold text-[#D4A85A] text-sm block">{story.title}</span>
                      <p className="text-[#F3EBDD]/80 leading-relaxed italic">"{story.narrative}"</p>
                    </div>
                  ))}
                </div>

                {/* Notebook integration */}
                <div className="pt-4 border-t border-[#D4A85A]/15 space-y-3">
                  <textarea
                    rows={2}
                    placeholder="Add personal scholarly notes for this section..."
                    value={notes.legends || ''}
                    onChange={(e) => setNotes(prev => ({ ...prev, legends: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/30 focus:outline-none focus:border-[#D4A85A]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSaveToNotebook('Legends & Stories', monument.stories[0]?.narrative || '')}
                      className="px-4 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/30 text-[10px] font-bold text-[#D4A85A] hover:bg-[#2B2118] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      {saveSuccess.legends ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                      {saveSuccess.legends ? 'Saved to Notebook' : 'Save Section to Notebook'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Timeline */}
          <div className="rounded-3xl border border-[#D4A85A]/30 bg-[#2B2118]/80 overflow-hidden shadow-xl">
            <button 
              onClick={() => toggleSection('timeline')}
              className="w-full px-6 py-4 flex items-center justify-between bg-[#2B2118] border-b border-[#D4A85A]/15 text-sm font-bold text-[#F3EBDD] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4A85A]" />
                V. Structural & Historical Chronology
              </span>
              {expandedSections.timeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.timeline && (
              <div className="p-6 space-y-6">
                
                {/* Data driven timeline component (Requirement 8) */}
                {!monument.historicalTimeline || monument.historicalTimeline.length === 0 ? (
                  <p className="text-xs text-[#F3EBDD]/60 text-center py-4">Timeline data not registered for this monument.</p>
                ) : (
                  <div className="relative pl-6 border-l border-[#D4A85A]/30 space-y-8 ml-3 py-2 text-xs">
                    {monument.historicalTimeline.map((evt, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline point indicator node */}
                        <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-[#17130F] border-2 border-[#D4A85A] flex items-center justify-center z-10 group-hover:bg-[#D4A85A] transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D4A85A] group-hover:bg-[#17130F]" />
                        </div>

                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-[#D4A85A]/10 border border-[#D4A85A]/35 text-[10px] font-mono text-[#D4A85A] font-bold">
                            {evt.year}
                          </span>
                          <h4 className="font-display font-bold text-[#F3EBDD] text-sm pt-1">{evt.title}</h4>
                          <span className="text-[9px] uppercase font-bold text-[#F3EBDD]/50 block">{evt.period}</span>
                          <p className="text-[#F3EBDD]/70 leading-relaxed pt-0.5">{evt.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notebook integration */}
                <div className="pt-4 border-t border-[#D4A85A]/15 space-y-3">
                  <textarea
                    rows={2}
                    placeholder="Add personal scholarly notes for this section..."
                    value={notes.timeline || ''}
                    onChange={(e) => setNotes(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/30 focus:outline-none focus:border-[#D4A85A]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSaveToNotebook('Timeline & Chronology', monument.historicalTimeline?.[0]?.description || '')}
                      className="px-4 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/30 text-[10px] font-bold text-[#D4A85A] hover:bg-[#2B2118] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      {saveSuccess.timeline ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                      {saveSuccess.timeline ? 'Saved to Notebook' : 'Save Section to Notebook'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Inline Sutradhar Researcher Chat Panel */}
      {showSutradhar && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowSutradhar(false); setSutradharSection(undefined); } }}
        >
          <div className="w-full max-w-xl animate-in slide-in-from-bottom duration-300">
            <SutradharChat
              context={{
                ...sutradharContext,
                selectedFeature: sutradharSection
              }}
              initialQuestion={sutradharSection ? `Explain the "${sutradharSection}" section for ${monument?.name}.` : undefined}
              onClose={() => { setShowSutradhar(false); setSutradharSection(undefined); }}
              embedded={true}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};
