export type TabType = 'dashboard' | 'teleconsult' | 'inventory' | 'referrals' | 'disease-gap' | 'highrisk';

export interface DiseaseOutbreakZone {
  id: string;
  ruralAreaName: string;
  blockName: string;
  district: string;
  cityHub: string;
  coordinates: { lat: number; lng: number };
  populationAtRisk: number;
  
  // Disease Spreading Information
  diseaseName: string;
  diseaseCategory: 'Vector-Borne' | 'Water-Borne' | 'Maternal & Obstetric Crisis' | 'Zoonotic / Venomous' | 'Genetic / Blood Disorder' | 'Viral & Respiratory';
  activeCasesCount: number;
  weeklyGrowthRatePercent: number;
  attackRatePerThousand: number;
  severityLevel: 'Critical Outbreak' | 'High Surge' | 'Moderate Cluster' | 'Contained';
  outbreakSource: string;
  primarySymptoms: string[];
  
  // Required Facility / Medical Treatment Capability to Cure this Disease
  requiredFacilityType: string;
  requiredEquipment: string[];
  requiredSpecialist: string;
  requiredLifeSavingDrugs: string[];
  
  // Local Availability Status in that rural area
  isFacilityAvailableLocally: boolean;
  localFacilityName: string;
  localFacilityCapacityStatus: 'Not Available / Critical Deficit' | 'Partially Equipped (Deficit)' | 'Fully Operational & Equipped';
  deficitSummary: string;
  
  // Gap & Distance to nearest treatment center if not available
  nearestEquippedHospitalName: string;
  nearestHospitalCoordinates: { lat: number; lng: number };
  nearestHospitalDistanceKm: number;
  travelTransitTimeMinutes: number;
  transitRiskAssessment: string;
  
  // Government Alert & Escalation Details
  governmentActionStatus: 'Action Required (Deficit Escalated)' | 'Mobile Unit Sanctioned' | 'Emergency Allocation Approved' | 'Facility Sufficient';
  governmentAlertLevel: 'Red - Urgent State Action' | 'Amber - District Collector Alert' | 'Green - Standard Monitoring';
  governmentRecommendation: string;
  sanctionBudgetEstimateINR: string;
  affectedPanchayats: string[];
  reportedByAshaOrMo: string;
  lastUpdated: string;
}

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
  avatarUrl?: string;
}

export type ReferralStatus = 'Created' | 'Accepted' | 'Reached' | 'Consultation' | 'Completed';
export type ReferralPriority = 'Critical' | 'High' | 'Medium' | 'Routine';
export type FollowUpStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Missed' | 'Overdue';
export type ReferralCategory = 'Maternal & High-Risk ANC' | 'Child & Pediatric' | 'Chronic Care' | 'Emergency & Trauma' | 'General & Specialty';

export interface ReferralStatusStep {
  status: ReferralStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface ReferralItem {
  id: string; // e.g. 'SEVA-PAT-1024'
  familyId: string; // e.g. 'FAM-MH-9481'
  patientName: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  patientPhone: string;
  village: string;
  sector: string;
  category: ReferralCategory;
  isHighRisk: boolean;
  highRiskReason?: string;
  
  // Referring Worker & Facility
  referringWorkerName: string; // e.g., 'Sunita Patil (ASHA)'
  referringWorkerRole: 'ASHA' | 'ANM' | 'Community Health Officer';
  referringWorkerPhone: string;
  referringFacility: string; // e.g., 'Chandanagiri Health Sub-Center'
  
  // Referred Hospital & Department
  referredHospital: string; // e.g., 'District Hospital', 'Rural Hospital Shirur'
  referredDepartment: string; // e.g., 'Obstetrics & High-Risk Pregnancy', 'Pediatrics'
  
  // Clinical Context & Priority
  reasonForReferral: string;
  clinicalNotes: string;
  priority: ReferralPriority;
  
  // Dates & Status Tracking
  referralDate: string; // e.g. '08 Sep'
  fullReferralDate: string; // e.g. '08 Sep 2026, 09:30 AM'
  status: ReferralStatus; // Created -> Accepted -> Reached -> Consultation -> Completed
  statusTimeline: ReferralStatusStep[];
  
  // Transit & Delay Identification
  hasReached: boolean;
  isDelayed: boolean;
  delayedHours?: number;
  delayedReason?: string;
  completionTimeHours?: number; // e.g. 4.2 hrs
  
  // Follow-up Management
  followUpDate: string; // e.g. '12 Sep'
  fullFollowUpDate: string; // e.g. '12 Sep 2026'
  followUpStatus: FollowUpStatus;
  followUpNotes?: string;
  remindersSentCount: number;
  lastReminderSentAt?: string;
}
