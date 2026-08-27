import React from 'react';

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      
      {/* 1. DISEASE DISTRIBUTION CARD */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 font-mono">
            Disease Distribution
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
            Village-wise Disease Distribution
          </h3>
        </div>

        {/* Custom Clean Bar Chart */}
        <div className="my-6 relative h-48 flex items-end justify-center">
          {/* Y Axis Grid */}
          <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-mono pointer-events-none">
            <div className="flex items-center w-full">
              <span className="w-6 text-right pr-2">40</span>
              <div className="flex-1 border-b border-slate-100"></div>
            </div>
            <div className="flex items-center w-full">
              <span className="w-6 text-right pr-2">30</span>
              <div className="flex-1 border-b border-slate-100"></div>
            </div>
            <div className="flex items-center w-full">
              <span className="w-6 text-right pr-2">20</span>
              <div className="flex-1 border-b border-slate-100"></div>
            </div>
            <div className="flex items-center w-full">
              <span className="w-6 text-right pr-2">10</span>
              <div className="flex-1 border-b border-slate-100"></div>
            </div>
            <div className="flex items-center w-full">
              <span className="w-6 text-right pr-2">0</span>
              <div className="flex-1 border-b border-slate-200"></div>
            </div>
          </div>

          {/* Bar Groups */}
          <div className="relative z-10 w-full pl-8 pr-2 flex items-end justify-around h-40">
            {/* Village 1: Ramapuram */}
            <div className="flex items-end gap-1 group cursor-pointer" title="Ramapuram: 14 Dengue, 2 Diarrhea, 16 Fever">
              <div className="w-2.5 bg-rose-500 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '35%' }}></div>
              <div className="w-2.5 bg-blue-500 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '10%' }}></div>
              <div className="w-2.5 bg-slate-400 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '40%' }}></div>
            </div>

            {/* Village 2: Chandanagiri */}
            <div className="flex items-end gap-1 group cursor-pointer" title="Chandanagiri: 6 Dengue, 4 Diarrhea, 88 Fever">
              <div className="w-2.5 bg-rose-500 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '20%' }}></div>
              <div className="w-2.5 bg-blue-500 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '15%' }}></div>
              <div className="w-2.5 bg-slate-400 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '85%' }}></div>
            </div>

            {/* Village 3: Kalyanpur */}
            <div className="flex items-end gap-1 group cursor-pointer" title="Kalyanpur: 2 Dengue, 15 Diarrhea, 12 Fever">
              <div className="w-2.5 bg-rose-500 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '8%' }}></div>
              <div className="w-2.5 bg-blue-500 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '38%' }}></div>
              <div className="w-2.5 bg-slate-400 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '30%' }}></div>
            </div>

            {/* Village 4: Gopalapuram */}
            <div className="flex items-end gap-1 group cursor-pointer" title="Gopalapuram: 0 Dengue, 2 Diarrhea, 8 Fever">
              <div className="w-2.5 bg-rose-500 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '4%' }}></div>
              <div className="w-2.5 bg-blue-500 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '6%' }}></div>
              <div className="w-2.5 bg-slate-400 rounded-t-xs transition-all duration-300 group-hover:opacity-80" style={{ height: '20%' }}></div>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] font-mono text-slate-500 -mt-3 mb-2">
          Kalyanpur & Chandanagiri Sectors
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 text-xs">
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

      {/* 2. MATERNAL SURVEILLANCE CARD */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 font-mono">
            Maternal Surveillance
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
            Maternal Trimester Stage Risks
          </h3>
        </div>

        {/* Trimester Area SVG Graph */}
        <div className="my-6 relative h-48">
          <svg className="w-full h-full" viewBox="0 0 260 160">
            <defs>
              <linearGradient id="healthyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="anemiaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="preeclampGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="30" y1="20" x2="250" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="30" y1="55" x2="250" y2="55" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="30" y1="90" x2="250" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="30" y1="125" x2="250" y2="125" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="30" y1="140" x2="250" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="30" y1="20" x2="30" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Y Axis Numbers */}
            <text x="22" y="24" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">36</text>
            <text x="22" y="59" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">27</text>
            <text x="22" y="94" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">18</text>
            <text x="22" y="129" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">9</text>
            <text x="22" y="143" fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="monospace">0</text>

            {/* Shaded Area for Preeclampsia Risk */}
            <path d="M 30,135 Q 140,120 240,105 L 240,140 L 30,140 Z" fill="url(#preeclampGrad)" />
            <path d="M 30,135 Q 140,120 240,105" fill="none" stroke="#ef4444" strokeWidth="2" />

            {/* Shaded Area for Anemia Overlaps */}
            <path d="M 30,100 Q 140,75 240,65 L 240,140 L 30,140 Z" fill="url(#anemiaGrad)" />
            <path d="M 30,100 Q 140,75 240,65" fill="none" stroke="#f59e0b" strokeWidth="2" />

            {/* Shaded Area for Healthy ANC Cases */}
            <path d="M 30,30 Q 140,55 240,70 L 240,140 L 30,140 Z" fill="url(#healthyGrad)" />
            <path d="M 30,30 Q 140,55 240,70" fill="none" stroke="#10b981" strokeWidth="2" />

            {/* X Axis Trimester Markers */}
            <text x="40" y="154" fontSize="9" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">1st</text>
            <text x="140" y="154" fontSize="9" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">2nd</text>
            <text x="235" y="154" fontSize="9" fill="#64748b" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">3rd Trimester</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-700 font-medium">Anemia Overlaps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700 font-medium">Healthy Cases</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-700 font-medium">Preeclampsia</span>
          </div>
        </div>
      </div>

      {/* 3. IMMUNIZATION INDEX CARD */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 font-mono">
            Immunization Index
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
            Coverage Ratios (%) by Antigen
          </h3>
        </div>

        {/* Horizontal Bars List */}
        <div className="my-4 space-y-2.5">
          {/* BCG (Birth) */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-24 text-right text-slate-600 font-medium text-[11px] leading-tight">
              BCG<br /><span className="text-[10px] text-slate-400">(Birth)</span>
            </div>
            <div className="flex-1 bg-slate-100 rounded-md h-6 p-0.5 relative overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-xs flex items-center justify-end pr-2 text-white font-bold text-[11px] transition-all duration-500"
                style={{ width: '98%' }}
              >
                98%
              </div>
            </div>
          </div>

          {/* OPV-1 (6 Wk) */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-24 text-right text-slate-600 font-medium text-[11px]">
              OPV-1 (6 Wk)
            </div>
            <div className="flex-1 bg-slate-100 rounded-md h-6 p-0.5 relative overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-xs flex items-center justify-end pr-2 text-white font-bold text-[11px] transition-all duration-500"
                style={{ width: '95%' }}
              >
                95%
              </div>
            </div>
          </div>

          {/* Penta-1 */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-24 text-right text-slate-600 font-medium text-[11px]">
              Penta-1
            </div>
            <div className="flex-1 bg-slate-100 rounded-md h-6 p-0.5 relative overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-xs flex items-center justify-end pr-2 text-white font-bold text-[11px] transition-all duration-500"
                style={{ width: '94%' }}
              >
                94%
              </div>
            </div>
          </div>

          {/* Measles (9M) */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-24 text-right text-slate-600 font-medium text-[11px]">
              Measles (9M)
            </div>
            <div className="flex-1 bg-slate-100 rounded-md h-6 p-0.5 relative overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-xs flex items-center justify-end pr-2 text-white font-bold text-[11px] transition-all duration-500"
                style={{ width: '91%' }}
              >
                91%
              </div>
            </div>
          </div>

          {/* DPT Booster */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-24 text-right text-slate-600 font-medium text-[11px] leading-tight">
              DPT<br /><span className="text-[10px] text-slate-400">Booster</span>
            </div>
            <div className="flex-1 bg-slate-100 rounded-md h-6 p-0.5 relative overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-xs flex items-center justify-end pr-2 text-white font-bold text-[11px] transition-all duration-500"
                style={{ width: '88%' }}
              >
                88%
              </div>
            </div>
          </div>

          {/* Horizontal Axis Scale */}
          <div className="flex justify-between pl-26 pr-1 text-[10px] text-slate-400 font-mono pt-1">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Target Standard: 95.0%</span>
          <span className="text-blue-700 font-bold">Overall 94.2%</span>
        </div>
      </div>

    </div>
  );
};
