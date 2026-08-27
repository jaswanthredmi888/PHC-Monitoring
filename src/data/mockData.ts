import { SectorData, AshaWorker, TeleconsultationRequest, MedicineItem, FacilityStatus, HighRiskPatient } from '../types';

export interface MaharashtraCityHub {
  id: string;
  name: string;
  district: string;
  center: { lat: number; lng: number };
  zoom: number;
  description: string;
}

export const MAHARASHTRA_CITIES: MaharashtraCityHub[] = [
  {
    id: 'pune',
    name: 'Pune District',
    district: 'Pune Rural & Semi-Urban Circle',
    center: { lat: 18.5204, lng: 73.8567 },
    zoom: 10,
    description: 'Haveli, Mulshi, Baramati, Junnar & Khed PHC Circles'
  },
  {
    id: 'nashik',
    name: 'Nashik District',
    district: 'North Maharashtra Health Zone',
    center: { lat: 19.9975, lng: 73.7898 },
    zoom: 10,
    description: 'Trimbakeshwar, Igatpuri, Sinnar & Dindori Tribal PHCs'
  },
  {
    id: 'nagpur',
    name: 'Nagpur District',
    district: 'Vidarbha Regional Health Circle',
    center: { lat: 21.1458, lng: 79.0882 },
    zoom: 10,
    description: 'Hingna, Saoner, Umred & Kamptee Rural PHCs'
  },
  {
    id: 'chhatrapati-sambhajinagar',
    name: 'Chhatrapati Sambhajinagar',
    district: 'Marathwada Central Hub',
    center: { lat: 19.8762, lng: 75.3433 },
    zoom: 10,
    description: 'Paithan, Gangapur, Khuldabad & Kannad PHCs'
  },
  {
    id: 'satara',
    name: 'Satara District',
    district: 'Western Maharashtra Ghats Hub',
    center: { lat: 17.6805, lng: 74.0183 },
    zoom: 10,
    description: 'Wai, Karad, Mahabaleshwar & Koregaon PHCs'
  }
];

export const INITIAL_SECTORS: SectorData[] = [
  {
    id: 'haveli-block',
    name: 'Haveli Block (Wagholi PHC)',
    sectorName: 'WAGHOLI - HAVELI SECTOR',
    city: 'pune',
    district: 'Pune District',
    complianceIndex: 72,
    zoneStatus: 'High Pregnancy Risk',
    zoneStatusColor: 'orange',
    highRiskAncCases: 8,
    assignedCitizens: 420,
    designatedAsha: 'Sunita Patil',
    ashaPhone: '+91 98221 44510',
    alertMessage: 'Gestational Alert: 8 High-risk maternal preeclampsia & severe anemia cases under active tracking in Wagholi rural cluster.',
    coordinates: { lat: 18.5793, lng: 73.9814 },
    activeOutbreak: 'Preeclampsia Cluster (8 cases)',
    vaccineGapPercent: 4.2
  },
  {
    id: 'mulshi-block',
    name: 'Mulshi Block (Paud PHC)',
    sectorName: 'PAUD - MULSHI SECTOR',
    city: 'pune',
    district: 'Pune District',
    complianceIndex: 81,
    zoneStatus: 'Dengue & Fever Cluster',
    zoneStatusColor: 'red',
    highRiskAncCases: 4,
    assignedCitizens: 380,
    designatedAsha: 'Vandana Shinde',
    ashaPhone: '+91 94220 88321',
    alertMessage: 'Vector-borne Alert: 14 symptomatic dengue & viral fever cases near Mulshi catchment area undergoing house-to-house fogging.',
    coordinates: { lat: 18.5314, lng: 73.6140 },
    activeOutbreak: 'Dengue Active (14 cases)',
    vaccineGapPercent: 2.5
  },
  {
    id: 'baramati-block',
    name: 'Baramati Block (Malegaon PHC)',
    sectorName: 'MALEGAON - BARAMATI SECTOR',
    city: 'pune',
    district: 'Pune District',
    complianceIndex: 95,
    zoneStatus: 'High Vaccine Compliance',
    zoneStatusColor: 'green',
    highRiskAncCases: 2,
    assignedCitizens: 510,
    designatedAsha: 'Archana Deshmukh',
    ashaPhone: '+91 97650 44219',
    alertMessage: 'Optimal Coverage: 98.4% child immunization achieved for Pentavalent, Rotavirus, and MR-1 booster doses.',
    coordinates: { lat: 18.1517, lng: 74.5772 },
    activeOutbreak: 'None',
    vaccineGapPercent: 1.1
  },
  {
    id: 'junnar-block',
    name: 'Junnar Block (Otur Tribal PHC)',
    sectorName: 'OTUR - JUNNAR SECTOR',
    city: 'pune',
    district: 'Pune District',
    complianceIndex: 69,
    zoneStatus: 'Diarrheal Cluster Watch',
    zoneStatusColor: 'blue',
    highRiskAncCases: 6,
    assignedCitizens: 340,
    designatedAsha: 'Kavita Gaikwad',
    ashaPhone: '+91 96041 55301',
    alertMessage: 'Water Sanitation Alert: 11 Acute Diarrhea & gastroenteritis cases detected near Kukadi river irrigation canal.',
    coordinates: { lat: 19.2558, lng: 73.9140 },
    activeOutbreak: 'Gastroenteritis Cluster (11 cases)',
    vaccineGapPercent: 5.8
  },
  {
    id: 'khed-block',
    name: 'Khed Block (Chakan PHC)',
    sectorName: 'CHAKAN - KHED SECTOR',
    city: 'pune',
    district: 'Pune District',
    complianceIndex: 88,
    zoneStatus: 'Active Surveillance',
    zoneStatusColor: 'green',
    highRiskAncCases: 5,
    assignedCitizens: 460,
    designatedAsha: 'Savitri Jadhav',
    ashaPhone: '+91 98902 33411',
    alertMessage: 'Industrial Corridor ANC: Weekly mobile clinic operational for migrant labor colonies and industrial settlements.',
    coordinates: { lat: 18.7606, lng: 73.8596 },
    activeOutbreak: 'None',
    vaccineGapPercent: 3.0
  },
  {
    id: 'bhor-block',
    name: 'Bhor Block (Nasrapur PHC)',
    sectorName: 'NASRAPUR - BHOR SECTOR',
    city: 'pune',
    district: 'Pune District',
    complianceIndex: 84,
    zoneStatus: 'Neonatal & HBNC Care',
    zoneStatusColor: 'blue',
    highRiskAncCases: 3,
    assignedCitizens: 290,
    designatedAsha: 'Renuka Bhosale',
    ashaPhone: '+91 97300 77123',
    alertMessage: 'Home Based Newborn Care (HBNC): 18 post-natal mothers completing Day 3, 7, 14, and 28 home visits.',
    coordinates: { lat: 18.2435, lng: 73.9125 },
    activeOutbreak: 'Low Birth Weight Monitoring',
    vaccineGapPercent: 2.2
  },
  // Nashik District Sectors
  {
    id: 'trimbak-block',
    name: 'Trimbak Block (Harsul PHC)',
    sectorName: 'HARSUL - TRIMBAK TRIBAL SECTOR',
    city: 'nashik',
    district: 'Nashik District',
    complianceIndex: 76,
    zoneStatus: 'Tribal Maternal Risk',
    zoneStatusColor: 'orange',
    highRiskAncCases: 7,
    assignedCitizens: 310,
    designatedAsha: 'Anusuya Raut',
    ashaPhone: '+91 94033 11840',
    alertMessage: 'Tribal Belt Alert: Severe nutritional anemia screening active across 12 hilly padas.',
    coordinates: { lat: 19.9383, lng: 73.5303 },
    activeOutbreak: 'Severe Anemia (7 cases)',
    vaccineGapPercent: 6.1
  },
  {
    id: 'sinnar-block',
    name: 'Sinnar Block (Wavi PHC)',
    sectorName: 'WAVI - SINNAR SECTOR',
    city: 'nashik',
    district: 'Nashik District',
    complianceIndex: 91,
    zoneStatus: 'High Routine Immunization',
    zoneStatusColor: 'green',
    highRiskAncCases: 3,
    assignedCitizens: 430,
    designatedAsha: 'Shobha Gite',
    ashaPhone: '+91 98501 66209',
    alertMessage: 'Immunization camp scheduled at ZP School for Pentavalent and Japanese Encephalitis vaccines.',
    coordinates: { lat: 19.8458, lng: 74.0016 },
    activeOutbreak: 'None',
    vaccineGapPercent: 1.8
  },
  // Nagpur District Sectors
  {
    id: 'hingna-block',
    name: 'Hingna Block (Kanhan PHC)',
    sectorName: 'KANHAN - HINGNA SECTOR',
    city: 'nagpur',
    district: 'Nagpur District',
    complianceIndex: 85,
    zoneStatus: 'Vector Surveillance Active',
    zoneStatusColor: 'red',
    highRiskAncCases: 4,
    assignedCitizens: 390,
    designatedAsha: 'Lata Meshram',
    ashaPhone: '+91 97644 33012',
    alertMessage: 'Malaria & Chikungunya surveillance active with rapid card testing at sub-centers.',
    coordinates: { lat: 21.0664, lng: 78.9667 },
    activeOutbreak: 'Malaria Surveillance (6 cases)',
    vaccineGapPercent: 2.9
  },
  // Satara District Sectors
  {
    id: 'wai-block',
    name: 'Wai Block (Bhuinj PHC)',
    sectorName: 'BHUINJ - WAI SECTOR',
    city: 'satara',
    district: 'Satara District',
    complianceIndex: 93,
    zoneStatus: 'Maternal Safety Model',
    zoneStatusColor: 'green',
    highRiskAncCases: 2,
    assignedCitizens: 410,
    designatedAsha: 'Mangal Salunkhe',
    ashaPhone: '+91 94238 99120',
    alertMessage: '100% Institutional Delivery achieved for the past quarter under Pradhan Mantri Matru Vandana Yojana.',
    coordinates: { lat: 17.9487, lng: 73.8906 },
    activeOutbreak: 'None',
    vaccineGapPercent: 1.4
  }
];

export const INITIAL_ASHA_WORKERS: AshaWorker[] = [
  {
    id: 'asha-1',
    initial: 'V',
    name: 'Vandana Shinde',
    sector: 'PAUD - MULSHI SECTOR',
    status: 'Online',
    activeCases: 124,
    performanceScore: 96,
    visitsComplete: 45,
    visitsPending: 3,
    assignedRetirement: '2044-08-15',
    phone: '+91 94220 88321',
    lastActive: '2 mins ago'
  },
  {
    id: 'asha-2',
    initial: 'S',
    name: 'Sunita Patil',
    sector: 'WAGHOLI - HAVELI SECTOR',
    status: 'Online',
    activeCases: 118,
    performanceScore: 94,
    visitsComplete: 38,
    visitsPending: 4,
    assignedRetirement: '2039-11-20',
    phone: '+91 98221 44510',
    lastActive: 'Just now'
  },
  {
    id: 'asha-3',
    initial: 'A',
    name: 'Archana Deshmukh',
    sector: 'MALEGAON - BARAMATI SECTOR',
    status: 'Online',
    activeCases: 110,
    performanceScore: 98,
    visitsComplete: 42,
    visitsPending: 1,
    assignedRetirement: '2046-02-10',
    phone: '+91 97650 44219',
    lastActive: '5 mins ago'
  },
  {
    id: 'asha-4',
    initial: 'K',
    name: 'Kavita Gaikwad',
    sector: 'OTUR - JUNNAR SECTOR',
    status: 'Offline',
    activeCases: 85,
    performanceScore: 91,
    visitsComplete: 34,
    visitsPending: 5,
    assignedRetirement: '2042-05-18',
    phone: '+91 96041 55301',
    lastActive: '30 mins ago (Syncing cache)'
  },
  {
    id: 'asha-5',
    initial: 'S',
    name: 'Savitri Jadhav',
    sector: 'CHAKAN - KHED SECTOR',
    status: 'Online',
    activeCases: 95,
    performanceScore: 93,
    visitsComplete: 39,
    visitsPending: 2,
    assignedRetirement: '2045-09-12',
    phone: '+91 98902 33411',
    lastActive: '8 mins ago'
  }
];

export const INITIAL_TELECONSULTATIONS: TeleconsultationRequest[] = [
  {
    id: 'TC-2026-801',
    patientName: 'Pooja Sanjay Kadam',
    patientAge: 24,
    patientGender: 'Female',
    patientPhone: '+91 98220 77123',
    abhaId: '27-9821-4401-2098',
    village: 'Wagholi Rural Hamlet, Pune',
    sector: 'WAGHOLI - HAVELI SECTOR',
    source: 'ASHA Field Worker',
    bookedBy: 'ASHA Sunita Patil',
    requestTime: '10:15 AM (Today)',
    urgency: 'Critical',
    specialty: 'OB/GYN & Maternal',
    symptoms: 'Gestational 32 weeks, severe frontal headache, blurred vision, bilateral pedal edema, field BP 158/104 mmHg.',
    pregnancyStatus: 'Pregnant (3rd Trimester - 32 Wks)',
    vitals: {
      bloodPressure: '158/104',
      heartRate: 88,
      spo2: 98,
      temperature: 37.1,
      hemoglobin: 8.2,
      bloodSugar: 112
    },
    doctorAssigned: 'Dr. Rajesh Sharma, MD (PHC In-Charge)',
    status: 'Waiting'
  },
  {
    id: 'TC-2026-802',
    patientName: 'Aarav Sachin More',
    patientAge: 4,
    patientGender: 'Male',
    patientPhone: '+91 97651 33201',
    abhaId: '27-5510-9122-8711',
    village: 'Otur East Hamlet, Junnar',
    sector: 'OTUR - JUNNAR SECTOR',
    source: 'Direct Patient',
    bookedBy: 'Mother (Swati More)',
    requestTime: '10:22 AM (Today)',
    urgency: 'High',
    specialty: 'Pediatrics',
    symptoms: 'High spike fever for 3 days, watery diarrhea (5 episodes today), sunken eyes, moderate dehydration signs.',
    vitals: {
      bloodPressure: '90/60',
      heartRate: 120,
      spo2: 97,
      temperature: 39.4,
      bloodSugar: 85
    },
    doctorAssigned: 'Dr. Anita Sundaram, DCH',
    status: 'Waiting'
  },
  {
    id: 'TC-2026-803',
    patientName: 'Tukaram Vitthal Shinde',
    patientAge: 62,
    patientGender: 'Male',
    patientPhone: '+91 94221 12093',
    abhaId: '27-1109-8432-6019',
    village: 'Paud Village, Mulshi',
    sector: 'PAUD - MULSHI SECTOR',
    source: 'ASHA Field Worker',
    bookedBy: 'ASHA Vandana Shinde',
    requestTime: '09:40 AM (Today)',
    urgency: 'Medium',
    specialty: 'General Physician',
    symptoms: 'Severe joint & muscle pains, retro-orbital headache, chills and fever, suspected Dengue NS1 positive in rapid card test.',
    vitals: {
      bloodPressure: '130/85',
      heartRate: 92,
      spo2: 96,
      temperature: 38.9,
      hemoglobin: 12.8,
      bloodSugar: 140
    },
    doctorAssigned: 'Dr. Rajesh Sharma, MD',
    status: 'In Consultation'
  },
  {
    id: 'TC-2026-804',
    patientName: 'Ashwini Ganesh Jagtap',
    patientAge: 27,
    patientGender: 'Female',
    patientPhone: '+91 98900 44102',
    abhaId: '27-7740-1288-4390',
    village: 'Malegaon Budruk, Baramati',
    sector: 'MALEGAON - BARAMATI SECTOR',
    source: 'Sub-Center ANM',
    bookedBy: 'ANM Sister Sujata',
    requestTime: '08:50 AM (Today)',
    urgency: 'Routine',
    specialty: 'OB/GYN & Maternal',
    symptoms: 'Post-natal HBNC Day 14 follow-up. Mild breast engorgement, infant suckling actively, umbilical stump healed cleanly.',
    pregnancyStatus: 'Postpartum Day 14',
    vitals: {
      bloodPressure: '118/76',
      heartRate: 74,
      spo2: 99,
      temperature: 36.8,
      hemoglobin: 10.4
    },
    doctorAssigned: 'Dr. Anita Sundaram, DCH',
    status: 'Completed',
    doctorNotes: 'Lactation counseling given. Advised warm compresses. Prescribed Calcium 500mg daily. Mother and newborn stable.'
  }
];

export const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: 'MED-001',
    name: 'IFA Tablets (Iron Folic Acid 100mg/0.5mg)',
    genericName: 'Ferrous Sulfate + Folic Acid',
    category: 'Maternal Health',
    unit: 'Strips (10 tabs)',
    currentStock: 480,
    minBufferThreshold: 800,
    batchNumber: 'IFA-2026-MH-04B',
    expiryDate: '2027-11-30',
    dosageForm: 'Tablets',
    lastUpdated: 'Today, 08:30 AM'
  },
  {
    id: 'MED-002',
    name: 'Calcium + Vitamin D3 Tablets (500mg)',
    genericName: 'Calcium Carbonate + Cholecalciferol',
    category: 'Maternal Health',
    unit: 'Strips (15 tabs)',
    currentStock: 1250,
    minBufferThreshold: 600,
    batchNumber: 'CAL-8891-MH',
    expiryDate: '2028-02-28',
    dosageForm: 'Tablets',
    lastUpdated: 'Today, 08:30 AM'
  },
  {
    id: 'MED-003',
    name: 'Oxytocin Injection IP (10 IU/ml)',
    genericName: 'Oxytocin 10 IU',
    category: 'Maternal Health',
    unit: 'Ampoules',
    currentStock: 85,
    minBufferThreshold: 50,
    batchNumber: 'OXY-441-MH',
    expiryDate: '2027-08-15',
    dosageForm: 'Injectable',
    lastUpdated: 'Yesterday'
  },
  {
    id: 'MED-004',
    name: 'Paracetamol Tablets IP (500mg)',
    genericName: 'Paracetamol 500mg',
    category: 'Emergency & IV',
    unit: 'Strips (10 tabs)',
    currentStock: 2400,
    minBufferThreshold: 1000,
    batchNumber: 'PCM-9920-MH',
    expiryDate: '2028-06-30',
    dosageForm: 'Tablets',
    lastUpdated: 'Today, 09:00 AM'
  },
  {
    id: 'MED-005',
    name: 'ORS Packets (Oral Rehydration Salts WHO Formula)',
    genericName: 'Sodium Chloride + Potassium Chloride + Dextrose',
    category: 'Pediatric Care',
    unit: 'Sachets (21.8g)',
    currentStock: 310,
    minBufferThreshold: 500,
    batchNumber: 'ORS-7731-MH',
    expiryDate: '2027-12-31',
    dosageForm: 'Packets',
    lastUpdated: 'Today, 09:15 AM'
  },
  {
    id: 'MED-006',
    name: 'Zinc Sulfate Dispersible Tablets (20mg)',
    genericName: 'Zinc Sulfate Monohydrate',
    category: 'Pediatric Care',
    unit: 'Strips (14 tabs)',
    currentStock: 890,
    minBufferThreshold: 400,
    batchNumber: 'ZNC-102-MH',
    expiryDate: '2028-01-15',
    dosageForm: 'Tablets',
    lastUpdated: 'Yesterday'
  },
  {
    id: 'MED-007',
    name: 'Amoxicillin Capsules (500mg)',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotics & Anti-infectives',
    unit: 'Strips (10 caps)',
    currentStock: 620,
    minBufferThreshold: 300,
    batchNumber: 'AMX-553-MH',
    expiryDate: '2027-10-31',
    dosageForm: 'Capsules',
    lastUpdated: '2 days ago'
  },
  {
    id: 'MED-008',
    name: 'Anti-Rabies Vaccine (ARV 2.5 IU)',
    genericName: 'Purified Chick Embryo Cell Rabies Vaccine',
    category: 'Vaccines & Cold Chain',
    unit: 'Vials (Cold Chain 2-8°C)',
    currentStock: 45,
    minBufferThreshold: 30,
    batchNumber: 'ARV-998-MH',
    expiryDate: '2027-04-30',
    dosageForm: 'Vials',
    lastUpdated: 'Today, 07:45 AM'
  },
  {
    id: 'MED-009',
    name: 'BCG Vaccine + Diluent (0.1 ml)',
    genericName: 'Bacillus Calmette-Guerin',
    category: 'Vaccines & Cold Chain',
    unit: 'Vials (10 doses)',
    currentStock: 95,
    minBufferThreshold: 40,
    batchNumber: 'BCG-301-MH',
    expiryDate: '2027-09-30',
    dosageForm: 'Vials',
    lastUpdated: 'Today, 07:45 AM'
  },
  {
    id: 'MED-010',
    name: 'Metformin Hydrochloride (500mg)',
    genericName: 'Metformin HCl',
    category: 'Chronic Care',
    unit: 'Strips (10 tabs)',
    currentStock: 1450,
    minBufferThreshold: 500,
    batchNumber: 'MET-880-MH',
    expiryDate: '2028-04-30',
    dosageForm: 'Tablets',
    lastUpdated: '3 days ago'
  },
  {
    id: 'MED-011',
    name: 'Magnesium Sulfate Injection 50% w/v (2ml/1g)',
    genericName: 'Magnesium Sulfate (Preeclampsia Protocol)',
    category: 'Maternal Health',
    unit: 'Ampoules',
    currentStock: 28,
    minBufferThreshold: 40,
    batchNumber: 'MGS-662-MH',
    expiryDate: '2027-05-31',
    dosageForm: 'Injectable',
    lastUpdated: 'Today, 08:30 AM'
  }
];

export const INITIAL_FACILITY_STATUS: FacilityStatus = {
  hospitalName: 'Government Primary Health Center Paud & Wagholi Hub (Pune District, Maharashtra)',
  phcCode: 'PHC-MH-PUN-042',
  lastUpdated: 'Today, 10:20 AM',
  beds: {
    generalWard: { total: 30, occupied: 22 },
    maternityWard: { total: 8, occupied: 6 },
    emergencyTriage: { total: 4, occupied: 1 },
    neonatalRadiantWarmers: { total: 3, occupied: 1 }
  },
  equipment: [
    {
      name: 'Digital Hemoglobinometer (Sahli & Digital Strip)',
      category: 'Diagnostic Lab',
      isOperational: true,
      details: 'Calibrated today at 08:00 AM. 180 microcuvettes in stock.'
    },
    {
      name: 'Point-of-Care Blood Glucose Meter',
      category: 'Diagnostic Lab',
      isOperational: true,
      details: 'Active. 140 glucose test strips available.'
    },
    {
      name: 'Obstetric 2D Ultrasound Scanning Machine',
      category: 'Radiology / Maternal Care',
      isOperational: true,
      details: 'Operational. Visiting Sonologist on duty (Tues & Thurs 10 AM - 2 PM).'
    },
    {
      name: 'Urine Multistix Albumin/Sugar Analyzer',
      category: 'Diagnostic Lab',
      isOperational: true,
      details: 'Operational. 250 dipsticks available for ANC screening.'
    },
    {
      name: 'Cold Chain ILR (Ice Lined Refrigerator - 140L)',
      category: 'Cold Chain Equipment',
      isOperational: true,
      details: 'Digital Data Logger temperature steady at +4.2°C (Acceptable 2°C to 8°C).'
    },
    {
      name: 'Neonatal Phototherapy Unit',
      category: 'Newborn Care (HBNC)',
      isOperational: true,
      details: 'Tested & Operational in Labour Recovery Room.'
    }
  ],
  coldChainTemp: 4.2,
  coldChainPowerStatus: 'Main Grid',
  ambulance108Status: {
    totalUnits: 3,
    availableUnits: 2,
    activeDispatches: [
      {
        unitId: 'MH-108-PUN-14',
        destination: 'Wagholi Rural Hamlet, Sector 1',
        etaMinutes: 11,
        assignedCase: 'Emergency Maternal Transfer - Pooja Kadam (BP 158/104)'
      }
    ]
  },
  staffOnDuty: [
    {
      role: 'Medical Officer In-Charge',
      name: 'Dr. Rajesh Sharma, MBBS, MD (Community Medicine)',
      contact: '+91 94220 98112',
      shift: '08:00 AM - 04:00 PM (Morning & Day Duty)'
    },
    {
      role: 'Consultant Pediatrician',
      name: 'Dr. Anita Sundaram, MBBS, DCH',
      contact: '+91 98221 22910',
      shift: '09:00 AM - 02:00 PM'
    },
    {
      role: 'Senior Staff Nurse (Labour & Emergency)',
      name: 'Sister Sujata Pawar, GNM',
      contact: '+91 97651 33020',
      shift: '08:00 AM - 08:00 PM'
    },
    {
      role: 'Chief Pharmacist',
      name: 'R. B. Kulkarni, D.Pharm',
      contact: '+91 96040 88123',
      shift: '08:00 AM - 04:00 PM'
    },
    {
      role: 'Laboratory Technician',
      name: 'S. N. Shinde, DMLT',
      contact: '+91 94232 77019',
      shift: '08:00 AM - 04:00 PM'
    }
  ],
  utilities: {
    cleanWaterSupply: true,
    backupGeneratorFuelPercent: 94,
    internetBandwidthMbps: 45,
    telemedicineConnectivity: 'Excellent'
  }
};

export const INITIAL_HIGH_RISK_PATIENTS: HighRiskPatient[] = [
  {
    id: 'HRP-01',
    name: 'Pooja Sanjay Kadam',
    age: 24,
    village: 'Wagholi Rural Hamlet',
    sector: 'WAGHOLI - HAVELI SECTOR',
    gestationalWeek: 32,
    riskCategory: 'Severe Pre-eclampsia',
    urgency: 'Critical',
    vitals: { bp: '158/104', hb: 8.2, sugar: 112 },
    ashaName: 'Sunita Patil',
    lastVisitDate: 'Today, 09:45 AM',
    recommendedAction: 'Immediate tele-consultation + 108 Ambulance dispatch for Sassoon General Hospital Pune admission.'
  },
  {
    id: 'HRP-02',
    name: 'Radhika Vaibhav Jagtap',
    age: 28,
    village: 'Wagholi Central Ward',
    sector: 'WAGHOLI - HAVELI SECTOR',
    gestationalWeek: 28,
    riskCategory: 'Severe Anemia',
    urgency: 'High',
    vitals: { bp: '110/70', hb: 6.9, sugar: 94 },
    ashaName: 'Sunita Patil',
    lastVisitDate: 'Yesterday',
    recommendedAction: 'IV Iron Sucrose infusion ordered at PHC day-care ward. Double IFA dose.'
  },
  {
    id: 'HRP-03',
    name: 'Manisha Datta Chavan',
    age: 26,
    village: 'Paud Village',
    sector: 'PAUD - MULSHI SECTOR',
    gestationalWeek: 36,
    riskCategory: 'Gestational Diabetes',
    urgency: 'High',
    vitals: { bp: '134/88', hb: 10.1, sugar: 198 },
    ashaName: 'Vandana Shinde',
    lastVisitDate: 'Today, 08:30 AM',
    recommendedAction: 'Medical nutrition therapy & Insulin titration review under Dr. Rajesh.'
  },
  {
    id: 'HRP-04',
    name: 'Baby of Kavita More (Age 7 Mo)',
    age: 1,
    village: 'Otur Canal Hamlet',
    sector: 'OTUR - JUNNAR SECTOR',
    riskCategory: 'Malnutrition (SAM)',
    urgency: 'High',
    vitals: { bp: '90/60', hb: 8.0, sugar: 80 },
    ashaName: 'Kavita Gaikwad',
    lastVisitDate: '2 days ago',
    recommendedAction: 'Enroll in NRC (Nutrition Rehabilitation Center) + Ready-to-Use Therapeutic Food (RUTF).'
  }
];
