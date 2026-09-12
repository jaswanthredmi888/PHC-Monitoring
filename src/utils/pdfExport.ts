import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReferralItem, AppointmentItem } from '../types';

/**
 * Export filtered referrals registry to a formatted official PDF document
 */
export const exportReferralsToPDF = (referrals: ReferralItem[], filterTitle = 'All Referrals'): void => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const total = referrals.length;
  const pending = referrals.filter(r => r.status !== 'Completed').length;
  const completed = referrals.filter(r => r.status === 'Completed').length;
  const delayed = referrals.filter(r => r.isDelayed || r.followUpStatus === 'Missed' || r.followUpStatus === 'Overdue').length;
  const highRisk = referrals.filter(r => r.isHighRisk).length;

  // Header band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 297, 24, 'F');

  // Title & Department
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NATIONAL HEALTH MISSION - GOVERNMENT OF MAHARASHTRA', 14, 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('SEVA Digital Health Network • Referral & Grassroots Continuum of Care Register', 14, 16);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated: ${currentDate}`, 283, 10, { align: 'right' });
  doc.text(`Scope: ${filterTitle}`, 283, 16, { align: 'right' });

  // Summary Metrics Bar
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 28, 269, 13, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 28, 269, 13, 'S');

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Records: ${total}`, 20, 36);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text(`Pending: ${pending}`, 75, 36);
  doc.setTextColor(21, 128, 61); // emerald-700
  doc.text(`Completed: ${completed}`, 125, 36);
  doc.setTextColor(190, 18, 60); // rose-700
  doc.text(`Delayed / Missed: ${delayed}`, 175, 36);
  doc.setTextColor(126, 34, 206); // purple-700
  doc.text(`High-Risk ANC/Pediatric: ${highRisk}`, 230, 36);

  // Table Data Preparation
  const tableData = referrals.map((r, index) => {
    return [
      `${index + 1}`,
      `${r.id}\n${r.familyId}${r.isHighRisk ? '\n[HIGH RISK]' : ''}`,
      `${r.patientName} (${r.patientAge}y/${r.patientGender[0]})\n${r.village}`,
      `${r.referredHospital}\n${r.referredDepartment}`,
      `${r.priority}\n${r.category.split(' ')[0]}`,
      `${r.referralDate}`,
      `${r.status}${!r.hasReached && r.status !== 'Completed' ? '\n(In Transit)' : ''}${r.isDelayed ? '\n[DELAYED]' : ''}`,
      `${r.followUpDate} (${r.followUpStatus})\n${r.followUpNotes ? r.followUpNotes.substring(0, 32) + '...' : 'None'}`,
      `${r.referringWorkerName}\n${r.referringFacility}`
    ];
  });

  autoTable(doc, {
    startY: 45,
    head: [[
      '#',
      'Patient & Family ID',
      'Patient Demographics',
      'Referred Facility & Dept',
      'Priority',
      'Ref. Date',
      'Current Status',
      'Follow-up & Notes',
      'Referring Worker'
    ]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      valign: 'middle'
    },
    headStyles: {
      fillColor: [30, 58, 138], // blue-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 36 },
      3: { cellWidth: 42 },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 26, halign: 'center' },
      7: { cellWidth: 43 },
      8: { cellWidth: 42 }
    },
    didParseCell: (data) => {
      // Highlight High Risk in red/purple
      if (data.column.index === 1 && typeof data.cell.raw === 'string' && data.cell.raw.includes('[HIGH RISK]')) {
        data.cell.styles.textColor = [190, 18, 60];
      }
      // Status coloring
      if (data.column.index === 6 && typeof data.cell.raw === 'string') {
        if (data.cell.raw.includes('Completed')) {
          data.cell.styles.textColor = [21, 128, 61];
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw.includes('DELAYED')) {
          data.cell.styles.textColor = [225, 29, 72];
          data.cell.styles.fontStyle = 'bold';
        }
      }
      // Priority coloring
      if (data.column.index === 4 && typeof data.cell.raw === 'string') {
        if (data.cell.raw.includes('Critical')) {
          data.cell.styles.textColor = [225, 29, 72];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    foot: [[
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      `Report verified by Medical Officer • Total: ${total}`
    ]],
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [71, 85, 105],
      fontStyle: 'italic',
      fontSize: 8,
      halign: 'right'
    },
    margin: { left: 14, right: 14, top: 45, bottom: 18 }
  });

  // Footer on each page
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Confidential Healthcare Record • Public Health Department, Govt of Maharashtra • SEVA Clinical Tracking System',
      14,
      202
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      283,
      202,
      { align: 'right' }
    );
  }

  // Save the document
  const fileName = `NHM_Referrals_Report_${filterTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};

/**
 * Export single patient referral slip PDF for printing or patient dispatch
 */
export const exportSingleReferralSlipPDF = (referral: ReferralItem): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header band
  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('NATIONAL HEALTH MISSION - GOVERNMENT OF MAHARASHTRA', 105, 11, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(219, 234, 254);
  doc.text('PUBLIC HEALTH DEPARTMENT • PATIENT REFERRAL & FOLLOW-UP SLIP', 105, 17, { align: 'center' });
  doc.text('Grassroots to Secondary / Tertiary Healthcare Continuum', 105, 22, { align: 'center' });

  // Status & Priority Banner
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 34, 182, 16, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 34, 182, 16, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Referral ID: ${referral.id}`, 20, 41);
  doc.text(`Family ID: ${referral.familyId}`, 20, 46);

  doc.text(`Priority: ${referral.priority.toUpperCase()}`, 110, 41);
  doc.text(`Status: ${referral.status.toUpperCase()}`, 110, 46);

  if (referral.isHighRisk) {
    doc.setTextColor(225, 29, 72);
    doc.text('★ HIGH-RISK CASE', 160, 41);
  }

  // Patient Info Box
  autoTable(doc, {
    startY: 54,
    head: [['PATIENT INFORMATION', 'DETAILS']],
    body: [
      ['Full Name', referral.patientName],
      ['Age / Gender', `${referral.patientAge} Years / ${referral.patientGender}`],
      ['Contact Phone', referral.patientPhone || 'Not provided'],
      ['Village / Sector', `${referral.village}, Sector ${referral.sector}`],
      ['Category', referral.category],
      ['High-Risk Clinical Flag', referral.isHighRisk ? (referral.highRiskReason || 'Maternal / Severe risk flagged') : 'Standard referral']
    ],
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85], fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 2.2 },
    columnStyles: { 0: { cellWidth: 55, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 }
  });

  // Referring & Target Hospital Information
  const currentY = (doc as any).lastAutoTable.finalY + 6;
  autoTable(doc, {
    startY: currentY,
    head: [['REFERRAL FACILITY & DESTINATION', 'FACILITY DETAILS']],
    body: [
      ['Referring Health Center', referral.referringFacility],
      ['Referring Frontline Worker', `${referral.referringWorkerName} (${referral.referringWorkerRole}) - Ph: ${referral.referringWorkerPhone}`],
      ['Referred Target Hospital', referral.referredHospital],
      ['Target Specialist Department', referral.referredDepartment],
      ['Referral Date & Time', referral.fullReferralDate || referral.referralDate]
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 2.2 },
    columnStyles: { 0: { cellWidth: 55, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 }
  });

  // Clinical Indication & Instructions
  const nextY = (doc as any).lastAutoTable.finalY + 6;
  autoTable(doc, {
    startY: nextY,
    head: [['CLINICAL NOTES & FOLLOW-UP SCHEDULE', 'CLINICAL GUIDELINES']],
    body: [
      ['Reason for Referral', referral.reasonForReferral],
      ['Clinical Assessment Notes', referral.clinicalNotes],
      ['Transit Arrival Status', referral.hasReached ? 'Patient Confirmed Reached at Hospital' : (referral.isDelayed ? `Transit Delay Flagged (${referral.delayedReason || 'Pending arrival'})` : 'In Transit / Dispatched')],
      ['Scheduled Follow-up Date', `${referral.fullFollowUpDate || referral.followUpDate} (${referral.followUpStatus})`],
      ['Follow-up Plan & Advice', referral.followUpNotes || 'Patient advised to attend designated follow-up check at Sub-Center post hospital consultation.']
    ],
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 2.2 },
    columnStyles: { 0: { cellWidth: 55, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 }
  });

  // Signature Block
  const sigY = (doc as any).lastAutoTable.finalY + 18;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, sigY, 74, sigY);
  doc.line(134, sigY, 194, sigY);

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Signature of Referring Officer / ASHA', 14, sigY + 5);
  doc.text('Signature of Receiving Hospital Specialist', 134, sigY + 5);

  // Disclaimer & Instructions Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Notice: Carry this referral slip and Aadhaar/ABHA Card to the receiving hospital OPD counter for fast-track admission.',
    105,
    280,
    { align: 'center' }
  );

  doc.save(`Referral_Slip_${referral.id}.pdf`);
};

/**
 * Directly generate and download official PHC Appointment Receipt & Queue Token PDF
 */
export const exportAppointmentReceiptPDF = (appointment: AppointmentItem): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const isEmergency = appointment.priority === 'Emergency';
  const isMaternal = appointment.priority === 'High-Risk Maternal';

  // 1. Official Header Top Band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('NATIONAL HEALTH MISSION - GOVERNMENT OF MAHARASHTRA', 105, 11, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(219, 234, 254); // blue-100
  doc.text('PUBLIC HEALTH DEPARTMENT • PRIMARY HEALTHCARE OUTPATIENT APPOINTMENT SLIP', 105, 17, { align: 'center' });
  doc.text('SEVA Digital Healthcare Network • Electronic Queue & Triage Gateway', 105, 22, { align: 'center' });

  // 2. Facility & Generation Banner
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 30, 182, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 30, 182, 8, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Facility: ${appointment.facilityName}`, 18, 35.5);

  const downloadTime = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated: ${downloadTime}`, 192, 35.5, { align: 'right' });

  // 3. Prominent Queue Token & Timing Box
  doc.setFillColor(isEmergency ? 255 : 248, isEmergency ? 241 : 250, isEmergency ? 242 : 252);
  doc.rect(14, 41, 182, 25, 'F');
  doc.setDrawColor(isEmergency ? 244 : 203, isEmergency ? 63 : 213, isEmergency ? 94 : 225);
  doc.setLineWidth(isEmergency ? 0.8 : 0.4);
  doc.rect(14, 41, 182, 25, 'S');
  doc.setLineWidth(0.2); // reset

  // Token Number
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isEmergency ? 225 : 71, isEmergency ? 29 : 85, isEmergency ? 72 : 105);
  doc.text('QUEUE TOKEN NUMBER', 20, 47);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isEmergency ? 225 : 15, isEmergency ? 29 : 23, isEmergency ? 72 : 42);
  doc.text(`#${appointment.tokenNumber}`, 20, 56);

  // Priority Pill text
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  if (isEmergency) {
    doc.setTextColor(225, 29, 72);
    doc.text(`[ ${appointment.priority.toUpperCase()} - IMMEDIATE ATTENTION ]`, 20, 62);
  } else if (isMaternal) {
    doc.setTextColor(180, 83, 9);
    doc.text(`[ ${appointment.priority.toUpperCase()} ]`, 20, 62);
  } else {
    doc.setTextColor(37, 99, 235);
    doc.text(`[ Priority: ${appointment.priority} ]`, 20, 62);
  }

  // Right column: Schedule slot & Booking Date/Time
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('APPOINTMENT DETAILS', 110, 47);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`Appointment Date & Slot:`, 110, 52);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text(`${appointment.appointmentDate} (${appointment.appointmentTimeSlot})`, 147, 52);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`Booking Date & Time:`, 110, 57);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${appointment.bookedAt}`, 147, 57);

  doc.setFont('helvetica', 'normal');
  doc.text(`Attending Doctor:`, 110, 62);
  doc.setFont('helvetica', 'bold');
  doc.text(`${appointment.assignedDoctor.split(',')[0]}`, 147, 62);

  // 4. Patient Identification Table
  autoTable(doc, {
    startY: 69,
    head: [['1. PATIENT IDENTIFICATION & DEMOGRAPHICS', 'REGISTERED DETAILS']],
    body: [
      ['Patient Full Name', appointment.patientName],
      ['Age / Gender', `${appointment.patientAge} Years / ${appointment.patientGender}`],
      ['Contact Phone Number', appointment.patientPhone],
      ['Ayushman Bharat ID (ABHA)', appointment.abhaId],
      ['Village / Health Sector', `${appointment.village}, Sector ${appointment.sector}`],
      ['Queue Status', appointment.status === 'Checked-In' ? 'Checked-In (Waiting in Queue)' : appointment.status]
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], fontSize: 8.5, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.2 },
    columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold', textColor: [51, 65, 85] } },
    margin: { left: 14, right: 14 }
  });

  // 5. Clinical Department & Purpose of Visit
  const currentY = (doc as any).lastAutoTable.finalY + 4;
  autoTable(doc, {
    startY: currentY,
    head: [['2. CLINICAL DEPARTMENT & PURPOSE OF VISIT', 'CONSULTATION DETAILS']],
    body: [
      ['Clinical Department', appointment.department],
      ['Attending Physician / Specialist', appointment.assignedDoctor],
      ['Consultation Facility', appointment.facilityName],
      ['Chief Complaint / Purpose of Visit', appointment.purposeOfVisit],
      ['Priority / Triage Justification', appointment.priorityReason || 'Standard primary care consultation']
    ],
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], fontSize: 8.5, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.2 },
    columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold', textColor: [51, 65, 85] } },
    margin: { left: 14, right: 14 }
  });

  // 6. Medical History & Baseline Vitals
  const vitalsY = (doc as any).lastAutoTable.finalY + 4;
  const vitals = appointment.medicalHistory.vitalsAtBooking;
  const vitalsStr = vitals 
    ? `BP: ${vitals.bp || '--'} | Pulse: ${vitals.pulse ? vitals.pulse + ' bpm' : '--'} | SpO2: ${vitals.spo2 ? vitals.spo2 + '%' : '--'} | Temp: ${vitals.temp || '--'}${vitals.hemoglobin ? ' | Hb: ' + vitals.hemoglobin + 'g/dL' : ''}${vitals.bloodSugar ? ' | Sugar: ' + vitals.bloodSugar : ''}`
    : 'No baseline vitals recorded at booking';

  autoTable(doc, {
    startY: vitalsY,
    head: [['3. CLINICAL HISTORY & BASELINE VITALS', 'RECORDED STATUS']],
    body: [
      ['Recorded Baseline Vitals', vitalsStr],
      ['Known Chronic Conditions', appointment.medicalHistory.chronicConditions.length > 0 ? appointment.medicalHistory.chronicConditions.join(', ') : 'None declared'],
      ['Known Drug Allergies', appointment.medicalHistory.allergies.length > 0 ? appointment.medicalHistory.allergies.join(', ') : 'No known drug allergies'],
      ['Ongoing Medications', appointment.medicalHistory.ongoingMedications.length > 0 ? appointment.medicalHistory.ongoingMedications.join(', ') : 'None']
    ],
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85], fontSize: 8.5, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.2 },
    columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold', textColor: [51, 65, 85] } },
    margin: { left: 14, right: 14 }
  });

  // 7. Booking Audit Trail (Highlighting booking date & time)
  const auditY = (doc as any).lastAutoTable.finalY + 4;
  autoTable(doc, {
    startY: auditY,
    head: [['4. BOOKING AUDIT TRAIL', 'REGISTRATION METADATA']],
    body: [
      ['Booking Date & Time', appointment.bookedAt],
      ['Appointment Slot', `${appointment.appointmentDate} (${appointment.appointmentTimeSlot})`],
      ['Booked By', appointment.bookedBy],
      ['Booking Source Channel', appointment.bookingSource],
      ['Check-In Time at Facility', appointment.checkInTime || 'Pending patient arrival / check-in'],
      ['Completion Time', appointment.completedTime || 'Consultation in progress or queued']
    ],
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], fontSize: 8.5, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.2 },
    columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold', textColor: [51, 65, 85] } },
    margin: { left: 14, right: 14 }
  });

  // 8. Sign-off / Verification Stamp Simulation
  const endY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, endY, 182, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, endY, 182, 14, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('PATIENT INSTRUCTIONS & NDHM VERIFICATION:', 18, endY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Please present this electronic slip at the PHC OPD Registration Counter upon arrival. Bring your ABHA/Aadhaar card.',
    18,
    endY + 9.5
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(`Digital Security Stamp: MH-PHC-NDHM-VERIFIED • Token #${appointment.tokenNumber}`, 192, endY + 9.5, { align: 'right' });

  // Save the PDF file directly
  const safeName = appointment.patientName.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Appointment_Slip_${appointment.tokenNumber}_${safeName}.pdf`;
  doc.save(fileName);
};

