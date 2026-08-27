import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  Globe, 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  Bot, 
  ShieldCheck, 
  MapPin, 
  Navigation,
  Info,
  ChevronDown
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  language,
  onLanguageChange,
  onOpenSearch
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[language].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.home, icon: Compass },
    { id: 'explore', label: t.explore, icon: Layers },
    { id: 'trails', label: t.trails, icon: Navigation },
    { id: '3d-explorer', label: t.threeD, icon: Sparkles, badge: 'Live 3D' },
    { id: 'ai-guide', label: t.aiGuide, icon: Bot },
    { id: 'heritage-map', label: t.map, icon: MapPin },
    { id: 'preservation', label: t.preservation, icon: ShieldCheck },
    { id: 'about', label: t.about, icon: Info }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const languageLabels: Record<Language, { label: string; native: string }> = {
    en: { label: 'English', native: 'EN' },
    ta: { label: 'தமிழ்', native: 'தமிழ்' },
    hi: { label: 'हिन्दी', native: 'हिन्दी' }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#17130F]/95 backdrop-blur-md border-b border-[#D4A85A]/30 py-3 shadow-xl' 
        : 'bg-gradient-to-b from-[#17130F]/90 via-[#17130F]/60 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="navbar-brand-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group text-left"
        >
          {/* Emblem Icon */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A85A] to-[#B58A52] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#17130F] rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-lg text-[#D4A85A]">ध</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-bold tracking-widest text-[#F3EBDD] group-hover:text-[#D4A85A] transition-colors">
                DHAROHAR
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A85A]" />
            </div>
            <p className="text-[10px] text-[#D4A85A] tracking-wider uppercase font-semibold">
              Digital Indian Heritage
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#2B2118]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4A85A]/30 shadow-inner">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id || (item.id === 'explore' && (currentRoute.startsWith('state/') || currentRoute.startsWith('destination/') || currentRoute.startsWith('monument/')));
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#D4A85A] text-[#17130F] font-bold shadow-md'
                    : 'text-[#F3EBDD]/80 hover:text-[#F3EBDD] hover:bg-[#B58A52]/20'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-[#17130F] text-[#D4A85A]' : 'bg-[#D4A85A]/20 text-[#D4A85A]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Search + Language + Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            id="nav-search-button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B2118]/80 hover:bg-[#2B2118] border border-[#D4A85A]/30 text-xs text-[#F3EBDD]/80 hover:text-[#D4A85A] hover:border-[#D4A85A] transition-all"
            title="Search Monuments (Press /)"
          >
            <Search className="w-3.5 h-3.5 text-[#D4A85A]" />
            <span className="hidden md:inline text-[11px] text-[#F3EBDD]/60">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-[#17130F] border border-[#D4A85A]/30 rounded text-[#D4A85A]">
              /
            </kbd>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="language-selector-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2B2118]/80 hover:bg-[#2B2118] border border-[#D4A85A]/30 text-xs text-[#F3EBDD] transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4A85A]" />
              <span className="font-semibold">{languageLabels[language].native}</span>
              <ChevronDown className="w-3 h-3 text-[#D4A85A]/70" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#2B2118] border border-[#D4A85A] rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                {(['en', 'ta', 'hi'] as Language[]).map((lng) => (
                  <button
                    key={lng}
                    id={`lang-option-${lng}`}
                    onClick={() => {
                      onLanguageChange(lng);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                      language === lng
                        ? 'bg-[#D4A85A] text-[#17130F] font-bold'
                        : 'text-[#F3EBDD] hover:bg-[#B58A52]/30'
                    }`}
                  >
                    <span>{languageLabels[lng].label}</span>
                    <span className="text-[10px] opacity-70">({languageLabels[lng].native})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#2B2118] border border-[#D4A85A]/30 text-[#D4A85A] hover:bg-[#D4A85A] hover:text-[#17130F] transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#17130F]/98 border-b border-[#D4A85A]/40 px-4 py-6 mt-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                    isActive
                      ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] font-bold shadow-md'
                      : 'bg-[#2B2118]/60 text-[#F3EBDD] border-[#D4A85A]/20 hover:border-[#D4A85A]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#17130F]' : 'text-[#D4A85A]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
