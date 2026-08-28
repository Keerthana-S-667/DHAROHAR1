import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Sparkles, Award, Calendar, Layers, HardHat, FileText,
  CheckCircle2, ChevronDown, ChevronUp, Save, ExternalLink, BookMarked,
  Map, Trophy, User, Building2, Shield, Globe, Filter, Volume2
} from 'lucide-react';
import { Language, ResearchSource } from '../types';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';
import { aiService } from '../services/aiService';
import { studentProgressService } from '../services/studentProgressService';
import { getSourcesByMonument, sourceTypeLabel } from '../data/researchSourceData';
import { hasQuizData } from '../data/quizData';
import { DharoharAIChat } from '../components/DharoharAIChat';
import { VoiceNarrationButton } from '../components/VoiceNarrationButton';

interface ResearchMonumentPageProps {
  monumentId?: string;
  onNavigate: (route: string) => void;
  language: Language;
}

type SourceFilterType = 'ALL' | 'UNESCO_RECORD' | 'OFFICIAL_SOURCE' | 'GOVERNMENT_DOCUMENT' | 'RESEARCH_PAPER' | 'MUSEUM_RECORD';

const SOURCE_TYPE_COLORS: Record<string, string> = {
  UNESCO_RECORD: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  OFFICIAL_SOURCE: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  GOVERNMENT_DOCUMENT: 'bg-green-500/15 text-green-700 border-green-500/30',
  RESEARCH_PAPER: 'bg-purple-500/15 text-purple-700 border-purple-500/30',
  MUSEUM_RECORD: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
  ACADEMIC_PUBLICATION: 'bg-indigo-500/15 text-indigo-700 border-indigo-500/30',
  ARCHAEOLOGICAL_REPORT: 'bg-orange-500/15 text-orange-700 border-orange-500/30',
  HISTORICAL_DOCUMENT: 'bg-teal-500/15 text-teal-700 border-teal-500/30',
  BOOK_CATALOGUE: 'bg-cyan-500/15 text-cyan-700 border-cyan-500/30',
};

export const ResearchMonumentPage: React.FC<ResearchMonumentPageProps> = ({
  monumentId: propMonumentId,
  onNavigate,
  language
}) => {
  const { monumentId: paramMonumentId } = useParams<{ monumentId: string }>();
  const resolvedId = propMonumentId || paramMonumentId;
  const monument = resolvedId ? heritageService.getMonumentById(resolvedId, language) : null;

  const store = useStore();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    identification: true,
    overview: true,
    history: true,
    architecture: false,
    cultural: false,
    conservation: false,
    timeline: false,
    library: false,
    threed: false,
    quest: false,
  });

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState<Record<string, boolean>>({});
  const [showDharoharAI, setShowDharoharAI] = useState(false);
  const [dharoharAISection, setDharoharAISection] = useState<string | undefined>();
  const [sourceFilter, setSourceFilter] = useState<SourceFilterType>('ALL');
  const [newBadgeAlert, setNewBadgeAlert] = useState<string | null>(null);

  // Load sources for this monument
  const allSources = useMemo(() => {
    if (!resolvedId) return [];
    return getSourcesByMonument(resolvedId);
  }, [resolvedId]);

  const filteredSources = useMemo(() => {
    if (sourceFilter === 'ALL') return allSources;
    return allSources.filter(s => s.sourceType === sourceFilter);
  }, [allSources, sourceFilter]);

  const uniqueSourceTypes = useMemo(() =>
    Array.from(new Set(allSources.map(s => s.sourceType))),
    [allSources]
  );

  const quizAvailable = resolvedId ? hasQuizData(resolvedId) : false;
  const is3DModelAvailable = monument?.threeDStatus === 'available' || monument?.has3DModel;

  const dharoharAIContext = useMemo(() => {
    if (!monument) return { researchMode: 'researcher' as const };
    return aiService.buildContext(monument as any, { researchMode: 'researcher' });
  }, [monument]);

  // Track monument as explored + add to recently viewed
  useEffect(() => {
    if (!resolvedId || !monument) return;
    store.addRecentlyViewed(resolvedId);
    const newBadges = studentProgressService.markMonumentExplored(resolvedId);
    if (newBadges.length > 0) {
      const badgeDefs = studentProgressService.getBadgesEarned();
      const firstNew = badgeDefs.find(b => b.id === newBadges[0]);
      if (firstNew) {
        setNewBadgeAlert(`${firstNew.icon} Badge Unlocked: ${firstNew.title}`);
        setTimeout(() => setNewBadgeAlert(null), 4000);
      }
    }
  }, [resolvedId]);

  if (!monument) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ArrowLeft className="w-12 h-12 text-[#b65a3a] mx-auto cursor-pointer" onClick={() => onNavigate('research')} />
          <h2 className="text-xl font-bold">Monument research file not found</h2>
          <p className="text-sm text-[#4b2f23]/60">The monument ID "{resolvedId}" was not found in the DHAROHAR archive.</p>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    studentProgressService.markSectionCompleted(monument.id, section);
  };

  const handleSaveToNotebook = (sectionName: string, content: string) => {
    const noteContent = notes[sectionName] || '';
    store.addSavedResearchItem({
      monumentId: monument.id,
      monumentName: monument.name,
      sectionName,
      savedContent: content.substring(0, 200),
      note: noteContent || undefined,
    });
    studentProgressService.incrementNotesCreated();
    setSaveSuccess(prev => ({ ...prev, [sectionName]: true }));
    setTimeout(() => setSaveSuccess(prev => ({ ...prev, [sectionName]: false })), 2000);
    setNotes(prev => ({ ...prev, [sectionName]: '' }));
  };

  const handleSourceView = (source: ResearchSource) => {
    studentProgressService.markSourceViewed(source.id);
    window.open(source.url, '_blank', 'noopener,noreferrer');
  };

  const handleAskAI = (sectionName: string) => {
    setDharoharAISection(sectionName);
    setShowDharoharAI(true);
  };

  // ─── Reusable notebook block ──────────────────────────────────────────────────
  const NotebookBlock = ({ sectionKey, content }: { sectionKey: string; content: string }) => (
    <div className="pt-4 border-t border-[#aa7b3f]/15 space-y-3">
      <textarea
        rows={2}
        placeholder="Add your research notes for this section…"
        value={notes[sectionKey] || ''}
        onChange={(e) => setNotes(prev => ({ ...prev, [sectionKey]: e.target.value }))}
        className="w-full p-3 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/20 text-xs text-[#4b2f23] placeholder-[#4b2f23]/30 focus:outline-none focus:border-[#aa7b3f] resize-none"
      />
      <div className="flex justify-end">
        <button
          onClick={() => handleSaveToNotebook(sectionKey, content)}
          className="px-4 py-2 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/30 text-[10px] font-bold text-[#b65a3a] hover:bg-[#ede3d1] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          {saveSuccess[sectionKey] ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
          {saveSuccess[sectionKey] ? 'Saved to Notebook ✓' : 'Save to Notebook'}
        </button>
      </div>
    </div>
  );

  // ─── Reusable section header ──────────────────────────────────────────────────
  const SectionHeader = ({
    sectionKey, icon: Icon, title, onAsk
  }: { sectionKey: string; icon: any; title: string; onAsk?: string }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full px-6 py-4 flex items-center justify-between bg-[#ede3d1] border-b border-[#aa7b3f]/15 text-sm font-bold text-[#4b2f23] cursor-pointer hover:bg-[#e8dbc7] transition-colors"
    >
      <span className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#b65a3a]" />
        {title}
      </span>
      <div className="flex items-center gap-2">
        {onAsk && expandedSections[sectionKey] && (
          <span
            onClick={(e) => { e.stopPropagation(); handleAskAI(onAsk); }}
            className="px-2 py-1 rounded-lg bg-[#b65a3a]/10 border border-[#b65a3a]/20 text-[9px] font-bold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1 hover:bg-[#b65a3a]/20 transition-colors"
          >
            <Sparkles className="w-3 h-3" /> Ask AI
          </span>
        )}
        {expandedSections[sectionKey] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Badge unlock toast */}
      {newBadgeAlert && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-2xl bg-amber-500 text-white text-sm font-bold shadow-2xl animate-bounce">
          {newBadgeAlert}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Breadcrumb + Quick Actions ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('research')}
            className="hover:underline flex items-center gap-1.5 text-xs text-[#b65a3a] font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Research Portal
          </button>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('research/progress')}
              className="px-3 py-2 rounded-xl bg-[#ede3d1] border border-[#aa7b3f]/30 text-[10px] font-bold text-[#4b2f23] uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:border-[#aa7b3f] transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> My Progress
            </button>
            {quizAvailable && (
              <button
                onClick={() => onNavigate(`research/quest/${monument.id}`)}
                className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-amber-500/20 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5" /> Heritage Quest
              </button>
            )}
            {is3DModelAvailable ? (
              <button
                onClick={() => onNavigate(`monument/${monument.id}/3d`)}
                className="px-4 py-2 rounded-xl bg-[#b65a3a] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#9e4a2e] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" /> Explore in 3D
              </button>
            ) : (
              <span className="px-3 py-2 rounded-xl bg-[#ede3d1] border border-[#aa7b3f]/25 text-[#4b2f23]/40 text-[10px] font-bold uppercase tracking-wider select-none">
                3D Model Pending
              </span>
            )}
          </div>
        </div>

        {/* ── Quick Navigation Strip ───────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[#ede3d1]/60 border border-[#aa7b3f]/20">
          {[
            { key: 'identification', label: 'Identification', icon: '🏛️' },
            { key: 'overview', label: 'Overview', icon: '📜' },
            { key: 'history', label: 'History', icon: '📅' },
            { key: 'architecture', label: 'Architecture', icon: '🏗️' },
            { key: 'cultural', label: 'Cultural', icon: '🎭' },
            { key: 'conservation', label: 'Conservation', icon: '🛡️' },
            { key: 'timeline', label: 'Timeline', icon: '📈' },
            { key: 'library', label: 'Sources', icon: '📚' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => {
                setExpandedSections(prev => ({ ...prev, [item.key]: true }));
                setTimeout(() => {
                  document.getElementById(`section-${item.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#f5f0e6] border border-[#aa7b3f]/20 hover:border-[#aa7b3f]/60 text-[10px] font-semibold text-[#4b2f23] cursor-pointer transition-colors"
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* ── Dossier Banner ───────────────────────────────────────────────────── */}
        <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/30 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-5 bg-repeat" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%234b2f23\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-widest block">Monument Research Dossier</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#4b2f23] mt-1">{monument.name}</h1>
              {monument.nativeName && (
                <p className="text-sm text-[#b65a3a] font-medium mt-0.5">{monument.nativeName}</p>
              )}
              <p className="text-xs text-[#4b2f23]/65 mt-1">
                {monument.location.city}, {monument.location.state} · {monument.period} · {monument.dynasty}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {monument.unescoYear && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3 h-3" /> UNESCO {monument.unescoYear}
                  </span>
                )}
                {allSources.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[9px] text-blue-700 font-bold uppercase tracking-wider">
                    {allSources.length} Verified Sources
                  </span>
                )}
                {quizAvailable && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-[9px] text-green-700 font-bold uppercase tracking-wider">
                    Heritage Quest Available
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleAskAI('Monument Overview')}
                className="px-5 py-2.5 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/40 hover:bg-[#ede3d1] text-[11px] font-bold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Ask Dharohar AI
              </button>
            </div>
          </div>
        </div>

        {/* ── Research Sections ────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* I. Monument Identification */}
          <div id="section-identification" className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-xl">
            <SectionHeader sectionKey="identification" icon={FileText} title="I. Monument Identification" />
            {expandedSections.identification && (
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Official Name', value: monument.name },
                    { label: 'Native Name', value: monument.nativeName || '—' },
                    { label: 'Location', value: `${monument.location.city}, ${monument.location.state}` },
                    { label: 'Dynasty / Culture', value: monument.dynasty },
                    { label: 'Patron / Ruler', value: monument.ruler },
                    { label: 'Construction Period', value: monument.period },
                    { label: 'Architectural Style', value: monument.architectureStyle },
                    { label: 'Primary Material', value: monument.material || monument.constructionMaterial || '—' },
                    { label: 'Heritage Status', value: monument.unescoYear ? `UNESCO World Heritage Site (${monument.unescoYear})` : 'ASI Protected Monument' },
                    ...(monument.location.coordinates ? [{ label: 'Coordinates', value: monument.location.coordinates }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-[#f5f0e6]/70 rounded-xl border border-[#aa7b3f]/10">
                      <span className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-wider block mb-0.5">{label}</span>
                      <span className="text-xs font-semibold text-[#4b2f23]">{value}</span>
                    </div>
                  ))}
                </div>
                <NotebookBlock sectionKey="identification" content={`${monument.name} — ${monument.dynasty}, ${monument.period}, ${monument.location.city}`} />
              </div>
            )}
          </div>

          {/* II. Scientific / Historical Overview */}
          <div id="section-overview" className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-xl">
            <SectionHeader sectionKey="overview" icon={BookOpen} title="II. Scientific & Historical Overview" onAsk="Scientific Overview" />
            {expandedSections.overview && (
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="flex-1 text-xs sm:text-sm text-[#4b2f23]/90 leading-relaxed">
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
                {monument.historicalOverview && (
                  <p className="text-xs sm:text-sm text-[#4b2f23]/80 leading-relaxed border-t border-[#aa7b3f]/10 pt-3">
                    {monument.historicalOverview}
                  </p>
                )}
                <NotebookBlock sectionKey="overview" content={monument.culturalSignificance} />
              </div>
            )}
          </div>

          {/* III. Historical Context */}
          <div id="section-history" className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-xl">
            <SectionHeader sectionKey="history" icon={Calendar} title="III. Historical Context" onAsk="Historical Context" />
            {expandedSections.history && (
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="flex-1 text-xs sm:text-sm text-[#4b2f23]/90 leading-relaxed">
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
                {/* Legends & Literary References */}
                {monument.stories && monument.stories.length > 0 && (
                  <div className="space-y-3 border-t border-[#aa7b3f]/10 pt-4">
                    <h4 className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider">Legends & Literary References</h4>
                    <div className="space-y-3">
                      {monument.stories.map((story, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-[#f5f0e6]/60 border border-[#aa7b3f]/10 space-y-1">
                          <span className="font-semibold text-[#b65a3a] text-sm block">{story.title}</span>
                          <p className="text-xs text-[#4b2f23]/80 leading-relaxed italic">"{story.narrative}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <NotebookBlock sectionKey="history" content={monument.history} />
              </div>
            )}
          </div>

          {/* IV. Architecture & Construction */}
          <div id="section-architecture" className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-xl">
            <SectionHeader sectionKey="architecture" icon={Building2} title="IV. Architecture & Construction" onAsk="Architecture and Construction" />
            {expandedSections.architecture && (
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#f5f0e6]/60 rounded-2xl border border-[#aa7b3f]/10 text-xs space-y-1">
                    <span className="text-[10px] text-[#b65a3a] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Primary Material
                    </span>
                    <p className="text-[#4b2f23] font-medium pt-1">{monument.constructionMaterial || monument.material}</p>
                  </div>
                  <div className="p-4 bg-[#f5f0e6]/60 rounded-2xl border border-[#aa7b3f]/10 text-xs space-y-1">
                    <span className="text-[10px] text-[#b65a3a] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5" /> Architectural Style
                    </span>
                    <p className="text-[#4b2f23] font-medium pt-1">{monument.architectureStyle}</p>
                  </div>
                  {monument.constructionTechnique && (
                    <div className="p-4 bg-[#f5f0e6]/60 rounded-2xl border border-[#aa7b3f]/10 text-xs space-y-1 sm:col-span-2">
                      <span className="text-[10px] text-[#b65a3a] uppercase font-bold tracking-wider block">Construction Technique</span>
                      <p className="text-[#4b2f23] font-medium pt-1">{monument.constructionTechnique}</p>
                    </div>
                  )}
                </div>

                {/* Extended architectural details if available */}
                {monument.architecturalDetails && (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <p className="flex-1 text-xs sm:text-sm text-[#4b2f23]/90 leading-relaxed">
                        {monument.architecturalDetails.overview}
                      </p>
                      <VoiceNarrationButton
                        text={`Architecture: ${monument.architecturalDetails.overview}`}
                        language={language}
                        ariaLabel="Listen to Architecture section"
                        variant="compact"
                      />
                    </div>
                    {monument.architecturalDetails.highlights && monument.architecturalDetails.highlights.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider">Architectural Highlights</h4>
                        <ul className="space-y-1">
                          {monument.architecturalDetails.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#4b2f23]/80">
                              <span className="text-[#b65a3a] mt-0.5">◆</span> {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <NotebookBlock
                  sectionKey="architecture"
                  content={monument.architecturalDetails?.overview || `${monument.architectureStyle} — ${monument.constructionMaterial || monument.material}`}
                />
              </div>
            )}
          </div>

          {/* V. Cultural Significance */}
          <div id="section-cultural" className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-xl">
            <SectionHeader sectionKey="cultural" icon={Globe} title="V. Cultural Significance" onAsk="Cultural Significance" />
            {expandedSections.cultural && (
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <p className="text-xs sm:text-sm text-[#4b2f23]/90 leading-relaxed">{monument.culturalSignificance}</p>
                    {monument.unescoDetails && (
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                        <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block mb-2 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> UNESCO Recognition
                        </span>
                        <p className="text-xs text-[#4b2f23]/80 leading-relaxed">{monument.unescoDetails}</p>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <VoiceNarrationButton
                      text={`Cultural Significance: ${monument.culturalSignificance}`}
                      language={language}
                      ariaLabel="Listen to Cultural Significance"
                      variant="compact"
                    />
                  </div>
                </div>
                <NotebookBlock sectionKey="cultural" content={monument.culturalSignificance} />
              </div>
            )}
          </div>

          {/* VI. Conservation Status */}
          <div id="section-conservation" className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-xl">
            <SectionHeader sectionKey="conservation" icon={Shield} title="VI. Conservation & Preservation Status" />
            {expandedSections.conservation && (
              <div className="p-6 space-y-5">
                {/* Health score */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider">Heritage Health Index</span>
                      <span className="text-sm font-bold text-[#4b2f23]">{monument.preservationStatus.healthScore}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#f5f0e6] border border-[#aa7b3f]/20 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${monument.preservationStatus.healthScore}%`,
                          background: monument.preservationStatus.healthScore >= 85
                            ? '#22c55e' : monument.preservationStatus.healthScore >= 65
                            ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#f5f0e6]/60 border border-[#aa7b3f]/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider block">Conservation Initiatives</span>
                    <p className="text-[#4b2f23]/80 leading-relaxed">{monument.preservationStatus.currentInitiatives}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#f5f0e6]/60 border border-[#aa7b3f]/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider block">Digital Documentation</span>
                    <p className="text-[#4b2f23]/80 leading-relaxed">{monument.preservationStatus.digitalScanStatus}</p>
                  </div>
                </div>

                {monument.preservationStatus.threats.length > 0 && (
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider block">Documented Threats</span>
                    <ul className="space-y-1">
                      {monument.preservationStatus.threats.map((t, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[#4b2f23]/70">
                          <span className="text-red-500">⚠</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {monument.preservationStatus.visitorGuidelines.length > 0 && (
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">Visitor Responsibility Guidelines</span>
                    <ul className="space-y-1">
                      {monument.preservationStatus.visitorGuidelines.map((g, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#4b2f23]/70">
                          <span className="text-blue-500 mt-0.5">•</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <NotebookBlock
                  sectionKey="conservation"
                  content={`Conservation: ${monument.preservationStatus.currentInitiatives}. Health: ${monument.preservationStatus.healthScore}%.`}
                />
              </div>
            )}
          </div>

          {/* VII. Historical Chronology */}
          <div id="section-timeline" className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-xl">
            <SectionHeader sectionKey="timeline" icon={Calendar} title="VII. Structural & Historical Chronology" />
            {expandedSections.timeline && (
              <div className="p-6 space-y-6">
                {!monument.historicalTimeline || monument.historicalTimeline.length === 0 ? (
                  <p className="text-xs text-[#4b2f23]/60 text-center py-4">Timeline data not available for this monument.</p>
                ) : (
                  <div className="relative pl-6 border-l border-[#aa7b3f]/30 space-y-8 ml-3 py-2 text-xs">
                    {monument.historicalTimeline.map((evt, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-[#f5f0e6] border-2 border-[#aa7b3f] flex items-center justify-center z-10 group-hover:bg-[#b65a3a] transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#b65a3a] group-hover:bg-[#f5f0e6]" />
                        </div>
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-[#b65a3a]/10 border border-[#aa7b3f]/35 text-[10px] font-mono text-[#b65a3a] font-bold">
                            {evt.year}
                          </span>
                          <h4 className="font-display font-bold text-[#4b2f23] text-sm pt-1">{evt.title}</h4>
                          <span className="text-[9px] uppercase font-bold text-[#4b2f23]/50 block">{evt.period}</span>
                          <p className="text-[#4b2f23]/70 leading-relaxed pt-0.5">{evt.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <NotebookBlock
                  sectionKey="timeline"
                  content={monument.historicalTimeline?.[0] ? `Timeline: ${monument.historicalTimeline[0].year} — ${monument.historicalTimeline[0].title}` : ''}
                />
              </div>
            )}
          </div>

          {/* VIII. Research Library */}
          <div id="section-library" className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-xl">
            <SectionHeader sectionKey="library" icon={BookMarked} title="VIII. Research Library — Verified Sources" />
            {expandedSections.library && (
              <div className="p-6 space-y-5">
                {allSources.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <BookMarked className="w-10 h-10 text-[#b65a3a]/20 mx-auto" />
                    <p className="text-sm font-semibold text-[#4b2f23]">Research Archive In Progress</p>
                    <p className="text-xs text-[#4b2f23]/60 max-w-sm mx-auto">
                      Verified research sources are being compiled for this monument. Check UNESCO ({' '}
                      <a href="https://whc.unesco.org" target="_blank" rel="noopener noreferrer" className="text-[#b65a3a] underline">whc.unesco.org</a>
                      {' '}) and ASI ({' '}
                      <a href="https://asi.nic.in" target="_blank" rel="noopener noreferrer" className="text-[#b65a3a] underline">asi.nic.in</a>
                      {' '}) for authoritative information.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Source integrity notice */}
                    <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-700 leading-relaxed">
                        All sources below are real, verified references from UNESCO, ASI, or Government of India records.
                        Click <strong>View Source</strong> to access the original document.
                      </p>
                    </div>

                    {/* Filter bar */}
                    {uniqueSourceTypes.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSourceFilter('ALL')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${sourceFilter === 'ALL' ? 'bg-[#b65a3a] text-white border-[#b65a3a]' : 'bg-[#f5f0e6] text-[#4b2f23] border-[#aa7b3f]/20 hover:border-[#aa7b3f]'}`}
                        >
                          All ({allSources.length})
                        </button>
                        {uniqueSourceTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => setSourceFilter(type as SourceFilterType)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${sourceFilter === type ? 'bg-[#b65a3a] text-white border-[#b65a3a]' : 'bg-[#f5f0e6] text-[#4b2f23] border-[#aa7b3f]/20 hover:border-[#aa7b3f]'}`}
                          >
                            {sourceTypeLabel(type)}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Source cards */}
                    <div className="space-y-4">
                      {filteredSources.map(source => (
                        <div key={source.id} className="p-5 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/20 hover:border-[#aa7b3f]/50 transition-all space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1">
                              <h4 className="font-display font-bold text-[#4b2f23] text-sm leading-snug">{source.title}</h4>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${SOURCE_TYPE_COLORS[source.sourceType] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                  {sourceTypeLabel(source.sourceType)}
                                </span>
                                <span className="text-[10px] text-[#4b2f23]/60 font-medium">{source.organization}</span>
                                {source.year && <span className="text-[10px] text-[#4b2f23]/50">{source.year}</span>}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-[#4b2f23]/70 leading-relaxed">{source.description}</p>
                          <button
                            onClick={() => handleSourceView(source)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#b65a3a] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#9e4a2e] transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Original Source
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* IX. Explore in 3D */}
          {is3DModelAvailable && (
            <div id="section-threed" className="rounded-3xl border border-[#aa7b3f]/30 bg-gradient-to-br from-[#2B2118] to-[#3d2a1a] overflow-hidden shadow-xl">
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-amber-400 tracking-widest block">3D Heritage Experience</span>
                  <h3 className="font-display text-xl font-bold text-[#f5f0e6]">Explore {monument.name} in 3D</h3>
                  <p className="text-xs text-[#f5f0e6]/60 max-w-xs">
                    Navigate the existing 3D model of this monument — rotate, zoom, and explore the architecture from every angle.
                  </p>
                  {monument.sketchfabUrl && (
                    <p className="text-[9px] text-[#f5f0e6]/40">Powered by Sketchfab — existing 3D model</p>
                  )}
                </div>
                <button
                  onClick={() => onNavigate(`monument/${monument.id}/3d`)}
                  className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-2 shadow-lg shrink-0"
                >
                  <Globe className="w-5 h-5" />
                  Open 3D Explorer
                </button>
              </div>
            </div>
          )}

          {/* X. Heritage Quest */}
          {quizAvailable && (
            <div id="section-quest" className="rounded-3xl border border-green-500/30 bg-gradient-to-br from-[#1a2b1a] to-[#1e3520] overflow-hidden shadow-xl">
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-green-400 tracking-widest block">Test Your Knowledge</span>
                  <h3 className="font-display text-xl font-bold text-[#f5f0e6]">Heritage Quest</h3>
                  <p className="text-xs text-[#f5f0e6]/60 max-w-xs">
                    4 levels of questions — Explorer, Historian, Researcher, Scholar. All questions are based on verified historical facts.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['🟢 Explorer', '🔵 Historian', '🟣 Researcher', '🟡 Scholar'].map(l => (
                      <span key={l} className="text-[9px] text-[#f5f0e6]/50 font-medium">{l}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate(`research/quest/${monument.id}`)}
                  className="px-6 py-3 rounded-2xl bg-green-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-green-400 transition-colors cursor-pointer flex items-center gap-2 shadow-lg shrink-0"
                >
                  <Trophy className="w-5 h-5" />
                  Start Heritage Quest
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Dharohar AI Chat Modal */}
      {showDharoharAI && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowDharoharAI(false); setDharoharAISection(undefined); } }}
        >
          <div className="w-full max-w-xl animate-in slide-in-from-bottom duration-300">
            <DharoharAIChat
              context={{
                ...dharoharAIContext,
                selectedFeature: dharoharAISection
              }}
              initialQuestion={dharoharAISection ? `Explain the "${dharoharAISection}" of ${monument?.name} from a researcher's perspective.` : undefined}
              onClose={() => { setShowDharoharAI(false); setDharoharAISection(undefined); }}
              embedded={true}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};
