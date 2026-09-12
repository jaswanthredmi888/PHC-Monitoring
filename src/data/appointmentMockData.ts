import { AppointmentItem } from '../types';

export const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  // 1. Emergency Case (Checked-In, In Priority Queue)
  {
    id: 'APT-2026-101',
    tokenNumber: 'EM-01',
    patientName: 'Rameshwar Shinde',
    patientAge: 58,
    patientGender: 'Male',
    patientPhone: '+91 98220 44109',
    abhaId: '33-7819-2041-9912',
    village: 'Khadakwasla Pada',
    sector: 'CHANDANAGIRI SECTOR',
    department: 'Emergency & Trauma',
    purposeOfVisit: 'Acute chest tightness, diaphoresis & severe breathlessness',
    assignedDoctor: 'Dr. Ananya Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Emergency Bay - Triage',
    medicalHistory: {
      chronicConditions: ['Type 2 Diabetes Mellitus (8 yrs)', 'Essential Hypertension'],
      allergies: ['Sulfa drugs'],
      ongoingMedications: ['Metformin 500mg BD', 'Amlodipine 5mg OD'],
      previousVisitsCount: 4,
      vitalsAtBooking: {
        bp: '168/104 mmHg',
        pulse: 108,
        temp: '37.1 °C',
        spo2: 93,
        bloodSugar: '240 mg/dL'
      }
    },
    priority: 'Emergency',
    isHighRisk: true,
    priorityReason: 'Acute Coronary Syndrome suspect with desaturation (SpO2 93%)',
    bookingSource: 'SEVA-Lite (ASHA)',
    bookedBy: 'Sunita Patil (ASHA ID: MH-ASHA-1104)',
    bookedAt: '11 Sep 2026, 08:15 AM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '08:30 AM - 09:00 AM',
    estimatedWaitMinutes: 0,
    status: 'Checked-In',
    checkInTime: '08:25 AM',
    isDelayed: false,
    clinicalNotes: 'Frontline ASHA alerted via SEVA-Lite. Patient brought via 108 ambulance. Oxygen support initiated.'
  },

  // 2. High-Risk Maternal ANC Case (Checked-In, In Consultation)
  {
    id: 'APT-2026-102',
    tokenNumber: 'ANC-02',
    patientName: 'Kavita Jadhav',
    patientAge: 24,
    patientGender: 'Female',
    patientPhone: '+91 97654 33211',
    abhaId: '33-1109-8734-4501',
    village: 'Pirangut Wadi',
    sector: 'KASARAMBALI SECTOR',
    department: 'Obstetrics & Gynecology',
    purposeOfVisit: 'Maternal ANC 3rd Trimester (34 Wks) - Severe Pre-eclampsia Screening & USG Review',
    assignedDoctor: 'Dr. Rajesh Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 2 (Maternal & ANC Clinic)',
    medicalHistory: {
      chronicConditions: ['Gestational Hypertension (Primi)', 'Mild Anemia'],
      allergies: ['No known drug allergies'],
      ongoingMedications: ['Labetalol 100mg BD', 'Iron & Folic Acid (IFA)', 'Calcium Carbonate 500mg'],
      previousVisitsCount: 6,
      vitalsAtBooking: {
        bp: '154/98 mmHg',
        pulse: 88,
        temp: '36.8 °C',
        weightKg: 62.5,
        hemoglobin: 9.1
      }
    },
    priority: 'High-Risk Maternal',
    isHighRisk: true,
    priorityReason: 'Elevated systolic BP 154/98 mmHg with pedal edema and protein in urine',
    bookingSource: 'SEVA-Lite (ANM)',
    bookedBy: 'Meena Kulkarni (ANM Staff ID: MH-ANM-402)',
    bookedAt: '10 Sep 2026, 05:20 PM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '09:00 AM - 09:30 AM',
    estimatedWaitMinutes: 5,
    status: 'In Consultation',
    checkInTime: '08:50 AM',
    consultationStartTime: '09:05 AM',
    isDelayed: false,
    clinicalNotes: 'Cardiotocography and obstetric Doppler ultrasound under assessment.'
  },

  // 3. Child / Pediatric Immunization Case (Checked-In, Waiting)
  {
    id: 'APT-2026-103',
    tokenNumber: 'PED-03',
    patientName: 'Master Aarav Mane (Guardian: Sarla Mane)',
    patientAge: 1,
    patientGender: 'Male',
    patientPhone: '+91 94231 99014',
    abhaId: '33-5491-0023-7612',
    village: 'Mulshi Taluka Colony',
    sector: 'CHANDANAGIRI SECTOR',
    department: 'Pediatrics & Immunization',
    purposeOfVisit: 'Pentavalent-3, OPV Booster & Measles-Rubella (MR) Vaccine milestone',
    assignedDoctor: 'Dr. Vivek Kulkarni, MBBS, DCH',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 3 (Child Health & Immunization)',
    medicalHistory: {
      chronicConditions: ['None'],
      allergies: ['None known'],
      ongoingMedications: ['Vitamin A drops (preventive)'],
      previousVisitsCount: 3,
      vitalsAtBooking: {
        temp: '36.6 °C',
        weightKg: 9.2,
        pulse: 110
      }
    },
    priority: 'Child / Pediatric',
    isHighRisk: false,
    priorityReason: 'Under-5 Priority immunization catch-up program under Mission Indradhanush',
    bookingSource: 'SEVA-Lite (ASHA)',
    bookedBy: 'Sunita Patil (ASHA ID: MH-ASHA-1104)',
    bookedAt: '09 Sep 2026, 11:30 AM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '09:30 AM - 10:00 AM',
    estimatedWaitMinutes: 10,
    status: 'Checked-In',
    checkInTime: '09:18 AM',
    isDelayed: false,
    clinicalNotes: 'Cold-chain vaccine vial verified. Routine pediatric growth chart mapping.'
  },

  // 4. Elderly / Geriatric NCD Case (Checked-In, Waiting)
  {
    id: 'APT-2026-104',
    tokenNumber: 'ELD-04',
    patientName: 'Bapu Tukaram Deshmukh',
    patientAge: 76,
    patientGender: 'Male',
    patientPhone: '+91 91588 23091',
    abhaId: '33-6612-4490-3321',
    village: 'Kolewadi',
    sector: 'KASARAMBALI SECTOR',
    department: 'Geriatrics & NCD',
    purposeOfVisit: 'Severe osteoarthritis bilateral knees & uncontrolled hypertension follow-up',
    assignedDoctor: 'Dr. Ananya Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 1 (OPD & General Medicine)',
    medicalHistory: {
      chronicConditions: ['Stage 2 Hypertension (15 yrs)', 'Grade III Knee Osteoarthritis', 'BPH'],
      allergies: ['Diclofenac sodium (Gastritis trigger)'],
      ongoingMedications: ['Telmisartan 40mg + Hydrochlorothiazide 12.5mg', 'Paracetamol 650mg SOS'],
      previousVisitsCount: 11,
      vitalsAtBooking: {
        bp: '162/94 mmHg',
        pulse: 74,
        temp: '36.7 °C',
        weightKg: 68
      }
    },
    priority: 'Elderly / Geriatric',
    isHighRisk: true,
    priorityReason: 'Senior citizen (76y) with mobility impairment and severe blood pressure spike',
    bookingSource: 'SEVA-Lite (ASHA)',
    bookedBy: 'Rukmini Kadam (ASHA ID: MH-ASHA-1110)',
    bookedAt: '10 Sep 2026, 02:45 PM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '10:00 AM - 10:30 AM',
    estimatedWaitMinutes: 15,
    status: 'Checked-In',
    checkInTime: '09:40 AM',
    isDelayed: false,
    clinicalNotes: 'Accompanied by grandson. Needs wheelchair assistance from triage gate.'
  },

  // 5. Delayed Appointment Case (Flagged for Follow-up)
  {
    id: 'APT-2026-105',
    tokenNumber: 'ANC-05',
    patientName: 'Pooja Nitin Gaikwad',
    patientAge: 22,
    patientGender: 'Female',
    patientPhone: '+91 96041 87234',
    abhaId: '33-9081-3312-8745',
    village: 'Male Village Pada 3',
    sector: 'CHANDANAGIRI SECTOR',
    department: 'Obstetrics & Gynecology',
    purposeOfVisit: 'Maternal ANC 2nd Trimester (20 Wks) - Anomaly scan review & Hb check',
    assignedDoctor: 'Dr. Rajesh Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 2 (Maternal & ANC Clinic)',
    medicalHistory: {
      chronicConditions: ['Moderate Nutritional Anemia (Hb 8.2 g/dL)'],
      allergies: ['None known'],
      ongoingMedications: ['Iron Sucrose injection regimen planned', 'Calcium D3'],
      previousVisitsCount: 2,
      vitalsAtBooking: {
        bp: '112/70 mmHg',
        pulse: 82,
        hemoglobin: 8.2
      }
    },
    priority: 'High-Risk Maternal',
    isHighRisk: true,
    priorityReason: 'Moderate-severe anemia in pregnancy (Hb 8.2) requiring IV iron sucrose schedule',
    bookingSource: 'SEVA-Lite (ASHA)',
    bookedBy: 'Sunita Patil (ASHA ID: MH-ASHA-1104)',
    bookedAt: '08 Sep 2026, 06:10 PM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '09:00 AM - 09:30 AM',
    status: 'Delayed',
    isDelayed: true,
    delayedMinutes: 75,
    delayReason: 'Public state transport bus delayed from Male village; ASHA reports patient en route on motorcycle.',
    clinicalNotes: 'ASHA Sunita contacted at 09:45 AM. Patient anticipated by 10:30 AM.'
  },

  // 6. Missed Appointment Case (Did not attend)
  {
    id: 'APT-2026-106',
    tokenNumber: 'GEN-06',
    patientName: 'Santosh Baburao More',
    patientAge: 44,
    patientGender: 'Male',
    patientPhone: '+91 98901 12399',
    abhaId: '33-3241-9988-1123',
    village: 'Bhadas Khurd',
    sector: 'KASARAMBALI SECTOR',
    department: 'General Medicine',
    purposeOfVisit: 'Persistent dry cough for 3 weeks & intermittent night sweats (TB Screening)',
    assignedDoctor: 'Dr. Ananya Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 1 (OPD & General Medicine)',
    medicalHistory: {
      chronicConditions: ['Smoker (15 yrs)', 'Suspected Pulmonary Tuberculosis'],
      allergies: ['None reported'],
      ongoingMedications: ['Cough syrup OTC (no relief)'],
      previousVisitsCount: 1,
      vitalsAtBooking: {
        temp: '38.2 °C',
        weightKg: 51
      }
    },
    priority: 'General / Routine',
    isHighRisk: true,
    priorityReason: 'Presumptive Tuberculosis symptomatic requiring Sputum CBNAAT & Chest X-Ray',
    bookingSource: 'SEVA-Lite (ASHA)',
    bookedBy: 'Rukmini Kadam (ASHA ID: MH-ASHA-1110)',
    bookedAt: '09 Sep 2026, 03:00 PM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '08:30 AM - 09:00 AM',
    status: 'Missed',
    isDelayed: false,
    missedReason: 'Patient did not arrive. No response on phone call; family reports he went for agricultural harvesting.',
    clinicalNotes: 'Flagged to ASHA Rukmini for mandatory home visit & doorstep sputum collection bottle delivery.'
  },

  // 7. Completed Consultation Case
  {
    id: 'APT-2026-107',
    tokenNumber: 'ANC-01',
    patientName: 'Archana Sandeep Pawar',
    patientAge: 27,
    patientGender: 'Female',
    patientPhone: '+91 97643 88120',
    abhaId: '33-4012-7761-5509',
    village: 'Lavale Village',
    sector: 'CHANDANAGIRI SECTOR',
    department: 'Obstetrics & Gynecology',
    purposeOfVisit: 'Routine ANC 3rd Trimester Checkup & Td Booster administration',
    assignedDoctor: 'Dr. Rajesh Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 2 (Maternal & ANC Clinic)',
    medicalHistory: {
      chronicConditions: ['None - Healthy pregnancy'],
      allergies: ['No known allergies'],
      ongoingMedications: ['IFA, Calcium D3'],
      previousVisitsCount: 5,
      vitalsAtBooking: {
        bp: '118/76 mmHg',
        pulse: 78,
        temp: '36.6 °C',
        weightKg: 59,
        hemoglobin: 11.4
      }
    },
    priority: 'High-Risk Maternal',
    isHighRisk: false,
    priorityReason: 'Maternal health routine monitoring',
    bookingSource: 'SEVA-Lite (ASHA)',
    bookedBy: 'Sunita Patil (ASHA ID: MH-ASHA-1104)',
    bookedAt: '07 Sep 2026, 10:00 AM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '08:00 AM - 08:30 AM',
    status: 'Completed',
    checkInTime: '07:55 AM',
    consultationStartTime: '08:05 AM',
    completedTime: '08:28 AM',
    isDelayed: false,
    clinicalNotes: 'Fetal heart rate 142 bpm regular. Td dose 2 administered. Next review in 2 weeks.'
  },

  // 8. Completed Consultation Case 2
  {
    id: 'APT-2026-108',
    tokenNumber: 'GEN-01',
    patientName: 'Dnyaneshwar Shrirang Jagtap',
    patientAge: 52,
    patientGender: 'Male',
    patientPhone: '+91 94220 56711',
    abhaId: '33-2281-9011-4478',
    village: 'Paud Gaon',
    sector: 'CHANDANAGIRI SECTOR',
    department: 'General Medicine',
    purposeOfVisit: 'Type 2 Diabetes glycemic check & HbA1c lab report review',
    assignedDoctor: 'Dr. Ananya Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 1 (OPD & General Medicine)',
    medicalHistory: {
      chronicConditions: ['Type 2 Diabetes (6 yrs)', 'Dyslipidemia'],
      allergies: ['None known'],
      ongoingMedications: ['Glimepiride 1mg + Metformin 500mg', 'Atorvastatin 10mg'],
      previousVisitsCount: 8,
      vitalsAtBooking: {
        bp: '124/82 mmHg',
        pulse: 72,
        bloodSugar: '142 mg/dL (Fasting)'
      }
    },
    priority: 'General / Routine',
    isHighRisk: false,
    bookingSource: 'Patient Self-Portal',
    bookedBy: 'Self (via MahaHealth Web Portal)',
    bookedAt: '08 Sep 2026, 08:30 PM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '08:30 AM - 09:00 AM',
    status: 'Completed',
    checkInTime: '08:20 AM',
    consultationStartTime: '08:35 AM',
    completedTime: '08:52 AM',
    isDelayed: false,
    clinicalNotes: 'HbA1c 6.9% well controlled. 30-day drug supply dispensed from PHC pharmacy.'
  },

  // 9. Scheduled Upcoming Today
  {
    id: 'APT-2026-109',
    tokenNumber: 'PED-05',
    patientName: 'Baby Anvi Thorat (Mother: Rekha Thorat)',
    patientAge: 2,
    patientGender: 'Female',
    patientPhone: '+91 98231 66723',
    abhaId: '33-7712-4439-0112',
    village: 'Khamgaon',
    sector: 'KASARAMBALI SECTOR',
    department: 'Pediatrics & Immunization',
    purposeOfVisit: 'Acute diarrhea (3 days) with mild dehydration evaluation & ORS/Zinc kit',
    assignedDoctor: 'Dr. Vivek Kulkarni, MBBS, DCH',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 3 (Child Health & Immunization)',
    medicalHistory: {
      chronicConditions: ['Mild Underweight (Grade 1 Wasting)'],
      allergies: ['None'],
      ongoingMedications: ['ORS solution given at home'],
      previousVisitsCount: 2,
      vitalsAtBooking: {
        temp: '37.4 °C',
        weightKg: 10.4,
        pulse: 114
      }
    },
    priority: 'Child / Pediatric',
    isHighRisk: true,
    priorityReason: 'Pediatric dehydration risk during seasonal monsoon diarrheal cluster',
    bookingSource: 'SEVA-Lite (ASHA)',
    bookedBy: 'Rukmini Kadam (ASHA ID: MH-ASHA-1110)',
    bookedAt: '11 Sep 2026, 07:40 AM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '10:30 AM - 11:00 AM',
    estimatedWaitMinutes: 25,
    status: 'Scheduled',
    isDelayed: false,
    clinicalNotes: 'ASHA provided preliminary ORS packet. Mother instructed to bring child to PHC OPD Room 3.'
  },

  // 10. Scheduled Upcoming Today (Self Booked)
  {
    id: 'APT-2026-110',
    tokenNumber: 'GEN-07',
    patientName: 'Sanjay Vitthal Raut',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+91 97300 88290',
    abhaId: '33-1982-4412-6634',
    village: 'Kolwan Valley',
    sector: 'CHANDANAGIRI SECTOR',
    department: 'General Medicine',
    purposeOfVisit: 'Joint pain, lower back spasm after lifting agricultural equipment',
    assignedDoctor: 'Dr. Ananya Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 1 (OPD & General Medicine)',
    medicalHistory: {
      chronicConditions: ['Lumbago / Sciatica suspect'],
      allergies: ['None reported'],
      ongoingMedications: ['None'],
      previousVisitsCount: 0,
      vitalsAtBooking: {
        bp: '128/84 mmHg',
        pulse: 76
      }
    },
    priority: 'General / Routine',
    isHighRisk: false,
    bookingSource: 'Patient Self-Portal',
    bookedBy: 'Self (via MahaHealth Web Portal)',
    bookedAt: '10 Sep 2026, 09:15 PM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '11:00 AM - 11:30 AM',
    estimatedWaitMinutes: 35,
    status: 'Scheduled',
    isDelayed: false,
    clinicalNotes: 'First-time visit at Paud PHC. ABHA ID verified via OTP.'
  },

  // 11. Scheduled Upcoming Today (Walk-In)
  {
    id: 'APT-2026-111',
    tokenNumber: 'DEN-08',
    patientName: 'Sunita Mohan Gaikwad',
    patientAge: 46,
    patientGender: 'Female',
    patientPhone: '+91 98812 34456',
    abhaId: '33-6543-2198-7701',
    village: 'Paud Bazar',
    sector: 'CHANDANAGIRI SECTOR',
    department: 'Dental & AYUSH',
    purposeOfVisit: 'Severe molar toothache & gum swelling requiring dental extraction review',
    assignedDoctor: 'Dr. Sneha Deshmukh, BDS',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Dental Operatory & Ayush Unit',
    medicalHistory: {
      chronicConditions: ['Mild Gingivitis'],
      allergies: ['None known'],
      ongoingMedications: ['None'],
      previousVisitsCount: 1,
      vitalsAtBooking: {
        bp: '130/86 mmHg',
        pulse: 80
      }
    },
    priority: 'General / Routine',
    isHighRisk: false,
    bookingSource: 'Facility Walk-in',
    bookedBy: 'Reception Helpdesk Desk 1',
    bookedAt: '11 Sep 2026, 08:45 AM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '11:30 AM - 12:00 PM',
    estimatedWaitMinutes: 45,
    status: 'Scheduled',
    isDelayed: false,
    clinicalNotes: 'Walk-in registration at reception token kiosk.'
  },

  // 12. Scheduled Upcoming Today (Tele-Consult Escalation)
  {
    id: 'APT-2026-112',
    tokenNumber: 'ELD-09',
    patientName: 'Janabai Ramdas Salunkhe',
    patientAge: 71,
    patientGender: 'Female',
    patientPhone: '+91 94225 11984',
    abhaId: '33-8834-1290-7765',
    village: 'Andhale Pada',
    sector: 'KASARAMBALI SECTOR',
    department: 'Geriatrics & NCD',
    purposeOfVisit: 'Cataract vision deterioration & diabetic retinopathy screening follow-up',
    assignedDoctor: 'Dr. Ananya Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 1 (OPD & General Medicine)',
    medicalHistory: {
      chronicConditions: ['Type 2 Diabetes (12 yrs)', 'Bilateral Mature Cataract', 'Osteoporosis'],
      allergies: ['Ciprofloxacin eye drops irritation'],
      ongoingMedications: ['Glibenclamide 5mg OD', 'Calcium + Vitamin D3'],
      previousVisitsCount: 7,
      vitalsAtBooking: {
        bp: '144/88 mmHg',
        pulse: 70,
        bloodSugar: '186 mg/dL'
      }
    },
    priority: 'Elderly / Geriatric',
    isHighRisk: true,
    priorityReason: 'Elderly senior citizen (71y) vision impairment; scheduled for surgical camp referral',
    bookingSource: 'Tele-Consult Escalation',
    bookedBy: 'Dr. Rajesh Sharma, MD (Tele-Consult)',
    bookedAt: '10 Sep 2026, 03:30 PM',
    appointmentDate: '2026-09-11',
    appointmentTimeSlot: '12:00 PM - 12:30 PM',
    estimatedWaitMinutes: 50,
    status: 'Scheduled',
    isDelayed: false,
    clinicalNotes: 'Escalated from yesterday teleconsult session for physical slit lamp and fundus examination.'
  },

  // 13. Tomorrow Scheduled Appointment 1
  {
    id: 'APT-2026-113',
    tokenNumber: 'ANC-10',
    patientName: 'Priyanka Swapnil Kamble',
    patientAge: 26,
    patientGender: 'Female',
    patientPhone: '+91 97632 44190',
    abhaId: '33-9981-4432-6651',
    village: 'Rihe Village',
    sector: 'CHANDANAGIRI SECTOR',
    department: 'Obstetrics & Gynecology',
    purposeOfVisit: 'Maternal ANC 1st Trimester Confirmation & Nuchal Translucency Scan referral',
    assignedDoctor: 'Dr. Rajesh Sharma, MD',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 2 (Maternal & ANC Clinic)',
    medicalHistory: {
      chronicConditions: ['Hypothyroidism (subclinical)'],
      allergies: ['None reported'],
      ongoingMedications: ['Thyroxine 25mcg OD', 'Folic Acid 5mg OD'],
      previousVisitsCount: 1,
      vitalsAtBooking: {
        bp: '116/74 mmHg',
        pulse: 76,
        hemoglobin: 12.0
      }
    },
    priority: 'High-Risk Maternal',
    isHighRisk: false,
    priorityReason: 'Maternal 1st trimester baseline tests',
    bookingSource: 'SEVA-Lite (ASHA)',
    bookedBy: 'Sunita Patil (ASHA ID: MH-ASHA-1104)',
    bookedAt: '10 Sep 2026, 11:00 AM',
    appointmentDate: '2026-09-12',
    appointmentTimeSlot: '09:00 AM - 09:30 AM',
    status: 'Scheduled',
    isDelayed: false,
    clinicalNotes: 'ASHA recorded UPT positive test. Baseline maternal card generated.'
  },

  // 14. Tomorrow Scheduled Appointment 2
  {
    id: 'APT-2026-114',
    tokenNumber: 'PED-11',
    patientName: 'Master Tanmay Shinde (Mother: Bharati Shinde)',
    patientAge: 5,
    patientGender: 'Male',
    patientPhone: '+91 98600 77123',
    abhaId: '33-3391-8822-0199',
    village: 'Mangaon',
    sector: 'KASARAMBALI SECTOR',
    department: 'Pediatrics & Immunization',
    purposeOfVisit: 'DPT Booster 2 & School Entry Health Checkup',
    assignedDoctor: 'Dr. Vivek Kulkarni, MBBS, DCH',
    facilityName: 'Paud Central Primary Health Center',
    consultationRoom: 'Room 3 (Child Health & Immunization)',
    medicalHistory: {
      chronicConditions: ['Mild Asthma (seasonal)'],
      allergies: ['Dust / smoke sensitivity'],
      ongoingMedications: ['Salbutamol inhaler SOS'],
      previousVisitsCount: 4,
      vitalsAtBooking: {
        temp: '36.8 °C',
        weightKg: 16.5,
        pulse: 92
      }
    },
    priority: 'Child / Pediatric',
    isHighRisk: false,
    priorityReason: 'Pediatric pre-school immunization milestone',
    bookingSource: 'SEVA-Lite (ANM)',
    bookedBy: 'Meena Kulkarni (ANM Staff ID: MH-ANM-402)',
    bookedAt: '10 Sep 2026, 04:00 PM',
    appointmentDate: '2026-09-12',
    appointmentTimeSlot: '10:00 AM - 10:30 AM',
    status: 'Scheduled',
    isDelayed: false,
    clinicalNotes: 'ANM school health drive coordination.'
  }
];

export const PHC_DEPARTMENTS = [
  'All Departments',
  'Obstetrics & Gynecology',
  'Pediatrics & Immunization',
  'General Medicine',
  'Geriatrics & NCD',
  'Emergency & Trauma',
  'Dental & AYUSH'
] as const;

export const PHC_DOCTORS = [
  'All Doctors',
  'Dr. Ananya Sharma, MD',
  'Dr. Rajesh Sharma, MD',
  'Dr. Vivek Kulkarni, MBBS, DCH',
  'Dr. Sneha Deshmukh, BDS'
] as const;

export const PHC_FACILITIES = [
  'All Facilities',
  'Paud Central Primary Health Center',
  'Mulshi Rural Health Sector',
  'Pirangut Sub-District Hospital',
  'District Hospital Aundh'
] as const;
