import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Info, 
  Activity, 
  Baby, 
  ShieldCheck,
  Filter
} from 'lucide-react';

interface VillageDiseaseData {
  village: string;
  sector: string;
  dengue: number;
  diarrhea: number;
  fever: number;
  total: number;
  alert?: string;
}

const VILLAGE_DISEASE_DATA: VillageDiseaseData[] = [
  {
    village: 'Ramapuram',
    sector: 'Mulshi East',
    dengue: 14,
    diarrhea: 4,
    fever: 18,
    total: 36,
    alert: 'Dengue vector focus in Ward 2'
  },
  {
    village: 'Chandanagiri',
    sector: 'Paud Central',
    dengue: 8,
    diarrhea: 6,
    fever: 32,
    total: 46,
    alert: 'Seasonal viral fever cluster'
  },
  {
    village: 'Kalyanpur',
    sector: 'Pirangut South',
    dengue: 3,
    diarrhea: 16,
    fever: 14,
    total: 33,
    alert: 'Active waterborne cluster (Chlorination active)'
  },
  {
    village: 'Gopalapuram',
    sector: 'Lavasa Ridge',
    dengue: 1,
    diarrhea: 3,
    fever: 9,
    total: 13
  }
];

interface TrimesterData {
  stage: string;
  label: string;
  weeks: string;
  healthy: number;
  anemia: number;
  preeclampsia: number;
  total: number;
  primaryAction: string;
}

const TRIMESTER_METRICS: TrimesterData[] = [
  {
    stage: '1st',
    label: '1st Trimester',
    weeks: 'Weeks 1 – 12',
    healthy: 34,
    anemia: 11,
    preeclampsia: 2,
    total: 47,
    primaryAction: 'Early USG dating & Iron-Folic supplementation initiated'
  },
  {
    stage: '2nd',
    label: '2nd Trimester',
    weeks: 'Weeks 13 – 27',
    healthy: 28,
    anemia: 18,
    preeclampsia: 6,
    total: 52,
    primaryAction: 'Anomaly scan review & Gestational Diabetes screening'
  },
  {
    stage: '3rd',
    label: '3rd Trimester',
    weeks: 'Weeks 28 – 40+',
    healthy: 20,
    anemia: 24,
    preeclampsia: 14,
    total: 58,
    primaryAction: 'Weekly BP monitoring & Institutional Delivery birth plan'
  }
];

interface AntigenData {
  antigen: string;
  timing: string;
  coverage: number;
  cohortTarget: number;
  vaccinated: number;
  status: 'met' | 'near' | 'lag';
}

const ANTIGEN_DATA: AntigenData[] = [
  {
    antigen: 'BCG',
    timing: 'At Birth',
    coverage: 98,
    cohortTarget: 350,
    vaccinated: 343,
    status: 'met'
  },
  {
    antigen: 'OPV-1',
    timing: '6 Weeks',
    coverage: 95,
    cohortTarget: 350,
    vaccinated: 332,
    status: 'met'
  },
  {
    antigen: 'Pentavalent-1',
    timing: '6 Weeks',
    coverage: 94,
    cohortTarget: 350,
    vaccinated: 329,
    status: 'near'
  },
  {
    antigen: 'Measles-Rubella (MR-1)',
    timing: '9–12 Months',
    coverage: 91,
    cohortTarget: 340,
    vaccinated: 309,
    status: 'near'
  },
  {
    antigen: 'DPT Booster-1',
    timing: '16–24 Months',
    coverage: 88,
    cohortTarget: 330,
    vaccinated: 290,
    status: 'lag'
  }
];

export const AnalyticsCharts: React.FC = () => {
  // Card 1: Disease filter & hover state
  const [diseaseFilter, setDiseaseFilter] = useState<'all' | 'dengue' | 'diarrhea'>('all');
  const [hoveredVillage, setHoveredVillage] = useState<VillageDiseaseData | null>(null);

  // Card 2: Maternal trimester selection
  const [selectedTrimester, setSelectedTrimester] = useState<number>(2); // default 3rd trimester (index 2)

  // Card 3: Immunization cohort filter
  const [immunizationCohort, setImmunizationCohort] = useState<'all' | 'primary' | 'boosters'>('all');

  // Filtered antigens
  const filteredAntigens = ANTIGEN_DATA.filter(item => {
    if (immunizationCohort === 'primary') return item.timing.includes('Birth') || item.timing.includes('6');
    if (immunizationCohort === 'boosters') return item.timing.includes('Months');
    return true;
  });

  const activeTrimester = TRIMESTER_METRICS[selectedTrimester];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              PHC Command Analytics & Surveillance
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Epidemiological Trends & Population Coverage
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span>Real-time Sync • Last 24 Hours</span>
        </div>
      </div>

      {/* 3 Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* ================================================================= */}
        {/* 1. DISEASE DISTRIBUTION CARD */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between transition-all hover:border-slate-300">
          <div>
            {/* Header with Badges & Filter */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 font-mono">
                Disease Distribution
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-slate-600">
                <button
                  onClick={() => setDiseaseFilter('all')}
                  className={`px-2 py-0.5 rounded-md transition ${diseaseFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setDiseaseFilter('dengue')}
                  className={`px-2 py-0.5 rounded-md transition ${diseaseFilter === 'dengue' ? 'bg-rose-50 text-rose-700 font-bold' : 'hover:text-rose-700'}`}
                >
                  Dengue
                </button>
                <button
                  onClick={() => setDiseaseFilter('diarrhea')}
                  className={`px-2 py-0.5 rounded-md transition ${diseaseFilter === 'diarrhea' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:text-blue-700'}`}
                >
                  Diarrhea
                </button>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              Village-wise Outbreak & Disease Distribution
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Active cluster caseload across monitored PHC sub-sectors
            </p>
          </div>

          {/* Bar Chart Container */}
          <div className="my-5">
            <div className="relative h-48 w-full bg-slate-50/50 rounded-xl border border-slate-100 p-3 flex flex-col justify-between">
              
              {/* Horizontal Gridlines & Y-Axis Scale */}
              <div className="absolute inset-x-3 top-3 bottom-8 flex flex-col justify-between pointer-events-none">
                {[40, 30, 20, 10, 0].map((val) => (
                  <div key={val} className="flex items-center w-full">
                    <span className="w-5 text-[10px] font-mono text-slate-400 text-right pr-1.5 select-none">
                      {val}
                    </span>
                    <div className="flex-1 border-b border-dashed border-slate-200/80"></div>
                  </div>
                ))}
              </div>

              {/* Grouped Bars Area */}
              <div className="relative z-10 w-full pl-6 pr-2 h-36 flex items-end justify-around">
                {VILLAGE_DISEASE_DATA.map((item) => {
                  const maxVal = 40;
                  const dengueH = Math.min(100, Math.max(4, Math.round((item.dengue / maxVal) * 100)));
                  const diarrheaH = Math.min(100, Math.max(4, Math.round((item.diarrhea / maxVal) * 100)));
                  const feverH = Math.min(100, Math.max(4, Math.round((item.fever / maxVal) * 100)));

                  const isHovered = hoveredVillage?.village === item.village;
                  const showDengue = diseaseFilter === 'all' || diseaseFilter === 'dengue';
                  const showDiarrhea = diseaseFilter === 'all' || diseaseFilter === 'diarrhea';
                  const showFever = diseaseFilter === 'all';

                  return (
                    <div
                      key={item.village}
                      onMouseEnter={() => setHoveredVillage(item)}
                      onMouseLeave={() => setHoveredVillage(null)}
                      className={`flex flex-col items-center group cursor-pointer transition-transform ${isHovered ? 'scale-105' : ''}`}
                    >
                      {/* Bar Group */}
                      <div className="flex items-end gap-1.5 h-32 px-1">
                        {showDengue && (
                          <div 
                            className="w-3 sm:w-3.5 bg-rose-500 rounded-t-sm shadow-xs transition-all duration-300 relative group/bar hover:bg-rose-600"
                            style={{ height: `${dengueH}%` }}
                            title={`Dengue: ${item.dengue} cases`}
                          >
                            <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900 text-white px-1 rounded-sm pointer-events-none transition-opacity">
                              {item.dengue}
                            </span>
                          </div>
                        )}

                        {showDiarrhea && (
                          <div 
                            className="w-3 sm:w-3.5 bg-blue-500 rounded-t-sm shadow-xs transition-all duration-300 relative group/bar hover:bg-blue-600"
                            style={{ height: `${diarrheaH}%` }}
                            title={`Diarrhea: ${item.diarrhea} cases`}
                          >
                            <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900 text-white px-1 rounded-sm pointer-events-none transition-opacity">
                              {item.diarrhea}
                            </span>
                          </div>
                        )}

                        {showFever && (
                          <div 
                            className="w-3 sm:w-3.5 bg-slate-400 rounded-t-sm shadow-xs transition-all duration-300 relative group/bar hover:bg-slate-500"
                            style={{ height: `${feverH}%` }}
                            title={`General Fever: ${item.fever} cases`}
                          >
                            <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-slate-900 text-white px-1 rounded-sm pointer-events-none transition-opacity">
                              {item.fever}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Village Label Below Column */}
                      <div className="mt-2 text-center">
                        <span className={`block text-[11px] font-bold transition-colors ${isHovered ? 'text-blue-600' : 'text-slate-700'}`}>
                          {item.village}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.total} tot
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Hover / Alert Insight Strip */}
            <div className="mt-2.5 min-h-[32px] flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-50 border border-slate-100">
              {hoveredVillage ? (
                <div className="flex items-center gap-1.5 text-slate-800">
                  <span className="font-bold text-slate-900">{hoveredVillage.village}:</span>
                  <span className="text-rose-600 font-semibold">{hoveredVillage.dengue} Dengue</span> •
                  <span className="text-blue-600 font-semibold">{hoveredVillage.diarrhea} Diarrhea</span> •
                  <span className="text-slate-600 font-semibold">{hoveredVillage.fever} Fever</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Kalyanpur: 16 Diarrhea cases (Chlorination teams dispatched)</span>
                </div>
              )}
            </div>
          </div>

          {/* Clean Accessible Legend */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span>
              <span className="text-slate-700 font-medium">Dengue Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-500"></span>
              <span className="text-slate-700 font-medium">Diarrhea Cluster</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-400"></span>
              <span className="text-slate-700 font-medium">General Fever</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. MATERNAL SURVEILLANCE CARD */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between transition-all hover:border-slate-300">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 font-mono">
                Maternal Surveillance
              </span>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                <Baby className="w-3 h-3" />
                <span>114 Active ANC</span>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              Maternal Trimester Stage Risks
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Progression of healthy vs complicated pregnancies by gestation
            </p>
          </div>

          {/* Interactive SVG Area Chart */}
          <div className="my-5">
            <div className="relative h-48 w-full bg-slate-50/50 rounded-xl border border-slate-100 p-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 280 160" preserveAspectRatio="none">
                <defs>
                  {/* Healthy ANC Gradient */}
                  <linearGradient id="maternalHealthyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>

                  {/* Anemia Gradient */}
                  <linearGradient id="maternalAnemiaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.03" />
                  </linearGradient>

                  {/* Preeclampsia Gradient */}
                  <linearGradient id="maternalPreeclampGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.04" />
                  </linearGradient>
                </defs>

                {/* Y Axis Gridlines */}
                <line x1="28" y1="20" x2="270" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="28" y1="52" x2="270" y2="52" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="28" y1="84" x2="270" y2="84" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="28" y1="116" x2="270" y2="116" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="28" y1="135" x2="270" y2="135" stroke="#cbd5e1" strokeWidth="1" />

                {/* Y Axis Numbers */}
                <text x="22" y="24" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">36</text>
                <text x="22" y="56" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">27</text>
                <text x="22" y="88" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">18</text>
                <text x="22" y="120" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">9</text>
                <text x="22" y="138" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">0</text>

                {/* Vertical Stage Guidelines */}
                <line x1="45" y1="20" x2="45" y2="135" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="145" y1="20" x2="145" y2="135" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="245" y1="20" x2="245" y2="135" stroke="#e2e8f0" strokeWidth="1" />

                {/* 1. HEALTHY CASES (Decreases gradually as complications diagnosed) */}
                {/* Points: (45, 26), (145, 48), (245, 72) */}
                <path
                  d="M 45,26 Q 145,48 245,72 L 245,135 L 45,135 Z"
                  fill="url(#maternalHealthyGrad)"
                />
                <path
                  d="M 45,26 Q 145,48 245,72"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* 2. ANEMIA OVERLAPS (Hb < 11g) (Increases) */}
                {/* Points: (45, 98), (145, 78), (245, 60) */}
                <path
                  d="M 45,98 Q 145,78 245,60 L 245,135 L 45,135 Z"
                  fill="url(#maternalAnemiaGrad)"
                />
                <path
                  d="M 45,98 Q 145,78 245,60"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* 3. PREECLAMPSIA / HIGH RISK (Spikes in 3rd trimester) */}
                {/* Points: (45, 128), (145, 114), (245, 88) */}
                <path
                  d="M 45,128 Q 145,114 245,88 L 245,135 L 45,135 Z"
                  fill="url(#maternalPreeclampGrad)"
                />
                <path
                  d="M 45,128 Q 145,114 245,88"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Nodes with interactive circles */}
                {[
                  { x: 45, yH: 26, yA: 98, yP: 128, stageIndex: 0 },
                  { x: 145, yH: 48, yA: 78, yP: 114, stageIndex: 1 },
                  { x: 245, yH: 72, yA: 60, yP: 88, stageIndex: 2 }
                ].map((node) => (
                  <g key={node.x} className="cursor-pointer">
                    <circle cx={node.x} cy={node.yH} r={selectedTrimester === node.stageIndex ? 5 : 3.5} fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={node.x} cy={node.yA} r={selectedTrimester === node.stageIndex ? 5 : 3.5} fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={node.x} cy={node.yP} r={selectedTrimester === node.stageIndex ? 5 : 3.5} fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                ))}

                {/* X Axis Labels */}
                <text x="45" y="152" fontSize="10" fill={selectedTrimester === 0 ? "#0f172a" : "#64748b"} fontWeight={selectedTrimester === 0 ? "bold" : "normal"} textAnchor="middle">
                  1st Trimester
                </text>
                <text x="145" y="152" fontSize="10" fill={selectedTrimester === 1 ? "#0f172a" : "#64748b"} fontWeight={selectedTrimester === 1 ? "bold" : "normal"} textAnchor="middle">
                  2nd Trimester
                </text>
                <text x="245" y="152" fontSize="10" fill={selectedTrimester === 2 ? "#0f172a" : "#64748b"} fontWeight={selectedTrimester === 2 ? "bold" : "normal"} textAnchor="middle">
                  3rd Trimester
                </text>
              </svg>
            </div>

            {/* Trimester Selector Buttons */}
            <div className="grid grid-cols-3 gap-1.5 mt-2.5">
              {TRIMESTER_METRICS.map((tri, idx) => (
                <button
                  key={tri.stage}
                  onClick={() => setSelectedTrimester(idx)}
                  className={`p-1.5 rounded-lg text-left transition border ${
                    selectedTrimester === idx
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300 text-amber-950'
                      : 'bg-slate-50 border-slate-200/70 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-bold">{tri.label}</div>
                  <div className="text-[9px] text-slate-500 font-mono">{tri.weeks}</div>
                </button>
              ))}
            </div>

            {/* Selected Trimester Detail Callout */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{activeTrimester.label} ({activeTrimester.total} Cohort):</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-semibold">{activeTrimester.healthy} Normal</span>
                  <span className="text-amber-700 font-semibold">{activeTrimester.anemia} Anemia</span>
                  <span className="text-rose-600 font-bold">{activeTrimester.preeclampsia} High-Risk</span>
                </div>
              </div>
              <p className="text-slate-600 text-[10px] leading-tight">
                {activeTrimester.primaryAction}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 font-medium">Healthy Cases</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-700 font-medium">Anemia Overlaps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-700 font-medium">Preeclampsia (PIH)</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. IMMUNIZATION INDEX CARD */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between transition-all hover:border-slate-300">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 font-mono">
                Immunization Index
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-slate-600">
                <button
                  onClick={() => setImmunizationCohort('all')}
                  className={`px-2 py-0.5 rounded-md transition ${immunizationCohort === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setImmunizationCohort('primary')}
                  className={`px-2 py-0.5 rounded-md transition ${immunizationCohort === 'primary' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                >
                  Primary
                </button>
                <button
                  onClick={() => setImmunizationCohort('boosters')}
                  className={`px-2 py-0.5 rounded-md transition ${immunizationCohort === 'boosters' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
                >
                  Boosters
                </button>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              Coverage Ratios (%) by Antigen
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Universal Immunization Programme (UIP) infant & toddler adherence
            </p>
          </div>

          {/* Progress Bar Rows with Target Line Indicator */}
          <div className="my-4 space-y-3">
            <div className="relative">
              {/* Target 95% Vertical Marker Line */}
              <div 
                className="absolute top-0 bottom-6 w-0.5 border-l-2 border-dashed border-emerald-500/70 z-20 pointer-events-none"
                style={{ left: 'calc(28% + 67% * 0.95)' }}
                title="National UIP Target: 95%"
              >
                <span className="absolute -top-4 -translate-x-1/2 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                  95% Target
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-2.5 pt-2">
                {filteredAntigens.map((item) => {
                  const isMet = item.coverage >= 95;
                  const isLag = item.coverage < 90;

                  return (
                    <div key={item.antigen} className="flex items-center gap-2 text-xs group">
                      {/* Label */}
                      <div className="w-28 text-right shrink-0">
                        <div className="font-semibold text-slate-800 text-[11px] leading-tight truncate" title={item.antigen}>
                          {item.antigen}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {item.timing}
                        </div>
                      </div>

                      {/* Bar Track */}
                      <div className="flex-1 bg-slate-100 rounded-lg h-6 p-0.5 relative overflow-hidden flex items-center border border-slate-200/50">
                        <div
                          className={`h-full rounded-md flex items-center justify-between px-2 text-white font-bold text-[10px] transition-all duration-700 ${
                            isMet 
                              ? 'bg-blue-600' 
                              : isLag 
                                ? 'bg-amber-500' 
                                : 'bg-blue-500'
                          }`}
                          style={{ width: `${item.coverage}%` }}
                        >
                          <span className="font-mono">{item.coverage}%</span>
                          {isMet ? (
                            <CheckCircle2 className="w-3 h-3 text-white/90 shrink-0" />
                          ) : (
                            <span className="text-[8px] font-mono opacity-80">
                              -{95 - item.coverage}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Pill */}
                      <div className="w-14 text-right shrink-0">
                        {isMet ? (
                          <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Optimal
                          </span>
                        ) : isLag ? (
                          <span className="inline-block text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Due Drive
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            On Track
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Axis Scale Marks */}
              <div className="flex justify-between pl-30 pr-16 text-[9px] text-slate-400 font-mono pt-2">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* KPI Summary Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target Standard: <strong className="text-slate-800 font-mono">95.0%</strong></span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 mr-1">Composite Coverage:</span>
              <span className="text-blue-700 font-mono font-bold text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                94.2% (Grade A)
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
