import React, { useState, useMemo } from 'react';
import { Search, X, MapPin, Compass, ArrowRight, Shield } from 'lucide-react';
import { heritageService } from '../services/heritageService';
import { HeritageImage } from './HeritageImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const monuments = heritageService.getMonuments();
    const states = heritageService.getStates();
    const trails = heritageService.getHeritageTrails();

    const monumentHits = Object.values(monuments)
      .filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.nativeName.toLowerCase().includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.dynasty.toLowerCase().includes(q) ||
        m.architectureStyle.toLowerCase().includes(q) ||
        m.location.city.toLowerCase().includes(q) ||
        m.location.state.toLowerCase().includes(q) ||
        m.culturalSignificance.toLowerCase().includes(q)
      )
      .map(m => ({
        type: 'monument' as const,
        id: m.id,
        title: m.name,
        subtitle: `${m.dynasty} • ${m.location.city}, ${m.location.state}`,
        image: m.heroImage,
        route: `monument/${m.id}`
      }));

    const stateHits = states
      .filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.nativeName.toLowerCase().includes(q) ||
        s.dynasties.some(d => d.toLowerCase().includes(q))
      )
      .map(s => ({
        type: 'state' as const,
        id: s.id,
        title: s.name,
        subtitle: `State Heritage • ${s.dynasties[0]}`,
        image: s.heroImage,
        route: `state/${s.id}`
      }));

    const trailHits = trails
      .filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.theme.toLowerCase().includes(q)
      )
      .map(t => ({
        type: 'trail' as const,
        id: t.id,
        title: t.title,
        subtitle: `Thematic Trail • ${t.duration} • ${t.region}`,
        image: t.heroImage,
        route: `trails` // Map to trails list or dynamic route later
      }));

    return [...monumentHits, ...stateHits, ...trailHits];
  }, [query]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#f5f0e6]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#ede3d1] border border-[#aa7b3f]/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#aa7b3f]/20 bg-[#f5f0e6]">
          <Search className="w-5 h-5 text-[#b65a3a] shrink-0 mr-3" />
          <input
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search monuments (Shore Temple, Hawa Mahal), dynasties (Pallava, Chola), or trails..."
            className="w-full bg-transparent text-[#4b2f23] placeholder-[#F3EBDD]/40 text-sm md:text-base outline-none font-sans"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#4b2f23]/50 hover:text-[#4b2f23] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs rounded-lg bg-[#ede3d1] text-[#b65a3a] border border-[#aa7b3f]/30 hover:bg-[#b65a3a] hover:text-white transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {!query.trim() ? (
            <div className="py-6 text-center text-xs text-[#4b2f23]/60 space-y-3">
              <p className="font-semibold text-[#b65a3a] uppercase tracking-wider">Suggested Heritage Searches</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['Shore Temple 3D', 'Pallava Dynasty', 'Hawa Mahal', 'Konark Sun Chariot', 'Virupaksha', 'Musical Pillars'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 rounded-full bg-[#f5f0e6] border border-[#aa7b3f]/30 text-[#4b2f23]/80 hover:text-[#b65a3a] hover:border-[#aa7b3f] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#4b2f23]/60">
              No historical records found for "{query}". Try searching "Shore Temple" or "Jaipur".
            </div>
          ) : (
            searchResults.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => {
                  onNavigate(item.route);
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl bg-[#f5f0e6]/60 border border-[#aa7b3f]/20 hover:border-[#aa7b3f] hover:bg-[#f5f0e6] transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#aa7b3f]/30">
                  <HeritageImage src={item.image} alt={item.title} fallbackName={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      item.type === 'monument' ? 'bg-[#b65a3a]/20 text-[#b65a3a]' :
                      item.type === 'state' ? 'bg-[#B58A52]/20 text-[#B58A52]' :
                      'bg-emerald-900/30 text-emerald-300'
                    }`}>
                      {item.type}
                    </span>
                    <h4 className="text-sm font-semibold text-[#4b2f23] truncate group-hover:text-[#b65a3a]">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#4b2f23]/60 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#b65a3a]/60 group-hover:text-[#b65a3a] group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
