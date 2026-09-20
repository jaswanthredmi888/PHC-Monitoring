import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { AppLogo } from './AppLogo';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Video, 
  Pill, 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Building2,
  ShieldCheck,
  User,
  MapPin,
  ShieldAlert,
  LogOut,
  ArrowRightLeft,
  CalendarClock,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Check
} from 'lucide-react';
import { AuthUser } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingTeleconsultsCount: number;
  criticalDeficitsCount?: number;
  pendingReferralsCount?: number;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  lastSyncTime: string;
  onRefreshSync: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingTeleconsultsCount,
  criticalDeficitsCount = 6,
  pendingReferralsCount = 0,
  isOnline,
  setIsOnline,
  lastSyncTime,
  onRefreshSync,
  currentUser,
  onLogout
}) => {
  // Navigation Drawer state (closed by default)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme, setTheme, language, setLanguage, t } = useThemeLanguage();

  // Close drawer on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  // Tab definitions used in both top bar and sidebar drawer
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: t.commandCenter,
      icon: Activity,
      iconColor: 'text-blue-600',
    },
    {
      id: 'appointments' as TabType,
      label: t.opdQueue,
      icon: CalendarClock,
      iconColor: 'text-blue-600',
    },
    {
      id: 'inventory' as TabType,
      label: t.medicineFacility,
      icon: Pill,
      iconColor: 'text-emerald-600',
    },
    {
      id: 'referrals' as TabType,
      label: t.referrals,
      icon: ArrowRightLeft,
      iconColor: 'text-amber-600',
      badge: pendingReferralsCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'teleconsult' as TabType,
      label: t.teleConsult,
      icon: Video,
      iconColor: 'text-indigo-600',
      badge: pendingTeleconsultsCount,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'disease-gap' as TabType,
      label: t.diseaseGap,
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
      badge: criticalDeficitsCount,
      badgeText: 'Deficits',
      badgeColor: 'bg-rose-600 text-white',
    },
  ];

  return (
    <header id="phc-header" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo & Name with Top-Left Three Line Drawer Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Three-line icon for opening drawer (top left corner) */}
            <button
              id="btn-open-sidebar-drawer"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Navigation Drawer"
              title="Open Navigation Menu"
              className="p-2 -ml-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors border border-transparent hover:border-slate-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <Menu className="w-5 h-5" />
            </button>

            <AppLogo size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold tracking-tight">
                  <span className="text-orange-500">SEVA</span>
                  <span className="text-green-600">Link</span>{' '}
                  <span className="text-black">Monitoring</span>
                </h1>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* User Profile & Network Sync */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Sync Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-semibold text-slate-700">{t.syncAll}</span>
              <button 
                onClick={onRefreshSync}
                title="Refresh Cloud Sync" 
                className="text-slate-400 hover:text-blue-600 ml-0.5 transition"
              >
                <RefreshCw className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Network Connection Indicator */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? 'Online (Click to toggle offline mode)' : 'Offline (Click to toggle online mode)'}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition ${
                isOnline 
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' 
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span className="hidden md:inline text-[10px] font-semibold text-emerald-700">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span className="text-[10px] font-semibold">{t.workingOffline}</span>
                </>
              )}
            </button>

            {/* Staff User Avatar & Session Actions */}
            <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                  {currentUser?.role?.split('(')[0] || 'Staff on Duty'}
                </p>
                <p className="text-xs font-bold text-slate-800">
                  {currentUser?.name || 'Dr. Ananya Sharma'}
                </p>
              </div>
              <div 
                title={currentUser ? `${currentUser.name} (${currentUser.role}) • ${currentUser.phcName}` : 'Staff Profile'}
                className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0 cursor-default"
              >
                {currentUser?.initials || 'AS'}
              </div>

              {onLogout && (
                <button
                  id="btn-header-logout"
                  onClick={onLogout}
                  title="Sign Out of Clinical Portal"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 ml-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Clean Minimalist Navigation Tab Bar (Reduced Font Size & Compact Height) */}
      <div className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1.5 border-b-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Center Dashboard</span>
            </button>

            {/* NEW: Appointment & Queue Tab */}
            <button
              id="tab-appointments"
              onClick={() => setActiveTab('appointments')}
              className={`py-2 px-1.5 border-b-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'appointments'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5 text-blue-600" />
              <span>Appointment & Queue</span>
            </button>

            <button
              id="tab-inventory"
              onClick={() => setActiveTab('inventory')}
              className={`py-2 px-1.5 border-b-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Medicine & Facility Update</span>
            </button>

            <button
              id="tab-referrals"
              onClick={() => setActiveTab('referrals')}
              className={`relative py-2 px-1.5 border-b-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'referrals'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Referral & Follow-up</span>
              {pendingReferralsCount > 0 && (
                <span className="flex items-center justify-center px-1.5 min-w-3.5 h-3.5 text-[9px] font-bold rounded-full bg-amber-500 text-white">
                  {pendingReferralsCount}
                </span>
              )}
            </button>

            <button
              id="tab-teleconsult"
              onClick={() => setActiveTab('teleconsult')}
              className={`relative py-2 px-1.5 border-b-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'teleconsult'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Tele-Consultations</span>
              {pendingTeleconsultsCount > 0 && (
                <span className="flex items-center justify-center px-1.5 min-w-3.5 h-3.5 text-[9px] font-bold rounded-full bg-rose-500 text-white">
                  {pendingTeleconsultsCount}
                </span>
              )}
            </button>

            <button
              id="tab-disease-gap"
              onClick={() => setActiveTab('disease-gap')}
              className={`relative py-2 px-1.5 border-b-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'disease-gap'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Disease & Facility Gap Map</span>
              {criticalDeficitsCount > 0 && (
                <span className="flex items-center justify-center px-1.5 min-w-3.5 h-3.5 text-[9px] font-bold rounded-full bg-rose-600 text-white animate-pulse">
                  {criticalDeficitsCount} Deficits
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Side Navigation Drawer (Closed by default, toggled via three-line icon) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop Overlay */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity cursor-pointer"
              aria-hidden="true"
            />

            {/* Slide-out Drawer Panel */}
            <div className="fixed inset-y-0 left-0 max-w-full flex">
              <motion.div
                key="drawer-panel"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                id="phc-navigation-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Portal Navigation Drawer"
                className="w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col border-r border-slate-200 z-10"
              >
                {/* Drawer Top Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-slate-50/80">
                  <div className="flex items-center gap-2.5">
                    <AppLogo size="sm" />
                    <div>
                      <h2 className="text-base font-bold tracking-tight leading-tight">
                        <span className="text-orange-500">SEVA</span>
                        <span className="text-green-600">Link</span>{' '}
                        <span className="text-black">Monitoring</span>
                      </h2>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {t.subtitle}
                      </p>
                    </div>
                  </div>
                  <button
                    id="btn-close-sidebar-drawer"
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="Close Navigation Drawer"
                    title="Close Drawer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Staff User Card */}
                {currentUser && (
                  <div className="p-3.5 mx-3 mt-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {currentUser.initials || 'AS'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-blue-700 font-semibold truncate">
                        {currentUser.role}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {currentUser.phcName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Tabs in Drawer */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                  <p className="px-2 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t.navigation}
                  </p>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        id={`drawer-tab-${tab.id}`}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs font-bold'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : tab.iconColor || 'text-slate-500'}`} />
                          <span className="truncate">{tab.label}</span>
                        </div>

                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                              isActive
                                ? 'bg-white/25 text-white'
                                : tab.badgeColor || 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {tab.badgeText ? `${tab.badge} ${tab.badgeText}` : tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Drawer Footer: Theme Toggle & 4 Languages Switcher (DRAWER ONLY) */}
                <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 space-y-3">
                  
                  {/* 1. DARK MODE TOGGLE (DRAWER ONLY) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                        {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                        <span>{t.theme}</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-600">
                        {theme === 'dark' ? t.darkMode : t.lightMode}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/60 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        id="drawer-theme-light"
                        onClick={() => setTheme('light')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          theme === 'light'
                            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t.lightMode}</span>
                      </button>
                      <button
                        type="button"
                        id="drawer-theme-dark"
                        onClick={() => setTheme('dark')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-slate-800 text-white shadow-xs border border-slate-700 font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-blue-400" />
                        <span>{t.darkMode}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. FOUR LANGUAGES SUPPORT: MARATHI, ENGLISH, HINDI, TAMIL (DRAWER ONLY) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t.language}</span>
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {language.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { code: 'mr', label: 'मराठी', sub: 'Marathi' },
                        { code: 'en', label: 'English', sub: 'English' },
                        { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
                        { code: 'ta', label: 'தமிழ்', sub: 'Tamil' },
                      ].map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            id={`drawer-lang-${lang.code}`}
                            onClick={() => setLanguage(lang.code as any)}
                            className={`p-2 rounded-xl border text-left transition flex items-center justify-between group cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold ring-1 ring-blue-500 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold leading-tight">{lang.label}</div>
                              <div className="text-[9px] text-slate-400 font-normal">{lang.sub}</div>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. SIGN OUT */}
                  {onLogout && (
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold border border-rose-200 hover:border-rose-300 transition cursor-pointer mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
