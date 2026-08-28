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
  ChevronDown,
  LogOut,
  Shield,
  BookOpen,
  FileText,
  Target,
  Award
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { useAuthStore } from '../store/authStore';

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

  // Bind Auth state
  const { session, profile, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isResearcher = session && profile?.role === 'researcher';

  const navItems = isResearcher 
    ? [
        { id: 'home', label: t.home, icon: Compass },
        { id: 'research', label: 'Research Dossier', icon: Layers },
        { id: '3d-explorer', label: t.threeD, icon: Sparkles, badge: 'LIVE 3D' },
        { id: 'research/progress', label: 'My Notebook', icon: FileText },
        { id: 'research-quest', label: 'Heritage Quest', icon: Target },
        { id: 'ai-guide', label: 'Ask Dharohar AI', icon: Bot }
      ]
    : [
        { id: 'home', label: t.home, icon: Compass },
        { id: 'explore', label: t.explore, icon: Layers },
        { id: 'trails', label: t.trails, icon: Navigation },
        { id: '3d-explorer', label: t.threeD, icon: Sparkles, badge: 'LIVE 3D' },
        { id: 'ai-guide', label: t.aiGuide, icon: Bot },
        { id: 'heritage-map', label: t.map, icon: MapPin },
        { id: 'preservation', label: t.preservation, icon: ShieldCheck }
      ];

  const handleItemClick = (id: string) => {
    let target = id;
    if (id === 'home') {
      target = 'landing';
    } else if (id === 'research-library') {
      target = 'research';
    } else if (id === 'research-quest') {
      target = 'research/quest';
    } else if (id === 'research/progress-tab') {
      target = 'research/progress';
    }
    onNavigate(target);
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
            className="flex items-center group cursor-pointer mr-6 xl:mr-10 flex-shrink-0 transition-all duration-300"
            title="DHAROHAR Home"
          >
            <span 
              className="brand-wordmark transition-all duration-300 group-hover:opacity-80 select-none"
              style={{ fontSize: currentRoute === 'landing' ? 'clamp(38px, 5.5vw, 50px)' : '28px' }}
            >
              dharohar
            </span>
          </button>

          {/* Desktop Navigation Links (Flat links with underline reveal) */}
          {currentRoute !== 'landing' && (
            <nav className="hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-5 flex-shrink-0">
              {navItems.map((item) => {
                const isActive = currentRoute === item.id || 
                  (item.id === 'research/progress-tab' && currentRoute === 'research/progress') ||
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
          )}

          {/* Action Controls (Search + Language + Mobile Toggle + Vertical Divider + CTA) */}
          <div className="flex items-center gap-2 xl:gap-2.5 ml-auto">
            {/* Quick Search Button */}
            {currentRoute !== 'landing' && (
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
            )}

            {/* Language Selector Dropdown */}
            {currentRoute !== 'landing' && (
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
            )}

            {/* Mobile Menu Toggle Button */}
            {currentRoute !== 'landing' && (
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl border border-[#d5b990] text-[#b65a3a] hover:bg-[#F4EFE6] transition-all cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Vertical Divider & CTA (Desktop & Mobile on Landing, Desktop only otherwise) */}
            <div className={`${currentRoute === 'landing' ? 'flex' : 'hidden xl:flex'} items-center gap-2 xl:gap-3`}>
              {currentRoute !== 'landing' && <div className="w-[1px] h-8 bg-[#d5b990] opacity-55" />}
              {session && profile ? (
                <div className="flex items-center gap-3.5">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-extrabold text-[#4b2f23] tracking-wide max-w-[120px] truncate">
                      {profile.full_name || profile.username}
                    </span>
                    <span className="text-[8px] font-bold text-[#b65a3a] uppercase tracking-wider">
                      {profile.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-[11px] font-bold uppercase tracking-widest text-[#4b2f23]/60 hover:text-[#b65a3a] transition-colors cursor-pointer py-1.5 flex items-center gap-1"
                  >
                    <span>LOGOUT</span>
                    <span className="text-xs">→</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('admin/login')}
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#b65a3a] hover:text-[#ede3d1] bg-[#ede3d1]/40 hover:bg-[#b65a3a] border border-[#b65a3a]/30 hover:border-[#b65a3a] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1.5"
                >
                  <span>ADMIN LOGIN</span>
                  <span className="text-xs font-semibold">→</span>
                </button>
              )}
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
            {/* Mobile Authentication Portal CTA */}
            <div className="mt-4 pt-4 border-t border-[#d5b990]/60 flex flex-col gap-2">
              {session && profile ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#ede3d1]/60 border border-[#d5b990]/40">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#4b2f23] truncate max-w-[150px]">
                      {profile.full_name || profile.username}
                    </span>
                    <span className="text-[9px] font-bold text-[#b65a3a] uppercase tracking-wider">
                      Role: {profile.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#b65a3a] hover:bg-[#4b2f23] text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('admin/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#ede3d1] border border-[#d5b990] text-[#b65a3a] hover:border-[#b65a3a] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
