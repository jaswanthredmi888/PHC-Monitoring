import React from 'react';
import { Users, ShieldCheck, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface MetricCardsProps {
  onCardClick?: (metric: string) => void;
  referralsCount?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ onCardClick, referralsCount = 8 }) => {
  const { t } = useThemeLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. ASSIGNED CITIZENS */}
      <div 
        id="card-assigned-citizens"
        onClick={() => onCardClick && onCardClick('citizens')}
        className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
        title="Click to scroll to Citizens Management"
      >
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            {t.citizensCountLabel}
          </span>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            140
          </div>
          <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center justify-between">
            <span>{t.coverageStat}</span>
            <span className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {t.manageLink}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE ASHA STAFF */}
      <div 
        id="card-active-staff"
        onClick={() => onCardClick && onCardClick('staff')}
        className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
        title="Click to scroll to ASHA & ANM Cadre Management"
      >
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            {t.activeAshaCountLabel}
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            12
          </div>
          <div className="text-xs font-medium text-emerald-700 mt-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t.liveInFieldStat}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {t.manageLink}
            </span>
          </div>
        </div>
      </div>

      {/* 3. REFERRAL & FOLLOW-UP */}
      <div 
        onClick={() => onCardClick && onCardClick('referrals')}
        className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 font-mono">
            {t.referrals}
          </span>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">
            {referralsCount}
          </div>
          <div className="text-xs font-medium text-blue-600 mt-1">
            {t.grassrootsHospitalReferrals}
          </div>
        </div>
      </div>

      {/* 4. BLOCK IMMUNIZATION */}
      <div 
        onClick={() => onCardClick && onCardClick('immunization')}
        className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            {t.blockImmunization}
          </span>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            94.2%
          </div>
          <div className="text-xs font-medium text-blue-600 mt-1">
            {t.nationalTargetStat}
          </div>
        </div>
      </div>

    </div>
  );
};
