import React, { useState } from 'react';
import { AshaWorker } from '../types';
import { Phone, MessageSquare, ExternalLink, CheckCircle2, Clock, UserCheck } from 'lucide-react';

interface AshaLeaderboardProps {
  workers: AshaWorker[];
  onCallAsha?: (worker: AshaWorker) => void;
  onViewAshaDetails?: (worker: AshaWorker) => void;
}

export const AshaLeaderboard: React.FC<AshaLeaderboardProps> = ({
  workers,
  onCallAsha,
  onViewAshaDetails
}) => {
  const [selectedWorker, setSelectedWorker] = useState<AshaWorker | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCall = (worker: AshaWorker, e: React.MouseEvent) => {
    e.stopPropagation();
    setToastMessage(`Initiating direct VoIP gateway call to ASHA ${worker.name} (${worker.phone})...`);
    setTimeout(() => setToastMessage(null), 4000);
    if (onCallAsha) onCallAsha(worker);
  };

  const handleMessage = (worker: AshaWorker, e: React.MouseEvent) => {
    e.stopPropagation();
    setToastMessage(`PHC Broadcast SMS sent to ${worker.name}: "Please submit Day-14 HBNC log today."`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Toast notification */}
      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-3">✕</button>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
          ASHA Worker Performance & Live Fields Leaderboard
        </h2>
        <span className="text-xs font-mono font-medium text-slate-500">
          Total Teams: 12 Members
        </span>
      </div>

      {/* Grid of ASHA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workers.map((worker) => {
          const totalVisits = worker.visitsComplete + worker.visitsPending;
          const completePercent = totalVisits > 0 ? (worker.visitsComplete / totalVisits) * 100 : 0;

          return (
            <div
              key={worker.id}
              onClick={() => {
                setSelectedWorker(worker);
                if (onViewAshaDetails) onViewAshaDetails(worker);
              }}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header with Avatar, Name, Sector & Online Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Blue Circle Avatar with Initial */}
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                      {worker.initial}
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {worker.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                        {worker.sector}
                      </p>
                    </div>
                  </div>

                  {/* Online / Offline Status Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      worker.status === 'Online'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {worker.status}
                  </span>
                </div>

                {/* Active Cases & Performance Index */}
                <div className="grid grid-cols-2 gap-4 my-4 pt-1">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                      Active Cases
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      {worker.activeCases} <span className="text-xs font-medium text-slate-500">Citizens</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                      Performance Index
                    </div>
                    <div className="text-lg font-bold text-blue-600 mt-0.5">
                      {worker.performanceScore}/100 <span className="text-xs font-medium text-blue-600">Score</span>
                    </div>
                  </div>
                </div>

                {/* Visits Progress Bar */}
                <div className="my-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-600 font-medium">
                      Visits: <strong className="text-slate-900">{worker.visitsComplete} Complete</strong>
                    </span>
                    <span className="text-amber-700 font-medium">
                      {worker.visitsPending} Pending
                    </span>
                  </div>

                  {/* Clean Dual-tone Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${completePercent}%` }}
                    ></div>
                    <div 
                      className="bg-amber-400 h-full transition-all duration-500"
                      style={{ width: `${100 - completePercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Footer: Retirement Date & Quick Contact Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-400 font-mono text-[11px]">
                  Assigned Block Retirement: <span className="font-medium text-slate-700">{worker.assignedRetirement}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCall(worker, e)}
                    title={`Call ASHA ${worker.name}`}
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleMessage(worker, e)}
                    title={`Message ASHA ${worker.name}`}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
