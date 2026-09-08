# Primary Health Center (PHC) Clinical Monitoring & Tele-Surveillance Platform
## Web Architecture & Technical Specification (`web-architecture.md`)

---

## 1. Executive Summary & Architectural Vision

The **Primary Health Center (PHC) Clinical Monitoring, Tele-Consultation & Disease Surveillance Platform** is an enterprise-grade public health command system engineered for rural and semi-urban healthcare administration. Built in alignment with the **National Health Mission (NHM)** and state public health standards (e.g., Government of Maharashtra Arogya Vibhag), the application bridges frontline community health workers (**ASHA Sevikas** and **ANM Field Nurses**) with **Medical Officers (MOs)**, **Tele-Consultant Specialists**, and **District Epidemiologists**.

### Primary Objectives
1. **Grassroots-to-Specialist Continuum**: Enable instant tele-triage, encrypted virtual consultation rooms, vital telemetry monitoring, and digital prescription issuance.
2. **Real-Time Epidemiological Surveillance**: Geotrack disease clusters (Vector-borne, Water-borne, Snakebite/Venomous, Respiratory, and Maternal crises) across rural panchayats and sub-centers.
3. **Facility Deficit & Action Proposal Automation**: Contrast rural outbreaks against local PHC equipment/specialist capabilities, computing transit times to equipped district hospitals and generating AI-backed government emergency sanction proposals.
4. **Supply Chain & Facility Readiness**: Monitor essential drug inventory against minimum buffer thresholds, cold chain vaccine storage temperature logs, 108 emergency ambulance dispatches, and bed availability.
5. **Open-Source Geospatial Independence**: Standardized on **OpenStreetMap (OSM)** and **Leaflet.js**, eliminating proprietary map licensing fees and API quotas.

---

## 2. High-Level System Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                       CLIENT TIER (Browser)                                       |
|                                                                                                   |
|  +-----------------------+   +-----------------------------------------------------------------+  |
|  |   Authentication      |   |                     Main Application Shell                      |  |
|  |   (LoginPage.tsx)     |   |                     (App.tsx / Header.tsx)                      |  |
|  |  • 4 Role Presets     |   +-----------------------------------------------------------------+  |
|  |  • Station Config     |                                   |                                    |
|  +-----------------------+               +-------------------+-------------------+                |
|                                          |                   |                   |                |
|                                          v                   v                   v                |
|  +------------------------+  +------------------------+  +---------------+  +------------------+  |
|  | 1. DashboardOverview   |  | 2. TeleConsultant      |  | 3. Inventory  |  | 4. High-Risk ANC |  |
|  |  • Sector KPIs         |  |  • Tele-Triage Queue   |  |  • Pharmacy   |  |  • Gestational   |  |
|  |  • ASHA Leaderboard    |  |  • DoctorConsultation  |  |  • Cold Chain |  |    Complications |  |
|  |  • Analytical Recharts |  |    Room (Audio/Video/  |  |  • Beds/108   |  |  • Emergency     |  |
|  |  • Sub-Center Health   |  |    Vitals/Rx/Referral) |  |    Ambulance  |  |    Tracking      |  |
|  +------------------------+  +------------------------+  +---------------+  +------------------+  |
|                                          |                                                        |
|                                          v                                                        |
|  +---------------------------------------------------------------------------------------------+  |
|  | 5. DiseaseFacilityGapMap.tsx & GisMap.tsx                                                   |  |
|  |  • OpenStreetMap Tile Layer Engine (OSM Raster / OpenTopoMap / Esri Satellite)              |  |
|  |  • Geospatial Vector Deficit Lines (Outbreak Zone -> Nearest District Hospital)             |  |
|  |  • AI Government Sanction Proposal Generator Modal                                          |  |
|  +---------------------------------------------------------------------------------------------+  |
+----------------------------------------------|----------------------------------------------------+
                                               | (HTTP / JSON REST API)
                                               v
+---------------------------------------------------------------------------------------------------+
|                                     BACKEND TIER (Node.js / Express)                              |
|                                              (server.ts)                                          |
|                                                                                                   |
|  [Port 3000 Ingress / 0.0.0.0 Host]                                                                |
|                                                                                                   |
|  +----------------------+  +-------------------------+  +--------------------------------------+  |
|  | GET /api/health      |  | POST /api/gemini/       |  | POST /api/gemini/                    |  |
|  | • Liveness & Ping    |  |      teleconsult-assist |  |      facility-gap-proposal           |  |
|  +----------------------+  +-------------------------+  +--------------------------------------+  |
|                                          |                                 |                      |
|                            +-------------+-------------+                   |                      |
|                            | POST /api/gemini/         |                   |                      |
|                            |      inventory-forecast   |                   |                      |
|                            +---------------------------+                   |                      |
|                                          |                                 |                      |
|                                          v                                 v                      |
|  +---------------------------------------------------------------------------------------------+  |
|  | Google GenAI SDK Client (@google/genai)                                                     |  |
|  | Model: gemini-2.5-flash (Secure Server-Side GEMINI_API_KEY with Zero Client Leakage)         |  |
|  | * Fallback Mode: Offline Clinical Rules Engine if API Key is not provisioned                |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                          |                                                        |
|  +---------------------------------------------------------------------------------------------+  |
|  | Production Static Asset Server / Vite Middleware Dev Pipeline                                |  |
|  | (Serves dist/index.html and optimized SPA bundles)                                          |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
                                               |
                                               v
+---------------------------------------------------------------------------------------------------+
|                                 EXTERNAL GIS & TILE SERVICES                                      |
|                                                                                                   |
|   • OpenStreetMap Public Tile CDN (https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png)            |
|   • OpenTopoMap Elevation & Contour Layer (https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png)      |
|   • Esri World Imagery Fallback Layer                                                             |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Technology Stack Matrix

| Architectural Layer | Technology / Library | Version / Specification | Rationale & Responsibility |
| :--- | :--- | :--- | :--- |
| **Runtime Environment** | Node.js | v20+ LTS | Scalable server runtime with native ECMAScript Modules (ESM). |
| **Application Framework**| React | 19.x | Component-driven, functional paradigm with hooks (`useState`, `useEffect`, `useMemo`). |
| **Type Safety** | TypeScript | 5.8+ | Strict compile-time typing for clinical safety, ABHA identifiers, and API payloads. |
| **Bundler & Dev Server**| Vite + tsx | Vite 6.2, tsx 4.19 | Sub-second HMR in dev; production static tree-shaking into `dist/`. |
| **Production Server** | Express | 4.21+ | Bundled to `dist/server.cjs` via `esbuild` to bypass runtime CJS/ESM path discrepancies. |
| **Styling & Theme** | Tailwind CSS | 4.x via `@tailwindcss/vite` | Modern utility CSS with high-contrast clinical palettes and clean borders. |
| **Mapping Engine** | Leaflet.js | 1.9.4 (`leaflet`, `@types/leaflet`) | Lightweight, hardware-accelerated interactive GIS mapping without proprietary fees. |
| **Tile Providers** | OpenStreetMap / OpenTopoMap | Open-source WGS84 Web Mercator | Standard OpenStreetMap tiles for rural and urban roads, topography, and boundaries. |
| **Data Visualization** | Recharts | 2.15+ | Responsive SVG rendering for epidemiologic curves, ANC risk breakdowns, and stock dials. |
| **Iconography** | Lucide React | 0.475+ | Unified, accessible SVG icons for clinical statuses, ambulances, vitals, and actions. |
| **AI Decision Engine** | Google GenAI SDK | `@google/genai` (Gemini 2.5 Flash) | Server-side structured medical triage, inventory forecasting, and government proposals. |
| **Delight / Micro-UX** | canvas-confetti | 1.9.4 | Positive reinforcement on consultation finalization, data sync, and login success. |

---

## 4. Frontend Architecture & Component Topology

The frontend is structured into discrete, highly decoupled functional modules located in `/src/components/`:

```
src/
├── App.tsx                     # Top-level state coordinator, auth gate, sync flash trigger
├── main.tsx                    # React DOM entry point
├── index.css                   # Tailwind CSS root import (@import "tailwindcss")
├── types.ts                    # Global TypeScript contracts and domain models
├── data/
│   └── mockData.ts             # Initial clinical datasets, sectors, medicines, and outbreak zones
└── components/
    ├── Header.tsx              # Application header, connectivity status HUD, sync button, user badge
    ├── LoginPage.tsx           # Clean authentication screen, role quick-access cards, terminal options
    ├── DashboardOverview.tsx   # Operational overview, sector filtering, quick teleconsult launcher
    ├── MetricCards.tsx         # Top-level KPI badges (Population, Compliance, Consults, Stock alerts)
    ├── AnalyticsCharts.tsx     # Disease distribution, monthly morbidity curves, maternal risk breakdown
    ├── AshaLeaderboard.tsx     # Frontline ASHA performance, visits completed, active patient caseload
    ├── TeleConsultant.tsx      # Triage queue manager, urgency filtering, consultation launchpad
    ├── DoctorConsultationRoom.tsx # Live video/audio telemedicine HUD, vitals monitor, AI Rx generator
    ├── MedicineFacilityUpdate.tsx # Pharmacy inventory, cold chain telemetry, 108 ambulance status, bed logs
    ├── HighRiskANCView.tsx     # Antenatal Care (ANC) tracking, pre-eclampsia flags, gestational tracking
    ├── DiseaseFacilityGapMap.tsx # Rural outbreak surveillance, facility deficit analysis, AI proposal modal
    ├── GisMap.tsx              # Sector geospatial mapper with Leaflet & OpenStreetMap
    └── AppLogo.tsx             # Standardized SVG vector mark for Arogya Vibhag / PHC Command
```

### 4.1 Authentication & Session Management (`LoginPage.tsx`)
- **Clean Canvas Design**: Renders on a clean slate background free of distracting top government strips or extraneous sidebars.
- **Role-Based Fast Presets**:
  1. *Dr. Ananya Sharma* — Medical Officer In-Charge (PHC Shirur).
  2. *Dr. Rajesh Sharma* — Tele-Consultant Specialist (MD Medicine).
  3. *Sunita Patil* — ASHA Field Supervisor (Chandanagiri Block).
  4. *Dr. Vikram Gaikwad* — District Epidemiologist & Surveillance Officer.
- **Persistence Strategy**: Sessions persist in `localStorage` (`phc_auth_user`). When authenticated, the session context propagates to the `Header`, presenting the user's name, role, and a one-click **Sign Out** button.

### 4.2 Tele-Consultation Gateway & Virtual Room (`TeleConsultant.tsx` & `DoctorConsultationRoom.tsx`)
- **Triage Queue**: Sorts patients by clinical urgency (`Critical`, `High`, `Medium`, `Routine`) across specialties (`OB/GYN & Maternal`, `Pediatrics`, `General Physician`, `Cardiology`).
- **Live Doctor HUD**:
  - Encrypted video feed simulation with camera/microphone hardware toggles.
  - Live patient vitals telemetry (BP, HR, SpO2, Temperature, Hemoglobin, Blood Sugar) with abnormal value color-coding (e.g., BP ≥ 140/90 mmHg triggers red alert).
  - ABHA ID (Ayushman Bharat Digital Health Account) verification badge.
- **AI Clinical Decision Support**: Calls `/api/gemini/teleconsult-assist` with the patient's presentation and vitals to generate differential diagnoses and recommended actions.
- **Integrated Prescription & Referral**:
  - Structured e-prescription builder (Drug, Dosage, Duration, Instructions).
  - 108 Emergency Ambulance dispatch modal for immediate tertiary care transfer.

### 4.3 Geospatial Outbreak & Facility Deficit Engine (`DiseaseFacilityGapMap.tsx`)
- **Core Problem Solved**: Rural populations frequently suffer from severe outbreaks (e.g., Snakebite envenomation, Dengue hemorrhagic fever, Leptospirosis, Severe Preeclampsia) in areas where the local Sub-Center or PHC lacks life-saving equipment (antivenom, platelet centrifuges, blood storage, or ICUs).
- **Interactive Visual Mapping**:
  - Renders red/amber pulsating outbreak circles over affected rural areas.
  - Pinpoints nearest fully equipped tertiary/district hospitals.
  - Draws dashed transit vector lines indicating the exact distance (km) and estimated road travel time (minutes).
- **AI Government Action Proposal**: Integrates with `/api/gemini/facility-gap-proposal` to formulate an official infrastructure sanction plan (mobile medical units, temporary field wards, equipment procurement, budget in INR) suitable for district collectors and state cabinet approval.

### 4.4 Pharmacy Supply Chain & Facility HUD (`MedicineFacilityUpdate.tsx`)
- **Inventory Telemetry**: Tracks drug stock, batch numbers, dosage forms, and expiry dates.
- **Deficit Thresholds**: Flags medications falling below the `minBufferThreshold` (e.g., Iron Folic Acid tablets, ORS, Paracetamol syrup, Anti-Rabies Vaccine).
- **Cold Chain Watchdog**: Displays ILR (Ice Lined Refrigerator) temperature (2°C – 8°C) and power source (Main Grid, Generator, Solar).
- **AI Stock Forecast**: Calls `/api/gemini/inventory-forecast` to adjust stock buffer recommendations in response to current outbreak spikes.

### 4.5 Antenatal Care (ANC) High-Risk Surveillance (`HighRiskANCView.tsx`)
- Focuses on reducing Maternal Mortality Ratio (MMR) and Infant Mortality Rate (IMR).
- Tracks gestational age, obstetric risk factors (Severe Pre-eclampsia, Severe Anemia Hb < 7.0 g/dL, Gestational Diabetes), and last visited dates by ASHA workers.
- Direct "Initiate Doctor Review" button creates an instantaneous high-priority teleconsultation record.

---

## 5. Geospatial & Mapping Architecture (OpenStreetMap Stack)

To ensure sovereignty, uninterrupted reliability, and zero third-party licensing overhead, the mapping infrastructure exclusively utilizes **OpenStreetMap** raster layers through **Leaflet.js**.

### 5.1 Tile Server Topography

```typescript
// OpenStreetMap Tile Layer Configurations in GisMap.tsx & DiseaseFacilityGapMap.tsx
const getTileLayerUrl = (mapLayer: 'roadmap' | 'satellite' | 'terrain') => {
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
```

### 5.2 Leaflet Vector Elements
1. **Custom Pulse Markers**: Outbreak locations use custom HTML `divIcon` classes with CSS pulsing wave animations calibrated to case volume and severity.
2. **Geodesic Transit Vectors**: `L.polyline` connects the deficit rural outbreak point to the nearest equipped district hospital, styled with dashed red lines to highlight transit vulnerability.
3. **Interactive Popups**: Rich popups display case metrics, local facility deficit summaries, and transit risks without triggering full-page navigations.

---

## 6. Backend Architecture & REST API Specifications

The server layer is housed in `server.ts`. It provides both dev middleware execution and production static bundling while exposing secure, server-side Gemini AI endpoints.

### 6.1 Server Topography
- **Host & Port**: Hardcoded to `0.0.0.0:3000` to satisfy Cloud Run and reverse proxy ingress requirements.
- **Lazy SDK Client**: The `@google/genai` client is initialized lazily upon first request, preventing server crashes if the `GEMINI_API_KEY` is not present at startup.
- **Fail-Safe Fallbacks**: If `GEMINI_API_KEY` is unset or an API call fails, all endpoints return validated medical guidance derived from clinical protocols, guaranteeing 100% uptime.

### 6.2 Endpoint Catalog

#### 1. System Health Check
- **Route**: `GET /api/health`
- **Purpose**: Container liveness probe and health monitoring.
- **Response**:
```json
{
  "status": "ok",
  "time": "2026-09-08T08:45:00.000Z"
}
```

#### 2. Clinical Teleconsultation Assistant
- **Route**: `POST /api/gemini/teleconsult-assist`
- **Model**: `gemini-2.5-flash` with `responseMimeType: "application/json"`
- **Request Body**:
```json
{
  "patientName": "Radha Kulkarni",
  "age": 24,
  "gender": "Female",
  "symptoms": "Severe headache, blurred vision, elevated blood pressure",
  "vitals": {
    "bloodPressure": "154/100",
    "heartRate": 86,
    "spo2": 98,
    "temperature": 37.1,
    "hemoglobin": 8.4
  },
  "medicalHistory": "Primigravida, 32 weeks gestation",
  "pregnancyStatus": "Pregnant (3rd Trimester)"
}
```
- **Response**:
```json
{
  "differentialDiagnosis": [
    "Severe Pre-eclampsia with impending eclampsia warning",
    "Gestational Hypertension with microalbuminuria"
  ],
  "recommendedActions": [
    "Immediate bedside blood pressure re-measurement in left lateral position",
    "Stat administration of IV Magnesium Sulfate loading dose as per NHM protocol",
    "Urgent 108 ambulance transfer to District Hospital FRU"
  ],
  "suggestedMedications": [
    { "name": "Labetalol 100mg", "dosage": "1 tablet stat (as per MO direction)", "duration": "Single dose" },
    { "name": "Magnesium Sulfate (50%)", "dosage": "4g IV + 10g IM loading dose", "duration": "Immediate stat" }
  ],
  "urgencyLevel": "Critical",
  "doctorNotesSummary": "High-risk 32-week ANC case presenting with pre-eclamptic triad. Immediate transfer recommended."
}
```

#### 3. Pharmacy Stock & Outbreak Forecaster
- **Route**: `POST /api/gemini/inventory-forecast`
- **Model**: `gemini-2.5-flash`
- **Request Body**: Current medicine list and active disease outbreak counts.
- **Response**:
```json
{
  "recommendations": [
    "Increase Oral Rehydration Salts (ORS) buffer by +45% due to 38 active Gastroenteritis cases.",
    "Order emergency batch of Doxycycline and Paracetamol for Kalyanpur sector."
  ],
  "criticalShortageAlerts": [
    "ORS Packets",
    "IV Ringer Lactate 500ml"
  ]
}
```

#### 4. Government Action & Infrastructure Gap Proposal
- **Route**: `POST /api/gemini/facility-gap-proposal`
- **Model**: `gemini-2.5-flash`
- **Request Body**: Outbreak zone entity containing population at risk, deficit summary, distance to hospital, and transit time.
- **Response**:
```json
{
  "executiveSummary": "URGENT INTERVENTION: Dengue Outbreak in Kalyanpur Block requires immediate specialized platelet and pediatric care.",
  "immediateMeasures": [
    "Deploy 108 Mobile Medical Unit equipped with hematology analyzer within 12 hours.",
    "Establish 20-bed temporary hydration camp at Kalyanpur Gram Panchayat Hall."
  ],
  "longTermInfrastructurePlan": "Sanction upgrade of Kalyanpur Primary Health Center to 24x7 First Referral Unit with blood storage center.",
  "budgetBreakdown": [
    { "item": "Mobile Unit & Field Triage Camp", "costINR": "₹12,00,000" },
    { "item": "Point-of-Care Platelet Counter & Centrifuge", "costINR": "₹8,50,000" },
    { "item": "Emergency Fluid & Antipyretic Reserves", "costINR": "₹3,50,000" }
  ],
  "totalSanctionEstimateINR": "₹24.00 Lakhs",
  "urgencyClassification": "Immediate District Magistrate & State Health Sanction"
}
```

---

## 7. Data Architecture & Domain Contracts

All domain structures are strictly typed in `src/types.ts`:

```typescript
// Key Data Model Entities
export type TabType = 'dashboard' | 'teleconsult' | 'inventory' | 'highrisk' | 'disease-gap';

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  designation: string;
  employeeCode: string;
  district: string;
  phcName: string;
  email: string;
  initials: string;
}

export interface DiseaseOutbreakZone {
  id: string;
  ruralAreaName: string;
  blockName: string;
  district: string;
  coordinates: { lat: number; lng: number };
  populationAtRisk: number;
  diseaseName: string;
  diseaseCategory: 'Vector-Borne' | 'Water-Borne' | 'Maternal & Obstetric Crisis' | 'Zoonotic / Venomous' | 'Genetic / Blood Disorder' | 'Viral & Respiratory';
  activeCasesCount: number;
  severityLevel: 'Critical Outbreak' | 'High Surge' | 'Moderate Cluster' | 'Contained';
  requiredFacilityType: string;
  isFacilityAvailableLocally: boolean;
  localFacilityName: string;
  deficitSummary: string;
  nearestEquippedHospitalName: string;
  nearestHospitalCoordinates: { lat: number; lng: number };
  nearestHospitalDistanceKm: number;
  travelTransitTimeMinutes: number;
  governmentActionStatus: 'Action Required (Deficit Escalated)' | 'Mobile Unit Sanctioned' | 'Emergency Allocation Approved' | 'Facility Sufficient';
  sanctionBudgetEstimateINR: string;
}

export interface TeleconsultationRequest {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  patientPhone: string;
  abhaId?: string;
  village: string;
  source: 'ASHA Field Worker' | 'Direct Patient' | 'Sub-Center ANM';
  urgency: 'Critical' | 'High' | 'Medium' | 'Routine';
  specialty: 'OB/GYN & Maternal' | 'Pediatrics' | 'General Physician' | 'Cardiology / Hypertension';
  symptoms: string;
  vitals: {
    bloodPressure?: string;
    heartRate?: number;
    spo2?: number;
    temperature?: number;
    hemoglobin?: number;
    bloodSugar?: number;
  };
  doctorAssigned: string;
  status: 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled';
  doctorNotes?: string;
  prescriptions?: {
    medicineName: string;
    dosage: string;
    duration: string;
    instructions: string;
  }[];
  referralDetails?: string;
}
```

---

## 8. Security, Privacy & Healthcare Compliance

1. **Zero-Leak API Key Security**:
   - `GEMINI_API_KEY` is exclusively read in `server.ts` via `process.env.GEMINI_API_KEY`.
   - Never prefixed with `VITE_`, preventing exposure in client JavaScript bundles.
2. **Patient Data Privacy & ABHA Compliance**:
   - Patient phone numbers and names are masked or handled through local state representations without unencrypted third-party logging.
   - ABHA 14-digit health accounts are validated against standard Indian National Health Stack schemas (`XX-XXXX-XXXX-XXXX`).
3. **Session Integrity**:
   - Authentication tokens and credentials can be cleared instantaneously using the header's Sign Out button, purging `localStorage` keys (`phc_auth_user`).

---

## 9. Build, Deployment & Runtime Topology

### 9.1 Development Pipeline
- **Command**: `npm run dev`
- **Process**: Starts `tsx server.ts`.
- **Behavior**: Express boots on `http://0.0.0.0:3000` and embeds Vite middleware in SPA mode, providing lightning-fast Hot Module Replacement (HMR) and serving client code seamlessly alongside backend API endpoints.

### 9.2 Production Build Pipeline
- **Command**: `npm run build`
- **Execution Chain**:
  1. `vite build`: Compiles and tree-shakes React, Leaflet, Recharts, and Tailwind assets into `dist/`.
  2. `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`:
     - Compiles the backend server into a single standalone CommonJS bundle (`dist/server.cjs`).
     - Marks external npm packages (e.g., `express`, `@google/genai`) as external.
     - Resolves ES Module relative imports cleanly at build time to prevent Node.js runtime resolution issues.

### 9.3 Production Execution
- **Command**: `npm start` -> `node dist/server.cjs`
- Serves pre-built static assets from `dist/` and mounts all API handlers on port 3000.

---

## 10. Summary Verification Matrix

| Quality Dimension | Standard Met | Validation Method |
| :--- | :--- | :--- |
| **TypeScript Type Safety** | 100% strict compliance | Verified via `tsc --noEmit` (`lint_applet`). |
| **Production Compilation** | Successful static + server bundle | Verified via `npm run build` (`compile_applet`). |
| **Open Source GIS Mapping** | Pure OpenStreetMap (No Google Maps API dependency) | Leaflet engine configured with OSM raster tiles. |
| **Design Consistency** | Light clinical aesthetic | Slate neutral canvas, high-contrast text, 44px+ touch targets. |
| **Offline Resilience** | Full operational fallback | Server endpoints serve structured protocol responses if offline. |
