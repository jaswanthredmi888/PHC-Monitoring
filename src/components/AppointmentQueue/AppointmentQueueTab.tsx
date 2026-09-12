import React, { useState, useMemo } from 'react';
import { AppointmentItem, AppointmentPriority, AppointmentStatus, BookingSource } from '../../types';
import { INITIAL_APPOINTMENTS, PHC_DEPARTMENTS, PHC_DOCTORS, PHC_FACILITIES } from '../../data/appointmentMockData';
import { AppointmentAnalyticsCards } from './AppointmentAnalyticsCards';
import { DailyRosterReportModal } from './DailyRosterReportModal';
import { PatientDetailsModal } from './PatientDetailsModal';
import { exportAppointmentReceiptPDF } from '../../utils/pdfExport';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download,
  UserCheck, 
  PhoneCall, 
  ArrowUpDown, 
  ShieldAlert, 
  Stethoscope, 
  Baby, 
  Building2,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  CalendarCheck,
  FileSpreadsheet
} from 'lucide-react';

interface AppointmentQueueTabProps {
  onInitiateTeleconsult?: (patientName?: string, sectorName?: string) => void;
}

export const AppointmentQueueTab: React.FC<AppointmentQueueTabProps> = ({
  onInitiateTeleconsult
}) => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All Priorities');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('All Doctors');
  const [selectedFacility, setSelectedFacility] = useState<string>('All Facilities');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('today'); // 'today' | 'tomorrow' | 'all' | custom YYYY-MM-DD
  const [customDate, setCustomDate] = useState<string>('2026-09-11');
  const [analyticsFilterStatus, setAnalyticsFilterStatus] = useState<string>('all');
  const [sortMode, setSortMode] = useState<'priority-first' | 'token-slot'>('priority-first');

  // Modals state
  const [isDailyRosterOpen, setIsDailyRosterOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<AppointmentItem | null>(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Direct PDF Download Handler (No popup receipt modal)
  const handleDownloadReceiptPdf = (apt: AppointmentItem) => {
    try {
      exportAppointmentReceiptPDF(apt);
      showToast(`Downloaded official PDF slip for ${apt.patientName} (Token #${apt.tokenNumber})`);
    } catch (err) {
      console.error('Failed to generate PDF slip:', err);
      showToast('Error generating PDF slip. Please try again.');
    }
  };

  // Target date calculated
  const activeDateString = useMemo(() => {
    if (selectedDateFilter === 'today') return '2026-09-11';
    if (selectedDateFilter === 'tomorrow') return '2026-09-12';
    if (selectedDateFilter === 'custom') return customDate;
    return 'all';
  }, [selectedDateFilter, customDate]);

  // Priority weight mapping for "Priority First" sorting
  const getPriorityWeight = (priority: AppointmentPriority) => {
    switch (priority) {
      case 'Emergency': return 100;
      case 'High-Risk Maternal': return 80;
      case 'Child / Pediatric': return 60;
      case 'Elderly / Geriatric': return 50;
      case 'General / Routine': return 20;
      default: return 10;
    }
  };

  // Status weight mapping (waiting/in-consultation first)
  const getStatusWeight = (status: AppointmentStatus) => {
    switch (status) {
      case 'In Consultation': return 90;
      case 'Checked-In': return 80;
      case 'Delayed': return 50;
      case 'Scheduled': return 40;
      case 'Completed': return 10;
      case 'Missed': return 5;
      default: return 0;
    }
  };

  // Filtered & Sorted Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = apt.patientName.toLowerCase().includes(q);
        const matchesToken = apt.tokenNumber.toLowerCase().includes(q);
        const matchesPhone = apt.patientPhone.includes(q);
        const matchesAbha = apt.abhaId.toLowerCase().includes(q);
        const matchesVillage = apt.village.toLowerCase().includes(q);
        const matchesDoctor = apt.assignedDoctor.toLowerCase().includes(q);
        if (!matchesName && !matchesToken && !matchesPhone && !matchesAbha && !matchesVillage && !matchesDoctor) {
          return false;
        }
      }

      // 2. Analytics Card Filter
      if (analyticsFilterStatus === 'Checked-In') {
        if (apt.status !== 'Checked-In') return false;
      } else if (analyticsFilterStatus === 'Completed') {
        if (apt.status !== 'Completed') return false;
      } else if (analyticsFilterStatus === 'Delayed') {
        if (apt.status !== 'Delayed') return false;
      } else if (analyticsFilterStatus === 'Missed') {
        if (apt.status !== 'Missed') return false;
      } else if (analyticsFilterStatus === 'priority') {
        if (apt.priority !== 'Emergency' && apt.priority !== 'High-Risk Maternal') return false;
      }

      // 3. Dropdown Filters
      if (selectedPriority !== 'All Priorities' && apt.priority !== selectedPriority) {
        return false;
      }
      if (selectedDepartment !== 'All Departments' && apt.department !== selectedDepartment) {
        return false;
      }
      if (selectedDoctor !== 'All Doctors' && apt.assignedDoctor !== selectedDoctor) {
        return false;
      }
      if (selectedFacility !== 'All Facilities' && apt.facilityName !== selectedFacility) {
        return false;
      }

      // 4. Date Filter
      if (activeDateString !== 'all' && apt.appointmentDate !== activeDateString) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortMode === 'priority-first') {
        // First by status active, then priority
        const statusDiff = getStatusWeight(b.status) - getStatusWeight(a.status);
        if (statusDiff !== 0) return statusDiff;
        const prioDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        if (prioDiff !== 0) return prioDiff;
        return a.tokenNumber.localeCompare(b.tokenNumber);
      } else {
        return a.appointmentTimeSlot.localeCompare(b.appointmentTimeSlot);
      }
    });
  }, [
    appointments, 
    searchQuery, 
    analyticsFilterStatus, 
    selectedPriority, 
    selectedDepartment, 
    selectedDoctor, 
    selectedFacility, 
    activeDateString, 
    sortMode
  ]);

  // Overall counts for analytics cards
  const totalCount = appointments.length;
  const waitingCount = appointments.filter(a => a.status === 'Checked-In').length;
  const inConsultCount = appointments.filter(a => a.status === 'In Consultation').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const missedCount = appointments.filter(a => a.status === 'Missed').length;
  const delayedCount = appointments.filter(a => a.status === 'Delayed').length;
  const emergencyCount = appointments.filter(a => a.priority === 'Emergency' || a.priority === 'High-Risk Maternal').length;

  // Actions
  const handleCheckIn = (id: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Checked-In',
          checkInTime: timeNow,
          isDelayed: false
        };
      }
      return a;
    }));
    showToast(`Patient checked in successfully! Placed in active triage queue.`);
  };

  const handleStartConsultation = (id: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'In Consultation',
          consultationStartTime: timeNow
        };
      }
      return a;
    }));
    showToast(`Token called into consultation room.`);
  };

  const handleMarkCompleted = (id: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Completed',
          completedTime: timeNow
        };
      }
      return a;
    }));
    showToast(`Consultation marked as Completed. Prescription & dispatch logged.`);
  };

  const handleMarkMissed = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'Missed',
          missedReason: 'Patient did not attend slot. Automatic ASHA home follow-up task triggered.'
        };
      }
      return a;
    }));
    showToast(`Marked as Missed / No-Show. ASHA notified for doorstep check.`);
  };

  const handleCallAshaOrPatient = (apt: AppointmentItem) => {
    showToast(`Dialing ${apt.patientName} (${apt.patientPhone}) / ASHA coordinator...`);
  };

  const activeSelectedPatient = selectedPatientForDetails 
    ? appointments.find(a => a.id === selectedPatientForDetails.id) || selectedPatientForDetails 
    : null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Outpatient Department & Clinical Flow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Appointment & Priority Queue Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Live triage prioritization for emergency, maternal, pediatric & elderly patients. Track SEVA-Lite ASHA frontline bookings, update queue check-ins, and inspect full patient profiles.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsDailyRosterOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition backdrop-blur-xs shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Print Day Roster ({activeDateString === 'all' ? 'All' : activeDateString})</span>
          </button>
        </div>
      </div>

      {/* 6. Queue Analytics Cards */}
      <AppointmentAnalyticsCards
        totalAppointments={totalCount}
        waitingPatients={waitingCount}
        completedConsultations={completedCount}
        missedAppointments={missedCount}
        emergencyCount={emergencyCount}
        delayedCount={delayedCount}
        activeFilterStatus={analyticsFilterStatus}
        onSelectFilterStatus={(status) => {
          if (analyticsFilterStatus === status) {
            setAnalyticsFilterStatus('all');
          } else {
            setAnalyticsFilterStatus(status);
          }
        }}
      />

      {/* Navigation Sub-Modes & Filters Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Filter Bar Controls */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-100 space-y-3 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, ABHA, token (EM-01), phone, or village..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-xs transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-[10px]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Date Selector */}
            <div>
              <select
                value={selectedDateFilter}
                onChange={e => setSelectedDateFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-semibold text-slate-700 text-xs"
              >
                <option value="today">📅 Today (11 Sep 2026)</option>
                <option value="tomorrow">📅 Tomorrow (12 Sep 2026)</option>
                <option value="all">📅 All Dates</option>
                <option value="custom">📅 Custom Date...</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={selectedPriority}
                onChange={e => setSelectedPriority(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-700 text-xs"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="Emergency">🚨 Emergency Only</option>
                <option value="High-Risk Maternal">🤰 High-Risk Maternal</option>
                <option value="Child / Pediatric">👶 Child / Pediatric</option>
                <option value="Elderly / Geriatric">👴 Elderly / Geriatric</option>
                <option value="General / Routine">🩺 General / Routine</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-700 text-xs"
              >
                {PHC_DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Secondary Filter Row (Doctor & Facility + Custom Date Picker if selected) */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>More Filters:</span>
            </div>

            {/* Doctor */}
            <select
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700"
            >
              {PHC_DOCTORS.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>

            {/* Facility */}
            <select
              value={selectedFacility}
              onChange={e => setSelectedFacility(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700"
            >
              {PHC_FACILITIES.map(fac => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
            </select>

            {/* Custom Date Input if selected */}
            {selectedDateFilter === 'custom' && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Pick Date:</span>
                <input
                  type="date"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  className="py-0.5 px-2 rounded-lg border border-slate-200 text-xs font-mono"
                />
              </div>
            )}

            {/* Active Filters Reset */}
            {(selectedPriority !== 'All Priorities' || selectedDepartment !== 'All Departments' || selectedDoctor !== 'All Doctors' || selectedFacility !== 'All Facilities' || searchQuery || analyticsFilterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSelectedPriority('All Priorities');
                  setSelectedDepartment('All Departments');
                  setSelectedDoctor('All Doctors');
                  setSelectedFacility('All Facilities');
                  setSearchQuery('');
                  setAnalyticsFilterStatus('all');
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Reset Filters
              </button>
            )}

            {/* Sort Switcher */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-medium text-slate-500">Order by:</span>
              <button
                onClick={() => setSortMode(sortMode === 'priority-first' ? 'token-slot' : 'priority-first')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-2xs"
              >
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
                <span>{sortMode === 'priority-first' ? 'Priority First' : 'Slot Time'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Column Bar Header */}
        <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-2.5 bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider items-center">
          <div className="col-span-1">Token</div>
          <div className="col-span-4">Patient Name & Demographics</div>
          <div className="col-span-3">Purpose & Department</div>
          <div className="col-span-1 text-center">Slot</div>
          <div className="col-span-1 text-center">Priority</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Minimal User-Friendly Appointments Queue List */}
        <div className="divide-y divide-slate-100">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-semibold text-slate-600">No appointments found matching your filters</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the priority, department, or date search</p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
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
                <div 
                  key={apt.id} 
                  onClick={() => setSelectedPatientForDetails(apt)}
                  className={`p-3.5 sm:p-4 transition cursor-pointer hover:bg-blue-50/50 group ${
                    isEmergency ? 'bg-rose-50/25 hover:bg-rose-50/50' : isMaternal ? 'bg-amber-50/15 hover:bg-amber-50/40' : ''
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                    
                    {/* 1. Token (col-span-1) */}
                    <div className="lg:col-span-1 flex items-center justify-between lg:justify-start">
                      <div className={`px-2.5 py-1 rounded-xl font-mono text-xs font-black tracking-wide border text-center shrink-0 ${
                        isEmergency 
                          ? 'bg-rose-600 text-white border-rose-700 animate-pulse' 
                          : isMaternal 
                          ? 'bg-amber-500 text-white border-amber-600'
                          : isChild 
                          ? 'bg-blue-600 text-white border-blue-700'
                          : isElderly
                          ? 'bg-purple-600 text-white border-purple-700'
                          : 'bg-slate-800 text-white border-slate-900'
                      }`}>
                        {apt.tokenNumber}
                      </div>

                      {/* Mobile-only status & priority badges */}
                      <div className="flex items-center gap-1.5 lg:hidden">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isEmergency ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          isMaternal ? 'bg-amber-100 text-amber-900 border-amber-300' :
                          'bg-slate-100 text-slate-700 border-slate-300'
                        }`}>
                          {apt.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isCompleted ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          isInConsult ? 'bg-purple-50 text-purple-800 border-purple-200' :
                          isWaiting ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {apt.status === 'Checked-In' ? 'Waiting' : apt.status}
                        </span>
                      </div>
                    </div>

                    {/* 2. Patient Identity & Demographics (col-span-4) */}
                    <div className="lg:col-span-4 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                          {apt.patientName}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium shrink-0">
                          ({apt.patientAge}y • {apt.patientGender})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1.5">
                        <span className="font-mono text-slate-600 font-semibold">{apt.patientPhone}</span>
                        <span>•</span>
                        <span className="truncate">{apt.village}</span>
                        {apt.bookingSource.startsWith('SEVA-Lite') && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">SEVA-Lite</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* 3. Purpose & Department (col-span-3) */}
                    <div className="lg:col-span-3 min-w-0 text-xs">
                      <p className="font-bold text-slate-900 truncate" title={apt.purposeOfVisit}>
                        {apt.purposeOfVisit}
                      </p>
                      <p className="text-slate-500 truncate mt-0.5">
                        {apt.department} • <span className="text-slate-600 font-medium">{apt.assignedDoctor.split(',')[0]}</span>
                      </p>
                    </div>

                    {/* 4. Slot Time (col-span-1) */}
                    <div className="lg:col-span-1 lg:text-center text-xs">
                      <span className="font-mono font-bold text-slate-800">
                        {apt.appointmentTimeSlot.split(' - ')[0]}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {apt.appointmentDate === '2026-09-11' ? 'Today' : apt.appointmentDate}
                      </p>
                    </div>

                    {/* 5. Priority Pill (col-span-1) */}
                    <div className="hidden lg:flex justify-center col-span-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border truncate ${
                        isEmergency 
                          ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' 
                          : isMaternal 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : isChild 
                          ? 'bg-blue-100 text-blue-900 border-blue-300' 
                          : isElderly 
                          ? 'bg-purple-100 text-purple-900 border-purple-300' 
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {apt.priority}
                      </span>
                    </div>

                    {/* 6. Status Pill (col-span-1) */}
                    <div className="hidden lg:flex justify-center col-span-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border truncate ${
                        isCompleted 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isInConsult
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : isWaiting
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : isDelayed
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : isMissed
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {apt.status === 'Checked-In' ? 'Waiting' : apt.status}
                      </span>
                    </div>

                    {/* 7. Action: Quick Mark as Completed, Download PDF Slip & View Details */}
                    <div className="lg:col-span-1 flex items-center justify-end gap-1">
                      {apt.status !== 'Completed' && apt.status !== 'Missed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkCompleted(apt.id);
                          }}
                          title="Mark as Completed"
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadReceiptPdf(apt);
                        }}
                        title="Download PDF Slip"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientForDetails(apt);
                        }}
                        title="View Patient Details"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white rounded-xl text-xs font-bold border border-blue-200/80 group-hover:border-blue-600 transition shadow-2xs"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Full Patient Details Popup View */}
      {activeSelectedPatient && (
        <PatientDetailsModal
          appointment={activeSelectedPatient}
          onClose={() => setSelectedPatientForDetails(null)}
          onCheckIn={handleCheckIn}
          onStartConsultation={handleStartConsultation}
          onMarkCompleted={handleMarkCompleted}
          onMarkMissed={handleMarkMissed}
          onPrintReceipt={handleDownloadReceiptPdf}
          onCallPatientOrAsha={handleCallAshaOrPatient}
        />
      )}

      {/* Daily Roster Report Modal */}
      {isDailyRosterOpen && (
        <DailyRosterReportModal
          appointments={appointments}
          currentFacility="Paud Central Primary Health Center"
          initialDate={activeDateString === 'all' ? '2026-09-11' : activeDateString}
          onClose={() => setIsDailyRosterOpen(false)}
        />
      )}

    </div>
  );
};
