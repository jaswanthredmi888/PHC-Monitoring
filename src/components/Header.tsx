import React from 'react';
import { TabType } from '../types';
import { AppLogo } from './AppLogo';
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
  ArrowRightLeft
} from 'lucide-react';
import { AuthUser } from '../types';

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
  return (
    <header id="phc-header" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <AppLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-orange-500">SEVA</span>
                  <span className="text-green-600">Link</span>{' '}
                  <span className="text-black">Monitoring</span>
                </h1>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Rural HealthCare Eco System - Maharashtra
              </p>
            </div>
          </div>

          {/* User Profile & Network Sync */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Sync Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-semibold text-slate-700">Synced</span>
              <button 
                onClick={onRefreshSync}
                title="Refresh Cloud Sync" 
                className="text-slate-400 hover:text-blue-600 ml-0.5 transition"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Simulated Live Gateway Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? 'Online (Click to toggle offline mode)' : 'Offline (Click to toggle online mode)'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                isOnline 
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' 
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline text-[11px] font-medium">Live Gateway</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[11px] font-semibold">Offline</span>
                </>
              )}
            </button>

            {/* Staff User Avatar & Session Actions */}
            <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {currentUser?.role?.split('(')[0] || 'Staff on Duty'}
                </p>
                <p className="text-xs font-bold text-slate-800">
                  {currentUser?.name || 'Dr. Ananya Sharma'}
                </p>
              </div>
              <div 
                title={currentUser ? `${currentUser.name} (${currentUser.role}) • ${currentUser.phcName}` : 'Staff Profile'}
                className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0 cursor-default"
              >
                {currentUser?.initials || 'AS'}
              </div>

              {onLogout && (
                <button
                  id="btn-header-logout"
                  onClick={onLogout}
                  title="Sign Out of Clinical Portal"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 ml-0.5"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Clean Minimalist Navigation Tab Bar */}
      <div className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 px-2 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Center Dashboard</span>
            </button>

            <button
              id="tab-teleconsult"
              onClick={() => setActiveTab('teleconsult')}
              className={`relative py-3 px-2 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'teleconsult'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Tele-Consultations</span>
              {pendingTeleconsultsCount > 0 && (
                <span className="flex items-center justify-center px-1.5 min-w-4 h-4 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {pendingTeleconsultsCount}
                </span>
              )}
            </button>

            <button
              id="tab-inventory"
              onClick={() => setActiveTab('inventory')}
              className={`py-3 px-2 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Medicine & Facility Update</span>
            </button>

            <button
              id="tab-referrals"
              onClick={() => setActiveTab('referrals')}
              className={`relative py-3 px-2 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'referrals'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Referral & Follow-up</span>
              {pendingReferralsCount > 0 && (
                <span className="flex items-center justify-center px-1.5 min-w-4 h-4 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                  {pendingReferralsCount}
                </span>
              )}
            </button>

            <button
              id="tab-disease-gap"
              onClick={() => setActiveTab('disease-gap')}
              className={`relative py-3 px-2 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'disease-gap'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Disease & Facility Gap Map</span>
              {criticalDeficitsCount > 0 && (
                <span className="flex items-center justify-center px-1.5 min-w-4 h-4 text-[10px] font-bold rounded-full bg-rose-600 text-white animate-pulse">
                  {criticalDeficitsCount} Deficits
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
