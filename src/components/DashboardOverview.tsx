import React from 'react';
import { SectorData, AshaWorker, TabType } from '../types';
import { MetricCards } from './MetricCards';
import { GisMap } from './GisMap';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AshaLeaderboard } from './AshaLeaderboard';
import { ShieldAlert, ArrowRight, AlertTriangle } from 'lucide-react';

interface DashboardOverviewProps {
  sectors: SectorData[];
  selectedSector: SectorData;
  onSelectSector: (sector: SectorData) => void;
  ashaWorkers: AshaWorker[];
  onNavigateTab: (tab: TabType) => void;
  onInitiateTeleconsult: (patientName?: string, sector?: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  sectors,
  selectedSector,
  onSelectSector,
  ashaWorkers,
  onNavigateTab,
  onInitiateTeleconsult
}) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Urgent Epidemic Facility Gap Escalation Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                State Epidemic Alert
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                6 Rural Deficits Detected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
              Outbreaks in Mulshi (Dengue), Otur (Cholera) & Harsul (Sickle Cell) lack local curing facilities. Escalation required.
            </p>
          </div>
        </div>

        <button
          id="btn-goto-disease-gap"
          onClick={() => onNavigateTab('disease-gap')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-xs"
        >
          <span>Open Disease & Facility Gap Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Top Metrics Section */}
      <section>
        <MetricCards onCardClick={(m) => {
          if (m === 'highrisk') onNavigateTab('highrisk');
          if (m === 'staff') onNavigateTab('dashboard');
        }} />
      </section>

      {/* 2. Live GIS Epidemiological Heatmap & Selected Sector Card */}
      <section>
        <GisMap
          sectors={sectors}
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
          onInitiateTeleconsult={onInitiateTeleconsult}
        />
      </section>

      {/* 3. Analytical Charts */}
      <section>
        <AnalyticsCharts />
      </section>

      {/* 4. ASHA Worker Performance & Live Fields Leaderboard */}
      <section>
        <AshaLeaderboard
          workers={ashaWorkers}
          onCallAsha={(w) => console.log('Calling ASHA', w.name)}
          onViewAshaDetails={(w) => console.log('Viewing ASHA', w.name)}
        />
      </section>
    </div>
  );
};
