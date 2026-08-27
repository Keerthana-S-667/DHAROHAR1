import React, { useState } from 'react';
import { ArrowLeft, Search, Compass, Shield, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface TravellerSearchPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const TravellerSearchPage: React.FC<TravellerSearchPageProps> = ({
  onNavigate,
  language
}) => {
  const [searchVal, setSearchVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onNavigate('explore'); // Redirects to our central exploration grid
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#b65a3a]">
          <button
            onClick={() => onNavigate('traveller')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Traveller Home
          </button>
          <span className="text-[#4b2f23]/40">/</span>
          <span className="text-[#4b2f23] font-bold">Search Destination</span>
        </div>

        {/* Polished Search Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#b65a3a]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f0e6] border border-[#aa7b3f]/30 text-[10px] text-[#b65a3a] font-semibold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>Alternative Exploration Mode</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#4b2f23]">
              Where would you like to explore?
            </h1>
            <p className="font-subheading text-base sm:text-lg text-[#b65a3a] italic">
              Search by destination, monument name, or regional dynastic trails.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto relative pt-2">
            <div className="relative">
              <input
                id="destination-search-input"
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="e.g. Mahabalipuram, Hampi, Hawa Mahal..."
                className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl pl-11 pr-24 py-4 text-xs sm:text-sm text-[#4b2f23] placeholder-[#F3EBDD]/40 outline-none focus:border-[#aa7b3f] transition-colors"
              />
              <Search className="w-4 h-4 text-[#b65a3a] absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#b65a3a] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#f5f0e6] transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          <p className="text-xs text-[#4b2f23]/60 text-center max-w-md mx-auto leading-relaxed">
            If you do not want to provide GPS location access, searching for a specific monument serves as the starting point for trails, Recommended Viewpoints, and the Dharohar AI Heritage Guide.
          </p>
        </div>

        {/* Feature Hints Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#ede3d1]/40 border border-[#aa7b3f]/20 flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#b65a3a] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#4b2f23] uppercase tracking-wider">Privacy First</h4>
              <p className="text-[11px] text-[#4b2f23]/70 leading-relaxed">DHAROHAR does not store your location coordinates on any database. Your GPS location is computed locally in the browser to detect nearby monuments.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#ede3d1]/40 border border-[#aa7b3f]/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#b65a3a] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#4b2f23] uppercase tracking-wider">3D Exploration</h4>
              <p className="text-[11px] text-[#4b2f23]/70 leading-relaxed">Virtually scan structural columns, vimana heights, and architectural hotspots by selecting any monument from the query result.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
