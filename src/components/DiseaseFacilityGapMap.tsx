import React, { useState, useEffect, useMemo } from 'react';
import { DiseaseOutbreakZone } from '../types';
import { MAHARASHTRA_CITIES } from '../data/mockData';
import { 
  AlertTriangle, 
  Building2, 
  MapPin, 
  ShieldAlert, 
  Truck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Send, 
  Search, 
  Check, 
  Printer, 
  X,
  Layers,
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  Polyline,
  useMap 
} from 'react-leaflet';
import L from 'leaflet';

interface DiseaseFacilityGapMapProps {
  outbreakZones: DiseaseOutbreakZone[];
  onUpdateZone: (updatedZone: DiseaseOutbreakZone) => void;
  onInitiateTeleconsult?: (patientName?: string, sector?: string) => void;
}

type DeficitFilter = 'all' | 'deficit_only' | 'equipped_only';
type DossierTab = 'gap' | 'clinical' | 'ai_plan';

// Map View Controller for smooth map panning
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.0 });
  }, [center, zoom, map]);
  return null;
}

// Marker Icon Generators
const createDiseaseZoneMarkerIcon = (zone: DiseaseOutbreakZone, isSelected: boolean) => {
  const isDeficit = !zone.isFacilityAvailableLocally;
  const pulseColor = isDeficit ? 'bg-rose-500 ring-rose-200' : 'bg-emerald-500 ring-emerald-200';
  const badgeBg = isSelected
    ? 'bg-slate-900 text-white ring-2 ring-blue-500'
    : isDeficit
    ? 'bg-rose-50 text-rose-800 border-rose-300'
    : 'bg-emerald-50 text-emerald-800 border-emerald-300';

  const html = `
    <div class="relative flex flex-col items-center cursor-pointer -translate-x-1/2 -translate-y-full">
      <div class="relative flex items-center justify-center">
        ${isDeficit ? `<span class="absolute w-6 h-6 rounded-full bg-rose-500 opacity-75 animate-ping"></span>` : ''}
        <div class="w-7 h-7 rounded-full ${pulseColor} ring-4 flex items-center justify-center text-white shadow-md">
          <span class="text-[10px] font-black">${zone.activeCasesCount}</span>
        </div>
      </div>
      <div class="mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shadow-xs whitespace-nowrap ${badgeBg}">
        ${zone.blockName} • ${zone.diseaseName.split(' ')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-disease-marker',
    iconSize: [36, 44],
    iconAnchor: [18, 38],
    popupAnchor: [0, -38]
  });
};

const createHospitalMarkerIcon = (hospitalName: string) => {
  const html = `
    <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-full">
      <div class="w-7 h-7 rounded-full bg-blue-600 ring-4 ring-blue-200 flex items-center justify-center text-white shadow-md">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
      <div class="mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-950 text-white shadow-xs whitespace-nowrap">
        ${hospitalName.split(',')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-hospital-marker',
    iconSize: [32, 38],
    iconAnchor: [16, 34],
    popupAnchor: [0, -34]
  });
};

export const DiseaseFacilityGapMap: React.FC<DiseaseFacilityGapMapProps> = ({
  outbreakZones,
  onUpdateZone,
  onInitiateTeleconsult
}) => {
  const [selectedZone, setSelectedZone] = useState<DiseaseOutbreakZone>(outbreakZones[0]);
  const [selectedCityId, setSelectedCityId] = useState<string>('all');
  const [deficitFilter, setDeficitFilter] = useState<DeficitFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayer, setMapLayer] = useState<'roadmap' | 'satellite'>('roadmap');
  const [dossierTab, setDossierTab] = useState<DossierTab>('gap');

  // AI & Action States
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered zones
  const filteredZones = outbreakZones.filter(zone => {
    const matchesCity = selectedCityId === 'all' || zone.cityHub === selectedCityId;
    const matchesDeficit = 
      deficitFilter === 'all' ||
      (deficitFilter === 'deficit_only' && !zone.isFacilityAvailableLocally) ||
      (deficitFilter === 'equipped_only' && zone.isFacilityAvailableLocally);
    const matchesSearch = 
      searchQuery === '' ||
      zone.ruralAreaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.blockName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesDeficit && matchesSearch;
  });

  // Key KPI metrics
  const totalOutbreaks = outbreakZones.length;
  const criticalDeficitsCount = outbreakZones.filter(z => !z.isFacilityAvailableLocally).length;
  const equippedCount = totalOutbreaks - criticalDeficitsCount;
  const populationAtRisk = outbreakZones
    .filter(z => !z.isFacilityAvailableLocally)
    .reduce((acc, z) => acc + z.populationAtRisk, 0);

  // Escalate to Ministry
  const handleEscalate = (zone: DiseaseOutbreakZone) => {
    const updated: DiseaseOutbreakZone = {
      ...zone,
      governmentActionStatus: 'Action Required (Deficit Escalated)',
      lastUpdated: 'Just Now'
    };
    onUpdateZone(updated);
    setSelectedZone(updated);
    showToast(`Escalation requisition dispatched to Health Ministry for ${zone.ruralAreaName}.`);
  };

  // Deploy Mobile Unit
  const handleDeployMobile = (zone: DiseaseOutbreakZone) => {
    const updated: DiseaseOutbreakZone = {
      ...zone,
      governmentActionStatus: 'Mobile Unit Sanctioned',
      lastUpdated: 'Just Now'
    };
    onUpdateZone(updated);
    setSelectedZone(updated);
    showToast(`108 Emergency Mobile Unit sanctioned and dispatched for ${zone.ruralAreaName}.`);
  };

  // Automated AI Cabinet Action Plan (shown directly in UI for the selected zone)
  const activeAiPlan = useMemo(() => {
    const isCritical = !selectedZone.isFacilityAvailableLocally || selectedZone.severityLevel === 'Critical Outbreak';

    const immediateMeasures = [
      `Deploy 108 Emergency Mobile Medical Unit with specialized ${selectedZone.requiredSpecialist || 'clinical team'} within 12 hours.`,
      `Establish a 20-bed emergency triage & stabilization ward at ${selectedZone.blockName} Gram Panchayat / Community Hall.`,
      `Dispatch emergency reserve of life-saving medical supplies (${selectedZone.requiredLifeSavingDrugs.slice(0, 2).join(', ')}) from District Warehouse.`,
      `Mobilize frontline ASHA syndromic tracking across ${selectedZone.affectedPanchayats.length} gram panchayats (${selectedZone.affectedPanchayats.slice(0, 3).join(', ')}${selectedZone.affectedPanchayats.length > 3 ? ` +${selectedZone.affectedPanchayats.length - 3} more` : ''}).`
    ];

    const infrastructurePlan = `Sanction permanent upgradation of ${selectedZone.localFacilityName} to First Referral Unit (FRU) with dedicated ${selectedZone.requiredFacilityType}, equipped with ${selectedZone.requiredEquipment.slice(0, 2).join(' & ')}.`;

    const budgetBreakdown = [
      { item: '108 Mobile Unit & Field Triage Camp (90-Day Deployment)', costINR: '₹12,00,000' },
      { item: `Diagnostic Equipment Procurement (${selectedZone.requiredEquipment[0] || 'Clinical Equipment'})`, costINR: '₹14,50,000' },
      { item: `Life-Saving Drug Buffer & Cold-Chain Logistics (${selectedZone.requiredLifeSavingDrugs[0] || 'Essential Drugs'})`, costINR: '₹4,50,000' },
      { item: 'Community Sanitation, Water Purification & Vector Control', costINR: '₹3,50,000' }
    ];

    return {
      urgencyClassification: isCritical 
        ? 'Level 1: Urgent Cabinet & State Health Requisition' 
        : 'Level 2: District Emergency Health Sanction',
      urgencyBadgeColor: isCritical 
        ? 'bg-rose-100 text-rose-800 border-rose-200' 
        : 'bg-amber-100 text-amber-800 border-amber-200',
      executiveSummary: `Automated Strategic Proposal: Active surge of ${selectedZone.diseaseName} in ${selectedZone.ruralAreaName} (${selectedZone.activeCasesCount} confirmed cases, +${selectedZone.weeklyGrowthRatePercent}%/wk) requires immediate government infrastructure sanction. Local facility (${selectedZone.localFacilityName}) has an acute deficit with ${selectedZone.nearestHospitalDistanceKm} km (${selectedZone.travelTransitTimeMinutes} mins) transit barrier to ${selectedZone.nearestEquippedHospitalName}, endangering ${selectedZone.populationAtRisk.toLocaleString('en-IN')} citizens at risk.`,
      immediateMeasures,
      infrastructurePlan,
      budgetBreakdown,
      totalSanctionEstimateINR: selectedZone.sanctionBudgetEstimateINR || '₹34.50 Lakhs',
      fieldDeploymentLead: selectedZone.reportedByAshaOrMo || 'Dr. Rajesh Sharma (PHC MO)'
    };
  }, [selectedZone]);

  return (
    <div id="disease-facility-gap-view" className="space-y-4 pb-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Clean Top Header Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Disease & Facility Gap Map</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                GIS Surveillance
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live mapping of rural epidemic clusters vs. nearest equipped curing hospitals to fast-track emergency infrastructure.
            </p>
          </div>

          {/* KPI Summary Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Total Zones</span>
              <span className="text-sm font-bold text-slate-900">{totalOutbreaks}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[10px] text-rose-700 font-semibold block uppercase">Critical Deficits</span>
              <span className="text-sm font-bold text-rose-700">{criticalDeficitsCount} Zones</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] text-amber-800 font-semibold block uppercase">At-Risk Pop.</span>
              <span className="text-sm font-bold text-amber-900">{(populationAtRisk / 1000).toFixed(0)}k</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Equipped PHCs</span>
              <span className="text-sm font-bold text-emerald-800">{equippedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Deficit Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setDeficitFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                deficitFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Zones ({outbreakZones.length})
            </button>
            <button
              onClick={() => setDeficitFilter('deficit_only')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                deficitFilter === 'deficit_only'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Critical Deficits ({criticalDeficitsCount})</span>
            </button>
            <button
              onClick={() => setDeficitFilter('equipped_only')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                deficitFilter === 'equipped_only'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Equipped ({equippedCount})
            </button>
          </div>

          {/* District & Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search area, block..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Districts</option>
              {MAHARASHTRA_CITIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column View: Interactive Map (Left) & Streamlined Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: GIS Map Panel */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[480px]">
            
            {/* Map Sub-header bar */}
            <div className="px-3.5 py-2 bg-slate-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="font-semibold text-[11px]">GIS Surveillance Layer</span>
                <span className="text-slate-400 text-[11px]">|</span>
                <span className="text-slate-300 font-mono text-[11px]">
                  Viewing: <span className="text-blue-300 font-bold">{selectedZone.ruralAreaName}</span>
                </span>
              </div>

              {/* Map Layer Switch */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setMapLayer('roadmap')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                    mapLayer === 'roadmap' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setMapLayer('satellite')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                    mapLayer === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/* Leaflet Map */}
            <div className="flex-1 relative w-full bg-slate-100">
              <MapContainer
                center={[selectedZone.coordinates.lat, selectedZone.coordinates.lng]}
                zoom={10}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ height: '100%', width: '100%' }}
              >
                <MapViewController 
                  center={[selectedZone.coordinates.lat, selectedZone.coordinates.lng]} 
                  zoom={10} 
                />

                {mapLayer === 'roadmap' ? (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                ) : (
                  <TileLayer
                    attribution='&copy; Esri WorldImagery'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                )}

                {/* Outbreak Radius Circles */}
                {filteredZones.map(zone => {
                  const isDeficit = !zone.isFacilityAvailableLocally;
                  const isSelected = selectedZone.id === zone.id;
                  return (
                    <Circle
                      key={`circle-${zone.id}`}
                      center={[zone.coordinates.lat, zone.coordinates.lng]}
                      radius={isDeficit ? 3500 : 2200}
                      pathOptions={{
                        color: isDeficit ? '#e11d48' : '#10b981',
                        fillColor: isDeficit ? '#f43f5e' : '#10b981',
                        fillOpacity: isSelected ? 0.35 : 0.15,
                        weight: isSelected ? 2.5 : 1.5,
                        dashArray: isDeficit ? '4, 4' : undefined
                      }}
                    />
                  );
                })}

                {/* Transit Route Line to Nearest Hospital if Deficit */}
                {selectedZone && !selectedZone.isFacilityAvailableLocally && (
                  <>
                    <Polyline
                      positions={[
                        [selectedZone.coordinates.lat, selectedZone.coordinates.lng],
                        [selectedZone.nearestHospitalCoordinates.lat, selectedZone.nearestHospitalCoordinates.lng]
                      ]}
                      pathOptions={{
                        color: '#e11d48',
                        weight: 2.5,
                        dashArray: '6, 6',
                        opacity: 0.85
                      }}
                    />

                    <Marker
                      position={[selectedZone.nearestHospitalCoordinates.lat, selectedZone.nearestHospitalCoordinates.lng]}
                      icon={createHospitalMarkerIcon(selectedZone.nearestEquippedHospitalName)}
                    >
                      <Popup>
                        <div className="p-2 text-xs">
                          <p className="font-bold text-blue-900">{selectedZone.nearestEquippedHospitalName}</p>
                          <p className="text-slate-600 mt-0.5">Equipped Referral Facility</p>
                          <p className="text-rose-700 font-bold mt-1">
                            Distance: {selectedZone.nearestHospitalDistanceKm} km ({selectedZone.travelTransitTimeMinutes} mins)
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  </>
                )}

                {/* Markers for Zones */}
                {filteredZones.map(zone => {
                  const isSelected = selectedZone.id === zone.id;
                  return (
                    <Marker
                      key={zone.id}
                      position={[zone.coordinates.lat, zone.coordinates.lng]}
                      icon={createDiseaseZoneMarkerIcon(zone, isSelected)}
                      eventHandlers={{
                        click: () => {
                          setSelectedZone(zone);
                        }
                      }}
                    >
                      <Popup>
                        <div className="p-2 text-xs space-y-1">
                          <div className="flex items-center justify-between gap-2 border-b pb-1">
                            <span className="font-bold text-slate-900">{zone.ruralAreaName}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              !zone.isFacilityAvailableLocally ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {!zone.isFacilityAvailableLocally ? 'DEFICIT' : 'EQUIPPED'}
                            </span>
                          </div>
                          <p className="font-semibold text-rose-700">{zone.diseaseName}</p>
                          <p className="text-slate-600 text-[11px]">
                            Active Cases: <strong>{zone.activeCasesCount}</strong> (+{zone.weeklyGrowthRatePercent}%/wk)
                          </p>
                          {!zone.isFacilityAvailableLocally && (
                            <p className="text-rose-600 text-[11px] font-medium">
                              Nearest Hospital: {zone.nearestHospitalDistanceKm} km away
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Compact Map Legend */}
              <div className="absolute bottom-2 left-2 z-[1000] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg px-2.5 py-2 shadow-sm text-[10px] space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-700 font-medium">Critical Deficit ({criticalDeficitsCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-700 font-medium">Equipped ({equippedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-700 font-medium">Referral Hospital</span>
                </div>
              </div>
            </div>

            {/* Quick Zone Selector Strip Directly Under Map */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
              <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Zones:</span>
              {filteredZones.map(zone => {
                const isSelected = selectedZone.id === zone.id;
                const isDeficit = !zone.isFacilityAvailableLocally;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : isDeficit
                        ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isDeficit ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                    <span>{zone.blockName}</span>
                    <span className="text-[10px] opacity-75 font-normal">({zone.activeCasesCount})</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right: Streamlined, Easy-to-View Dossier Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
            
            {/* Card Header: Zone Title & Status */}
            <div className={`p-4 border-b ${!selectedZone.isFacilityAvailableLocally ? 'bg-rose-50/40 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedZone.ruralAreaName}, {selectedZone.district}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedZone.diseaseName}
                  </h2>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                  !selectedZone.isFacilityAvailableLocally
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {!selectedZone.isFacilityAvailableLocally ? 'CRITICAL DEFICIT' : 'EQUIPPED LOCAL'}
                </span>
              </div>

              {/* 3 High-level stats */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200/60 text-center">
                <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold block">Active Cases</span>
                  <span className="text-sm font-bold text-rose-600">{selectedZone.activeCasesCount}</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold block">Weekly Surge</span>
                  <span className="text-sm font-bold text-rose-600">+{selectedZone.weeklyGrowthRatePercent}%</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold block">At-Risk Pop.</span>
                  <span className="text-sm font-bold text-slate-800">{(selectedZone.populationAtRisk / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>

            {/* Dossier Internal Sub-tabs (Organized so it's not a giant wall of text) */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 text-xs px-3">
              <button
                onClick={() => setDossierTab('gap')}
                className={`py-2 px-3 font-semibold border-b-2 transition ${
                  dossierTab === 'gap'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Facility Gap & Transit
              </button>

              <button
                onClick={() => setDossierTab('clinical')}
                className={`py-2 px-3 font-semibold border-b-2 transition ${
                  dossierTab === 'clinical'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Clinical Details
              </button>

              <button
                onClick={() => setDossierTab('ai_plan')}
                className={`py-2 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
                  dossierTab === 'ai_plan'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>AI Action Plan</span>
              </button>
            </div>

            {/* Tab Body Content */}
            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto max-h-[360px]">
              
              {/* TAB 1: FACILITY GAP & TRANSIT (PRIMARY EASY VIEW) */}
              {dossierTab === 'gap' && (
                <div className="space-y-3">
                  
                  {/* Local Center vs Nearest Hospital Comparison Box */}
                  <div className="space-y-2">
                    {/* 1. Local Center */}
                    <div className={`p-3 rounded-xl border text-xs ${
                      !selectedZone.isFacilityAvailableLocally
                        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                        : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600">Local Facility</span>
                        <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          !selectedZone.isFacilityAvailableLocally ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                        }`}>
                          {selectedZone.localFacilityCapacityStatus}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900">{selectedZone.localFacilityName}</p>
                      <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                        {selectedZone.deficitSummary}
                      </p>
                    </div>

                    {/* 2. Nearest Equipped Hospital (if deficit) */}
                    {!selectedZone.isFacilityAvailableLocally && (
                      <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs space-y-1 text-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] uppercase tracking-wider text-blue-700 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" />
                            <span>Nearest Equipped Referral Hospital</span>
                          </span>
                          <span className="font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                            {selectedZone.nearestHospitalDistanceKm} km ({selectedZone.travelTransitTimeMinutes} mins)
                          </span>
                        </div>
                        <p className="font-bold text-blue-950">{selectedZone.nearestEquippedHospitalName}</p>
                        <p className="text-[11px] text-slate-600">
                          <strong>Transit Barrier:</strong> {selectedZone.transitRiskAssessment}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Required Protocol */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Required Medical Infrastructure</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedZone.requiredFacilityType}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Specialist: {selectedZone.requiredSpecialist}</p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      id="btn-quick-escalate"
                      onClick={() => handleEscalate(selectedZone)}
                      className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Escalate to Ministry</span>
                    </button>

                    <button
                      id="btn-quick-deploy"
                      onClick={() => handleDeployMobile(selectedZone)}
                      className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Deploy 108 Unit</span>
                    </button>

                    <button
                      onClick={() => setShowMemoModal(true)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
                      title="View Official Government Memo"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CLINICAL DETAILS */}
              {dossierTab === 'clinical' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                      Primary Clinical Symptoms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedZone.primarySymptoms.map((sym, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-[11px] font-medium">
                          • {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Outbreak Etiology & Source</span>
                    <p className="text-slate-800 font-medium">{selectedZone.outbreakSource}</p>
                    <p className="text-[11px] text-slate-500">Category: {selectedZone.diseaseCategory}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Life-Saving Essential Drugs Mandated</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedZone.requiredLifeSavingDrugs.map((drug, dIdx) => (
                        <span key={dIdx} className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[11px]">
                          {drug}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1">
                    Reported by: <span className="font-semibold text-slate-700">{selectedZone.reportedByAshaOrMo}</span>
                  </div>
                </div>
              )}

              {/* TAB 3: AI ACTION PLAN (DIRECTLY SHOWN IN UI - NO GENERATE BUTTON) */}
              {dossierTab === 'ai_plan' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-bold text-indigo-950 text-xs">AI Cabinet Action Plan</span>
                        <span className="text-[10px] font-mono text-slate-400">Live Active</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${activeAiPlan.urgencyBadgeColor}`}>
                        {activeAiPlan.urgencyClassification}
                      </span>
                    </div>

                    {/* Executive Summary */}
                    <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-indigo-900 block mb-1">
                        Executive Strategic Assessment
                      </span>
                      <p className="text-slate-700 text-[11px] leading-relaxed">
                        {activeAiPlan.executiveSummary}
                      </p>
                    </div>

                    {/* Immediate Tactical Measures */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Immediate Tactical Measures (0 - 48 Hours)</span>
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-slate-700">
                        {activeAiPlan.immediateMeasures.map((m, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0 leading-tight">•</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Long Term Infrastructure Plan */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                        Long-Term Infrastructure Sanction Plan
                      </span>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        {activeAiPlan.infrastructurePlan}
                      </p>
                    </div>

                    {/* Budget Sanction Breakdown */}
                    <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-950 text-xs">Estimated Sanction Budget:</span>
                        <span className="font-bold font-mono text-indigo-900 text-sm">
                          {activeAiPlan.totalSanctionEstimateINR}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-indigo-200/60 space-y-1 text-[10px]">
                        {activeAiPlan.budgetBreakdown.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center justify-between text-slate-600">
                            <span>{b.item}</span>
                            <span className="font-mono font-semibold text-slate-800">{b.costINR}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Controls (Directly visible - No generate button) */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => setShowMemoModal(true)}
                        className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Official Cabinet Memo</span>
                      </button>

                      <button
                        onClick={() => handleEscalate(selectedZone)}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        title="Escalate directly to State Health Ministry"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Escalate</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Dossier Bottom Status Pill */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: <strong className="text-slate-700">{selectedZone.governmentActionStatus}</strong></span>
              <span className="font-mono text-[10px]">{selectedZone.lastUpdated}</span>
            </div>

          </div>
        </div>

      </div>

      {/* 3. Concise Surveillance Table (Simplified, No visual noise) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Rural Epidemic & Hospital Deficit Registry</span>
          </h3>
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredZones.length}</strong> outbreak zones
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase text-slate-400">
                <th className="pb-2">Rural Area & Block</th>
                <th className="pb-2">Active Disease</th>
                <th className="pb-2 text-center">Cases (Surge)</th>
                <th className="pb-2">Local PHC Infrastructure Status</th>
                <th className="pb-2 text-right">Government Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredZones.map(zone => (
                <tr 
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`cursor-pointer transition hover:bg-slate-50 ${
                    selectedZone.id === zone.id ? 'bg-blue-50/70 font-medium' : ''
                  }`}
                >
                  <td className="py-2.5 pr-2">
                    <div className="font-bold text-slate-900">{zone.blockName}</div>
                    <div className="text-[10px] text-slate-500">{zone.district}</div>
                  </td>
                  <td className="py-2.5 pr-2">
                    <div className="font-semibold text-slate-800">{zone.diseaseName.split('(')[0]}</div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {zone.diseaseCategory}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="font-bold text-rose-600">{zone.activeCasesCount}</span>
                    <span className="text-[10px] text-rose-500 font-mono ml-1">+{zone.weeklyGrowthRatePercent}%</span>
                  </td>
                  <td className="py-2.5 pr-2">
                    {zone.isFacilityAvailableLocally ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3" /> Available Locally
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <AlertTriangle className="w-3 h-3" /> Deficit ({zone.nearestHospitalDistanceKm} km away)
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      zone.governmentActionStatus.includes('Approved') || zone.governmentActionStatus.includes('Dispatched')
                        ? 'bg-emerald-100 text-emerald-800'
                        : zone.governmentActionStatus.includes('Escalated') || zone.governmentActionStatus.includes('Action')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {zone.governmentActionStatus.split('(')[0]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Official Government Memorandum Modal */}
      {showMemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-xs sm:text-sm">Official Government Action Requisition</span>
              </div>
              <button 
                onClick={() => setShowMemoModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Memorandum Letterhead */}
            <div className="p-5 space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="text-center border-b border-slate-200 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Government of Maharashtra • Public Health Department
                </h4>
                <p className="text-[11px] text-slate-600">
                  Office of the District Health Officer & Primary Health Center Command Center
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Ref No: MH/PHC-SURV/{selectedZone.id} • Date: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p className="font-bold text-rose-900">
                  SUBJECT: Emergency Epidemic Intervention & Infrastructure Sanction for {selectedZone.ruralAreaName} ({selectedZone.diseaseName}).
                </p>
              </div>

              <div className="space-y-2 text-[11px] text-slate-700">
                <p>
                  1. An acute outbreak of <strong>{selectedZone.diseaseName}</strong> is actively escalating in <strong>{selectedZone.ruralAreaName} ({selectedZone.blockName})</strong> with <strong>{selectedZone.activeCasesCount} confirmed active cases</strong>.
                </p>
                <p>
                  2. <strong>FACILITY DEFICIT:</strong> The local facility ({selectedZone.localFacilityName}) lacks specialized curing capabilities ({selectedZone.requiredFacilityType}).
                </p>
                <p>
                  3. <strong>TRANSIT BARRIER:</strong> The nearest equipped tertiary facility is <strong>{selectedZone.nearestEquippedHospitalName}</strong> at <strong>{selectedZone.nearestHospitalDistanceKm} km ({selectedZone.travelTransitTimeMinutes} minutes travel)</strong>.
                </p>
                <p>
                  4. <strong>SANCTION SOUGHT:</strong> Immediate allocation of <strong>{selectedZone.sanctionBudgetEstimateINR}</strong> and deployment of emergency 108 Mobile Medical Unit.
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px]">
                <div>
                  <p className="font-semibold text-slate-800">{selectedZone.reportedByAshaOrMo}</p>
                  <p className="text-slate-500">PHC Clinical Command Center</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Authorized Medical Officer</p>
                  <p className="text-slate-500">Government of Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-5 py-3 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowMemoModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
