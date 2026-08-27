# PHC Medicine Inventory & Facility Readiness Subsystem

## 1. Overview & Operational Scope

The **Medicine & Facility** subsystem provides real-time logistics, pharmaceutical inventory tracking, and operational readiness monitoring for Primary Health Centers (PHCs) and affiliated Community Health Centers (CHCs).

It enables PHC Pharmacists, Medical Officers In-Charge, and District Health Officers to:
1. Maintain accurate, batch-wise drug and vaccine stockpiles.
2. Monitor real-time hospital bed occupancy across clinical wards.
3. Supervise cold chain integrity for vaccines and temperature-sensitive biologicals.
4. Track 108 Emergency Ambulance dispatches and road transit ETAs.
5. Leverage **Gemini AI** to forecast drug stockout risks based on localized epidemiological outbreaks.

---

## 2. Essential Drug Stock Registry & Inventory

### 2.1 Medicine Categorization
The registry tracks pharmaceutical items across standard National Health Mission (NHM) categories:
- **Maternal Health**: IFA Tablets, Calcium + Vit D3, Oxytocin Injection IP, Magnesium Sulfate 50% (Preeclampsia management).
- **Pediatric Care**: Zinc Sulfate 20mg dispersible tablets, ORS Sachets (WHO formula), Vitamin A solutions, Paracetamol pediatric drops.
- **Emergency & IV**: Paracetamol 500mg, Ringer's Lactate, Normal Saline, Dextrose 5%, Epinephrine.
- **Antibiotics & Anti-infectives**: Amoxicillin, Azithromycin, Metronidazole, Cotrimoxazole.
- **Vaccines & Cold Chain**: BCG, Pentavalent, Rotavirus, Measles-Rubella (MR), Anti-Rabies Vaccine (ARV), Td.
- **Chronic Care**: Metformin HCl 500mg, Amlodipine 5mg, Enalapril, Telmisartan.

### 2.2 Inventory Attributes
Each pharmaceutical record tracks:
- `id`: Unique inventory identifier (e.g. `MED-001`).
- `name` & `genericName`: Brand and pharmacological generic compound.
- `category`: Therapeutic clinical classification.
- `unit`: Packaging denomination (e.g. *Strips (10 tabs)*, *Vials (Cold Chain 2-8°C)*, *Ampoules*).
- `currentStock`: Real-time on-hand count in the PHC dispensary.
- `minBufferThreshold`: Minimum safety buffer level before automatic re-order alerts trigger.
- `batchNumber`: Manufacturer batch tracking code.
- `expiryDate`: ISO date for shelf-life management and FEFO (First-Expired, First-Out) rotation.
- `dosageForm`: `Tablets`, `Capsules`, `Syrup`, `Injectable`, `Vials`, `Packets`.
- `lastUpdated`: Audit timestamp of the most recent stock transaction.

---

## 3. Stock Operations & Alert System

```
[Stock Level Status]
  ├── Normal (currentStock >= minBufferThreshold)  ──> Green Badge
  ├── Low Buffer (currentStock < minBufferThreshold)──> Amber Warning Badge
  └── Critical / Zero Stock (currentStock == 0)    ──> Red Emergency Alert
```

### 3.1 Dynamic Stock Adjustment
- **Direct Input & Step Controls**: Pharmacists can rapidly increment/decrement stock during daily dispensing or batch receipt.
- **New Batch Induction**: Interactive modal form to register new shipments with batch number, manufacturer details, and expiry verification.
- **Search & Category Filtering**: Instant multi-term search covering brand names, generic formulations, and batch IDs.

---

## 4. Gemini AI Inventory & Outbreak-Driven Forecasting

The subsystem utilizes **Gemini AI** (`/api/gemini/inventory-forecast`) to correlate live disease outbreaks and high-risk pregnancy clusters with pharmaceutical consumption trends, preventing critical stockouts.

### 4.1 Forecasting API Specification
- **Method**: `POST`
- **Route**: `/api/gemini/inventory-forecast`
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "medicines": [
    { "name": "IFA Tablets (Iron Folic Acid 100mg/0.5mg)", "stock": 480, "min": 800 },
    { "name": "ORS Packets (Oral Rehydration Salts)", "stock": 310, "min": 500 },
    { "name": "Magnesium Sulfate Injection 50%", "stock": 28, "min": 40 },
    { "name": "Paracetamol Tablets IP 500mg", "stock": 2400, "min": 1000 }
  ],
  "recentDiseaseTrend": {
    "dengueCases": 14,
    "highRiskAncCases": 8,
    "diarrheaClusterCases": 11
  }
}
```

#### Response Payload
```json
{
  "recommendations": [
    "Immediate emergency indent: IFA Tablet stock (480) is below safety buffer (800) with 8 active high-risk maternal anemia cases in Wagholi sector.",
    "Stock up ORS and Zinc dispersible tablets by +40% to combat active diarrheal cluster near Otur canal.",
    "Replenish Magnesium Sulfate ampoules immediately to maintain obstetric eclampsia emergency readiness.",
    "Verify Paracetamol and IV infusion sets buffer for Paud vector-borne Dengue surveillance."
  ],
  "criticalShortageAlerts": [
    "IFA Tablets (Iron Folic Acid 100mg/0.5mg)",
    "ORS Packets (Oral Rehydration Salts)",
    "Magnesium Sulfate Injection 50%"
  ]
}
```

---

## 5. Facility Status & Infrastructure Readiness

### 5.1 Hospital Bed Capacity Management
Tracks real-time bed availability across four dedicated wards:
1. **General Inpatient Ward**: Total beds vs. current occupancy.
2. **Maternity & Labour Ward**: Dedicated delivery and post-partum recovery beds.
3. **Emergency Triage Ward**: Acute stabilization beds equipped with oxygen ports.
4. **Neonatal Radiant Warmers**: Warmers for Home-Based Newborn Care (HBNC) and low birth-weight stabilization.

### 5.2 Cold Chain Equipment & Biological Integrity
- **Ice-Lined Refrigerator (ILR 140L)**: Real-time digital data logger temperature monitoring.
  - **Acceptable Operating Range**: `+2.0°C` to `+8.0°C`.
  - **Critical Breach Alert**: Auto-triggers alert if temperature falls outside the acceptable threshold for > 15 minutes.
- **Power Grid & Backup Generator**: Monitored power source with diesel generator backup capacity (percentage fuel remaining).

### 5.3 108 Emergency Ambulance Logistics
- **Fleet Availability**: Active units available at PHC bay vs. units dispatched on field calls.
- **Live Dispatches**: Tracks assigned patient, pick-up sector, destination medical facility, and real-time transit ETA.

### 5.4 Staff On-Duty & Medical Roster
Maintains contact and duty shifts for on-premise personnel:
- Medical Officer In-Charge (MBBS, MD)
- Consultant Pediatrician (DCH)
- Senior Staff Nurses (Labour & Emergency)
- Chief Pharmacist (D.Pharm / B.Pharm)
- Laboratory Technicians (DMLT)

---

## 6. TypeScript Data Interfaces

```typescript
export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Maternal Health' | 'Pediatric Care' | 'Emergency & IV' | 'Antibiotics & Anti-infectives' | 'Vaccines & Cold Chain' | 'Chronic Care';
  unit: string;
  currentStock: number;
  minBufferThreshold: number;
  batchNumber: string;
  expiryDate: string;
  dosageForm: 'Tablets' | 'Capsules' | 'Syrup' | 'Injectable' | 'Vials' | 'Packets';
  lastUpdated: string;
}

export interface BedCapacity {
  total: number;
  occupied: number;
}

export interface EquipmentStatus {
  name: string;
  category: string;
  isOperational: boolean;
  details: string;
}

export interface AmbulanceDispatch {
  unitId: string;
  destination: string;
  etaMinutes: number;
  assignedCase: string;
}

export interface StaffOnDuty {
  role: string;
  name: string;
  contact: string;
  shift: string;
}

export interface FacilityStatus {
  hospitalName: string;
  phcCode: string;
  lastUpdated: string;
  beds: {
    generalWard: BedCapacity;
    maternityWard: BedCapacity;
    emergencyTriage: BedCapacity;
    neonatalRadiantWarmers: BedCapacity;
  };
  equipment: EquipmentStatus[];
  coldChainTemp: number; // in Celsius (e.g. 4.2)
  coldChainPowerStatus: 'Main Grid' | 'Generator Backup' | 'Battery Inverter';
  ambulance108Status: {
    totalUnits: number;
    availableUnits: number;
    activeDispatches: AmbulanceDispatch[];
  };
  staffOnDuty: StaffOnDuty[];
  utilities: {
    cleanWaterSupply: boolean;
    backupGeneratorFuelPercent: number;
    internetBandwidthMbps: number;
    telemedicineConnectivity: 'Excellent' | 'Fair' | 'Degraded';
  };
}
```

---

## 7. Operational Standards & Protocol Compliance

1. **FEFO Protocol (First-Expired, First-Out)**: Dispensary staff must prioritize dispensing batches with nearest expiry dates to reduce biomedical waste.
2. **Daily Cold Chain Verification**: Temperature logs must be verified twice daily (08:00 AM and 04:00 PM) in accordance with the National Cold Chain Guidelines.
3. **Emergency Indenting Trigger**: Automated indent proposals are created whenever any Maternal or Pediatric essential drug remains below the 20% buffer mark for more than 48 hours.
