import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, BookOpen, Layers, Award, Grid, Trash2, FileText, Sparkles, Trophy, Target, BookMarked } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';
import { studentProgressService } from '../services/studentProgressService';
import { hasQuizData } from '../data/quizData';

interface ResearchHomePageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const ResearchHomePage: React.FC<ResearchHomePageProps> = ({
  onNavigate,
  language
}) => {
  const store = useStore();
  const t = TRANSLATIONS[language]?.research || TRANSLATIONS.en.research;
  const tLanding = TRANSLATIONS[language]?.landing || TRANSLATIONS.en.landing;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedDynasty, setSelectedDynasty] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedUnescoOnly, setSelectedUnescoOnly] = useState<boolean>(false);

  const monuments = Object.values(heritageService.getMonuments(language));

  // Extracted unique filter lists from active dataset
  const states = useMemo(() => Array.from(new Set(monuments.map(m => m.location.state))), [monuments]);
  const styles = useMemo(() => Array.from(new Set(monuments.map(m => m.architectureStyle))), [monuments]);
  const dynasties = useMemo(() => Array.from(new Set(monuments.map(m => m.dynasty))), [monuments]);
  const periods = useMemo(() => Array.from(new Set(monuments.map(m => m.period))), [monuments]);

  // Handle Search Filtering
  const filteredMonuments = useMemo(() => {
    return monuments.filter(mon => {
      // 1. Text Search matching name, city, state, dynasty, style, period, significance
      const query = searchQuery.toLowerCase();
      const matchesText = !searchQuery || 
        mon.name.toLowerCase().includes(query) ||
        mon.location.city.toLowerCase().includes(query) ||
        mon.location.state.toLowerCase().includes(query) ||
        mon.dynasty.toLowerCase().includes(query) ||
        mon.architectureStyle.toLowerCase().includes(query) ||
        mon.period.toLowerCase().includes(query) ||
        mon.culturalSignificance.toLowerCase().includes(query);

      // 2. Select filter matching
      const matchesState = selectedState === 'all' || mon.location.state === selectedState;
      const matchesStyle = selectedStyle === 'all' || mon.architectureStyle === selectedStyle;
      const matchesDynasty = selectedDynasty === 'all' || mon.dynasty === selectedDynasty;
      const matchesPeriod = selectedPeriod === 'all' || mon.period === selectedPeriod;
      const matchesUnesco = !selectedUnescoOnly || !!mon.unescoYear;

      return matchesText && matchesState && matchesStyle && matchesDynasty && matchesPeriod && matchesUnesco;
    });
  }, [monuments, searchQuery, selectedState, selectedStyle, selectedDynasty, selectedPeriod, selectedUnescoOnly]);

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedState('all');
    setSelectedStyle('all');
    setSelectedDynasty('all');
    setSelectedPeriod('all');
    setSelectedUnescoOnly(false);
  };

  // Quick category filters click
  const handleQuickBrowse = (category: string, value: string) => {
    handleClearFilters();
    if (category === 'state') setSelectedState(value);
    if (category === 'style') setSelectedStyle(value);
    if (category === 'dynasty') setSelectedDynasty(value);
    if (category === 'period') setSelectedPeriod(value);
    if (category === 'unesco') setSelectedUnescoOnly(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#b65a3a]">
          <button
            onClick={() => onNavigate('landing')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <span className="text-[#4b2f23]/40">/</span>
          <span className="text-[#4b2f23] font-bold">Research Portal</span>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/30 text-[10px] text-[#b65a3a] font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 animate-pulse" />
            <span>{t.workspaceTitle}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#4b2f23] tracking-tight">
            {tLanding.roleResearcherTitle}
          </h1>
          <p className="text-sm text-[#4b2f23]/70 max-w-xl leading-relaxed">
            {t.workspaceSubtitle}
          </p>
        </div>

        {/* ── STUDENT DASHBOARD ────────────────────────────────────────────── */}
        {(() => {
          const progress = studentProgressService.getProgress();
          const studentLevel = studentProgressService.getStudentLevel();
          const totalQuests = studentProgressService.getTotalQuestsCompleted();

          return (
            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/30 shadow-xl w-full">
              <div className="flex flex-col md:flex-row gap-6 items-stretch justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="w-4 h-4" /> My Progress Snapshot
                    </h3>
                    <button
                      onClick={() => onNavigate('research/progress')}
                      className="text-[10px] text-[#b65a3a] font-bold hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Monuments Explored', value: progress.monumentsExplored.length, icon: '🏛️' },
                      { label: 'Research Notes', value: store.savedResearchItems.length, icon: '📝' },
                      { label: 'Sources Viewed', value: progress.sourcesViewed.length, icon: '📜' },
                      { label: 'Quests Completed', value: totalQuests, icon: '🎯' },
                    ].map(({ label, value, icon }) => (
                      <div key={label} className="flex flex-col justify-between p-3.5 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/15 space-y-1">
                        <span className="text-[10px] font-semibold text-[#4b2f23]/60 leading-tight">{icon} {label}</span>
                        <span className="font-black text-[#4b2f23] text-xl pt-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full md:w-64 p-5 rounded-2xl bg-[#f5f0e6]/50 border border-[#aa7b3f]/25 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-[9px] text-[#b65a3a] uppercase font-bold tracking-wider">Current Level</p>
                    <p className="text-base font-bold text-[#4b2f23]">{studentLevel.title}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('research/progress')}
                    className="w-full py-2.5 rounded-xl bg-[#b65a3a] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-[#9e4a2e] transition-colors shadow"
                  >
                    View Full Progress
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Continue Researching */}
        {store.recentlyViewedMonuments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Continue Researching
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {store.recentlyViewedMonuments.map(id => {
                const mon = heritageService.getMonumentById(id);
                if (!mon) return null;
                return (
                  <div
                    key={id}
                    onClick={() => onNavigate(`research/monument/${id}`)}
                    className="flex-shrink-0 w-48 rounded-2xl overflow-hidden border border-[#aa7b3f]/25 bg-[#ede3d1] cursor-pointer hover:border-[#aa7b3f]/60 transition-all shadow-md hover:shadow-lg"
                  >
                    <img src={mon.heroImage} alt={mon.name} className="w-full h-28 object-cover" />
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-bold text-[#4b2f23] line-clamp-1">{mon.name}</p>
                      <p className="text-[10px] text-[#4b2f23]/50">{mon.dynasty}</p>
                      {hasQuizData(id) && (
                        <span className="text-[9px] text-green-700 font-bold">Quest Available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Browse Categories */}
        <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/30 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1.5">
            <Grid className="w-4 h-4" />
            Quick Study Collections
          </h3>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <button 
              onClick={() => handleQuickBrowse('unesco', 'true')}
              className="px-3 py-2 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/20 hover:border-[#aa7b3f] text-[#4b2f23] font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-[#b65a3a]" />
              UNESCO Heritage Sites
            </button>
            <button 
              onClick={() => handleQuickBrowse('state', 'Tamil Nadu')}
              className="px-3 py-2 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/20 hover:border-[#aa7b3f] text-[#4b2f23] font-semibold transition-all cursor-pointer"
            >
              Tamil Nadu Monuments
            </button>
            <button 
              onClick={() => handleQuickBrowse('dynasty', 'Pallava Dynasty')}
              className="px-3 py-2 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/20 hover:border-[#aa7b3f] text-[#4b2f23] font-semibold transition-all cursor-pointer"
            >
              Pallava Architecture
            </button>
            <button 
              onClick={() => handleQuickBrowse('style', 'Early Structural Dravidian Stone Architecture')}
              className="px-3 py-2 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/20 hover:border-[#aa7b3f] text-[#4b2f23] font-semibold transition-all cursor-pointer"
            >
              Dravidian Stone Craft
            </button>
          </div>
        </div>

        {/* Main Grid: Search and Notebook Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left search results workspace (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search inputs bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-[#b65a3a]/60" />
                <input
                  type="text"
                  placeholder="Search name, city, dynasty, style, epoch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/40 text-xs text-[#4b2f23] placeholder-[#F3EBDD]/40 focus:outline-none focus:border-[#aa7b3f] transition-colors"
                />
              </div>
              
              <button
                onClick={handleClearFilters}
                className="px-4 py-3 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/30 text-xs font-semibold text-[#b65a3a] hover:bg-[#ede3d1] transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>

            {/* Filter controls shelf */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-3xl bg-[#ede3d1]/50 border border-[#aa7b3f]/20">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-wider block">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/20 rounded-xl px-2 py-1.5 text-[11px] text-[#4b2f23] focus:outline-none"
                >
                  <option value="all">All States</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-wider block">Architecture Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/20 rounded-xl px-2 py-1.5 text-[11px] text-[#4b2f23] focus:outline-none"
                >
                  <option value="all">All Styles</option>
                  {styles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-wider block">Dynasty</label>
                <select
                  value={selectedDynasty}
                  onChange={(e) => setSelectedDynasty(e.target.value)}
                  className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/20 rounded-xl px-2 py-1.5 text-[11px] text-[#4b2f23] focus:outline-none"
                >
                  <option value="all">All Dynasties</option>
                  {dynasties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-wider block">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/20 rounded-xl px-2 py-1.5 text-[11px] text-[#4b2f23] focus:outline-none"
                >
                  <option value="all">All Periods</option>
                  {periods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4 col-span-2 sm:col-span-1">
                <input
                  type="checkbox"
                  id="unesco_check"
                  checked={selectedUnescoOnly}
                  onChange={(e) => setSelectedUnescoOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-[#aa7b3f]/40 text-[#b65a3a] bg-[#f5f0e6] focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="unesco_check" className="text-[11px] text-[#4b2f23] font-medium cursor-pointer">
                  UNESCO Sites Only
                </label>
              </div>
            </div>

            {/* Results count indicator */}
            <div className="text-xs text-[#4b2f23]/60 flex items-center justify-between">
              <span>Showing <strong>{filteredMonuments.length}</strong> index matches</span>
              {selectedState !== 'all' || selectedStyle !== 'all' || selectedDynasty !== 'all' || selectedPeriod !== 'all' || selectedUnescoOnly ? (
                <span className="text-[#b65a3a] font-semibold">Active filters are applied</span>
              ) : null}
            </div>

            {/* Search results catalog */}
            {filteredMonuments.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#ede3d1]/20 border border-[#aa7b3f]/20 space-y-3">
                <Layers className="w-12 h-12 text-[#b65a3a]/30 mx-auto" />
                <h4 className="font-bold text-sm">No research entries match</h4>
                <p className="text-xs text-[#4b2f23]/60">Try updating your filters or searching other queries.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMonuments.map((mon) => {
                  const isSavedForComparison = store.selectedComparisonMonuments.includes(mon.id);
                  const is3DModelAvailable = mon.threeDStatus === 'available' || mon.has3DModel;

                  return (
                    <div 
                      key={mon.id}
                      className="p-5 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/30 hover:border-[#aa7b3f]/60 transition-all flex flex-col sm:flex-row gap-5 shadow-lg"
                    >
                      <img 
                        src={mon.heroImage} 
                        alt={mon.name}
                        className="w-full sm:w-40 h-32 rounded-2xl object-cover shrink-0 border border-[#aa7b3f]/20"
                      />
                      
                      <div className="flex-1 flex flex-col justify-between space-y-4 sm:space-y-0">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h3 className="font-display text-lg font-bold text-[#4b2f23]">{mon.name}</h3>
                            {mon.unescoYear && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] text-[#b65a3a] font-bold uppercase tracking-wider">
                                UNESCO {mon.unescoYear}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#b65a3a] font-medium">
                            {mon.location.city}, {mon.location.state} • {mon.period} • {mon.dynasty}
                          </p>
                          <p className="text-xs text-[#4b2f23]/70 leading-relaxed line-clamp-2">
                            {mon.culturalSignificance}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#aa7b3f]/10 flex-wrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onNavigate(`monument/${mon.id}`)}
                              className="px-4 py-2 rounded-xl bg-[#f5f0e6] text-[#4b2f23] hover:bg-[#ede3d1] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#aa7b3f]/35"
                            >
                              Explore Monument
                            </button>
                            <button
                              onClick={() => onNavigate(`research/monument/${mon.id}`)}
                              className="px-4 py-2 rounded-xl bg-[#b65a3a] text-white hover:bg-[#f5f0e6] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Open Research View
                            </button>
                            
                            {is3DModelAvailable ? (
                              <button
                                onClick={() => onNavigate(`monument/${mon.id}/3d`)}
                                className="px-4 py-2 rounded-xl bg-[#f5f0e6] text-amber-400 border border-amber-500/30 hover:bg-amber-950/20 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                3D Explore
                              </button>
                            ) : (
                              <span className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-[#4b2f23]/40 select-none">
                                3D Model Pending
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if (isSavedForComparison) {
                                store.removeComparisonMonument(mon.id);
                              } else {
                                store.addComparisonMonument(mon.id);
                              }
                            }}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                              isSavedForComparison
                                ? 'bg-amber-600/20 text-[#b65a3a] border-amber-600'
                                : 'bg-[#f5f0e6]/40 text-[#4b2f23]/60 border-[#aa7b3f]/20 hover:text-white'
                            }`}
                          >
                            {isSavedForComparison ? '✓ Added to Compare' : '+ Compare'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Notebook & Compare shelf panel (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Compare monitors panel */}
            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 shadow-2xl space-y-5">
              <h3 className="font-display text-lg font-bold text-[#4b2f23] pb-3 border-b border-[#aa7b3f]/20 flex items-center justify-between">
                <span>Monument Comparison</span>
                <span className="px-2 py-0.5 rounded bg-[#f5f0e6] text-[10px] font-mono text-[#b65a3a]">
                  {store.selectedComparisonMonuments.length}/2 Selected
                </span>
              </h3>

              {store.selectedComparisonMonuments.length === 0 ? (
                <p className="text-[11px] text-[#4b2f23]/60 text-center py-4">
                  Add up to 2 monuments to compare their architecture styles, material, epochs, and preservation status.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {store.selectedComparisonMonuments.map((id) => {
                      const mon = heritageService.getMonumentById(id);
                      if (!mon) return null;
                      return (
                        <div key={id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/10 text-xs">
                          <span className="font-semibold truncate">{mon.name}</span>
                          <button
                            onClick={() => store.removeComparisonMonument(id)}
                            className="p-1 text-red-400 hover:bg-red-950/20 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('research/compare')}
                      disabled={store.selectedComparisonMonuments.length < 2}
                      className="flex-1 py-2.5 rounded-xl bg-[#b65a3a] text-white disabled:opacity-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Compare Monuments
                    </button>
                    <button
                      onClick={() => store.clearComparisonMonuments()}
                      className="px-3 py-2.5 rounded-xl bg-[#f5f0e6] border border-[#aa7b3f]/20 text-[#b65a3a] hover:bg-[#ede3d1] text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notebook panel (Zustand linked + localStorage) */}
            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 shadow-2xl space-y-5">
              <h3 className="font-display text-lg font-bold text-[#4b2f23] pb-3 border-b border-[#aa7b3f]/20 flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-[#b65a3a]" />
                My Research Notebook
              </h3>

              {store.savedResearchItems.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <FileText className="w-8 h-8 text-[#b65a3a]/20 mx-auto" />
                  <p className="text-[11px] text-[#4b2f23]/60 max-w-xs mx-auto">
                    Notebook is empty. While studying a monument's chronicle or construction techniques, click "Save to Notebook" to bookmark notes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 space-y-3">
                  {store.savedResearchItems.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/20 text-[11px] space-y-2 relative group">
                      <button
                        onClick={() => store.removeSavedResearchItem(item.id)}
                        className="absolute top-2 right-2 p-1 text-[#4b2f23]/40 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="pr-6 space-y-0.5">
                        <strong className="text-[#b65a3a] block truncate">{item.monumentName}</strong>
                        {item.sectionName && (
                          <span className="text-[9px] uppercase font-bold text-[#4b2f23]/50 block">
                            Section: {item.sectionName}
                          </span>
                        )}
                        {item.featureName && (
                          <span className="text-[9px] uppercase font-bold text-[#4b2f23]/50 block">
                            Feature: {item.featureName}
                          </span>
                        )}
                      </div>

                      {item.note && (
                        <p className="text-[#4b2f23]/80 border-t border-[#aa7b3f]/10 pt-1.5 italic leading-relaxed">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Dharohar AI Scholar guide entry */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2B2118] to-amber-950/20 border border-[#aa7b3f]/30 shadow-xl space-y-4 text-center">
              <Sparkles className="w-8 h-8 text-[#b65a3a] mx-auto animate-bounce" style={{ animationDuration: '4s' }} />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-[#4b2f23]">Dharohar AI Scholar AI</h4>
                <p className="text-[10px] text-[#4b2f23]/60 max-w-xs mx-auto">
                  Consult the AI Guide for specific architectural structures, Chola inscriptions, or rock-cut construction comparisons.
                </p>
              </div>
              <button
                onClick={() => onNavigate('ai-guide')}
                className="w-full py-2.5 rounded-xl bg-[#b65a3a] text-white font-bold text-[11px] uppercase tracking-wider hover:bg-[#f5f0e6] transition-colors cursor-pointer"
              >
                Ask Dharohar AI
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
