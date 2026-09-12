import React, { useState, useMemo, useEffect } from 'react';
import { SectorData, AshaWorker, TabType } from '../types';
import { 
  Users, 
  UserCheck, 
  Search, 
  Phone, 
  Video, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Heart, 
  Baby, 
  Activity, 
  ChevronRight, 
  X, 
  Download, 
  ShieldCheck, 
  ArrowUpRight, 
  Calendar, 
  Building2,
  Thermometer,
  Eye,
  Check,
  Award
} from 'lucide-react';

export interface CitizenRecord {
  id: string;
  name: string;
  abhaId: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  village: string;
  sector: string;
  category: 'High-Risk Maternal' | 'Chronic Care (NCD)' | 'Pediatric / SAM' | 'Elderly Care' | 'General Rural';
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Routine';
  conditionSummary: string;
  gestationalWeek?: number;
  vitals: {
    bp?: string;
    hb?: number;
    sugar?: number;
    spo2?: number;
    weightKg?: number;
  };
  assignedAshaId: string;
  assignedAshaName: string;
  assignedAnmName: string;
  lastVisitDate: string;
  nextScheduledVisit: string;
  complianceStatus: 'On-Track' | 'Due Visit' | 'Delayed' | 'Critical Review';
}

export interface CadreWorker {
  id: string;
  name: string;
  initial: string;
  role: 'ASHA Worker' | 'ANM (Auxiliary Nurse Midwife)' | 'CHO (Community Health Officer)';
  sector: string;
  subCenter: string;
  villagesCovered: string[];
  assignedPopulation: number;
  assignedHouseholds: number;
  activeCases: number;
  highRiskCases: number;
  visitsCompleteToday: number;
  visitsPendingToday: number;
  performanceScore: number;
  phone: string;
  status: 'Online' | 'In Field' | 'Offline';
  lastSync: string;
}

const INITIAL_CITIZENS: CitizenRecord[] = [
  {
    id: 'CIT-101',
    name: 'Pooja Sanjay Kadam',
    abhaId: '91-4021-8842-1002',
    age: 24,
    gender: 'Female',
    phone: '+91 98221 55431',
    village: 'Wagholi Rural Hamlet',
    sector: 'WAGHOLI - HAVELI SECTOR',
    category: 'High-Risk Maternal',
    riskLevel: 'Critical',
    conditionSummary: 'Severe Pre-eclampsia (Week 32), Elevated BP, Peripheral Edema',
    gestationalWeek: 32,
    vitals: { bp: '158/104', hb: 8.2, sugar: 112, spo2: 98, weightKg: 58 },
    assignedAshaId: 'asha-2',
    assignedAshaName: 'Sunita Patil',
    assignedAnmName: 'ANM Meena Jadhav',
    lastVisitDate: 'Today, 09:30 AM',
    nextScheduledVisit: 'Tomorrow (Daily Monitoring)',
    complianceStatus: 'Critical Review'
  },
  {
    id: 'CIT-102',
    name: 'Radhika Vaibhav Jagtap',
    abhaId: '91-3145-7721-4409',
    age: 28,
    gender: 'Female',
    phone: '+91 97654 11203',
    village: 'Wagholi Central Ward',
    sector: 'WAGHOLI - HAVELI SECTOR',
    category: 'High-Risk Maternal',
    riskLevel: 'High',
    conditionSummary: 'Severe Nutritional Anemia (Hb 6.9 g/dL), Week 28',
    gestationalWeek: 28,
    vitals: { bp: '110/70', hb: 6.9, sugar: 94, spo2: 99, weightKg: 51 },
    assignedAshaId: 'asha-2',
    assignedAshaName: 'Sunita Patil',
    assignedAnmName: 'ANM Meena Jadhav',
    lastVisitDate: 'Yesterday, 04:15 PM',
    nextScheduledVisit: 'In 2 days (IV Iron Review)',
    complianceStatus: 'Due Visit'
  },
  {
    id: 'CIT-103',
    name: 'Manisha Datta Chavan',
    abhaId: '91-8821-6601-9012',
    age: 26,
    gender: 'Female',
    phone: '+91 94220 77144',
    village: 'Paud Village',
    sector: 'PAUD - MULSHI SECTOR',
    category: 'High-Risk Maternal',
    riskLevel: 'High',
    conditionSummary: 'Gestational Diabetes Mellitus (Fasting Sugar 198 mg/dL)',
    gestationalWeek: 36,
    vitals: { bp: '134/88', hb: 10.1, sugar: 198, spo2: 97, weightKg: 64 },
    assignedAshaId: 'asha-1',
    assignedAshaName: 'Vandana Shinde',
    assignedAnmName: 'ANM Anita Koli',
    lastVisitDate: 'Today, 08:30 AM',
    nextScheduledVisit: 'Friday (Insulin Titration)',
    complianceStatus: 'On-Track'
  },
  {
    id: 'CIT-104',
    name: 'Baby of Kavita More',
    abhaId: '91-5501-4491-3318',
    age: 1,
    gender: 'Female',
    phone: '+91 91580 33819',
    village: 'Otur Canal Hamlet',
    sector: 'OTUR - JUNNAR SECTOR',
    category: 'Pediatric / SAM',
    riskLevel: 'High',
    conditionSummary: 'Severe Acute Malnutrition (SAM), MUAC < 11.5cm, Growth faltering',
    vitals: { bp: '90/60', hb: 8.0, sugar: 80, spo2: 98, weightKg: 5.4 },
    assignedAshaId: 'asha-4',
    assignedAshaName: 'Kavita Gaikwad',
    assignedAnmName: 'ANM Rekha Shinde',
    lastVisitDate: '2 days ago',
    nextScheduledVisit: 'Tomorrow (NRC RUTF Feed Check)',
    complianceStatus: 'Due Visit'
  },
  {
    id: 'CIT-105',
    name: 'Shantaram Babanrao Deshmukh',
    abhaId: '91-1192-3304-8841',
    age: 67,
    gender: 'Male',
    phone: '+91 98230 44521',
    village: 'Malegaon Budruk',
    sector: 'MALEGAON - BARAMATI SECTOR',
    category: 'Chronic Care (NCD)',
    riskLevel: 'High',
    conditionSummary: 'Hypertensive Heart Disease & Type 2 Diabetes, Missed Refill',
    vitals: { bp: '166/98', hb: 12.4, sugar: 230, spo2: 96, weightKg: 72 },
    assignedAshaId: 'asha-3',
    assignedAshaName: 'Archana Deshmukh',
    assignedAnmName: 'ANM Swati Gore',
    lastVisitDate: '5 days ago',
    nextScheduledVisit: 'Today (Drug Delivery & BP Log)',
    complianceStatus: 'Delayed'
  },
  {
    id: 'CIT-106',
    name: 'Anusaya Ramchandra Gholap',
    abhaId: '91-6602-1190-2211',
    age: 72,
    gender: 'Female',
    phone: '+91 94231 66890',
    village: 'Harsul Tribal Hamlet',
    sector: 'PAUD - MULSHI SECTOR',
    category: 'Elderly Care',
    riskLevel: 'Moderate',
    conditionSummary: 'Osteoarthritis, Chronic Bronchitis, Mobility Impaired',
    vitals: { bp: '138/84', hb: 9.8, sugar: 140, spo2: 95, weightKg: 46 },
    assignedAshaId: 'asha-1',
    assignedAshaName: 'Vandana Shinde',
    assignedAnmName: 'ANM Anita Koli',
    lastVisitDate: '3 days ago',
    nextScheduledVisit: 'Monday (Palliative Physiotherapy)',
    complianceStatus: 'On-Track'
  },
  {
    id: 'CIT-107',
    name: 'Deepali Santosh Shinde',
    abhaId: '91-7733-4411-9988',
    age: 22,
    gender: 'Female',
    phone: '+91 98500 22109',
    village: 'Male Rural Ward',
    sector: 'PAUD - MULSHI SECTOR',
    category: 'High-Risk Maternal',
    riskLevel: 'Moderate',
    conditionSummary: 'Primigravida (Week 20), Previous Spontaneous Abortion history',
    gestationalWeek: 20,
    vitals: { bp: '118/76', hb: 11.2, sugar: 92, spo2: 99, weightKg: 54 },
    assignedAshaId: 'asha-1',
    assignedAshaName: 'Vandana Shinde',
    assignedAnmName: 'ANM Anita Koli',
    lastVisitDate: 'Yesterday',
    nextScheduledVisit: 'Next Week (Targeted USG Scan)',
    complianceStatus: 'On-Track'
  },
  {
    id: 'CIT-108',
    name: 'Master Aarav Sachin Shinde',
    abhaId: '91-2299-8811-0023',
    age: 3,
    gender: 'Male',
    phone: '+91 97633 44011',
    village: 'Bavadhan Khurd',
    sector: 'WAGHOLI - HAVELI SECTOR',
    category: 'Pediatric / SAM',
    riskLevel: 'Routine',
    conditionSummary: 'Routine Immunization DPT Booster + Vitamin A Drops',
    vitals: { bp: '95/62', hb: 11.5, sugar: 90, spo2: 99, weightKg: 13.8 },
    assignedAshaId: 'asha-2',
    assignedAshaName: 'Sunita Patil',
    assignedAnmName: 'ANM Meena Jadhav',
    lastVisitDate: '4 days ago',
    nextScheduledVisit: 'In 2 weeks (Growth Monitoring)',
    complianceStatus: 'On-Track'
  }
];

const INITIAL_CADRE: CadreWorker[] = [
  {
    id: 'asha-1',
    name: 'Vandana Shinde',
    initial: 'V',
    role: 'ASHA Worker',
    sector: 'PAUD - MULSHI SECTOR',
    subCenter: 'Paud Central Health Sub-Center',
    villagesCovered: ['Paud Village', 'Harsul Hamlet', 'Male Rural Ward'],
    assignedPopulation: 1420,
    assignedHouseholds: 284,
    activeCases: 124,
    highRiskCases: 7,
    visitsCompleteToday: 4,
    visitsPendingToday: 1,
    performanceScore: 96,
    phone: '+91 94220 88321',
    status: 'Online',
    lastSync: '2 mins ago'
  },
  {
    id: 'asha-2',
    name: 'Sunita Patil',
    initial: 'S',
    role: 'ASHA Worker',
    sector: 'WAGHOLI - HAVELI SECTOR',
    subCenter: 'Wagholi East Sub-Center',
    villagesCovered: ['Wagholi Central Ward', 'Wagholi Rural Hamlet', 'Bavadhan Khurd'],
    assignedPopulation: 1380,
    assignedHouseholds: 270,
    activeCases: 118,
    highRiskCases: 9,
    visitsCompleteToday: 3,
    visitsPendingToday: 2,
    performanceScore: 94,
    phone: '+91 98221 44510',
    status: 'Online',
    lastSync: 'Just now'
  },
  {
    id: 'asha-3',
    name: 'Archana Deshmukh',
    initial: 'A',
    role: 'ASHA Worker',
    sector: 'MALEGAON - BARAMATI SECTOR',
    subCenter: 'Malegaon Agro Sub-Center',
    villagesCovered: ['Malegaon Budruk', 'Koregaon Wadi', 'Songaon'],
    assignedPopulation: 1290,
    assignedHouseholds: 250,
    activeCases: 110,
    highRiskCases: 5,
    visitsCompleteToday: 5,
    visitsPendingToday: 0,
    performanceScore: 98,
    phone: '+91 97650 44219',
    status: 'Online',
    lastSync: '5 mins ago'
  },
  {
    id: 'asha-4',
    name: 'Kavita Gaikwad',
    initial: 'K',
    role: 'ASHA Worker',
    sector: 'OTUR - JUNNAR SECTOR',
    subCenter: 'Otur Valley Sub-Center',
    villagesCovered: ['Otur Canal Hamlet', 'Kukadi Basin', 'Pargaon'],
    assignedPopulation: 1150,
    assignedHouseholds: 230,
    activeCases: 85,
    highRiskCases: 6,
    visitsCompleteToday: 2,
    visitsPendingToday: 3,
    performanceScore: 91,
    phone: '+91 94210 55198',
    status: 'In Field',
    lastSync: '25 mins ago'
  },
  {
    id: 'anm-1',
    name: 'ANM Meena Jadhav',
    initial: 'M',
    role: 'ANM (Auxiliary Nurse Midwife)',
    sector: 'WAGHOLI - HAVELI SECTOR',
    subCenter: 'Wagholi Sector Primary Clinic',
    villagesCovered: ['Wagholi Sector Hub & 4 Feeding Villages'],
    assignedPopulation: 4500,
    assignedHouseholds: 920,
    activeCases: 280,
    highRiskCases: 18,
    visitsCompleteToday: 8,
    visitsPendingToday: 1,
    performanceScore: 97,
    phone: '+91 98229 33012',
    status: 'Online',
    lastSync: '10 mins ago'
  },
  {
    id: 'anm-2',
    name: 'ANM Anita Koli',
    initial: 'A',
    role: 'ANM (Auxiliary Nurse Midwife)',
    sector: 'PAUD - MULSHI SECTOR',
    subCenter: 'Paud Rural Sub-Center 1',
    villagesCovered: ['Paud Circle & Tribal Belt'],
    assignedPopulation: 4200,
    assignedHouseholds: 860,
    activeCases: 245,
    highRiskCases: 14,
    visitsCompleteToday: 6,
    visitsPendingToday: 2,
    performanceScore: 95,
    phone: '+91 94233 11890',
    status: 'Online',
    lastSync: '4 mins ago'
  }
];

interface CitizenAshaManagementProps {
  sectors: SectorData[];
  ashaWorkers: AshaWorker[];
  onInitiateTeleconsult?: (patientName?: string, sector?: string) => void;
  onNavigateTab?: (tab: TabType) => void;
  activeView?: 'citizens' | 'cadre';
  onViewChange?: (view: 'citizens' | 'cadre') => void;
}

export const CitizenAshaManagement: React.FC<CitizenAshaManagementProps> = ({
  sectors,
  ashaWorkers,
  onInitiateTeleconsult,
  onNavigateTab,
  activeView: controlledActiveView,
  onViewChange
}) => {
  // Main view tab: 'citizens' | 'cadre'
  const [internalView, setInternalView] = useState<'citizens' | 'cadre'>('citizens');
  const activeView = controlledActiveView || internalView;

  const handleSetView = (view: 'citizens' | 'cadre') => {
    setInternalView(view);
    if (onViewChange) onViewChange(view);
  };

  // Data state
  const [citizens, setCitizens] = useState<CitizenRecord[]>(INITIAL_CITIZENS);
  const [cadreList, setCadreList] = useState<CadreWorker[]>(INITIAL_CADRE);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [filterAshaWorkerId, setFilterAshaWorkerId] = useState<string | null>(null);

  // Toast & Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Selected user popups: Citizen or Worker
  const [selectedCitizenDetail, setSelectedCitizenDetail] = useState<CitizenRecord | null>(null);
  const [selectedWorkerDetail, setSelectedWorkerDetail] = useState<CadreWorker | null>(null);

  // Reassign ASHA selection
  const [isReassigning, setIsReassigning] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Citizens
  const filteredCitizens = useMemo(() => {
    return citizens.filter((c) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const match = 
          c.name.toLowerCase().includes(query) ||
          c.abhaId.toLowerCase().includes(query) ||
          c.village.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.assignedAshaName.toLowerCase().includes(query);
        if (!match) return false;
      }

      if (filterAshaWorkerId && c.assignedAshaId !== filterAshaWorkerId) {
        return false;
      }

      if (selectedSector !== 'All Sectors' && c.sector !== selectedSector) {
        return false;
      }

      return true;
    });
  }, [citizens, searchQuery, selectedSector, filterAshaWorkerId]);

  // Filtered Cadre
  const filteredCadre = useMemo(() => {
    return cadreList.filter((w) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const match =
          w.name.toLowerCase().includes(query) ||
          w.sector.toLowerCase().includes(query) ||
          w.subCenter.toLowerCase().includes(query) ||
          w.phone.includes(query);
        if (!match) return false;
      }

      if (selectedSector !== 'All Sectors' && w.sector !== selectedSector) {
        return false;
      }

      return true;
    });
  }, [cadreList, searchQuery, selectedSector]);

  // Reassign ASHA
  const handleReassignAsha = (citizenId: string, newAshaName: string) => {
    setCitizens(prev => prev.map(c => {
      if (c.id === citizenId) {
        return { ...c, assignedAshaName: newAshaName };
      }
      return c;
    }));
    showToast(`Reassigned to ${newAshaName}`);
    setIsReassigning(false);
  };

  return (
    <div id="citizen-asha-management-section" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-3">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header - Minimal & Clear */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Citizen & Health Worker Management
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200/80">
              Live Register
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any citizen or health worker to open full details as a popup
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200/80 p-1 rounded-xl border border-slate-300/60 text-xs font-semibold">
            <button
              id="btn-switch-citizens"
              onClick={() => {
                handleSetView('citizens');
                setFilterAshaWorkerId(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'citizens'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Citizens</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono">
                {citizens.length}
              </span>
            </button>

            <button
              id="btn-switch-cadre"
              onClick={() => {
                handleSetView('cadre');
                setFilterAshaWorkerId(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'cadre'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>ASHA & ANM Workers</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono">
                {cadreList.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Simplified */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeView === 'cadre'
                ? 'Search worker name, sector, sub-center...'
                : 'Search citizen name, ABHA ID, village, ASHA...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sector Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold focus:outline-none"
          >
            <option value="All Sectors">All Sectors ({sectors.length})</option>
            {sectors.map(s => (
              <option key={s.id} value={s.sectorName}>{s.sectorName}</option>
            ))}
          </select>

          {(searchQuery || selectedSector !== 'All Sectors' || filterAshaWorkerId) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('All Sectors');
                setFilterAshaWorkerId(null);
              }}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter notification if filtered to specific ASHA */}
      {filterAshaWorkerId && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
          <span className="font-semibold">
            Showing citizens assigned to ASHA:{' '}
            <span className="font-bold underline">{cadreList.find(w => w.id === filterAshaWorkerId)?.name}</span>
          </span>
          <button
            onClick={() => setFilterAshaWorkerId(null)}
            className="text-[11px] font-bold text-blue-700 hover:underline"
          >
            Show All Citizens
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. CITIZENS LIST (FRONT - MINIMAL & SIMPLIFIED) */}
      {/* ========================================================= */}
      {activeView === 'citizens' && (
        <div className="divide-y divide-slate-100">
          {filteredCitizens.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="font-semibold text-sm">No citizens found</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the search or filter</p>
            </div>
          ) : (
            filteredCitizens.map((citizen) => {
              const isCritical = citizen.riskLevel === 'Critical';
              const isHigh = citizen.riskLevel === 'High';

              return (
                <div
                  key={citizen.id}
                  onClick={() => setSelectedCitizenDetail(citizen)}
                  className="px-4 py-3.5 hover:bg-blue-50/40 hover:border-l-4 hover:border-blue-600 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left: Avatar + Name + ABHA + Category */}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 ${
                      isCritical ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {citizen.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {citizen.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {citizen.age}y, {citizen.gender.charAt(0)}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          citizen.category === 'High-Risk Maternal'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : citizen.category === 'Pediatric / SAM'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : citizen.category === 'Chronic Care (NCD)'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {citizen.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="font-mono text-[11px] text-slate-600">{citizen.abhaId}</span>
                        <span>•</span>
                        <span>{citizen.village}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Assigned ASHA + Status Tag + Chevron */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center sm:justify-end gap-1 text-xs font-semibold text-slate-800">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>ASHA: {citizen.assignedAshaName}</span>
                      </div>
                      <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {citizen.complianceStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      <span className="hidden md:inline text-[11px]">View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ASHA & ANM WORKERS LIST (FRONT - MINIMAL & SIMPLIFIED) */}
      {/* ========================================================= */}
      {activeView === 'cadre' && (
        <div className="divide-y divide-slate-100">
          {filteredCadre.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="font-semibold text-sm">No health workers found</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the search or filter</p>
            </div>
          ) : (
            filteredCadre.map((worker) => {
              return (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorkerDetail(worker)}
                  className="px-4 py-3.5 hover:bg-indigo-50/40 hover:border-l-4 hover:border-indigo-600 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left: Avatar + Name + Role + SubCenter */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      {worker.initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                          {worker.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          worker.role.includes('ANM')
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {worker.role}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                          worker.status === 'Online'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          ● {worker.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>{worker.subCenter}</span>
                        <span>•</span>
                        <span>{worker.sector}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Caseload + Performance + Chevron */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-slate-900">
                        {worker.activeCases} Cases ({worker.highRiskCases} High-Risk)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Performance: <strong className="text-emerald-600">{worker.performanceScore}%</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                      <span className="hidden md:inline text-[11px]">View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span>Click on any row to open the complete profile popup</span>
        </div>
        <button
          onClick={() => showToast('Citizens & ASHA Registry exported as CSV.')}
          className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* POPUP 1: SPECIFIC CITIZEN DETAILS MODAL */}
      {/* ========================================================= */}
      {selectedCitizenDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {selectedCitizenDetail.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedCitizenDetail.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedCitizenDetail.riskLevel === 'Critical'
                        ? 'bg-rose-600 text-white'
                        : selectedCitizenDetail.riskLevel === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {selectedCitizenDetail.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ABHA ID: {selectedCitizenDetail.abhaId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCitizenDetail(null);
                  setIsReassigning(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-3.5 text-xs">
              
              {/* Demographics & Location */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Age & Gender</span>
                  <span className="font-semibold text-slate-800">{selectedCitizenDetail.age} Years ({selectedCitizenDetail.gender})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Contact Mobile</span>
                  <span className="font-semibold text-slate-800">{selectedCitizenDetail.phone}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Village / Sector</span>
                  <span className="font-semibold text-slate-800">{selectedCitizenDetail.village}, {selectedCitizenDetail.sector}</span>
                </div>
              </div>

              {/* Health Condition & Vitals */}
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                    Clinical Diagnosis & Alert
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {selectedCitizenDetail.category}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                  {selectedCitizenDetail.conditionSummary}
                </p>

                {/* Vitals Grid */}
                <div className="pt-2 grid grid-cols-3 gap-2 border-t border-blue-200/60 text-center">
                  <div className="p-2 bg-white rounded-lg border border-blue-100">
                    <span className="text-[10px] text-slate-500 font-bold block">Blood Pressure</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {selectedCitizenDetail.vitals.bp || '120/80'}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-blue-100">
                    <span className="text-[10px] text-slate-500 font-bold block">Haemoglobin</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {selectedCitizenDetail.vitals.hb || 11.0} g/dL
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-blue-100">
                    <span className="text-[10px] text-slate-500 font-bold block">Blood Sugar</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {selectedCitizenDetail.vitals.sugar || 110} mg/dL
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned ASHA & Field Cadre */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Assigned Health Cadre
                  </span>
                  <button
                    onClick={() => setIsReassigning(!isReassigning)}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    {isReassigning ? 'Cancel Reassign' : 'Reassign Worker'}
                  </button>
                </div>

                {!isReassigning ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{selectedCitizenDetail.assignedAshaName}</span>
                      <p className="text-[11px] text-slate-500">Sub-center Lead: {selectedCitizenDetail.assignedAnmName}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {selectedCitizenDetail.complianceStatus}
                    </span>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center gap-2">
                    <select
                      defaultValue={selectedCitizenDetail.assignedAshaName}
                      onChange={(e) => {
                        handleReassignAsha(selectedCitizenDetail.id, e.target.value);
                        setSelectedCitizenDetail({ ...selectedCitizenDetail, assignedAshaName: e.target.value });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold focus:outline-none"
                    >
                      {cadreList.filter(w => w.role === 'ASHA Worker').map(w => (
                        <option key={w.id} value={w.name}>{w.name} ({w.sector})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-1 text-[11px] text-slate-500 flex justify-between border-t border-slate-200/60">
                  <span>Last Visit: {selectedCitizenDetail.lastVisitDate}</span>
                  <span>Next: {selectedCitizenDetail.nextScheduledVisit}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  showToast(`Calling citizen ${selectedCitizenDetail.name} (${selectedCitizenDetail.phone})...`);
                  setSelectedCitizenDetail(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Citizen</span>
              </button>

              {onInitiateTeleconsult && (
                <button
                  onClick={() => {
                    onInitiateTeleconsult(selectedCitizenDetail.name, selectedCitizenDetail.sector);
                    setSelectedCitizenDetail(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Teleconsult</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPUP 2: SPECIFIC ASHA / ANM WORKER DETAILS MODAL */}
      {/* ========================================================= */}
      {selectedWorkerDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {selectedWorkerDetail.initial}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{selectedWorkerDetail.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {selectedWorkerDetail.role}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ● {selectedWorkerDetail.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedWorkerDetail.subCenter}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorkerDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-3 text-xs">
              
              {/* Coverage & Location Grid */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">PHC Sector:</span>
                  <strong className="text-slate-800">{selectedWorkerDetail.sector}</strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Official Mobile:</span>
                  <strong className="text-slate-800 font-mono">{selectedWorkerDetail.phone}</strong>
                </div>
                <div className="pt-1.5 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Villages & Wards Covered
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWorkerDetail.villagesCovered.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Caseload & Performance Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Pop.</span>
                  <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                    {selectedWorkerDetail.assignedPopulation.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {selectedWorkerDetail.assignedHouseholds} homes
                  </span>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-bold uppercase text-blue-700 block">Active Cases</span>
                  <span className="text-sm font-bold text-blue-700 font-mono mt-0.5 block">
                    {selectedWorkerDetail.activeCases}
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold">
                    {selectedWorkerDetail.highRiskCases} High-Risk
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">Performance</span>
                  <span className="text-sm font-bold text-emerald-700 font-mono mt-0.5 block">
                    {selectedWorkerDetail.performanceScore}%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">Grade A</span>
                </div>
              </div>

              {/* Today's Field Visits Progress */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-700">Today's Home Visits Schedule</span>
                  <span className="text-emerald-700">
                    {selectedWorkerDetail.visitsCompleteToday} done &bull; {selectedWorkerDetail.visitsPendingToday} pending
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        (selectedWorkerDetail.visitsCompleteToday /
                          (selectedWorkerDetail.visitsCompleteToday + selectedWorkerDetail.visitsPendingToday || 1)) *
                        100
                      }%`
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-right">Last sync: {selectedWorkerDetail.lastSync}</p>
              </div>

              {/* Monitored Citizens preview */}
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Assigned Citizens Caseload</span>
                  <button
                    onClick={() => {
                      setFilterAshaWorkerId(selectedWorkerDetail.id);
                      handleSetView('citizens');
                      setSelectedWorkerDetail(null);
                    }}
                    className="text-blue-600 hover:underline font-bold text-[11px]"
                  >
                    View All in List →
                  </button>
                </div>
                <div className="text-[11px] text-slate-600">
                  Clicking below will filter the citizens table specifically to {selectedWorkerDetail.name}'s assigned caseload.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  showToast(`Calling ${selectedWorkerDetail.name} (${selectedWorkerDetail.phone})...`);
                  setSelectedWorkerDetail(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Worker</span>
              </button>

              <button
                onClick={() => {
                  setFilterAshaWorkerId(selectedWorkerDetail.id);
                  handleSetView('citizens');
                  setSelectedWorkerDetail(null);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Filter Assigned Citizens</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
