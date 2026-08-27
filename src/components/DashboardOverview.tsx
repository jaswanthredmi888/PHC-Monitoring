import React from 'react';
import { SectorData, AshaWorker } from '../types';
import { MetricCards } from './MetricCards';
import { GisMap } from './GisMap';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AshaLeaderboard } from './AshaLeaderboard';

interface DashboardOverviewProps {
  sectors: SectorData[];
  selectedSector: SectorData;
  onSelectSector: (sector: SectorData) => void;
  ashaWorkers: AshaWorker[];
  onNavigateTab: (tab: 'teleconsult' | 'inventory' | 'highrisk') => void;
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
    <div className="space-y-8 pb-12">
      {/* 1. Top Metrics Section (Screenshot 3) */}
      <section>
        <MetricCards onCardClick={(m) => {
          if (m === 'highrisk') onNavigateTab('highrisk');
          if (m === 'staff') onNavigateTab('dashboard');
        }} />
      </section>

      {/* 2. Live GIS Epidemiological Heatmap & Selected Sector Card (Screenshot 3 & Screenshot 2) */}
      <section>
        <GisMap
          sectors={sectors}
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
          onInitiateTeleconsult={onInitiateTeleconsult}
        />
      </section>

      {/* 3. Analytical Charts (Screenshot 1) */}
      <section>
        <AnalyticsCharts />
      </section>

      {/* 4. ASHA Worker Performance & Live Fields Leaderboard (Screenshot 1) */}
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
