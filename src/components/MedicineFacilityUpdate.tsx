import React, { useState } from 'react';
import { MedicineItem, FacilityStatus } from '../types';
import { 
  Pill, 
  Building2, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  RefreshCw, 
  ShieldAlert, 
  Thermometer, 
  Truck, 
  Activity, 
  Zap, 
  Droplet,
  Edit2,
  Trash2
} from 'lucide-react';

interface MedicineFacilityUpdateProps {
  medicines: MedicineItem[];
  facilityStatus: FacilityStatus;
  onUpdateMedicines: (updated: MedicineItem[]) => void;
  onUpdateFacility: (updated: FacilityStatus) => void;
}

export const MedicineFacilityUpdate: React.FC<MedicineFacilityUpdateProps> = ({
  medicines,
  facilityStatus,
  onUpdateMedicines,
  onUpdateFacility
}) => {
  const [subTab, setSubTab] = useState<'medicines' | 'facility'>('medicines');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiForecasting, setIsAiForecasting] = useState(false);
  const [aiForecastResult, setAiForecastResult] = useState<any>(null);

  // Facility State for editing
  const [currentFacility, setCurrentFacility] = useState<FacilityStatus>(facilityStatus);

  // New Medicine Form State
  const [newMedicine, setNewMedicine] = useState<Partial<MedicineItem>>({
    name: '',
    genericName: '',
    category: 'Maternal Health',
    unit: 'Strips (10 tabs)',
    currentStock: 500,
    minBufferThreshold: 300,
    batchNumber: `PHC-2026-${Math.floor(100 + Math.random() * 900)}`,
    expiryDate: '2028-12-31',
    dosageForm: 'Tablets'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Stock Increment / Decrement
  const handleStockChange = (medId: string, delta: number) => {
    const updated = medicines.map(m => {
      if (m.id === medId) {
        const newStock = Math.max(0, m.currentStock + delta);
        return { ...m, currentStock: newStock, lastUpdated: 'Just Now' };
      }
      return m;
    });
    onUpdateMedicines(updated);
  };

  const handleStockInput = (medId: string, val: number) => {
    const updated = medicines.map(m => {
      if (m.id === medId) {
        return { ...m, currentStock: Math.max(0, val), lastUpdated: 'Just Now' };
      }
      return m;
    });
    onUpdateMedicines(updated);
  };

  // Add New Medicine
  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedicine.name) return;

    const created: MedicineItem = {
      id: `MED-${Math.floor(100 + Math.random() * 900)}`,
      name: newMedicine.name,
      genericName: newMedicine.genericName || newMedicine.name,
      category: (newMedicine.category as any) || 'Maternal Health',
      unit: newMedicine.unit || 'Strips',
      currentStock: Number(newMedicine.currentStock) || 100,
      minBufferThreshold: Number(newMedicine.minBufferThreshold) || 50,
      batchNumber: newMedicine.batchNumber || 'BATCH-2026',
      expiryDate: newMedicine.expiryDate || '2028-12-31',
      dosageForm: (newMedicine.dosageForm as any) || 'Tablets',
      lastUpdated: 'Just Now'
    };

    onUpdateMedicines([created, ...medicines]);
    setShowAddMedModal(false);
    showToast(`Added "${created.name}" to hospital stock registry!`);
  };

  // AI Shortage Forecast
  const handleRunAiForecast = async () => {
    setIsAiForecasting(true);
    try {
      const response = await fetch('/api/gemini/inventory-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicines: medicines.map(m => ({ name: m.name, stock: m.currentStock, min: m.minBufferThreshold })),
          recentDiseaseTrend: {
            dengueCases: 14,
            highRiskAncCases: 8,
            diarrheaClusterCases: 11
          }
        })
      });
      const data = await response.json();
      setAiForecastResult(data);
      showToast('AI Stock Forecast updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiForecasting(false);
    }
  };

  // Save Facility Changes
  const handleSaveFacility = () => {
    const updated = {
      ...currentFacility,
      lastUpdated: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onUpdateFacility(updated);
    showToast('Hospital facility and equipment status broadcasted to District Health Registry & ASHA tablets!');
  };

  // Filter Medicines
  const filteredMedicines = medicines.filter(m => {
    const matchQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  const categories = [
    'all',
    'Maternal Health',
    'Pediatric Care',
    'Antibiotics & Anti-infectives',
    'Emergency & IV',
    'Vaccines & Cold Chain',
    'Chronic Care'
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-3">✕</button>
        </div>
      )}

      {/* Sub-Header Tabs: Medicine Stock vs Hospital Facility */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Medicine & Hospital Facility Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stock ledger and operational infrastructure status for Kanchipuram Primary Health Center.
          </p>
        </div>

        {/* Subtab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setSubTab('medicines')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'medicines'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-blue-600" />
            <span>Medicine Availability ({medicines.length})</span>
          </button>

          <button
            onClick={() => setSubTab('facility')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'facility'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Facility & Bed Availability</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MEDICINE STOCK MANAGEMENT SUB-TAB */}
      {/* ========================================================================= */}
      {subTab === 'medicines' && (
        <div className="space-y-5">
          
          {/* AI Stock Assistant Alert */}
          <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Stock Shortage & Buffer Forecasting</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini AI analyzes real-time maternal high-risk cases (8 in Chandanagiri) and fever clusters to project emergency medicine deficits.
              </p>
              {aiForecastResult && (
                <div className="pt-2 text-xs space-y-1 text-slate-800">
                  <span className="font-semibold text-slate-900">AI Recommendations:</span>
                  <ul className="list-disc list-inside text-slate-600">
                    {aiForecastResult.recommendations?.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleRunAiForecast}
                disabled={isAiForecasting}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiForecasting ? 'Forecasting...' : 'Predict Shortages'}</span>
              </button>

              <button
                onClick={() => setShowAddMedModal(true)}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search medicine, generic name, batch #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Medicine Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((med) => {
              const isLowStock = med.currentStock < med.minBufferThreshold;
              const isCritical = med.currentStock < med.minBufferThreshold * 0.4;

              return (
                <div
                  key={med.id}
                  className={`bg-white rounded-xl border transition-all p-4 sm:p-5 flex flex-col justify-between shadow-xs ${
                    isCritical
                      ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
                      : isLowStock
                      ? 'border-amber-300 ring-1 ring-amber-100'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header: Category & Stock Status */}
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                        {med.category}
                      </span>

                      {isCritical ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Critical Shortage</span>
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Low Buffer</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Well Stocked</span>
                        </span>
                      )}
                    </div>

                    {/* Medicine Name & Details */}
                    <div className="mt-2.5">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {med.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {med.genericName}
                      </p>
                    </div>

                    {/* Stock Count Controls */}
                    <div className="my-3.5 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                          Available Stock
                        </div>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className={`text-2xl font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                            {med.currentStock}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{med.unit}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Buffer Threshold: <strong>{med.minBufferThreshold}</strong>
                        </div>
                      </div>

                      {/* Increment / Decrement Buttons for Instant Update */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                        <button
                          onClick={() => handleStockChange(med.id, -10)}
                          className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center transition"
                          title="Decrease by 10"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handleStockChange(med.id, -1)}
                          className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center transition"
                          title="Decrease by 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleStockChange(med.id, 1)}
                          className="w-7 h-7 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center transition"
                          title="Increase by 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleStockChange(med.id, 10)}
                          className="w-7 h-7 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center transition"
                          title="Increase by 10"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    {/* Batch No & Expiry */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                      <div>
                        Batch: <span className="font-semibold text-slate-800">{med.batchNumber}</span>
                      </div>
                      <div className="text-right">
                        Exp: <span className="font-semibold text-slate-800">{med.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Updated: {med.lastUpdated}</span>
                    <button
                      onClick={() => showToast(`Restock requisition sent for ${med.name} to Tamil Nadu Medical Services Corporation (TNMSC).`)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Order Supply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Broadcast Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Total <strong>{medicines.length} essential pharmaceuticals</strong> tracked under Kanchipuram PHC cold-chain & dispensary.
            </div>
            <button
              onClick={() => showToast('Medicine inventory synchronized with State Health Dashboard.')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Sync All Stock Changes</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HOSPITAL FACILITY & EQUIPMENT SUB-TAB */}
      {/* ========================================================================= */}
      {subTab === 'facility' && (
        <div className="space-y-5">
          
          {/* PHC Header Summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-blue-600 text-xs font-mono font-bold uppercase">
                <Building2 className="w-4 h-4" />
                <span>Primary Health Center Infrastructure</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {currentFacility.hospitalName}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Code: {currentFacility.phcCode} • Last Broadcast: {currentFacility.lastUpdated}
              </p>
            </div>

            <button
              onClick={handleSaveFacility}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-2 self-start md:self-auto"
            >
              <Save className="w-4 h-4" />
              <span>Broadcast Live Facility Status</span>
            </button>
          </div>

          {/* 1. Bed Availability Status Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
              1. Inpatient & Labour Bed Availability
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* General Ward */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase font-mono">
                  <span>General Ward</span>
                  <span className="text-slate-900">{currentFacility.beds.generalWard.occupied} / {currentFacility.beds.generalWard.total}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                  {currentFacility.beds.generalWard.total - currentFacility.beds.generalWard.occupied}
                  <span className="text-xs font-semibold text-emerald-600 ml-1.5">Beds Free</span>
                </div>
                {/* Stepper controls */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Occupancy:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentFacility({
                        ...currentFacility,
                        beds: {
                          ...currentFacility.beds,
                          generalWard: {
                            ...currentFacility.beds.generalWard,
                            occupied: Math.max(0, currentFacility.beds.generalWard.occupied - 1)
                          }
                        }
                      })}
                      className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-xs"
                    >-</button>
                    <span className="px-2 font-mono text-xs font-bold">{currentFacility.beds.generalWard.occupied}</span>
                    <button
                      onClick={() => setCurrentFacility({
                        ...currentFacility,
                        beds: {
                          ...currentFacility.beds,
                          generalWard: {
                            ...currentFacility.beds.generalWard,
                            occupied: Math.min(currentFacility.beds.generalWard.total, currentFacility.beds.generalWard.occupied + 1)
                          }
                        }
                      })}
                      className="w-7 h-7 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-bold text-xs"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Maternity / Labour Ward */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase font-mono">
                  <span>Maternity Ward</span>
                  <span className="text-blue-900">{currentFacility.beds.maternityWard.occupied} / {currentFacility.beds.maternityWard.total}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
                  {currentFacility.beds.maternityWard.total - currentFacility.beds.maternityWard.occupied}
                  <span className="text-xs font-semibold text-blue-700 ml-1.5">Beds Free</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Occupancy:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentFacility({
                        ...currentFacility,
                        beds: {
                          ...currentFacility.beds,
                          maternityWard: {
                            ...currentFacility.beds.maternityWard,
                            occupied: Math.max(0, currentFacility.beds.maternityWard.occupied - 1)
                          }
                        }
                      })}
                      className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-xs border border-slate-200"
                    >-</button>
                    <span className="px-2 font-mono text-xs font-bold text-slate-900">{currentFacility.beds.maternityWard.occupied}</span>
                    <button
                      onClick={() => setCurrentFacility({
                        ...currentFacility,
                        beds: {
                          ...currentFacility.beds,
                          maternityWard: {
                            ...currentFacility.beds.maternityWard,
                            occupied: Math.min(currentFacility.beds.maternityWard.total, currentFacility.beds.maternityWard.occupied + 1)
                          }
                        }
                      })}
                      className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-xs"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Emergency / Triage Beds */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase font-mono">
                  <span>Emergency Triage</span>
                  <span className="text-slate-900">{currentFacility.beds.emergencyTriage.occupied} / {currentFacility.beds.emergencyTriage.total}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-rose-600 mt-2">
                  {currentFacility.beds.emergencyTriage.total - currentFacility.beds.emergencyTriage.occupied}
                  <span className="text-xs font-semibold text-rose-700 ml-1.5">Beds Free</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Occupancy:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentFacility({
                        ...currentFacility,
                        beds: {
                          ...currentFacility.beds,
                          emergencyTriage: {
                            ...currentFacility.beds.emergencyTriage,
                            occupied: Math.max(0, currentFacility.beds.emergencyTriage.occupied - 1)
                          }
                        }
                      })}
                      className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-xs"
                    >-</button>
                    <span className="px-2 font-mono text-xs font-bold">{currentFacility.beds.emergencyTriage.occupied}</span>
                    <button
                      onClick={() => setCurrentFacility({
                        ...currentFacility,
                        beds: {
                          ...currentFacility.beds,
                          emergencyTriage: {
                            ...currentFacility.beds.emergencyTriage,
                            occupied: Math.min(currentFacility.beds.emergencyTriage.total, currentFacility.beds.emergencyTriage.occupied + 1)
                          }
                        }
                      })}
                      className="w-7 h-7 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-bold text-xs"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Radiant Warmers for Neonates */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-700 uppercase font-mono">
                  <span>Radiant Warmers</span>
                  <span className="text-amber-900">{currentFacility.beds.neonatalRadiantWarmers.occupied} / {currentFacility.beds.neonatalRadiantWarmers.total}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mt-2">
                  {currentFacility.beds.neonatalRadiantWarmers.total - currentFacility.beds.neonatalRadiantWarmers.occupied}
                  <span className="text-xs font-semibold text-amber-700 ml-1.5">Free</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">HBNC Care:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentFacility({
                        ...currentFacility,
                        beds: {
                          ...currentFacility.beds,
                          neonatalRadiantWarmers: {
                            ...currentFacility.beds.neonatalRadiantWarmers,
                            occupied: Math.max(0, currentFacility.beds.neonatalRadiantWarmers.occupied - 1)
                          }
                        }
                      })}
                      className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-xs"
                    >-</button>
                    <span className="px-2 font-mono text-xs font-bold">{currentFacility.beds.neonatalRadiantWarmers.occupied}</span>
                    <button
                      onClick={() => setCurrentFacility({
                        ...currentFacility,
                        beds: {
                          ...currentFacility.beds,
                          neonatalRadiantWarmers: {
                            ...currentFacility.beds.neonatalRadiantWarmers,
                            occupied: Math.min(currentFacility.beds.neonatalRadiantWarmers.total, currentFacility.beds.neonatalRadiantWarmers.occupied + 1)
                          }
                        }
                      })}
                      className="w-7 h-7 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-bold text-xs"
                    >+</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Diagnostic & Equipment Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
              2. Medical Equipment & Cold Chain Operational Status
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentFacility.equipment.map((eq, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900">{eq.name}</h5>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">{eq.category}</span>
                    <p className="text-xs text-slate-600 mt-1">{eq.details}</p>
                  </div>

                  {/* Toggle Operational Status */}
                  <button
                    onClick={() => {
                      const updatedEq = [...currentFacility.equipment];
                      updatedEq[idx].isOperational = !updatedEq[idx].isOperational;
                      setCurrentFacility({ ...currentFacility, equipment: updatedEq });
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      eq.isOperational
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {eq.isOperational ? 'Operational' : 'Maintenance'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 108 Emergency Ambulance & Utilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* 108 Ambulance Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs font-mono uppercase">
                  <Truck className="w-4 h-4" />
                  <span>108 Emergency Ambulance Unit</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  {currentFacility.ambulance108Status.availableUnits} Unit On Standby
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {currentFacility.ambulance108Status.activeDispatches.map((disp, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{disp.unitId} (Dispatched)</span>
                      <span className="font-mono text-rose-600 font-semibold">ETA: {disp.etaMinutes} mins</span>
                    </div>
                    <p className="text-slate-600">{disp.assignedCase}</p>
                    <p className="text-[11px] text-slate-400 font-mono">Dest: {disp.destination}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Utilities */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs font-mono uppercase">
                  <Zap className="w-4 h-4" />
                  <span>Hospital Infrastructure & Utilities</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  All Systems Normal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Cold Chain Temp</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <Thermometer className="w-4 h-4" />
                    <span>+{currentFacility.coldChainTemp}°C</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">ILR Normal (2°C - 8°C)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Backup Generator Fuel</div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {currentFacility.utilities.backupGeneratorFuelPercent}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Continuous Power Ready</span>
                </div>
              </div>
            </div>

          </div>

          {/* 4. Staff On-Duty Rota */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              3. Current PHC Duty Staff Roster
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentFacility.staffOnDuty.map((staff, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="font-semibold text-slate-900">{staff.name}</div>
                  <div className="text-[11px] text-blue-700 font-medium">{staff.role}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Shift: {staff.shift}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{staff.contact}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Add New Medicine / Drug to Stock</span>
              </h3>
              <button
                onClick={() => setShowAddMedModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedicineSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medicine / Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IFA Tablets (Iron Folic Acid)"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Generic Composition</label>
                <input
                  type="text"
                  placeholder="e.g. Ferrous Sulfate 100mg + Folic Acid 0.5mg"
                  value={newMedicine.genericName}
                  onChange={(e) => setNewMedicine({ ...newMedicine, genericName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newMedicine.category}
                    onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  >
                    <option value="Maternal Health">Maternal Health</option>
                    <option value="Pediatric Care">Pediatric Care</option>
                    <option value="Antibiotics & Anti-infectives">Antibiotics</option>
                    <option value="Emergency & IV">Emergency & IV</option>
                    <option value="Vaccines & Cold Chain">Vaccines & Cold Chain</option>
                    <option value="Chronic Care">Chronic Care</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={newMedicine.dosageForm}
                    onChange={(e) => setNewMedicine({ ...newMedicine, dosageForm: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  >
                    <option value="Tablets">Tablets</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injectable">Injectable</option>
                    <option value="Capsules">Capsules</option>
                    <option value="Packets">Packets / Sachets</option>
                    <option value="Vials">Vials</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Stock Quantity</label>
                  <input
                    type="number"
                    value={newMedicine.currentStock}
                    onChange={(e) => setNewMedicine({ ...newMedicine, currentStock: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Buffer Alert Threshold</label>
                  <input
                    type="number"
                    value={newMedicine.minBufferThreshold}
                    onChange={(e) => setNewMedicine({ ...newMedicine, minBufferThreshold: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newMedicine.batchNumber}
                    onChange={(e) => setNewMedicine({ ...newMedicine, batchNumber: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Add Medicine to Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
