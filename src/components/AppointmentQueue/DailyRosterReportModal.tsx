import React, { useState, useMemo } from 'react';
import { AppointmentItem } from '../../types';
import { 
  Printer, 
  X, 
  Calendar, 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Stethoscope,
  Filter,
  ArrowRight
} from 'lucide-react';

interface DailyRosterReportModalProps {
  appointments: AppointmentItem[];
  currentFacility: string;
  initialDate?: string;
  onClose: () => void;
}

export const DailyRosterReportModal: React.FC<DailyRosterReportModalProps> = ({
  appointments,
  currentFacility,
  initialDate = '2026-09-11',
  onClose
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  // Filter appointments for the selected day
  const dayAppointments = useMemo(() => {
    return appointments.filter(a => a.appointmentDate === selectedDate);
  }, [appointments, selectedDate]);

  // Metrics for selected day
  const totalBooked = dayAppointments.length;
  const waitingCount = dayAppointments.filter(a => a.status === 'Checked-In').length;
  const inConsultationCount = dayAppointments.filter(a => a.status === 'In Consultation').length;
  const completedCount = dayAppointments.filter(a => a.status === 'Completed').length;
  const missedCount = dayAppointments.filter(a => a.status === 'Missed').length;
  const delayedCount = dayAppointments.filter(a => a.status === 'Delayed').length;
  const emergencyCount = dayAppointments.filter(a => a.priority === 'Emergency').length;
  const maternalCount = dayAppointments.filter(a => a.priority === 'High-Risk Maternal').length;

  // Department breakdown
  const departmentCounts = useMemo(() => {
    const map: Record<string, number> = {};
    dayAppointments.forEach(a => {
      map[a.department] = (map[a.department] || 0) + 1;
    });
    return map;
  }, [dayAppointments]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print-bg">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 print-container">
        
        {/* Top Header Bar (Controls hidden in print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Daily Appointment Roster & Queue Report</h3>
              <p className="text-[11px] text-slate-400">Total appointments booked summary and printable official day register</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Date Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-[11px] font-semibold text-slate-300">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 text-white text-xs font-mono font-medium rounded px-2 py-0.5 border border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Day Roster</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Roster Sheet */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 space-y-6">
          
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-orange-500 font-black text-xl tracking-tight">SEVA</span>
              <span className="text-green-600 font-black text-xl tracking-tight">Link</span>
              <span className="text-slate-900 font-bold text-xl tracking-tight">Monitoring</span>
            </div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
              Daily Outpatient Appointment & Triage Roster
            </h2>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              Rural HealthCare Eco System - Maharashtra • Directorate of Health Services (DHS)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs font-medium text-slate-700">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span>{currentFacility}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-semibold">
                <Calendar className="w-3 h-3" />
                <span>Roster Date: {selectedDate}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                <span>Total Booked: {totalBooked} Patients</span>
              </span>
            </div>
          </div>

          {/* Quick Stats Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Booked</span>
              <span className="text-xl font-black text-slate-900 font-mono">{totalBooked}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">For {selectedDate}</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Waiting in Queue</span>
              <span className="text-xl font-black text-blue-800 font-mono">{waitingCount}</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Checked-in</span>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">In Consultation</span>
              <span className="text-xl font-black text-purple-800 font-mono">{inConsultationCount}</span>
              <span className="text-[10px] text-purple-600 block mt-0.5">Active</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Completed</span>
              <span className="text-xl font-black text-emerald-800 font-mono">{completedCount}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Discharged/RX</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Delayed</span>
              <span className="text-xl font-black text-amber-900 font-mono">{delayedCount}</span>
              <span className="text-[10px] text-amber-700 block mt-0.5">Follow-up needed</span>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Missed / No-Show</span>
              <span className="text-xl font-black text-rose-800 font-mono">{missedCount}</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Flagged for ASHA</span>
            </div>
          </div>

          {/* Department Breakdown Bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Bookings by Clinical Department
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(departmentCounts).map(([dept, count]) => (
                <span key={dept} className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{dept}:</span>
                  <strong className="font-mono text-slate-900">{count}</strong>
                </span>
              ))}
              {Object.keys(departmentCounts).length === 0 && (
                <span className="text-slate-400 italic">No appointments scheduled for this date.</span>
              )}
            </div>
          </div>

          {/* Comprehensive Patients List Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Patient Schedule Roster (Date: {selectedDate})
              </h4>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {dayAppointments.length} Record(s)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 font-semibold text-slate-600">
                  <tr>
                    <th scope="col" className="px-3 py-2">Token</th>
                    <th scope="col" className="px-3 py-2">Slot</th>
                    <th scope="col" className="px-3 py-2">Patient Details</th>
                    <th scope="col" className="px-3 py-2">Department & Purpose</th>
                    <th scope="col" className="px-3 py-2">Attending Doctor</th>
                    <th scope="col" className="px-3 py-2">Booked By</th>
                    <th scope="col" className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {dayAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2.5 whitespace-nowrap font-mono font-bold text-slate-900">
                        #{apt.tokenNumber}
                        <span className="block text-[9px] font-normal uppercase text-slate-400">
                          {apt.priority.split('/')[0]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap font-mono text-slate-600">
                        {apt.appointmentTimeSlot.split(' - ')[0]}
                      </td>
                      <td className="px-3 py-2.5">
                        <strong className="text-slate-900 block font-semibold">{apt.patientName}</strong>
                        <span className="text-[11px] text-slate-500">
                          {apt.patientAge}y • {apt.patientGender} • {apt.village}
                        </span>
                        <span className="block text-[10px] font-mono text-blue-700">ABHA: {apt.abhaId}</span>
                      </td>
                      <td className="px-3 py-2.5 max-w-xs">
                        <span className="text-[11px] font-semibold text-slate-800 block">{apt.department}</span>
                        <span className="text-[10px] text-slate-600 line-clamp-1">{apt.purposeOfVisit}</span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="font-medium text-slate-800 block">{apt.assignedDoctor.split(',')[0]}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-semibold text-slate-800 block text-[11px]">{apt.bookingSource}</span>
                        <span className="text-[10px] text-slate-500 truncate block max-w-32">{apt.bookedBy}</span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : apt.status === 'In Consultation'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : apt.status === 'Checked-In'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : apt.status === 'Delayed'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : apt.status === 'Missed'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {dayAppointments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                        No appointments found for date {selectedDate}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Roster Authentication Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              <p className="font-medium text-slate-700">Official Primary Health Center Medical Records Register</p>
              <p className="text-[10px]">National Health Mission • Health & Family Welfare Department, Maharashtra</p>
            </div>
            <div className="text-right font-mono text-[10px]">
              <p>Printed On: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()}</p>
              <p>Certified by Medical Officer on Duty</p>
            </div>
          </div>

        </div>

        {/* Bottom Actions (Hidden in print) */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Export or print complete appointment ledger for audits and daily queue monitoring.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Day Roster Sheet</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
