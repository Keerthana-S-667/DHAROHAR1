import React, { useState, useMemo } from 'react';
import { Search, Compass, ArrowLeft, BookOpen, Layers, Filter, Check, ShieldAlert, Award, Grid, Trash2, Calendar, FileText, Sparkles, Navigation } from 'lucide-react';
import { Language, Monument } from '../types';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';

interface ResearchHomePageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const ResearchHomePage: React.FC<ResearchHomePageProps> = ({
  onNavigate,
  language
}) => {
  const store = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedDynasty, setSelectedDynasty] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedUnescoOnly, setSelectedUnescoOnly] = useState<boolean>(false);

  const monuments = Object.values(heritageService.getMonuments());

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
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#D4A85A]">
          <button
            onClick={() => onNavigate('landing')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <span className="text-[#F3EBDD]/40">/</span>
          <span className="text-[#F3EBDD] font-bold">Research Portal</span>
        </div>

        {/* Header Block */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B2118] border border-[#D4A85A]/30 text-[10px] text-[#D4A85A] font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 animate-pulse" />
            <span>Virtual Research & Study Environment</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#F3EBDD] tracking-tight">
            Explore India's Heritage
          </h1>
          <p className="text-xs sm:text-base text-[#F3EBDD]/70 leading-relaxed">
            Discover monuments, architecture, history and cultural stories through a virtual research experience. Explore structural timelines, save items of interest to your research notebook, and compare monument profiles side-by-side.
          </p>
        </div>

        {/* Quick Browse Categories */}
        <div className="p-6 rounded-3xl bg-[#2B2118]/80 border border-[#D4A85A]/30 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-[#D4A85A] uppercase tracking-wider flex items-center gap-1.5">
            <Grid className="w-4 h-4" />
            Quick Study Collections
          </h3>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <button 
              onClick={() => handleQuickBrowse('unesco', 'true')}
              className="px-3 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 hover:border-[#D4A85A] text-[#F3EBDD] font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-[#D4A85A]" />
              UNESCO Heritage Sites
            </button>
            <button 
              onClick={() => handleQuickBrowse('state', 'Tamil Nadu')}
              className="px-3 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 hover:border-[#D4A85A] text-[#F3EBDD] font-semibold transition-all cursor-pointer"
            >
              Tamil Nadu Monuments
            </button>
            <button 
              onClick={() => handleQuickBrowse('dynasty', 'Pallava Dynasty')}
              className="px-3 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 hover:border-[#D4A85A] text-[#F3EBDD] font-semibold transition-all cursor-pointer"
            >
              Pallava Architecture
            </button>
            <button 
              onClick={() => handleQuickBrowse('style', 'Early Structural Dravidian Stone Architecture')}
              className="px-3 py-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 hover:border-[#D4A85A] text-[#F3EBDD] font-semibold transition-all cursor-pointer"
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
                <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-[#D4A85A]/60" />
                <input
                  type="text"
                  placeholder="Search name, city, dynasty, style, epoch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/40 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/40 focus:outline-none focus:border-[#D4A85A] transition-colors"
                />
              </div>
              
              <button
                onClick={handleClearFilters}
                className="px-4 py-3 rounded-2xl bg-[#17130F] border border-[#D4A85A]/30 text-xs font-semibold text-[#D4A85A] hover:bg-[#2B2118] transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>

            {/* Filter controls shelf */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-3xl bg-[#2B2118]/50 border border-[#D4A85A]/20">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#D4A85A] tracking-wider block">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-[#17130F] border border-[#D4A85A]/20 rounded-xl px-2 py-1.5 text-[11px] text-[#F3EBDD] focus:outline-none"
                >
                  <option value="all">All States</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#D4A85A] tracking-wider block">Architecture Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-[#17130F] border border-[#D4A85A]/20 rounded-xl px-2 py-1.5 text-[11px] text-[#F3EBDD] focus:outline-none"
                >
                  <option value="all">All Styles</option>
                  {styles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#D4A85A] tracking-wider block">Dynasty</label>
                <select
                  value={selectedDynasty}
                  onChange={(e) => setSelectedDynasty(e.target.value)}
                  className="w-full bg-[#17130F] border border-[#D4A85A]/20 rounded-xl px-2 py-1.5 text-[11px] text-[#F3EBDD] focus:outline-none"
                >
                  <option value="all">All Dynasties</option>
                  {dynasties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#D4A85A] tracking-wider block">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-[#17130F] border border-[#D4A85A]/20 rounded-xl px-2 py-1.5 text-[11px] text-[#F3EBDD] focus:outline-none"
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
                  className="w-4 h-4 rounded border-[#D4A85A]/40 text-[#D4A85A] bg-[#17130F] focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="unesco_check" className="text-[11px] text-[#F3EBDD] font-medium cursor-pointer">
                  UNESCO Sites Only
                </label>
              </div>
            </div>

            {/* Results count indicator */}
            <div className="text-xs text-[#F3EBDD]/60 flex items-center justify-between">
              <span>Showing <strong>{filteredMonuments.length}</strong> index matches</span>
              {selectedState !== 'all' || selectedStyle !== 'all' || selectedDynasty !== 'all' || selectedPeriod !== 'all' || selectedUnescoOnly ? (
                <span className="text-[#D4A85A] font-semibold">Active filters are applied</span>
              ) : null}
            </div>

            {/* Search results catalog */}
            {filteredMonuments.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#2B2118]/20 border border-[#D4A85A]/20 space-y-3">
                <Layers className="w-12 h-12 text-[#D4A85A]/30 mx-auto" />
                <h4 className="font-bold text-sm">No research entries match</h4>
                <p className="text-xs text-[#F3EBDD]/60">Try updating your filters or searching other queries.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMonuments.map((mon) => {
                  const isSavedForComparison = store.selectedComparisonMonuments.includes(mon.id);
                  const is3DModelAvailable = mon.threeDStatus === 'available' || mon.has3DModel;

                  return (
                    <div 
                      key={mon.id}
                      className="p-5 rounded-3xl bg-[#2B2118]/80 border border-[#D4A85A]/30 hover:border-[#D4A85A]/60 transition-all flex flex-col sm:flex-row gap-5 shadow-lg"
                    >
                      <img 
                        src={mon.heroImage} 
                        alt={mon.name}
                        className="w-full sm:w-40 h-32 rounded-2xl object-cover shrink-0 border border-[#D4A85A]/20"
                      />
                      
                      <div className="flex-1 flex flex-col justify-between space-y-4 sm:space-y-0">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h3 className="font-display text-lg font-bold text-[#F3EBDD]">{mon.name}</h3>
                            {mon.unescoYear && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] text-[#D4A85A] font-bold uppercase tracking-wider">
                                UNESCO {mon.unescoYear}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#D4A85A] font-medium">
                            {mon.location.city}, {mon.location.state} • {mon.period} • {mon.dynasty}
                          </p>
                          <p className="text-xs text-[#F3EBDD]/70 leading-relaxed line-clamp-2">
                            {mon.culturalSignificance}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#D4A85A]/10 flex-wrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onNavigate(`monument/${mon.id}`)}
                              className="px-4 py-2 rounded-xl bg-[#17130F] text-[#F3EBDD] hover:bg-[#2B2118] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-[#D4A85A]/35"
                            >
                              Explore Monument
                            </button>
                            <button
                              onClick={() => onNavigate(`research/monument/${mon.id}`)}
                              className="px-4 py-2 rounded-xl bg-[#D4A85A] text-[#17130F] hover:bg-[#F3EBDD] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Open Research View
                            </button>
                            
                            {is3DModelAvailable ? (
                              <button
                                onClick={() => onNavigate(`monument/${mon.id}/3d`)}
                                className="px-4 py-2 rounded-xl bg-[#17130F] text-amber-400 border border-amber-500/30 hover:bg-amber-950/20 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                3D Explore
                              </button>
                            ) : (
                              <span className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-[#F3EBDD]/40 select-none">
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
                                ? 'bg-amber-600/20 text-[#D4A85A] border-amber-600'
                                : 'bg-[#17130F]/40 text-[#F3EBDD]/60 border-[#D4A85A]/20 hover:text-white'
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
            <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl space-y-5">
              <h3 className="font-display text-lg font-bold text-[#F3EBDD] pb-3 border-b border-[#D4A85A]/20 flex items-center justify-between">
                <span>Monument Comparison</span>
                <span className="px-2 py-0.5 rounded bg-[#17130F] text-[10px] font-mono text-[#D4A85A]">
                  {store.selectedComparisonMonuments.length}/2 Selected
                </span>
              </h3>

              {store.selectedComparisonMonuments.length === 0 ? (
                <p className="text-[11px] text-[#F3EBDD]/60 text-center py-4">
                  Add up to 2 monuments to compare their architecture styles, material, epochs, and preservation status.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {store.selectedComparisonMonuments.map((id) => {
                      const mon = heritageService.getMonumentById(id);
                      if (!mon) return null;
                      return (
                        <div key={id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#17130F] border border-[#D4A85A]/10 text-xs">
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
                      className="flex-1 py-2.5 rounded-xl bg-[#D4A85A] text-[#17130F] disabled:opacity-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Compare Monuments
                    </button>
                    <button
                      onClick={() => store.clearComparisonMonuments()}
                      className="px-3 py-2.5 rounded-xl bg-[#17130F] border border-[#D4A85A]/20 text-[#D4A85A] hover:bg-[#2B2118] text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notebook panel (Zustand linked + localStorage) */}
            <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 shadow-2xl space-y-5">
              <h3 className="font-display text-lg font-bold text-[#F3EBDD] pb-3 border-b border-[#D4A85A]/20 flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-[#D4A85A]" />
                My Research Notebook
              </h3>

              {store.savedResearchItems.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <FileText className="w-8 h-8 text-[#D4A85A]/20 mx-auto" />
                  <p className="text-[11px] text-[#F3EBDD]/60 max-w-xs mx-auto">
                    Notebook is empty. While studying a monument's chronicle or construction techniques, click "Save to Notebook" to bookmark notes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 space-y-3">
                  {store.savedResearchItems.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-[#17130F] border border-[#D4A85A]/20 text-[11px] space-y-2 relative group">
                      <button
                        onClick={() => store.removeSavedResearchItem(item.id)}
                        className="absolute top-2 right-2 p-1 text-[#F3EBDD]/40 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="pr-6 space-y-0.5">
                        <strong className="text-[#D4A85A] block truncate">{item.monumentName}</strong>
                        {item.sectionName && (
                          <span className="text-[9px] uppercase font-bold text-[#F3EBDD]/50 block">
                            Section: {item.sectionName}
                          </span>
                        )}
                        {item.featureName && (
                          <span className="text-[9px] uppercase font-bold text-[#F3EBDD]/50 block">
                            Feature: {item.featureName}
                          </span>
                        )}
                      </div>

                      {item.note && (
                        <p className="text-[#F3EBDD]/80 border-t border-[#D4A85A]/10 pt-1.5 italic leading-relaxed">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Sutradhar AI Scholar guide entry */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2B2118] to-amber-950/20 border border-[#D4A85A]/30 shadow-xl space-y-4 text-center">
              <Sparkles className="w-8 h-8 text-[#D4A85A] mx-auto animate-bounce" style={{ animationDuration: '4s' }} />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-[#F3EBDD]">Sutradhar Scholar AI</h4>
                <p className="text-[10px] text-[#F3EBDD]/60 max-w-xs mx-auto">
                  Consult the AI Guide for specific architectural structures, Chola inscriptions, or rock-cut construction comparisons.
                </p>
              </div>
              <button
                onClick={() => onNavigate('ai-guide')}
                className="w-full py-2.5 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-[11px] uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors cursor-pointer"
              >
                Ask Sutradhar
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
