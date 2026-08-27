import React, { useState } from 'react';
import { TabType, SectorData, AshaWorker, TeleconsultationRequest, MedicineItem, FacilityStatus, HighRiskPatient } from './types';
import { 
  INITIAL_SECTORS, 
  INITIAL_ASHA_WORKERS, 
  INITIAL_TELECONSULTATIONS, 
  INITIAL_MEDICINES, 
  INITIAL_FACILITY_STATUS, 
  INITIAL_HIGH_RISK_PATIENTS 
} from './data/mockData';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { TeleConsultant } from './components/TeleConsultant';
import { MedicineFacilityUpdate } from './components/MedicineFacilityUpdate';
import { HighRiskANCView } from './components/HighRiskANCView';
import { AppLogo } from './components/AppLogo';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sectors, setSectors] = useState<SectorData[]>(INITIAL_SECTORS);
  const [selectedSector, setSelectedSector] = useState<SectorData>(INITIAL_SECTORS[0]);
  const [ashaWorkers, setAshaWorkers] = useState<AshaWorker[]>(INITIAL_ASHA_WORKERS);
  const [teleconsultRequests, setTeleconsultRequests] = useState<TeleconsultationRequest[]>(INITIAL_TELECONSULTATIONS);
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [facilityStatus, setFacilityStatus] = useState<FacilityStatus>(INITIAL_FACILITY_STATUS);
  const [highRiskPatients, setHighRiskPatients] = useState<HighRiskPatient[]>(INITIAL_HIGH_RISK_PATIENTS);

  // Network & Sync State
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('Just Now');
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const pendingTeleconsults = teleconsultRequests.filter(r => r.status === 'Waiting').length;

  const handleRefreshSync = () => {
    confetti({ particleCount: 35, spread: 50 });
    setLastSyncTime('Just Now');
    setSyncNotice('All PHC field registries, ASHA tablets & Central Telemedicine servers synchronized.');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handleUpdateTeleconsult = (updated: TeleconsultationRequest) => {
    setTeleconsultRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleAddTeleconsult = (newReq: TeleconsultationRequest) => {
    setTeleconsultRequests(prev => [newReq, ...prev]);
    setActiveTab('teleconsult');
  };

  const handleInitiateTeleconsultFromAnywhere = (patientName?: string, sectorName?: string) => {
    if (patientName) {
      const existing = teleconsultRequests.find(r => r.patientName.toLowerCase() === patientName.toLowerCase());
      if (existing) {
        setActiveTab('teleconsult');
        return;
      }
    }

    const created: TeleconsultationRequest = {
      id: `TC-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName: patientName || 'Flagged ANC Patient',
      patientAge: 24,
      patientGender: 'Female',
      patientPhone: '+91 98400 11223',
      village: sectorName ? `${sectorName} Community` : 'Central Block',
      sector: sectorName || 'CHANDANAGIRI SECTOR',
      source: 'ASHA Field Worker',
      bookedBy: 'PHC Medical Officer Roster',
      requestTime: 'Just Now',
      urgency: 'Critical',
      specialty: 'OB/GYN & Maternal',
      symptoms: 'Gestational urgency flagged during PHC sector monitoring. Immediate doctor tele-review requested.',
      pregnancyStatus: 'Pregnant (3rd Trimester)',
      vitals: {
        bloodPressure: '154/100',
        heartRate: 86,
        spo2: 98,
        temperature: 37.1,
        hemoglobin: 8.4
      },
      doctorAssigned: 'Dr. Rajesh Sharma, MD (PHC In-Charge)',
      status: 'Waiting'
    };

    setTeleconsultRequests(prev => [created, ...prev]);
    setActiveTab('teleconsult');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Header (Tabs as mandated - NO three line drawer) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTeleconsultsCount={pendingTeleconsults}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        lastSyncTime={lastSyncTime}
        onRefreshSync={handleRefreshSync}
      />

      {/* Sync Flash Notice */}
      {syncNotice && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center shadow-xs flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            sectors={sectors}
            selectedSector={selectedSector}
            onSelectSector={setSelectedSector}
            ashaWorkers={ashaWorkers}
            onNavigateTab={setActiveTab}
            onInitiateTeleconsult={handleInitiateTeleconsultFromAnywhere}
          />
        )}

        {activeTab === 'teleconsult' && (
          <TeleConsultant
            requests={teleconsultRequests}
            onUpdateRequest={handleUpdateTeleconsult}
            onAddRequest={handleAddTeleconsult}
          />
        )}

        {activeTab === 'inventory' && (
          <MedicineFacilityUpdate
            medicines={medicines}
            facilityStatus={facilityStatus}
            onUpdateMedicines={setMedicines}
            onUpdateFacility={setFacilityStatus}
          />
        )}

        {activeTab === 'highrisk' && (
          <HighRiskANCView
            patients={highRiskPatients}
            onConnectTeleconsult={handleInitiateTeleconsultFromAnywhere}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2.5">
            <AppLogo size="xs" />
            <span className="font-semibold text-slate-800">PHC Monitoring</span>
            <span>•</span>
            <span>AshaCare⁺ Clinical Command Hub</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-blue-600 font-semibold">Kanchipuram District Health Registry</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>National Health Mission (NHM) Verified</span>
            <span>● 24x7 Gateway Live</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
