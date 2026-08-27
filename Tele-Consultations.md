# PHC Tele-Consultation Gateway & Clinical Command Hub

## 1. Overview & System Purpose

The **PHC Tele-Consultation Gateway** bridges grassroots rural health workers (**ASHA Sevikas** and **ANM Field Nurses**) with on-duty **Primary Health Center (PHC) Medical Officers** and **Specialist Consultants** across rural districts.

This subsystem provides real-time tele-triage, encrypted video/audio consultations, live vital-sign tele-monitoring, ABHA (Ayushman Bharat Health Account) verification, AI-assisted clinical decision support, digital e-prescriptions, and emergency tertiary hospital referral workflows.

---

## 2. Key Capabilities & Workflow

```
[ASHA Field Worker / Sub-Center]
          │
          ▼ 1. Books Consultation (Patient Vitals, Symptoms, ABHA ID)
[PHC Tele-Consultation Queue]
          │
          ▼ 2. Triage by Urgency (Critical, High, Medium, Routine)
[Doctor Live Consultation Room]
    ├─── Live Audio/Video Stream + Camera Toggles
    ├─── Patient Vitals Telemetry HUD (BP, HR, SpO2, Temp, Hb, Sugar)
    ├─── Gemini AI Clinical Decision Support (Differential Diagnosis & Rx Suggestions)
    ├─── Interactive E-Prescription Builder (Drug, Dosage, Duration, Directions)
    └─── Emergency 108 Ambulance & District Hospital Referral System
          │
          ▼ 3. Finalize & Transmit
[Digital Health Record / SMS / ASHA Tablet Sync]
```

### 2.1 Consultation Booking & Triage
1. **Intake Channels**:
   - **ASHA Field Workers**: Registered on-ground during home visits (maternal tracking, acute febrile illness, neonatal care).
   - **Sub-Center ANMs**: Booked at health wellness sub-centers.
   - **Direct Rural Patients**: Self-registered or walk-in queue.
2. **Urgency Classification**:
   - `Critical`: Severe preeclampsia (BP > 150/100 mmHg), acute respiratory distress, severe postpartum hemorrhage risk, severe pediatric dehydration.
   - `High`: High fever (>39°C), suspected dengue/malaria, gestational diabetes review, severe anemia (Hb < 7.0 g/dL).
   - `Medium`: Chronic hypertension follow-up, subacute infections, joint pain.
   - `Routine`: Post-natal HBNC day 14/28 checks, routine immunization clearance.

---

## 3. Doctor Consultation Room Architecture

### 3.1 Split-Screen Clinical HUD
The consultation interface (`DoctorConsultationRoom.tsx`) provides an integrated split-view:
- **Left Column (Video & Telemetry Stream)**:
  - Simulated high-definition interactive video stream for doctor and rural patient/ASHA worker.
  - Video stream controls: Audio mute/unmute, camera toggle, call termination.
  - Live patient identity banner with age, gender, village, and designated ASHA worker.
  - Vitals HUD displaying:
    - **Blood Pressure (BP)**: Highlighted in red if systolic > 140 or diastolic > 90.
    - **Heart Rate (Pulse)**: Live bpm telemetry.
    - **Blood Oxygen Saturation ($SpO_2$)**: Percentage gauge.
    - **Body Temperature**: Celsius readouts with fever thresholds.
    - **Hemoglobin ($Hb$) & Blood Glucose**: Point-of-care lab values.
- **Right Column (Clinical Decision Support & Rx)**:
  - Chief clinical complaint and presentation timeline.
  - One-click **Gemini AI Clinical Assist** trigger.
  - Structured physician clinical notes editor.
  - Digital E-Prescription management.
  - Tertiary care referral toggle with hospital assignment.

---

## 4. Gemini AI Clinical Decision Support

The tele-consultation platform integrates Gemini AI via `/api/gemini/teleconsult-assist` to provide evidence-based clinical guidance suited for rural PHC practice under National Health Mission (NHM) protocols.

### 4.1 Endpoint Specification
- **Method**: `POST`
- **Route**: `/api/gemini/teleconsult-assist`
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "patientName": "Pooja Sanjay Kadam",
  "age": 24,
  "gender": "Female",
  "pregnancyStatus": "Pregnant (3rd Trimester - 32 Wks)",
  "symptoms": "Severe frontal headache, blurred vision, bilateral pedal edema, field BP 158/104 mmHg.",
  "vitals": {
    "bloodPressure": "158/104",
    "heartRate": 88,
    "spo2": 98,
    "temperature": 37.1,
    "hemoglobin": 8.2,
    "bloodSugar": 112
  },
  "medicalHistory": "High gestational hypertension risk"
}
```

#### Response Payload (Structured JSON)
```json
{
  "differentialDiagnosis": [
    "Severe Pre-eclampsia / Impending Eclampsia",
    "Gestational Hypertension with severe features",
    "Nutritional Microcytic Anemia (moderate)"
  ],
  "recommendedActions": [
    "Administer loading dose of Magnesium Sulfate (Pritchard/Zuspan regimen) if eclampsia signs present",
    "Initiate Oral Labetalol 100mg or Nifedipine 10mg immediately for acute BP control",
    "Arrange immediate 108 Emergency Ambulance transfer to District Women Hospital",
    "Perform urgent spot urine albumin dipstick test"
  ],
  "suggestedMedications": [
    {
      "name": "Labetalol 100mg",
      "dosage": "1 Tab BID",
      "duration": "5 Days"
    },
    {
      "name": "Magnesium Sulfate 50% Injection",
      "dosage": "As per emergency obstetric protocol",
      "duration": "Immediate loading dose"
    }
  ],
  "urgencyLevel": "Critical",
  "doctorNotesSummary": "Patient presents at 32 weeks gestation with severe pre-eclampsia warning signs. Immediate stabilization and emergency tertiary referral recommended."
}
```

### 4.2 Graceful Offline / Fallback Mode
When no `GEMINI_API_KEY` is present in the environment, the server automatically serves curated, high-accuracy NHM-compliant clinical guidance without disrupting the doctor's workflow.

---

## 5. E-Prescriptions & Referral Escalation

### 5.1 Digital Prescription Generator
- **Supported Fields**: Medicine name, dosage frequency (`1 Tab OD`, `1 Tab BID`, `1 Tab TID SOS`), duration (`3 Days`, `30 Days`), and special instructions (e.g., *"Take after meals with warm water"*).
- **Auto-Sync to Pharmacy**: Prescriptions generated in the consultation room directly update the PHC dispensary dispense queue.

### 5.2 Emergency Referral & 108 Ambulance Dispatch
- For cases marked `Critical` or requiring specialist obstetric/pediatric interventions:
  - Generates referral summaries with ABHA identification.
  - Pre-populates clinical reason and dispatch parameters for the district tertiary hospital (e.g., Sassoon General Hospital / District Women Hospital).
  - Triggers real-time ambulance dispatch tracker with estimated ETA.

---

## 6. TypeScript Data Interfaces

```typescript
export interface TeleconsultationRequest {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  abhaId?: string;
  village: string;
  sector: string;
  source: 'ASHA Field Worker' | 'Sub-Center ANM' | 'Direct Patient';
  bookedBy: string;
  requestTime: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Routine';
  specialty: 'OB/GYN & Maternal' | 'Pediatrics' | 'General Physician' | 'Infectious Disease';
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
```

---

## 7. Field Best Practices & Guidelines

1. **Bandwidth Optimization**: The video subsystem supports degraded connection modes, allowing seamless fallback to audio-only + vitals telemetry over 2G/3G rural networks.
2. **ASHA Assisted Protocol**: Field workers must verify identity using the patient's 14-digit ABHA ID and record resting vitals 5 minutes prior to establishing the video call.
3. **Audit Trail & Privacy**: All consultation timestamps, doctor notes, and prescribed interventions are logged with timestamped verification for medico-legal and National Health Mission compliance.
