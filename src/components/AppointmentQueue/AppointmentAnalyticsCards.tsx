import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  HeartPulse, 
  CalendarClock,
  ArrowUpRight
} from 'lucide-react';

interface AppointmentAnalyticsCardsProps {
  totalAppointments: number;
  waitingPatients: number;
  completedConsultations: number;
  missedAppointments: number;
  emergencyCount: number;
  delayedCount: number;
  activeFilterStatus: string;
  onSelectFilterStatus: (status: string) => void;
}

export const AppointmentAnalyticsCards: React.FC<AppointmentAnalyticsCardsProps> = ({
  totalAppointments,
  waitingPatients,
  completedConsultations,
  missedAppointments,
  emergencyCount,
  delayedCount,
  activeFilterStatus,
  onSelectFilterStatus
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Total Appointments */}
      <button
        type="button"
        onClick={() => onSelectFilterStatus('all')}
        className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
          activeFilterStatus === 'all'
            ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Booked
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <CalendarClock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalAppointments}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">All Slots</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 font-medium">Full facility OPD schedule</p>
      </button>

      {/* 2. Waiting Patients (Queue) */}
      <button
        type="button"
        onClick={() => onSelectFilterStatus('Checked-In')}
        className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
          activeFilterStatus === 'Checked-In'
            ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Waiting in Queue
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-black text-blue-900 font-mono tracking-tight">
            {waitingPatients}
          </span>
          <span className="text-[10px] font-bold text-blue-600">Checked-In</span>
        </div>
        <p className="text-[10px] text-blue-700/80 mt-1 font-medium">Receptive at triage counters</p>
      </button>

      {/* 3. Emergency / High-Risk Priority */}
      <button
        type="button"
        onClick={() => onSelectFilterStatus('priority')}
        className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
          activeFilterStatus === 'priority'
            ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/20 shadow-xs'
            : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
            Priority Cases
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-black text-rose-900 font-mono tracking-tight">
            {emergencyCount}
          </span>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded-full">
            Immediate
          </span>
        </div>
        <p className="text-[10px] text-rose-700/80 mt-1 font-medium">Emergency & High-Risk ANC</p>
      </button>

      {/* 4. Completed Consultations */}
      <button
        type="button"
        onClick={() => onSelectFilterStatus('Completed')}
        className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
          activeFilterStatus === 'Completed'
            ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
            : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Completed
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-900 font-mono tracking-tight">
            {completedConsultations}
          </span>
          <span className="text-[10px] font-semibold text-emerald-600">Discharged</span>
        </div>
        <p className="text-[10px] text-emerald-700/80 mt-1 font-medium">Consulted & Rx dispensed</p>
      </button>

      {/* 5. Delayed Appointments */}
      <button
        type="button"
        onClick={() => onSelectFilterStatus('Delayed')}
        className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
          activeFilterStatus === 'Delayed'
            ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
            : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Delayed Slots
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-950 font-mono tracking-tight">
            {delayedCount}
          </span>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full">
            En Route
          </span>
        </div>
        <p className="text-[10px] text-amber-800/80 mt-1 font-medium">Flagged for ASHA reminder</p>
      </button>

      {/* 6. Missed Appointments */}
      <button
        type="button"
        onClick={() => onSelectFilterStatus('Missed')}
        className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
          activeFilterStatus === 'Missed'
            ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/20 shadow-xs'
            : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
            Missed / No-Show
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-black text-rose-950 font-mono tracking-tight">
            {missedAppointments}
          </span>
          <span className="text-[10px] font-bold text-rose-600">Action Req</span>
        </div>
        <p className="text-[10px] text-rose-800/80 mt-1 font-medium">Doorstep follow-up assigned</p>
      </button>

    </div>
  );
};
