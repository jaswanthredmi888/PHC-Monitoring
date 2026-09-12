import React from 'react';
import { SectorData, AshaWorker, TabType } from '../types';
import { MetricCards } from './MetricCards';
import { GisMap } from './GisMap';
import { CitizenAshaManagement } from './CitizenAshaManagement';
import { AnalyticsCharts } from './AnalyticsCharts';
import { DashboardQuickActions } from './DashboardQuickActions';

interface DashboardOverviewProps {
  sectors: SectorData[];
  selectedSector: SectorData;
  onSelectSector: (sector: SectorData) => void;
  ashaWorkers: AshaWorker[];
  onNavigateTab: (tab: TabType) => void;
  onInitiateTeleconsult: (patientName?: string, sector?: string) => void;
  pendingTeleconsultsCount?: number;
  criticalDeficitsCount?: number;
  pendingReferralsCount?: number;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  sectors,
  selectedSector,
  onSelectSector,
  ashaWorkers,
  onNavigateTab,
  onInitiateTeleconsult,
  pendingTeleconsultsCount = 3,
  criticalDeficitsCount = 6,
  pendingReferralsCount = 5
}) => {
  const [managementView, setManagementView] = React.useState<'citizens' | 'cadre'>('citizens');

  const scrollToManagement = (view: 'citizens' | 'cadre') => {
    setManagementView(view);
    setTimeout(() => {
      const element = document.getElementById('citizen-asha-management-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
        }, 1600);
      }
    }, 50);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Quick Action Hub for all Tabs */}
      <section>
        <DashboardQuickActions
          onNavigateTab={onNavigateTab}
          pendingTeleconsultsCount={pendingTeleconsultsCount}
          criticalDeficitsCount={criticalDeficitsCount}
          pendingReferralsCount={pendingReferralsCount}
        />
      </section>

      {/* 2. Top Metrics Section */}
      <section>
        <MetricCards onCardClick={(m) => {
          if (m === 'citizens') {
            scrollToManagement('citizens');
          } else if (m === 'staff') {
            scrollToManagement('cadre');
          } else if (m === 'referrals' || m === 'highrisk') {
            onNavigateTab('referrals');
          }
        }} />
      </section>

      {/* 3. Live GIS Epidemiological Heatmap & Selected Sector Card */}
      <section>
        <GisMap
          sectors={sectors}
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
          onInitiateTeleconsult={onInitiateTeleconsult}
          onNavigateToCitizens={() => scrollToManagement('citizens')}
          onNavigateToCadre={() => scrollToManagement('cadre')}
        />
      </section>

      {/* 4. Management of Citizen and ASHA/ANM by Organised List */}
      <section>
        <CitizenAshaManagement
          sectors={sectors}
          ashaWorkers={ashaWorkers}
          onInitiateTeleconsult={onInitiateTeleconsult}
          onNavigateTab={onNavigateTab}
          activeView={managementView}
          onViewChange={setManagementView}
        />
      </section>

      {/* 5. Analytical Charts */}
      <section>
        <AnalyticsCharts />
      </section>
    </div>
  );
};

