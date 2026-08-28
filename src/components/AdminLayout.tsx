import React, { useState } from 'react';
import { 
  Shield, 
  LogOut, 
  Grid, 
  FileText, 
  ShieldAlert, 
  Users, 
  BarChart3, 
  History,
  Menu,
  X,
  Bell,
  User,
  ArrowLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSubview: string;
  onNavigate: (route: string) => void;
  breadcrumbs: { label: string; route?: string }[];
  notificationsCount?: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentSubview,
  onNavigate,
  breadcrumbs,
  notificationsCount = 0
}) => {
  const { logout, profile } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Grid, path: 'admin' },
    { id: 'reports', label: 'All Reports', icon: FileText, path: 'admin/reports' },
    { id: 'risk-monitor', label: 'Risk Monitor', icon: ShieldAlert, path: 'admin/risk-monitor' },
    { id: 'contributions', label: 'Contributions', icon: Users, path: 'admin/contributions' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: 'admin/analytics' },
    { id: 'activity', label: 'Activity Log', icon: History, path: 'admin/activity' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] flex font-body selection:bg-[#b65a3a] selection:text-white">
      
      {/* ── LEFT SIDEBAR (DESKTOP) ──────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#ede3d1]/80 border-r border-[#d5b990] min-h-screen p-6 shrink-0 relative backdrop-blur-sm">
        
        {/* Brand/Department Identifier */}
        <div className="flex items-center gap-3 pb-8 border-b border-[#d5b990]/65">
          <div className="w-10 h-10 bg-[#b65a3a]/10 border border-[#b65a3a]/25 text-[#b65a3a] rounded-lg flex items-center justify-center">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="brand-wordmark text-2xl leading-none pt-1">dharohar</h2>
            <p className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#b65a3a]">
              Heritage Admin
            </p>
          </div>
        </div>

        {/* Navigation Link Deck */}
        <nav className="flex-1 py-8 space-y-2">
          <p className="text-[9px] uppercase tracking-widest font-black text-[#4b2f23]/40 pb-2">COMMAND PANEL</p>
          {navItems.map((item) => {
            const isActive = currentSubview === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#b65a3a] text-white shadow-md'
                    : 'text-[#4b2f23]/80 hover:bg-[#ede3d1] hover:text-[#b65a3a]'
                }`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Authenticated Admin Badge */}
        <div className="pt-6 border-t border-[#d5b990]/65 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#b65a3a] text-white flex items-center justify-center font-display font-bold">
              ध
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-[#4b2f23] max-w-[120px] truncate">
                {profile?.full_name || 'Officer'}
              </span>
              <span className="text-[8px] font-extrabold text-[#b65a3a] uppercase tracking-wider">
                Heritage Officer
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-[#d5b990] hover:bg-[#b65a3a] hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTAINER ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Command Header */}
        <header className="h-20 bg-[#f5f0e6]/95 backdrop-blur-sm border-b border-[#d5b990]/60 flex items-center justify-between px-6 lg:px-8 z-30 sticky top-0">
          
          {/* Breadcrumbs / Back button */}
          <div className="flex items-center gap-3.5">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[#d5b990] text-[#b65a3a] hover:bg-[#ede3d1] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-[#4b2f23]/60">
              <button 
                onClick={() => onNavigate('admin')}
                className="hover:text-[#b65a3a] cursor-pointer"
              >
                Command Centre
              </button>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3 h-3 text-[#4b2f23]/40" />
                  {crumb.route ? (
                    <button
                      onClick={() => onNavigate(crumb.route!)}
                      className="hover:text-[#b65a3a] cursor-pointer font-bold"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-[#b65a3a] font-bold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action Center (Announcements / User Details) */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block px-3 py-1 rounded bg-[#ede3d1] border border-[#d5b990]/50 text-[9px] font-bold text-[#b65a3a] uppercase tracking-wider">
              Secure Session Active
            </span>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-full border border-[#d5b990] hover:bg-[#ede3d1] text-[#4b2f23] transition-all cursor-pointer relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {notificationsCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#b65a3a] border border-[#f5f0e6] flex items-center justify-center text-[7px] text-white font-bold animate-pulse">
                    {notificationsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-72 bg-[#ede3d1] border border-[#d5b990] rounded-2xl shadow-xl p-4 space-y-3 z-50 text-left font-body"
                  >
                    <div className="flex justify-between items-center border-b border-[#d5b990]/60 pb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b65a3a]">Preservation Warnings</span>
                      <span className="text-[9px] text-[#4b2f23]/60">{notificationsCount} items</span>
                    </div>
                    {notificationsCount === 0 ? (
                      <p className="text-[10px] text-[#4b2f23]/65 text-center py-2">No urgent alerts requiring immediate signature.</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        <div className="p-2 rounded bg-[#f5f0e6] border border-[#d5b990]/30 text-[10px]">
                          <strong className="text-red-500 uppercase text-[9px] block">High Priority</strong>
                          Shore Temple surface scaling case assigned. Target: Sep 10.
                        </div>
                        <div className="p-2 rounded bg-[#f5f0e6] border border-[#d5b990]/30 text-[10px]">
                          <strong className="text-amber-500 uppercase text-[9px] block">Verification</strong>
                          Surveyor Team logged Hampi Chariot structural survey.
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace Content viewport */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>

      {/* ── MOBILE MENU DRAWER ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            
            {/* Backdrop cover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex flex-col w-64 bg-[#ede3d1] border-r border-[#d5b990] h-full p-6 shadow-2xl z-50 text-left font-body"
            >
              <div className="flex items-center justify-between pb-6 border-b border-[#d5b990]/65">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#b65a3a]" />
                  <span className="brand-wordmark text-xl leading-none">dharohar</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg border border-[#d5b990] text-[#b65a3a]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 py-6 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = currentSubview === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#b65a3a] text-white'
                          : 'text-[#4b2f23]/80 hover:bg-[#f5f0e6] hover:text-[#b65a3a]'
                      }`}
                    >
                      <item.icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-[#d5b990]/65 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#b65a3a] text-white flex items-center justify-center font-display font-bold">
                    ध
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-[#4b2f23] max-w-[120px] truncate">
                      {profile?.full_name || 'Officer'}
                    </span>
                    <span className="text-[8px] font-medium text-[#4b2f23]/60 uppercase tracking-wider">
                      Heritage Officer
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-[#b65a3a] text-white text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
