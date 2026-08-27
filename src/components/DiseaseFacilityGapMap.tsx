import React, { useState, useEffect } from 'react';
import { DiseaseOutbreakZone } from '../types';
import { MAHARASHTRA_CITIES, MaharashtraCityHub } from '../data/mockData';
import { 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  Truck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Send, 
  Search, 
  Layers, 
  Maximize2, 
  Compass, 
  Stethoscope, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  Printer, 
  X,
  Radio,
  Share2,
  AlertCircle
} from 'lucide-react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  Polyline,
  useMap, 
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import confetti from 'canvas-confetti';

interface DiseaseFacilityGapMapProps {
  outbreakZones: DiseaseOutbreakZone[];
  onUpdateZone: (updatedZone: DiseaseOutbreakZone) => void;
  onInitiateTeleconsult?: (patientName?: string, sector?: string) => void;
}

type DeficitFilter = 'all' | 'deficit_only' | 'equipped_only';
type CategoryFilter = 'all' | 'Vector-Borne' | 'Water-Borne' | 'Maternal & Obstetric Crisis' | 'Genetic / Blood Disorder' | 'Zoonotic / Venomous';

// Map Controller for smooth flyTo
function MapViewController({ 
  center, 
  zoom 
}: { 
  center: [number, number]; 
  zoom: number; 
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  return null;
}

// Marker Icon Generator
const createDiseaseZoneMarkerIcon = (
  zone: DiseaseOutbreakZone, 
  isSelected: boolean
) => {
  const isDeficit = !zone.isFacilityAvailableLocally;
  const isCritical = zone.severityLevel === 'Critical Outbreak';

  const pulseBg = isDeficit
    ? 'bg-rose-500 ring-rose-200'
    : 'bg-emerald-500 ring-emerald-200';

  const badgeBg = isSelected
    ? 'bg-slate-900 text-white border-blue-500 ring-2 ring-blue-400 scale-105'
    : isDeficit
      ? 'bg-rose-50 text-rose-800 border-rose-300'
      : 'bg-emerald-50 text-emerald-800 border-emerald-300';

  const html = `
    <div class="relative flex flex-col items-center cursor-pointer -translate-x-1/2 -translate-y-full group">
      <div class="relative flex items-center justify-center">
        ${isDeficit ? `<span class="absolute w-7 h-7 rounded-full bg-rose-500 opacity-80 animate-ping"></span>` : ''}
        <div class="w-8 h-8 rounded-full ${pulseBg} ring-4 flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
          ${isDeficit 
            ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>` 
            : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
          }
        </div>
      </div>
      <div class="mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-xs transition-all whitespace-nowrap ${badgeBg}">
        ${zone.blockName} • ${zone.diseaseName.split(' ')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-disease-gap-marker',
    iconSize: [36, 46],
    iconAnchor: [18, 40],
    popupAnchor: [0, -40]
  });
};

// Hospital Marker Icon Generator
const createHospitalMarkerIcon = (hospitalName: string) => {
  const html = `
    <div class="relative flex flex-col items-center cursor-pointer -translate-x-1/2 -translate-y-full group">
      <div class="w-7 h-7 rounded-full bg-blue-600 ring-4 ring-blue-200 flex items-center justify-center text-white shadow-md">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
      <div class="mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-900 text-white border border-blue-700 shadow-xs whitespace-nowrap">
        ${hospitalName.split(',')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-hospital-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 36],
    popupAnchor: [0, -36]
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
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayer, setMapLayer] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  
  // AI Generation State
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [aiProposal, setAiProposal] = useState<any>(null);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const selectedCity = MAHARASHTRA_CITIES.find(c => c.id === selectedCityId);

  // Map center calculation
  const mapCenter: [number, number] = selectedZone 
    ? [selectedZone.coordinates.lat, selectedZone.coordinates.lng] 
    : [18.5204, 73.8567];

  // Filtering
  const filteredZones = outbreakZones.filter(zone => {
    const matchesCity = selectedCityId === 'all' || zone.cityHub === selectedCityId;
    const matchesDeficit = 
      deficitFilter === 'all' ||
      (deficitFilter === 'deficit_only' && !zone.isFacilityAvailableLocally) ||
      (deficitFilter === 'equipped_only' && zone.isFacilityAvailableLocally);
    const matchesCategory = categoryFilter === 'all' || zone.diseaseCategory === categoryFilter;
    const matchesSearch = 
      searchQuery === '' ||
      zone.ruralAreaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.blockName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.requiredFacilityType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesDeficit && matchesCategory && matchesSearch;
  });

  // Calculate high level metrics
  const totalOutbreaks = outbreakZones.length;
  const criticalDeficitsCount = outbreakZones.filter(z => !z.isFacilityAvailableLocally).length;
  const populationAtRiskDeficit = outbreakZones
    .filter(z => !z.isFacilityAvailableLocally)
    .reduce((acc, z) => acc + z.populationAtRisk, 0);
  const escalatedCount = outbreakZones.filter(z => z.governmentActionStatus !== 'Facility Sufficient').length;

  // Handle Escalate Action
  const handleEscalateToCollectorate = (zone: DiseaseOutbreakZone) => {
    const updated: DiseaseOutbreakZone = {
      ...zone,
      governmentActionStatus: 'Action Required (Deficit Escalated)',
      lastUpdated: 'Just Now (Escalated to District Collectorate)'
    };
    onUpdateZone(updated);
    setSelectedZone(updated);
    confetti({ particleCount: 40, spread: 60 });
    setActionSuccessNotice(`Government Requisition dispatched for ${zone.ruralAreaName}! Alert sent to Health Ministry and District Collectorate.`);
    setTimeout(() => setActionSuccessNotice(null), 5000);
  };

  // Handle Mobile Unit Deployment
  const handleDeployMobileUnit = (zone: DiseaseOutbreakZone) => {
    const updated: DiseaseOutbreakZone = {
      ...zone,
      governmentActionStatus: 'Mobile Unit Sanctioned',
      lastUpdated: 'Just Now (108 Mobile Medical Unit Dispatched)'
    };
    onUpdateZone(updated);
    setSelectedZone(updated);
    confetti({ particleCount: 50, spread: 70 });
    setActionSuccessNotice(`Emergency 108 Mobile Unit & Medical Squad sanctioned for ${zone.ruralAreaName}. Expected Arrival within 4 hours.`);
    setTimeout(() => setActionSuccessNotice(null), 5000);
  };

  // Handle Fund Sanction
  const handleApproveSanction = (zone: DiseaseOutbreakZone) => {
    const updated: DiseaseOutbreakZone = {
      ...zone,
      governmentActionStatus: 'Emergency Allocation Approved',
      lastUpdated: 'Just Now (Sanction Letter Issued)'
    };
    onUpdateZone(updated);
    setSelectedZone(updated);
    confetti({ particleCount: 75, spread: 80 });
    setActionSuccessNotice(`Emergency Budget of ${zone.sanctionBudgetEstimateINR} officially approved under NHM Outbreak Emergency Reserve!`);
    setTimeout(() => setActionSuccessNotice(null), 5000);
  };

  // Trigger Gemini AI Proposal
  const handleGenerateAIProposal = async (zone: DiseaseOutbreakZone) => {
    setIsGeneratingProposal(true);
    setAiProposal(null);
    try {
      const res = await fetch('/api/gemini/facility-gap-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone })
      });
      const data = await res.json();
      setAiProposal(data);
    } catch (err) {
      console.error('Failed to fetch AI proposal:', err);
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  return (
    <div id="disease-facility-gap-view" className="space-y-6 pb-12">
      
      {/* Top Banner Alert Notice if any */}
      {actionSuccessNotice && (
        <div className="bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-md flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{actionSuccessNotice}</span>
          </div>
          <button 
            onClick={() => setActionSuccessNotice(null)}
            className="text-emerald-200 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header & Subtext */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                    Rural Epidemic & Facility Gap Surveillance
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    Government Escalation Portal
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Real-time GIS outbreak tracking & hospital infrastructure deficit analysis for immediate Government sanction.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Outbreak Zones</span>
              <span className="text-lg font-bold text-slate-800">{totalOutbreaks}</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Facility Deficits</span>
              </div>
              <span className="text-lg font-bold text-rose-700">{criticalDeficitsCount}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider block">Population at Risk</span>
              <span className="text-lg font-bold text-amber-900">{(populationAtRiskDeficit / 1000).toFixed(0)}k</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block">State Requisitions</span>
              <span className="text-lg font-bold text-blue-800">{escalatedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Deficit Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setDeficitFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                deficitFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Zones ({outbreakZones.length})
            </button>
            <button
              onClick={() => setDeficitFilter('deficit_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                deficitFilter === 'deficit_only'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Critical Deficits ({criticalDeficitsCount})</span>
            </button>
            <button
              onClick={() => setDeficitFilter('equipped_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                deficitFilter === 'equipped_only'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Equipped Local ({outbreakZones.length - criticalDeficitsCount})
            </button>
          </div>

          {/* District Selector & Search */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search area, disease, block..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Maharashtra Districts</option>
              {MAHARASHTRA_CITIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) & Government Action Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive GIS Map */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[560px]">
            
            {/* Map Top Bar Controls */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="font-bold">Epidemic Spread & Hospital Reach Layer</span>
                <span className="hidden sm:inline text-slate-400">|</span>
                <span className="hidden sm:inline text-slate-300 font-mono text-[11px]">
                  {filteredZones.length} Zones Visible
                </span>
              </div>

              {/* Map Layer Switcher */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setMapLayer('roadmap')}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                    mapLayer === 'roadmap' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setMapLayer('satellite')}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                    mapLayer === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapLayer('terrain')}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                    mapLayer === 'terrain' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Terrain
                </button>
              </div>
            </div>

            {/* Leaflet Map Stage */}
            <div className="flex-1 relative w-full bg-slate-100">
              <MapContainer
                center={mapCenter}
                zoom={10}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ height: '100%', width: '100%' }}
              >
                <MapViewController 
                  center={[selectedZone.coordinates.lat, selectedZone.coordinates.lng]} 
                  zoom={10} 
                />

                {/* Tile Layer Provider */}
                {mapLayer === 'roadmap' && (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                )}
                {mapLayer === 'satellite' && (
                  <TileLayer
                    attribution='&copy; Esri WorldImagery'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                )}
                {mapLayer === 'terrain' && (
                  <TileLayer
                    attribution='&copy; OpenTopoMap'
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
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
                      radius={isDeficit ? 3800 : 2500}
                      pathOptions={{
                        color: isDeficit ? '#e11d48' : '#10b981',
                        fillColor: isDeficit ? '#f43f5e' : '#10b981',
                        fillOpacity: isSelected ? 0.35 : 0.18,
                        weight: isSelected ? 2.5 : 1.5,
                        dashArray: isDeficit ? '4, 4' : undefined
                      }}
                    />
                  );
                })}

                {/* Transit Vector Polyline to Nearest Hospital if Deficit */}
                {selectedZone && !selectedZone.isFacilityAvailableLocally && (
                  <>
                    <Polyline
                      positions={[
                        [selectedZone.coordinates.lat, selectedZone.coordinates.lng],
                        [selectedZone.nearestHospitalCoordinates.lat, selectedZone.nearestHospitalCoordinates.lng]
                      ]}
                      pathOptions={{
                        color: '#e11d48',
                        weight: 3,
                        dashArray: '6, 8',
                        opacity: 0.85
                      }}
                    />

                    {/* Nearest Hospital Target Marker */}
                    <Marker
                      position={[selectedZone.nearestHospitalCoordinates.lat, selectedZone.nearestHospitalCoordinates.lng]}
                      icon={createHospitalMarkerIcon(selectedZone.nearestEquippedHospitalName)}
                    >
                      <Popup>
                        <div className="p-2 text-xs max-w-xs">
                          <p className="font-bold text-blue-900">{selectedZone.nearestEquippedHospitalName}</p>
                          <p className="text-slate-600 mt-1">Equipped Referral Facility for {selectedZone.diseaseName}</p>
                          <p className="text-rose-700 font-bold mt-1">
                            Transit Barrier: {selectedZone.nearestHospitalDistanceKm} km ({selectedZone.travelTransitTimeMinutes} mins)
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  </>
                )}

                {/* Markers for all Filtered Zones */}
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
                        <div className="p-2.5 text-xs max-w-xs space-y-2">
                          <div className="flex items-center justify-between gap-2 border-b pb-1">
                            <span className="font-bold text-slate-900">{zone.ruralAreaName}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              !zone.isFacilityAvailableLocally ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {!zone.isFacilityAvailableLocally ? 'DEFICIT' : 'EQUIPPED'}
                            </span>
                          </div>
                          <p className="font-semibold text-rose-700">{zone.diseaseName}</p>
                          <p className="text-slate-600 text-[11px]">
                            <strong>Active Cases:</strong> {zone.activeCasesCount} (+{zone.weeklyGrowthRatePercent}%/wk)
                          </p>
                          <p className="text-slate-600 text-[11px]">
                            <strong>Required:</strong> {zone.requiredFacilityType}
                          </p>
                          {!zone.isFacilityAvailableLocally && (
                            <p className="text-rose-700 font-semibold text-[11px]">
                              Nearest Facility is {zone.nearestHospitalDistanceKm} km away ({zone.travelTransitTimeMinutes} mins)
                            </p>
                          )}
                          <button
                            onClick={() => setSelectedZone(zone)}
                            className="w-full mt-2 py-1 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-slate-800"
                          >
                            Inspect Dossier & Action Plan
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-2.5 shadow-md text-[11px] space-y-1.5 pointer-events-auto max-w-[210px]">
                <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Map Legend</p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200 shrink-0"></span>
                  <span className="text-slate-700 font-medium">Critical Facility Deficit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0"></span>
                  <span className="text-slate-700 font-medium">Equipped / Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-200 shrink-0"></span>
                  <span className="text-slate-700 font-medium">Nearest Referral Hospital</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-500 shrink-0"></span>
                  <span className="text-slate-700 font-medium">Transit Route & Distance</span>
                </div>
              </div>
            </div>

            {/* Bottom Quick Zone Selector Strip */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 overflow-x-auto flex items-center gap-2.5 no-scrollbar">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider shrink-0">Zones:</span>
              {filteredZones.map(zone => {
                const isSelected = selectedZone.id === zone.id;
                const isDeficit = !zone.isFacilityAvailableLocally;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : isDeficit
                          ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isDeficit ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                    <span>{zone.blockName}</span>
                    <span className="text-[10px] opacity-75 font-normal">({zone.activeCasesCount} cases)</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* District Summary Table Snippet */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Epidemic Attack Rate & Facility Status Summary</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase text-slate-400">
                    <th className="pb-2">Rural Area & Block</th>
                    <th className="pb-2">Active Disease</th>
                    <th className="pb-2 text-center">Cases (Growth)</th>
                    <th className="pb-2">Local Treatment Facility</th>
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
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
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
                          zone.governmentActionStatus.includes('Approved') || zone.governmentActionStatus.includes('Sanctioned')
                            ? 'bg-emerald-100 text-emerald-800'
                            : zone.governmentActionStatus.includes('Escalated')
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

        </div>

        {/* Right Column: Detailed Selected Zone Dossier & Government Requisition Action */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Main Action Requisition Card */}
          <div className={`border rounded-2xl p-5 shadow-xs transition-all ${
            !selectedZone.isFacilityAvailableLocally
              ? 'bg-white border-rose-300 ring-1 ring-rose-200'
              : 'bg-white border-slate-200'
          }`}>
            
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  !selectedZone.isFacilityAvailableLocally ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                }`}></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {selectedZone.blockName} Dossier
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                selectedZone.governmentAlertLevel.startsWith('Red')
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : selectedZone.governmentAlertLevel.startsWith('Amber')
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}>
                {selectedZone.governmentAlertLevel}
              </span>
            </div>

            {/* Disease Heading & Outbreak Stats */}
            <div className="mt-3.5 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Spreading Disease</span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedZone.diseaseName}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Outbreak Source:</strong> {selectedZone.outbreakSource}
                </p>
              </div>

              {/* Epidemic Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Active Cases</span>
                  <span className="text-base font-bold text-rose-600">{selectedZone.activeCasesCount}</span>
                </div>
                <div className="text-center border-x border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block">Weekly Surge</span>
                  <span className="text-base font-bold text-rose-600 font-mono">+{selectedZone.weeklyGrowthRatePercent}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">At-Risk Pop.</span>
                  <span className="text-base font-bold text-slate-800">{(selectedZone.populationAtRisk / 1000).toFixed(1)}k</span>
                </div>
              </div>

              {/* Symptoms Checklist */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Primary Clinical Manifestations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.primarySymptoms.map((sym, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      • {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medical Facility Gap Analysis */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Required Medical Facility to Cure:</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                      MANDATED PROTOCOL
                    </span>
                  </div>
                  <p className="text-xs font-bold text-blue-200">
                    {selectedZone.requiredFacilityType}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong>Specialist Required:</strong> {selectedZone.requiredSpecialist}
                  </p>
                </div>

                {/* Local PHC Reality Box */}
                <div className={`p-3 rounded-xl border ${
                  !selectedZone.isFacilityAvailableLocally
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Local Center Availability:</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      !selectedZone.isFacilityAvailableLocally ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {selectedZone.localFacilityCapacityStatus}
                    </span>
                  </div>
                  <p className="text-xs font-semibold">{selectedZone.localFacilityName}</p>
                  <p className="text-xs mt-1 text-slate-700 leading-relaxed">
                    {selectedZone.deficitSummary}
                  </p>
                </div>

                {/* Transit & Referral Barrier */}
                {!selectedZone.isFacilityAvailableLocally && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-900 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Nearest Equipped Hospital:</span>
                      </span>
                      <span className="font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-amber-300 text-[11px]">
                        {selectedZone.nearestHospitalDistanceKm} km ({selectedZone.travelTransitTimeMinutes} mins)
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800">{selectedZone.nearestEquippedHospitalName}</p>
                    <p className="text-[11px] text-amber-800 leading-tight mt-1">
                      ⚠️ <strong>Transit Risk:</strong> {selectedZone.transitRiskAssessment}
                    </p>
                  </div>
                )}

              </div>

              {/* Official Government Requisition Recommendation */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Government Action Needed
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Budget: {selectedZone.sanctionBudgetEstimateINR}
                  </span>
                </div>
                <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedZone.governmentRecommendation}
                </p>
              </div>

              {/* Interactive Government Escalation Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    id="btn-escalate-collectorate"
                    onClick={() => handleEscalateToCollectorate(selectedZone)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Escalate to Ministry</span>
                  </button>

                  <button
                    id="btn-deploy-mobile-unit"
                    onClick={() => handleDeployMobileUnit(selectedZone)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
                  >
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Deploy 108 Mobile Unit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    id="btn-approve-sanction"
                    onClick={() => handleApproveSanction(selectedZone)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sanction Budget (₹)</span>
                  </button>

                  <button
                    id="btn-open-memo-modal"
                    onClick={() => setShowMemoModal(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Official Memo</span>
                  </button>
                </div>

                {/* Gemini AI Action Proposal Trigger */}
                <button
                  id="btn-ai-sanction-proposal"
                  onClick={() => handleGenerateAIProposal(selectedZone)}
                  disabled={isGeneratingProposal}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200 hover:border-indigo-300 text-indigo-900 text-xs font-bold transition shadow-xs"
                >
                  <Sparkles className={`w-4 h-4 text-indigo-600 ${isGeneratingProposal ? 'animate-spin' : ''}`} />
                  <span>
                    {isGeneratingProposal 
                      ? 'Formulating Government Infrastructure Proposal...' 
                      : 'Generate AI Cabinet Action Plan (Gemini)'}
                  </span>
                </button>
              </div>

            </div>
          </div>

          {/* AI Generated Cabinet Proposal Box if generated */}
          {aiProposal && (
            <div className="bg-white border border-indigo-200 rounded-2xl p-4 shadow-xs space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-950">Gemini Public Health Sanction Plan</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  {aiProposal.urgencyClassification}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {aiProposal.executiveSummary}
              </p>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Immediate 24-Hour Measures
                </span>
                <ul className="text-xs text-slate-700 space-y-1">
                  {aiProposal.immediateMeasures?.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Long-Term Infrastructure Sanction
                </span>
                <p className="text-xs text-slate-700">
                  {aiProposal.longTermInfrastructurePlan}
                </p>
              </div>

              {aiProposal.budgetBreakdown && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Budget Allocation Breakdown
                  </span>
                  {aiProposal.budgetBreakdown.map((b: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                      <span>{b.item}</span>
                      <span className="font-mono font-bold text-slate-900">{b.costINR}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-1 flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Total Sanction:</span>
                    <span className="font-mono text-indigo-700">{aiProposal.totalSanctionEstimateINR}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Official Government Memorandum Modal */}
      {showMemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-300 animate-scaleUp">
            
            {/* Memorandum Header Bar */}
            <div className="px-6 py-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm">Official Government Action Requisition Memorandum</span>
              </div>
              <button 
                onClick={() => setShowMemoModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Memorandum Content Letterhead */}
            <div className="p-6 space-y-5 text-xs text-slate-800 font-serif leading-relaxed">
              
              <div className="text-center border-b border-slate-300 pb-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Government of Maharashtra • Public Health Department (Arogya Vibhag)
                </h4>
                <p className="text-[11px] text-slate-600">
                  Office of the District Health Officer & Primary Health Center Command Center
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  Ref No: MH/PHC-SURV/2026/{selectedZone.id} • Date: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div>
                <p><strong>TO:</strong> The Principal Secretary (Health), Mantralaya, Mumbai</p>
                <p><strong>THROUGH:</strong> The District Collector & Magistrate, {selectedZone.district}</p>
                <p><strong>FROM:</strong> Medical Officer In-Charge & District Epidemiological Surveillance Unit</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
                <p className="font-bold text-rose-900">
                  SUBJECT: Urgent Infrastructure Sanction & Emergency Epidemic Intervention for {selectedZone.ruralAreaName} due to {selectedZone.diseaseName} Outbreak.
                </p>
              </div>

              <div className="space-y-2">
                <p>Respected Authority,</p>
                <p>
                  1. It is brought to your urgent notice that an acute outbreak of <strong>{selectedZone.diseaseName}</strong> is actively escalating in <strong>{selectedZone.ruralAreaName} ({selectedZone.blockName})</strong> with <strong>{selectedZone.activeCasesCount} confirmed cases</strong> and a weekly growth rate of <strong>+{selectedZone.weeklyGrowthRatePercent}%</strong>.
                </p>
                <p>
                  2. <strong>CRITICAL FACILITY DEFICIT:</strong> The local health institution (<em>{selectedZone.localFacilityName}</em>) is strictly equipped for primary outpatient care and possesses <strong>NO specialized curing infrastructure</strong> ({selectedZone.requiredFacilityType}).
                </p>
                <p>
                  3. <strong>TRANSIT & MORTALITY HAZARD:</strong> The nearest equipped referral hospital is <strong>{selectedZone.nearestEquippedHospitalName}</strong>, located <strong>{selectedZone.nearestHospitalDistanceKm} km away</strong> (approx. <strong>{selectedZone.travelTransitTimeMinutes} minutes transit</strong> over rural/ghat roads). This transit lag presents severe mortality risk for critical patients.
                </p>
                <p>
                  4. <strong>IMMEDIATE ADMINISTRATIVE PROPOSAL:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 font-sans text-[11px]">
                  <li>Immediate sanction of emergency allocation: <strong>{selectedZone.sanctionBudgetEstimateINR}</strong>.</li>
                  <li>Deployment of 108 Mobile Medical Unit & Mobile Blood / Diagnostic Squad.</li>
                  <li>Establishment of temporary specialized treatment bay at block headquarters.</li>
                </ul>
              </div>

              <div className="border-t border-slate-300 pt-4 flex items-center justify-between text-[11px]">
                <div>
                  <p><strong>Reported By:</strong> {selectedZone.reportedByAshaOrMo}</p>
                  <p className="text-slate-500">PHC Clinical Command Center</p>
                </div>
                <div className="text-right">
                  <div className="w-24 h-8 border-b border-slate-400 mb-1"></div>
                  <p className="font-bold">Authorized Medical Officer</p>
                  <p className="text-slate-500">Seal & Signature</p>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3.5 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowMemoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
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
