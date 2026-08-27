export type TabType = 'dashboard' | 'teleconsult' | 'inventory' | 'highrisk';

export interface SectorData {
  id: string;
  name: string;
  sectorName: string;
  city?: string;
  district?: string;
  complianceIndex: number;
  zoneStatus: string;
  zoneStatusColor: 'red' | 'orange' | 'green' | 'blue';
  highRiskAncCases: number;
  assignedCitizens: number;
  designatedAsha: string;
  ashaPhone: string;
  alertMessage: string;
  coordinates: { lat: number; lng: number };
  activeOutbreak?: string;
  vaccineGapPercent?: number;
}

export interface AshaWorker {
  id: string;
  initial: string;
  name: string;
  sector: string;
  status: 'Online' | 'Offline';
  activeCases: number;
  performanceScore: number;
  visitsComplete: number;
  visitsPending: number;
  assignedRetirement: string;
  phone: string;
  lastActive: string;
}

export interface TeleconsultationRequest {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  patientPhone: string;
  abhaId?: string;
  village: string;
  sector: string;
  source: 'ASHA Field Worker' | 'Direct Patient' | 'Sub-Center ANM';
  bookedBy: string;
  requestTime: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Routine';
  specialty: 'OB/GYN & Maternal' | 'Pediatrics' | 'General Physician' | 'Cardiology / Hypertension';
  symptoms: string;
  pregnancyStatus?: string;
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

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Maternal Health' | 'Antibiotics & Anti-infectives' | 'Pediatric Care' | 'Emergency & IV' | 'Vaccines & Cold Chain' | 'Chronic Care';
  unit: string;
  currentStock: number;
  minBufferThreshold: number;
  batchNumber: string;
  expiryDate: string;
  dosageForm: 'Tablets' | 'Syrup' | 'Injectable' | 'Capsules' | 'Packets' | 'Vials';
  lastUpdated: string;
}

export interface FacilityStatus {
  hospitalName: string;
  phcCode: string;
  lastUpdated: string;
  beds: {
    generalWard: { total: number; occupied: number };
    maternityWard: { total: number; occupied: number };
    emergencyTriage: { total: number; occupied: number };
    neonatalRadiantWarmers: { total: number; occupied: number };
  };
  equipment: {
    name: string;
    category: string;
    isOperational: boolean;
    details: string;
  }[];
  coldChainTemp: number; // in Celsius
  coldChainPowerStatus: 'Main Grid' | 'Generator Backup' | 'Solar Power';
  ambulance108Status: {
    totalUnits: number;
    availableUnits: number;
    activeDispatches: {
      unitId: string;
      destination: string;
      etaMinutes: number;
      assignedCase: string;
    }[];
  };
  staffOnDuty: {
    role: string;
    name: string;
    contact: string;
    shift: string;
  }[];
  utilities: {
    cleanWaterSupply: boolean;
    backupGeneratorFuelPercent: number;
    internetBandwidthMbps: number;
    telemedicineConnectivity: 'Excellent' | 'Good' | 'Fair' | 'Offline';
  };
}

export interface HighRiskPatient {
  id: string;
  name: string;
  age: number;
  village: string;
  sector: string;
  gestationalWeek?: number;
  riskCategory: 'Severe Pre-eclampsia' | 'Severe Anemia' | 'Gestational Diabetes' | 'Malnutrition (SAM)' | 'High Fever Spike';
  urgency: 'Critical' | 'High' | 'Moderate';
  vitals: {
    bp: string;
    hb: number;
    sugar: number;
  };
  ashaName: string;
  lastVisitDate: string;
  recommendedAction: string;
}
