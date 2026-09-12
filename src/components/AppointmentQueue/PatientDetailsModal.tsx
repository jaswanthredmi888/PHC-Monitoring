import React from 'react';
import { AppointmentItem } from '../../types';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Stethoscope, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  Download,
  Building2, 
  Smartphone, 
  AlertOctagon, 
  Activity, 
  Pill, 
  UserCheck, 
  FileText,
  Thermometer,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

interface PatientDetailsModalProps {
  appointment: AppointmentItem;
  onClose: () => void;
  onCheckIn: (id: string) => void;
  onStartConsultation?: (id: string) => void;
  onMarkCompleted: (id: string) => void;
  onMarkMissed: (id: string) => void;
  onPrintReceipt: (apt: AppointmentItem) => void;
  onCallPatientOrAsha: (apt: AppointmentItem) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  appointment: apt,
  onClose,
  onCheckIn,
  onStartConsultation,
  onMarkCompleted,
  onMarkMissed,
  onPrintReceipt,
  onCallPatientOrAsha,
}) => {
  const isEmergency = apt.priority === 'Emergency';
  const isMaternal = apt.priority === 'High-Risk Maternal';
  const isChild = apt.priority === 'Child / Pediatric';
  const isElderly = apt.priority === 'Elderly / Geriatric';

  const isWaiting = apt.status === 'Checked-In';
  const isInConsult = apt.status === 'In Consultation';
  const isCompleted = apt.status === 'Completed';
  const isMissed = apt.status === 'Missed';
  const isDelayed = apt.status === 'Delayed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Token Badge */}
            <div className={`px-3 py-1.5 rounded-xl font-mono text-sm font-black tracking-wider border ${
              isEmergency 
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse' 
                : isMaternal 
                ? 'bg-amber-500 text-white border-amber-300' 
                : isChild 
                ? 'bg-blue-600 text-white border-blue-400' 
                : isElderly 
                ? 'bg-purple-600 text-white border-purple-400' 
                : 'bg-slate-700 text-white border-slate-600'
            }`}>
              {apt.tokenNumber}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {apt.patientName}
                </h3>
                <span className="text-xs text-slate-300">
                  ({apt.patientAge}y / {apt.patientGender})
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{apt.village}, {apt.sector}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintReceipt(apt)}
              title="Download Official PDF Slip"
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-slate-700 text-xs">

          {/* Quick Badges Strip */}
          <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-100">
            {/* Priority Badge */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
              isEmergency 
                ? 'bg-rose-50 text-rose-800 border-rose-200' 
                : isMaternal 
                ? 'bg-amber-50 text-amber-900 border-amber-200' 
                : isChild 
                ? 'bg-blue-50 text-blue-900 border-blue-200' 
                : isElderly 
                ? 'bg-purple-50 text-purple-900 border-purple-200' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {isEmergency && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />}
              <span>{apt.priority}</span>
            </span>

            {/* Status Badge */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              isCompleted 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isInConsult
                ? 'bg-purple-50 text-purple-800 border-purple-200'
                : isWaiting
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : isDelayed
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : isMissed
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              Status: {apt.status === 'Checked-In' ? 'Waiting in Queue' : apt.status}
            </span>

            {/* Source */}
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>{apt.bookingSource}</span>
            </span>

            {/* ABHA Badge */}
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>ABHA: {apt.abhaId}</span>
            </span>
          </div>

          {/* Prominent Booking Date & Time + Scheduled Consultation Slot */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50/80 rounded-xl border border-blue-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Booking Date & Time
                </span>
                <p className="font-mono text-xs sm:text-sm font-black text-blue-950 mt-0.5">
                  {apt.bookedAt}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Registered by: <strong className="text-slate-800">{apt.bookedBy}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:border-l sm:border-slate-200 sm:pl-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Scheduled Consultation Slot
                </span>
                <p className="font-mono text-xs sm:text-sm font-black text-emerald-900 mt-0.5">
                  {apt.appointmentDate} • {apt.appointmentTimeSlot}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Department: <strong className="text-blue-700">{apt.department}</strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Purpose: <strong className="text-slate-800">{apt.purposeOfVisit}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Demographics Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-bold text-slate-900">{apt.patientPhone}</span>
                <button
                  onClick={() => onCallPatientOrAsha(apt)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition"
                  title="Call Patient"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Location / Village</span>
              <p className="font-medium text-xs text-slate-900 mt-0.5">
                {apt.village}, {apt.sector}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Consultation Facility</span>
              <p className="font-medium text-xs text-slate-900 mt-0.5">
                {apt.facilityName}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Booking Channel</span>
              <p className="font-medium text-xs text-slate-900 mt-0.5">
                {apt.bookingSource}
              </p>
            </div>
          </div>

          {/* Clinical Purpose & Doctor */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700">Department & Doctor</span>
                <p className="font-bold text-sm text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <span>{apt.department}</span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="text-slate-700">{apt.assignedDoctor}</span>
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Chief Complaint / Purpose of Visit</span>
              <p className="text-xs font-semibold text-slate-900 mt-0.5 bg-white p-2.5 rounded-lg border border-blue-100/80">
                {apt.purposeOfVisit}
              </p>
            </div>

            {apt.priorityReason && (
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Priority Triage Note:</strong> {apt.priorityReason}
                </div>
              </div>
            )}

            {isDelayed && apt.delayReason && (
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Transit Delay ({apt.delayedMinutes} mins):</strong> {apt.delayReason}
                </div>
              </div>
            )}

            {isMissed && apt.missedReason && (
              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-900 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Missed Appointment Note:</strong> {apt.missedReason}
                </div>
              </div>
            )}
          </div>

          {/* Vitals at Booking (if available) */}
          {apt.medicalHistory.vitalsAtBooking && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span>Recorded Baseline Vitals</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {apt.medicalHistory.vitalsAtBooking.bp && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Blood Pressure</span>
                    <p className="font-mono text-xs font-bold text-slate-900">{apt.medicalHistory.vitalsAtBooking.bp} mmHg</p>
                  </div>
                )}
                {apt.medicalHistory.vitalsAtBooking.pulse && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Pulse Rate</span>
                    <p className="font-mono text-xs font-bold text-slate-900">{apt.medicalHistory.vitalsAtBooking.pulse} bpm</p>
                  </div>
                )}
                {apt.medicalHistory.vitalsAtBooking.spo2 && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">SpO2 Oxygen</span>
                    <p className="font-mono text-xs font-bold text-slate-900">{apt.medicalHistory.vitalsAtBooking.spo2}%</p>
                  </div>
                )}
                {apt.medicalHistory.vitalsAtBooking.temp && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</span>
                    <p className="font-mono text-xs font-bold text-slate-900">{apt.medicalHistory.vitalsAtBooking.temp}</p>
                  </div>
                )}
                {apt.medicalHistory.vitalsAtBooking.bloodSugar && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Blood Sugar</span>
                    <p className="font-mono text-xs font-bold text-slate-900">{apt.medicalHistory.vitalsAtBooking.bloodSugar}</p>
                  </div>
                )}
                {apt.medicalHistory.vitalsAtBooking.hemoglobin && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Hemoglobin</span>
                    <p className="font-mono text-xs font-bold text-slate-900">{apt.medicalHistory.vitalsAtBooking.hemoglobin} g/dL</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical History & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-slate-500" />
                <span>Known Chronic Conditions</span>
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {apt.medicalHistory.chronicConditions.length > 0 ? (
                  apt.medicalHistory.chronicConditions.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-md bg-white text-slate-800 text-[11px] font-medium border border-slate-200">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">None recorded</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-rose-500 flex items-center gap-1">
                <Pill className="w-3 h-3 text-rose-500" />
                <span>Drug Allergies</span>
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {apt.medicalHistory.allergies.length > 0 ? (
                  apt.medicalHistory.allergies.map(a => (
                    <span key={a} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">No known drug allergies</span>
                )}
              </div>
            </div>
          </div>

          {/* Booking Audit Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-2 text-slate-600">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Booking Date & Time: <strong className="font-mono text-xs text-slate-900">{apt.bookedAt}</strong></span>
              </span>
              <span>Channel: <strong className="text-slate-900">{apt.bookingSource}</strong></span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
              <span>Booked by: <strong className="text-slate-900">{apt.bookedBy}</strong></span>
              <span>Check-In Time: <strong className="font-mono text-slate-900">{apt.checkInTime || 'Not checked-in yet'}</strong></span>
              {apt.completedTime && <span>Completed Time: <strong className="font-mono text-emerald-700">{apt.completedTime}</strong></span>}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCallPatientOrAsha(apt)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Call Patient / ASHA</span>
            </button>
            <button
              onClick={() => onPrintReceipt(apt)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 text-xs font-bold rounded-xl border border-blue-200 shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download PDF Slip</span>
            </button>
          </div>

          {/* Workflow Status Actions */}
          <div className="flex items-center gap-2">
            {apt.status === 'Scheduled' && (
              <button
                onClick={() => {
                  onCheckIn(apt.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Check-In Patient</span>
              </button>
            )}

            {/* Consultation Action: Only Mark as Completed is needed (no Call to Room button) */}
            {apt.status !== 'Completed' && apt.status !== 'Missed' && (
              <button
                onClick={() => {
                  onMarkCompleted(apt.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Completed</span>
              </button>
            )}

            {(apt.status === 'Scheduled' || apt.status === 'Delayed') && (
              <button
                onClick={() => {
                  onMarkMissed(apt.id);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-2 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl border border-rose-200 transition"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Mark Missed</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
