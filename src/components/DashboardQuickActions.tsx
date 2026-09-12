import React from 'react';
import { TabType } from '../types';
import { 
  CalendarClock, 
  Video, 
  Pill, 
  ArrowRightLeft, 
  ShieldAlert, 
  ArrowUpRight,
  Zap
} from 'lucide-react';

interface DashboardQuickActionsProps {
  onNavigateTab: (tab: TabType) => void;
  pendingTeleconsultsCount?: number;
  criticalDeficitsCount?: number;
  pendingReferralsCount?: number;
  lowStockMedicinesCount?: number;
  activeAppointmentsCount?: number;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  onNavigateTab,
  pendingTeleconsultsCount = 3,
  criticalDeficitsCount = 6,
  pendingReferralsCount = 5,
  lowStockMedicinesCount = 3,
  activeAppointmentsCount = 14
}) => {
  const quickActions = [
    {
      id: 'appointments' as TabType,
      title: 'Appointment & Queue',
      countLabel: `${activeAppointmentsCount} Scheduled`,
      icon: CalendarClock,
      // Different background colors per card
      cardBg: 'bg-blue-50/90 hover:bg-blue-100/90 border-blue-200 text-blue-950',
      iconBox: 'bg-blue-600 text-white shadow-xs',
      badgeBg: 'bg-blue-100/80 text-blue-800 border-blue-200/70',
      arrowColor: 'text-blue-700'
    },
    {
      id: 'inventory' as TabType,
      title: 'Medicine & Facility',
      countLabel: lowStockMedicinesCount > 0 ? `${lowStockMedicinesCount} Low Stock` : 'Supplies OK',
      icon: Pill,
      cardBg: 'bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200 text-emerald-950',
      iconBox: 'bg-emerald-600 text-white shadow-xs',
      badgeBg: 'bg-emerald-100/80 text-emerald-800 border-emerald-200/70',
      arrowColor: 'text-emerald-700'
    },
    {
      id: 'referrals' as TabType,
      title: 'Referral & Follow-up',
      countLabel: `${pendingReferralsCount} Transfers`,
      icon: ArrowRightLeft,
      cardBg: 'bg-amber-50/90 hover:bg-amber-100/90 border-amber-200 text-amber-950',
      iconBox: 'bg-amber-600 text-white shadow-xs',
      badgeBg: 'bg-amber-100/80 text-amber-800 border-amber-200/70',
      arrowColor: 'text-amber-700'
    },
    {
      id: 'teleconsult' as TabType,
      title: 'Tele-Consultations',
      countLabel: pendingTeleconsultsCount > 0 ? `${pendingTeleconsultsCount} Waiting` : 'Active',
      icon: Video,
      cardBg: 'bg-purple-50/90 hover:bg-purple-100/90 border-purple-200 text-purple-950',
      iconBox: 'bg-purple-600 text-white shadow-xs',
      badgeBg: pendingTeleconsultsCount > 0 ? 'bg-rose-100 text-rose-800 border-rose-200 font-bold' : 'bg-purple-100/80 text-purple-800 border-purple-200/70',
      arrowColor: 'text-purple-700'
    },
    {
      id: 'disease-gap' as TabType,
      title: 'Disease & Gap Map',
      countLabel: `${criticalDeficitsCount} Critical Gaps`,
      icon: ShieldAlert,
      cardBg: 'bg-rose-50/90 hover:bg-rose-100/90 border-rose-200 text-rose-950',
      iconBox: 'bg-rose-600 text-white shadow-xs',
      badgeBg: 'bg-rose-100/80 text-rose-800 border-rose-200/70',
      arrowColor: 'text-rose-700'
    }
  ];

  return (
    <div id="center-dashboard-quick-actions" className="space-y-2.5">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Quick Actions</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          One-click tab navigation
        </span>
      </div>

      {/* Very Minimal 5-column Cards with Distinct Background Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={`quick-action-card-${action.id}`}
              onClick={() => onNavigateTab(action.id)}
              className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between group shadow-2xs hover:shadow-sm active:scale-[0.99] cursor-pointer ${action.cardBg}`}
            >
              {/* Top Row: Icon + Badge */}
              <div className="flex items-center justify-between w-full mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${action.iconBox}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${action.badgeBg}`}>
                  {action.countLabel}
                </span>
              </div>

              {/* Bottom Row: Title + Arrow */}
              <div className="flex items-center justify-between w-full mt-auto pt-1">
                <span className="text-xs font-bold tracking-tight truncate pr-1">
                  {action.title}
                </span>
                <ArrowUpRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${action.arrowColor}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
