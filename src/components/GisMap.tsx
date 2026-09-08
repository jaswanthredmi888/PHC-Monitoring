import React, { useState, useEffect, useRef } from 'react';
import { SectorData } from '../types';
import { MAHARASHTRA_CITIES, MaharashtraCityHub } from '../data/mockData';
import { 
  Layers, 
  Search, 
  Plus, 
  Minus, 
  Crosshair, 
  AlertCircle, 
  MapPin, 
  Activity,
  Flame,
  Baby,
  Syringe,
  EyeOff,
  Navigation,
  Globe,
  Building2,
  PhoneCall,
  Video,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  useMap, 
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';

interface GisMapProps {
  sectors: SectorData[];
  selectedSector: SectorData;
  onSelectSector: (sector: SectorData) => void;
  onInitiateTeleconsult: (patientName?: string, sector?: string) => void;
}

export type HeatmapFilter = 'outbreaks' | 'maternal' | 'vaccine' | 'all' | 'disabled';
export type MapLayer = 'roadmap' | 'satellite' | 'terrain';

// Helper component to handle map center & zoom dynamically
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

// Helper to track mouse/map coordinates
function MapCoordinatesWatcher({ onCoordinatesChange }: { onCoordinatesChange: (coords: { lat: number; lng: number }) => void }) {
  useMapEvents({
    mousemove(e) {
      onCoordinatesChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    click(e) {
      onCoordinatesChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

// Function to generate custom HTML icons for Leaflet markers
const createCustomMarkerIcon = (
  sector: SectorData, 
  isSelected: boolean
) => {
  const isOutbreak = sector.zoneStatusColor === 'red';
  const isMaternal = sector.zoneStatusColor === 'orange';
  
  const pulseColor = isOutbreak 
    ? 'bg-rose-500 ring-rose-200' 
    : isMaternal 
      ? 'bg-amber-500 ring-amber-200' 
      : 'bg-blue-600 ring-blue-200';
      
  const badgeBorder = isSelected 
    ? 'border-blue-600 bg-slate-900 text-white ring-2 ring-blue-400 scale-105' 
    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50';

  const html = `
    <div class="relative flex flex-col items-center cursor-pointer -translate-x-1/2 -translate-y-full group">
      <div class="relative flex items-center justify-center">
        <span class="absolute w-6 h-6 rounded-full ${pulseColor} opacity-75 animate-ping"></span>
        <div class="w-7 h-7 rounded-full ${pulseColor} ring-4 flex items-center justify-center text-white shadow-md transition-transform duration-200 group-hover:scale-110">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
            <circle cx="12" cy="9" r="2.5" fill="currentColor"></circle>
          </svg>
        </div>
      </div>
      <div class="mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-xs transition-all whitespace-nowrap ${badgeBorder}">
        ${sector.name.split('(')[0].trim()}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-phc-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 36],
    popupAnchor: [0, -36]
  });
};

export const GisMap: React.FC<GisMapProps> = ({
  sectors,
  selectedSector,
  onSelectSector,
  onInitiateTeleconsult
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('pune');
  const [heatmapFilter, setHeatmapFilter] = useState<HeatmapFilter>('outbreaks');
  const [mapLayer, setMapLayer] = useState<MapLayer>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([selectedSector.coordinates.lat, selectedSector.coordinates.lng]);
  const [zoomLevel, setZoomLevel] = useState<number>(10);
  const [liveCoordinates, setLiveCoordinates] = useState<{ lat: number; lng: number }>(selectedSector.coordinates);

  const selectedCity = MAHARASHTRA_CITIES.find(c => c.id === selectedCityId) || MAHARASHTRA_CITIES[0];

  // Filter sectors for selected city / district or search
  const filteredSectors = sectors.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designatedAsha.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery.trim()) {
      return matchesSearch;
    }
    
    return s.city === selectedCityId || (!s.city && selectedCityId === 'pune');
  });

  // Handle city selection
  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = MAHARASHTRA_CITIES.find(c => c.id === cityId);
    if (city) {
      setMapCenter([city.center.lat, city.center.lng]);
      setZoomLevel(city.zoom);
      
      const firstCitySector = sectors.find(s => s.city === cityId);
      if (firstCitySector) {
        onSelectSector(firstCitySector);
      }
    }
  };

  // Sync selectedSector to center if changed from external component
  useEffect(() => {
    if (selectedSector && selectedSector.coordinates) {
      setLiveCoordinates(selectedSector.coordinates);
    }
  }, [selectedSector]);

  // Tile layer URL selector (pure OpenStreetMap)
  const getTileLayerUrl = () => {
    switch (mapLayer) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'roadmap':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (mapLayer) {
      case 'satellite':
        return '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'terrain':
        return '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors)';
      case 'roadmap':
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & City Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        
        {/* City & District Hub Picker */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-blue-600 font-mono font-bold text-xs uppercase">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-slate-800">Maharashtra Hub:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {MAHARASHTRA_CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCityChange(city.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCityId === city.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            id="filter-outbreaks"
            onClick={() => setHeatmapFilter('outbreaks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              heatmapFilter === 'outbreaks'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Outbreaks</span>
          </button>

          <button
            id="filter-maternal"
            onClick={() => setHeatmapFilter('maternal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              heatmapFilter === 'maternal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Maternal Risks</span>
          </button>

          <button
            id="filter-vaccine"
            onClick={() => setHeatmapFilter('vaccine')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              heatmapFilter === 'vaccine'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>Vaccine Gaps</span>
          </button>

          <button
            id="filter-disabled"
            onClick={() => setHeatmapFilter('disabled')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              heatmapFilter === 'disabled'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Disable Layer</span>
          </button>
        </div>
      </div>

      {/* Map Interactive Container */}
      <div className="relative w-full h-[460px] md:h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 z-0">
        
        {/* Floating Top Bar (Search + Layer toggles) */}
        <div className="absolute top-3 left-3 right-3 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
          {/* Search Box */}
          <div className="relative pointer-events-auto w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search in ${selectedCity.name} villages/sectors...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/95 backdrop-blur-xs rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 border border-slate-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Layer toggles */}
          <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-xs self-end sm:self-auto">
            <button
              onClick={() => setMapLayer('roadmap')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                mapLayer === 'roadmap'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setMapLayer('satellite')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                mapLayer === 'satellite'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapLayer('terrain')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                mapLayer === 'terrain'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terrain (OSM)
            </button>
          </div>
        </div>

        {/* Real Interactive Map Component */}
        <MapContainer
          center={[selectedSector.coordinates.lat, selectedSector.coordinates.lng]}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution={getTileLayerAttribution()}
            url={getTileLayerUrl()}
          />

          <MapViewController center={mapCenter} zoom={zoomLevel} />
          <MapCoordinatesWatcher onCoordinatesChange={setLiveCoordinates} />

          {/* Render Heatmap Radius Zones over Maharashtra locations */}
          {heatmapFilter !== 'disabled' && (
            <>
              {filteredSectors.map((sector) => {
                if (
                  (heatmapFilter === 'outbreaks' || heatmapFilter === 'all') &&
                  sector.zoneStatusColor === 'red'
                ) {
                  return (
                    <Circle
                      key={`heat-outbreak-${sector.id}`}
                      center={[sector.coordinates.lat, sector.coordinates.lng]}
                      radius={3200}
                      pathOptions={{
                        color: '#e11d48',
                        fillColor: '#f43f5e',
                        fillOpacity: 0.22,
                        weight: 2,
                        dashArray: '4, 4'
                      }}
                    />
                  );
                }

                if (
                  (heatmapFilter === 'maternal' || heatmapFilter === 'all') &&
                  sector.highRiskAncCases >= 4
                ) {
                  return (
                    <Circle
                      key={`heat-maternal-${sector.id}`}
                      center={[sector.coordinates.lat, sector.coordinates.lng]}
                      radius={2800}
                      pathOptions={{
                        color: '#d97706',
                        fillColor: '#f59e0b',
                        fillOpacity: 0.2,
                        weight: 2
                      }}
                    />
                  );
                }

                if (
                  (heatmapFilter === 'vaccine' || heatmapFilter === 'all') &&
                  (sector.vaccineGapPercent || 0) > 3.0
                ) {
                  return (
                    <Circle
                      key={`heat-vaccine-${sector.id}`}
                      center={[sector.coordinates.lat, sector.coordinates.lng]}
                      radius={2400}
                      pathOptions={{
                        color: '#2563eb',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.18,
                        weight: 1.5
                      }}
                    />
                  );
                }

                return null;
              })}
            </>
          )}

          {/* Render PHC Sector Markers */}
          {filteredSectors.map((sector) => (
            <Marker
              key={sector.id}
              position={[sector.coordinates.lat, sector.coordinates.lng]}
              icon={createCustomMarkerIcon(sector, selectedSector.id === sector.id)}
              eventHandlers={{
                click: () => {
                  onSelectSector(sector);
                  setMapCenter([sector.coordinates.lat, sector.coordinates.lng]);
                }
              }}
            >
              <Popup className="custom-map-popup">
                <div className="p-3.5 min-w-[240px]">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      {sector.sectorName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      sector.zoneStatusColor === 'red' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : sector.zoneStatusColor === 'orange'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {sector.zoneStatus}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2">
                    {sector.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Designated ASHA: <span className="font-semibold text-slate-700">{sector.designatedAsha}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 my-2.5 bg-slate-50 p-2 rounded-lg text-center font-mono">
                    <div className="border-r border-slate-200">
                      <div className="text-[9px] text-slate-400 uppercase">High Risk ANC</div>
                      <div className="text-xs font-bold text-rose-600">{sector.highRiskAncCases} Cases</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">Health Index</div>
                      <div className="text-xs font-bold text-slate-800">{sector.complianceIndex}%</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => onInitiateTeleconsult(undefined, sector.sectorName)}
                      className="flex-1 py-1 px-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold text-center transition flex items-center justify-center gap-1"
                    >
                      <Video className="w-3 h-3" />
                      <span>Teleconsult</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectSector(sector);
                        setMapCenter([sector.coordinates.lat, sector.coordinates.lng]);
                      }}
                      className="py-1 px-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Live GPS Coordinates Readout */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-[11px] font-mono text-slate-700 font-medium flex items-center gap-2 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>
            {selectedCity.name}, MH &bull; Lat: {liveCoordinates.lat.toFixed(4)}° / Lng: {liveCoordinates.lng.toFixed(4)}°
          </span>
        </div>

        {/* Floating Custom Zoom and Recenter Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20 pointer-events-auto">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 16))}
            className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 6))}
            className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setMapCenter([selectedSector.coordinates.lat, selectedSector.coordinates.lng]);
              setZoomLevel(12);
            }}
            className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
            title="Center on Selected PHC Sector"
          >
            <Crosshair className="w-4 h-4 text-blue-600" />
          </button>
        </div>

      </div>

      {/* Sector Detailed Card */}
      <div id="sector-detail-card" className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedSector.name}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                  {selectedSector.district || 'Maharashtra'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono mt-0.5">
                {selectedSector.sectorName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              selectedSector.zoneStatusColor === 'red'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : selectedSector.zoneStatusColor === 'orange'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {selectedSector.zoneStatus}
            </span>
            <button
              onClick={() => onInitiateTeleconsult(undefined, selectedSector.sectorName)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Connect Teleconsult</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          {/* Compliance Index */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Sector Health Index
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
              {selectedSector.complianceIndex}%
              <span className="text-xs font-medium text-slate-600 ml-2">Compliance</span>
            </div>
          </div>

          {/* High Risk ANC Cases */}
          <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 font-mono">
              High Risk ANC
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1">
              {selectedSector.highRiskAncCases}
              <span className="text-xs font-semibold text-rose-700 ml-2">Cases</span>
            </div>
          </div>

          {/* Assigned Citizens */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Assigned Citizens
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {selectedSector.assignedCitizens}
            </div>
          </div>
        </div>

        {/* Designated ASHA & Alert Message */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
            <span className="text-slate-500 font-medium">DESIGNATED ASHA SEVIKA:</span>
            <span className="font-bold text-slate-900">
              {selectedSector.designatedAsha} ({selectedSector.ashaPhone})
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-normal leading-relaxed">
            {selectedSector.alertMessage}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-[11px] text-slate-500 gap-1">
            <div className="flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Real GPS: {selectedSector.coordinates.lat.toFixed(4)}° N, {selectedSector.coordinates.lng.toFixed(4)}° E &bull; {selectedSector.name}</span>
            </div>
            <span className="font-mono text-emerald-600 font-semibold">● Maharashtra Health Registry Live</span>
          </div>
        </div>

      </div>
    </div>
  );
};
