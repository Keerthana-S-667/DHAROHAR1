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
    { id: '3d-explorer', label: t.threeD, icon: Sparkles, badge: 'LIVE 3D' },
    { id: 'ai-guide', label: t.aiGuide, icon: Bot },
    { id: 'heritage-map', label: t.map, icon: MapPin },
    { id: 'preservation', label: t.preservation, icon: ShieldCheck },
    { id: 'about', label: t.about, icon: Info }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id === 'home' ? 'landing' : id);
    setMobileMenuOpen(false);
  };

  const languageLabels: Record<Language, { label: string; native: string }> = {
    en: { label: 'English', native: 'EN' },
    ta: { label: 'தமிழ்', native: 'தமிழ்' },
    hi: { label: 'हिन्दी', native: 'हिन्दी' }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex flex-col transition-all duration-300">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#211A16] text-[#aa7b3f] py-2 px-4 text-center text-[10px] sm:text-[11px] tracking-[0.18em] font-bold flex items-center justify-center gap-2 border-b border-[#aa7b3f]/10 shadow-sm z-50">
        <span className="w-1.5 h-1.5 rounded-full bg-[#b65a3a] animate-pulse" />
        <span>NOW OPENING: THE FIRST DIGITAL COLLECTION OF LIVING HERITAGE</span>
        <button 
          onClick={() => onNavigate('explore')}
          className="hover:text-[#f5f0e6] transition-colors ml-2 flex items-center gap-1 font-extrabold cursor-pointer"
        >
          ENTER THE ARCHIVE <span className="text-[12px]">→</span>
        </button>
      </div>

      {/* 2. MAIN NAVIGATION PANEL */}
      <div className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#f5f0e6]/95 backdrop-blur-md border-b border-[#d5b990] py-3 shadow-md' 
          : 'bg-[#f5f0e6]/90 backdrop-blur-sm border-b border-[#d5b990]/60 py-4.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo — dharohar text in Samarkan font */}
          <button
            id="navbar-brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center group cursor-pointer mr-6 xl:mr-10 flex-shrink-0"
            title="DHAROHAR Home"
          >
            <span className="brand-wordmark transition-opacity duration-300 group-hover:opacity-80 select-none">
              dharohar
            </span>
          </button>

          {/* Desktop Navigation Links (Flat links with underline reveal) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 flex-shrink-0">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id || 
                (item.id === 'explore' && (currentRoute.startsWith('state/') || currentRoute.startsWith('destination/') || currentRoute.startsWith('monument/'))) ||
                (item.id === 'home' && currentRoute === 'landing');
                
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative py-1.5 text-[11px] 2xl:text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#b65a3a]'
                      : 'text-[#4b2f23]/80 hover:text-[#b65a3a]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[8px] tracking-normal px-1.5 py-0.5 rounded bg-[#b65a3a] text-white font-extrabold scale-[0.9]">
                      {item.badge}
                    </span>
                  )}
                  {/* Subtle border bottom expand animation */}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#b65a3a] transform transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              );
            })}
          </nav>

          {/* Action Controls (Search + Language + Mobile Toggle + Vertical Divider + CTA) */}
          <div className="flex items-center gap-3">
            {/* Quick Search Button */}
            <button
              id="nav-search-button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#F4EFE6] border border-[#d5b990] text-xs text-[#4b2f23]/80 hover:text-[#b65a3a] transition-all cursor-pointer"
              title="Search Monuments (Press /)"
            >
              <Search className="w-3.5 h-3.5 text-[#b65a3a]" />
              <span className="hidden md:inline text-[11px] font-medium">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] bg-[#f5f0e6] border border-[#d5b990] rounded text-[#4b2f23]/60">
                /
              </kbd>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#F4EFE6] border border-[#d5b990] text-xs text-[#4b2f23] transition-all cursor-pointer font-semibold"
              >
                <Globe className="w-3.5 h-3.5 text-[#b65a3a]" />
                <span>{languageLabels[language].native}</span>
                <ChevronDown className="w-3 h-3 text-[#4b2f23]/60" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#ede3d1] border border-[#d5b990] rounded-xl shadow-lg overflow-hidden py-1 z-50 animate-fade-in-up duration-150">
                  {(['en', 'ta', 'hi'] as Language[]).map((lng) => (
                    <button
                      key={lng}
                      id={`lang-option-${lng}`}
                      onClick={() => {
                        onLanguageChange(lng);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        language === lng
                          ? 'bg-[#b65a3a] text-white font-bold'
                          : 'text-[#4b2f23] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      <span>{languageLabels[lng].label}</span>
                      <span className="text-[9px] opacity-75">({languageLabels[lng].native})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-[#d5b990] text-[#b65a3a] hover:bg-[#F4EFE6] transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Vertical Divider & CTA (Desktop only) */}
            <div className="hidden xl:flex items-center gap-4">
              <div className="w-[1px] h-8 bg-[#d5b990]" />
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs font-bold uppercase tracking-widest text-[#b65a3a] hover:text-[#4b2f23] transition-colors flex items-center gap-1.5 cursor-pointer py-1.5"
              >
                <span>BEGIN EXPLORING</span>
                <span className="text-sm font-semibold">→</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu (Light themed) */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#f5f0e6] border-t border-[#d5b990] px-4 py-6 mt-3 animate-fade-in-up duration-250">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id || 
                  (item.id === 'explore' && (currentRoute.startsWith('state/') || currentRoute.startsWith('destination/') || currentRoute.startsWith('monument/'))) ||
                  (item.id === 'home' && currentRoute === 'landing');
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#b65a3a] text-white border-[#b65a3a] shadow-md'
                        : 'bg-[#ede3d1] text-[#4b2f23] border-[#d5b990] hover:border-[#b65a3a]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#b65a3a]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
