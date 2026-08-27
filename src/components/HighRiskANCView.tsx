import React, { useState } from 'react';
import { HighRiskPatient } from '../types';
import { 
  AlertTriangle, 
  Search, 
  Video, 
  Truck, 
  Heart, 
  Activity, 
  ShieldAlert, 
  CheckCircle2,
  Calendar,
  User,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HighRiskANCViewProps {
  patients: HighRiskPatient[];
  onConnectTeleconsult: (patientName: string, sector: string) => void;
}

export const HighRiskANCView: React.FC<HighRiskANCViewProps> = ({
  patients,
  onConnectTeleconsult
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDispatchAmbulance = (patient: HighRiskPatient) => {
    confetti({ particleCount: 40, spread: 50 });
    setToastMessage(`108 Emergency Ambulance Unit Dispatched to ${patient.village} for ${patient.name}! ETA: 14 mins.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredPatients = patients.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.riskCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.ashaName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchUrgency = filterUrgency === 'all' || p.urgency.toLowerCase() === filterUrgency.toLowerCase();
    return matchQuery && matchUrgency;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-rose-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-3">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-rose-600 text-xs font-mono font-bold uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>High Risk Maternal & Pediatric Surveillance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            High-Risk ANC & Emergency Registry (28 Active Cases)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Prioritized clinical triage for mothers and neonates flagged with gestational hypertension, severe anemia (&lt;7.0 g/dL), preeclampsia risk, or acute malnutrition.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search high-risk patient, village, risk category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 font-mono">Urgency:</span>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
          >
            <option value="all">All Urgencies ({patients.length})</option>
            <option value="critical">Critical (Immediate Care)</option>
            <option value="high">High Priority</option>
            <option value="moderate">Moderate Watch</option>
          </select>
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all ${
              patient.urgency === 'Critical'
                ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
                : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {patient.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">({patient.age}y)</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {patient.village} • {patient.sector}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    patient.urgency === 'Critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {patient.riskCategory}
                </span>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-3 gap-2 my-3 text-center font-mono">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">BP</div>
                  <div className="text-xs sm:text-sm font-bold text-rose-600">{patient.vitals.bp}</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Hb</div>
                  <div className="text-xs sm:text-sm font-bold text-amber-600">{patient.vitals.hb} g/dL</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Blood Sugar</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">{patient.vitals.sugar} mg/dL</div>
                </div>
              </div>

              {/* Action Recommended Box */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                <div className="font-semibold text-slate-900">Clinical Protocol:</div>
                <p className="leading-relaxed text-slate-600">{patient.recommendedAction}</p>
                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  Designated ASHA: <span className="font-semibold text-slate-800">{patient.ashaName}</span> • Last Checked: {patient.lastVisitDate}
                </div>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleDispatchAmbulance(patient)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-200"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>108 Ambulance</span>
              </button>

              <button
                onClick={() => onConnectTeleconsult(patient.name, patient.sector)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Connect Teleconsult</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
