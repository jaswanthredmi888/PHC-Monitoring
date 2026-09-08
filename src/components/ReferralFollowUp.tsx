import React, { useState } from 'react';
import {
  ReferralItem,
  ReferralStatus,
  ReferralPriority,
  FollowUpStatus,
  ReferralCategory
} from '../types';
import {
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Building2,
  User,
  Phone,
  Search,
  Filter,
  Eye,
  PlusCircle,
  X,
  ShieldAlert,
  ArrowRight,
  Activity,
  HeartPulse,
  Bell,
  Check,
  MapPin,
  FileDown,
  Printer
} from 'lucide-react';
import { exportReferralsToPDF, exportSingleReferralSlipPDF } from '../utils/pdfExport';

interface ReferralFollowUpProps {
  referrals: ReferralItem[];
  onUpdateReferral: (updated: ReferralItem) => void;
  onAddReferral: (newReferral: ReferralItem) => void;
}

type FilterTabType = 'all' | 'pending' | 'completed' | 'delayed' | 'highrisk';

export const ReferralFollowUp: React.FC<ReferralFollowUpProps> = ({
  referrals,
  onUpdateReferral,
  onAddReferral
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Modal states
  const [viewingReferral, setViewingReferral] = useState<ReferralItem | null>(null);
  const [managingFollowUp, setManagingFollowUp] = useState<ReferralItem | null>(null);
  const [isCreatingReferral, setIsCreatingReferral] = useState(false);

  // Follow-up editing form state
  const [newFollowUpDate, setNewFollowUpDate] = useState('');
  const [newFollowUpStatus, setNewFollowUpStatus] = useState<FollowUpStatus>('Scheduled');
  const [newFollowUpNotes, setNewFollowUpNotes] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Analytics Computations
  const totalReferrals = referrals.length;
  const completedReferrals = referrals.filter(r => r.status === 'Completed').length;
  const pendingReferrals = referrals.filter(r => r.status !== 'Completed').length;
  const notYetReachedCount = referrals.filter(r => !r.hasReached && r.status !== 'Completed').length;
  const delayedReferrals = referrals.filter(r => r.isDelayed || r.followUpStatus === 'Missed' || r.followUpStatus === 'Overdue').length;
  const highRiskCount = referrals.filter(r => r.isHighRisk).length;
  
  // Average completion time (hours)
  const completedWithTime = referrals.filter(r => r.completionTimeHours !== undefined && r.completionTimeHours > 0);
  const avgCompletionTime = completedWithTime.length > 0
    ? (completedWithTime.reduce((acc, curr) => acc + (curr.completionTimeHours || 0), 0) / completedWithTime.length).toFixed(1)
    : '2.8';

  // Filter Referrals
  const filteredReferrals = referrals.filter(r => {
    // 1. Tab filter
    if (activeFilterTab === 'pending') {
      if (r.status === 'Completed') return false;
    } else if (activeFilterTab === 'completed') {
      if (r.status !== 'Completed') return false;
    } else if (activeFilterTab === 'delayed') {
      if (!r.isDelayed && r.followUpStatus !== 'Missed' && r.followUpStatus !== 'Overdue') return false;
    } else if (activeFilterTab === 'highrisk') {
      if (!r.isHighRisk) return false;
    }

    // 2. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = r.id.toLowerCase().includes(q);
      const matchFamily = r.familyId.toLowerCase().includes(q);
      const matchName = r.patientName.toLowerCase().includes(q);
      const matchHospital = r.referredHospital.toLowerCase().includes(q);
      const matchWorker = r.referringWorkerName.toLowerCase().includes(q);
      const matchVillage = r.village.toLowerCase().includes(q);
      if (!matchId && !matchFamily && !matchName && !matchHospital && !matchWorker && !matchVillage) return false;
    }

    // 3. Category filter
    if (selectedCategory !== 'all' && r.category !== selectedCategory) {
      return false;
    }

    // 4. Priority filter
    if (selectedPriority !== 'all' && r.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  // Advance Status Workflow: Created -> Accepted -> Reached -> Consultation -> Completed
  const handleAdvanceStatus = (item: ReferralItem, nextStatus: ReferralStatus) => {
    const timestamp = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const note = `Status advanced to ${nextStatus}`;
    const updated: ReferralItem = {
      ...item,
      status: nextStatus,
      hasReached: nextStatus === 'Reached' || nextStatus === 'Consultation' || nextStatus === 'Completed',
      isDelayed: nextStatus === 'Reached' ? false : item.isDelayed,
      statusTimeline: [
        ...item.statusTimeline,
        { status: nextStatus, timestamp, note, updatedBy: 'Medical Officer' }
      ]
    };

    onUpdateReferral(updated);
    if (viewingReferral?.id === item.id) {
      setViewingReferral(updated);
    }
    showToast(`Referral ${item.id} status updated to "${nextStatus}".`);
  };

  // Open Follow-up Modal
  const handleOpenFollowUpModal = (item: ReferralItem) => {
    setManagingFollowUp(item);
    setNewFollowUpDate(item.followUpDate || '14 Sep');
    setNewFollowUpStatus(item.followUpStatus || 'Scheduled');
    setNewFollowUpNotes(item.followUpNotes || '');
  };

  // Save Follow-up Modal Changes
  const handleSaveFollowUp = () => {
    if (!managingFollowUp) return;

    const updated: ReferralItem = {
      ...managingFollowUp,
      followUpDate: newFollowUpDate || managingFollowUp.followUpDate,
      followUpStatus: newFollowUpStatus,
      followUpNotes: newFollowUpNotes
    };

    onUpdateReferral(updated);
    setManagingFollowUp(null);
    showToast(`Follow-up scheduled for ${updated.patientName} on ${updated.followUpDate}.`);
  };

  // Send Direct Reminder to ASHA & Patient
  const handleSendReminder = (item: ReferralItem) => {
    const updated: ReferralItem = {
      ...item,
      remindersSentCount: (item.remindersSentCount || 0) + 1,
      lastReminderSentAt: 'Just Now'
    };

    onUpdateReferral(updated);
    showToast(`Automated SMS & WhatsApp Reminder sent to ${item.patientName} and ${item.referringWorkerName}!`);
  };

  // New Referral Creation Form State
  const [newForm, setNewForm] = useState({
    patientName: '',
    patientAge: 25,
    patientGender: 'Female' as 'Female' | 'Male' | 'Other',
    patientPhone: '+91 98',
    familyId: 'FAM-MH-',
    village: 'Chandanagiri',
    category: 'Maternal & High-Risk ANC' as ReferralCategory,
    isHighRisk: true,
    highRiskReason: '',
    referringWorkerName: 'Sunita Patil (ASHA)',
    referringWorkerPhone: '+91 98220 12345',
    referringFacility: 'Chandanagiri Health Sub-Center',
    referredHospital: 'District Hospital Pune',
    referredDepartment: 'Obstetrics & High-Risk Pregnancy Unit',
    reasonForReferral: '',
    clinicalNotes: '',
    priority: 'High' as ReferralPriority,
    followUpDate: '15 Sep'
  });

  const handleCreateNewReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.patientName || !newForm.reasonForReferral) {
      alert('Please fill in required fields: Patient Name and Reason for Referral.');
      return;
    }

    const newId = `SEVA-PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdItem: ReferralItem = {
      id: newId,
      familyId: newForm.familyId || `FAM-MH-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newForm.patientName,
      patientAge: Number(newForm.patientAge),
      patientGender: newForm.patientGender,
      patientPhone: newForm.patientPhone,
      village: newForm.village,
      sector: 'CHANDANAGIRI - PAUD SECTOR',
      category: newForm.category,
      isHighRisk: newForm.isHighRisk,
      highRiskReason: newForm.highRiskReason,
      referringWorkerName: newForm.referringWorkerName,
      referringWorkerRole: 'ASHA',
      referringWorkerPhone: newForm.referringWorkerPhone,
      referringFacility: newForm.referringFacility,
      referredHospital: newForm.referredHospital,
      referredDepartment: newForm.referredDepartment,
      reasonForReferral: newForm.reasonForReferral,
      clinicalNotes: newForm.clinicalNotes || 'Initial referral notes recorded at sub-center.',
      priority: newForm.priority,
      referralDate: 'Today',
      fullReferralDate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Created',
      statusTimeline: [
        { status: 'Created', timestamp: 'Today, Just Now', note: 'Referral registered by clinical staff', updatedBy: newForm.referringWorkerName }
      ],
      hasReached: false,
      isDelayed: false,
      followUpDate: newForm.followUpDate || '15 Sep',
      fullFollowUpDate: `${newForm.followUpDate} 2026`,
      followUpStatus: 'Pending',
      followUpNotes: 'Initial follow-up registered.',
      remindersSentCount: 0
    };

    onAddReferral(createdItem);
    setIsCreatingReferral(false);
    showToast(`New referral ${newId} created for ${newForm.patientName} to ${newForm.referredHospital}.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Referral & Follow-up</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Operational Hub
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Continuum of care tracking from grassroots ASHA/ANM referrals to secondary & tertiary hospital completion
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="btn-export-referrals-pdf"
            onClick={() => {
              const label = activeFilterTab === 'all' 
                ? 'All Referrals' 
                : activeFilterTab === 'pending'
                ? 'Pending Referrals'
                : activeFilterTab === 'completed'
                ? 'Completed Referrals'
                : activeFilterTab === 'delayed'
                ? 'Delayed & Overdue Referrals'
                : 'High-Risk Follow-up Referrals';
              exportReferralsToPDF(filteredReferrals, label);
              showToast(`Exported ${filteredReferrals.length} referrals to PDF report successfully.`);
            }}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs hover:border-slate-400"
            title="Export filtered referrals to PDF report"
          >
            <FileDown className="w-4 h-4 text-rose-600" />
            <span>Export Referrals PDF</span>
          </button>

          <button
            id="btn-create-new-referral"
            onClick={() => setIsCreatingReferral(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Referral</span>
          </button>
        </div>
      </div>

      {/* 6. Referral Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Referrals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Referrals</span>
            <ArrowRightLeft className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalReferrals}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Grassroots logged</div>
        </div>

        {/* Pending Referrals */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium">
            <span>Pending Referrals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">{pendingReferrals}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">{notYetReachedCount} not yet at facility</div>
        </div>

        {/* Completed Referrals */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-medium">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{completedReferrals}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Consulted & treated</div>
        </div>

        {/* Delayed / Missed */}
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 text-xs font-medium">
            <span>Delayed / Missed</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-2">{delayedReferrals}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">Transit & follow-up delays</div>
        </div>

        {/* High-Risk Follow-up */}
        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-xs">
          <div className="flex items-center justify-between text-purple-700 text-xs font-medium">
            <span>High-Risk Follow-up</span>
            <HeartPulse className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2">{highRiskCount}</div>
          <div className="text-[11px] text-purple-700 mt-0.5">Maternal, child, chronic</div>
        </div>

        {/* Avg Completion Time */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 text-xs font-medium">
            <span>Avg Completion Time</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-2">{avgCompletionTime} <span className="text-sm font-medium">hrs</span></div>
          <div className="text-[11px] text-blue-600 mt-0.5">Referral to tertiary triage</div>
        </div>
      </div>

      {/* Best Dashboard Layout Filter Segment Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* User's exact layout: Pending Referrals | Completed | Delayed | High-Risk */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            
            {/* All Referrals */}
            <button
              onClick={() => setActiveFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilterTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Referrals</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilterTab === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'}`}>
                {totalReferrals}
              </span>
            </button>

            {/* Pending Referrals */}
            <button
              onClick={() => setActiveFilterTab('pending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilterTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Referrals</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilterTab === 'pending' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-800'}`}>
                {pendingReferrals}
              </span>
            </button>

            {/* Completed */}
            <button
              onClick={() => setActiveFilterTab('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilterTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilterTab === 'completed' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-800'}`}>
                {completedReferrals}
              </span>
            </button>

            {/* Delayed */}
            <button
              onClick={() => setActiveFilterTab('delayed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilterTab === 'delayed'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Delayed</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilterTab === 'delayed' ? 'bg-rose-700 text-white' : 'bg-rose-200 text-rose-800'}`}>
                {delayedReferrals}
              </span>
            </button>

            {/* High-Risk */}
            <button
              onClick={() => setActiveFilterTab('highrisk')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilterTab === 'highrisk'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>High-Risk</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilterTab === 'highrisk' ? 'bg-purple-700 text-white' : 'bg-purple-200 text-purple-800'}`}>
                {highRiskCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredReferrals.length}</span> of {totalReferrals} referrals
            </span>
            <button
              onClick={() => {
                const label = activeFilterTab === 'all' 
                  ? 'All Referrals' 
                  : activeFilterTab === 'pending'
                  ? 'Pending Referrals'
                  : activeFilterTab === 'completed'
                  ? 'Completed Referrals'
                  : activeFilterTab === 'delayed'
                  ? 'Delayed & Overdue Referrals'
                  : 'High-Risk Follow-up Referrals';
                exportReferralsToPDF(filteredReferrals, label);
                showToast(`Exported ${filteredReferrals.length} referrals to PDF.`);
              }}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center gap-1 transition"
              title="Quick export current table as PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Search & Secondary Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patient ID, Name, Hospital, or ASHA Worker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by clinical category"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Maternal & High-Risk ANC">Maternal & ANC</option>
              <option value="Child & Pediatric">Child & Pediatric</option>
              <option value="Chronic Care">Chronic Care</option>
              <option value="Emergency & Trauma">Emergency / Trauma</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              aria-label="Filter by priority level"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Routine">Routine</option>
            </select>
          </div>
        </div>
      </div>

      {/* Operational Table Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Patient ID</th>
                <th className="py-3.5 px-4">Referred To</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Follow-up</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <ArrowRightLeft className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No referrals matching your filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try changing the search query or filter tab.</p>
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((item) => {
                  const isPendingArrival = !item.hasReached && item.status !== 'Completed';
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        item.isDelayed ? 'bg-rose-50/30' : item.isHighRisk ? 'bg-purple-50/20' : ''
                      }`}
                    >
                      {/* Patient ID Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2">
                          <div>
                            <div className="font-mono font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{item.id}</span>
                              {item.isHighRisk && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                  High-Risk
                                </span>
                              )}
                            </div>
                            <div className="text-slate-800 font-semibold text-[13px] mt-0.5">
                              {item.patientName}
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              {item.patientAge}y • {item.patientGender} • {item.village}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              Fam: {item.familyId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Referred To Column */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 text-[12px] flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{item.referredHospital}</span>
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {item.referredDepartment}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                            <span className="text-slate-400">By:</span>
                            <span className="font-medium text-slate-700">{item.referringWorkerName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Priority Column */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            item.priority === 'Critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : item.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : item.priority === 'Medium'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-xs">
                          {item.referralDate}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.fullReferralDate.split(', ')[1] || 'Morning'}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              item.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : item.status === 'Consultation'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : item.status === 'Reached'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : item.status === 'Accepted'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {item.status}
                          </span>

                          {/* Delayed / Not Yet Reached Warning Pill */}
                          {item.isDelayed && (
                            <div className="text-[10px] font-bold text-rose-700 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                              <span>Delayed (+{item.delayedHours || 24}h)</span>
                            </div>
                          )}

                          {isPendingArrival && !item.isDelayed && (
                            <div className="text-[10px] text-amber-700 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span>En route to facility</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Follow-up Column */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.followUpDate}</span>
                          </div>
                          <div>
                            <span
                              className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                item.followUpStatus === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.followUpStatus === 'Missed' || item.followUpStatus === 'Overdue'
                                  ? 'bg-rose-100 text-rose-800 font-bold'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {item.followUpStatus}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View Details / Timeline */}
                          <button
                            onClick={() => setViewingReferral(item)}
                            title="View Referral Details & Full Timeline"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition border border-slate-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Manage Follow-up */}
                          <button
                            onClick={() => handleOpenFollowUpModal(item)}
                            title="Schedule or Update Follow-up"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition border border-slate-200"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>

                          {/* Send Reminder to Frontline Worker / Patient */}
                          <button
                            onClick={() => handleSendReminder(item)}
                            title="Send SMS/WhatsApp Reminder to Frontline Worker and Patient"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition border border-slate-200"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: REFERRAL DETAILS & LIFECYCLE TRACKER (Feature 1 & 3) */}
      {viewingReferral && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold font-mono">
                  {viewingReferral.id.split('-').pop()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{viewingReferral.patientName}</span>
                    <span className="text-xs font-mono font-normal text-slate-500">({viewingReferral.id})</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Family ID: <span className="font-mono font-semibold text-slate-700">{viewingReferral.familyId}</span> • {viewingReferral.village}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingReferral(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Feature 5: High-Risk Alert Banner if High-Risk */}
              {viewingReferral.isHighRisk && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-rose-800">High-Risk Priority Case Flagged:</span>
                    <p className="text-rose-700 mt-0.5">{viewingReferral.highRiskReason || 'Clinical condition requires immediate monitoring and hospital intervention.'}</p>
                  </div>
                </div>
              )}

              {/* Feature 1: Lifecycle Progress Stepper (Created -> Accepted -> Reached -> Consultation -> Completed) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Referral Lifecycle Progress
                </h3>
                
                <div className="grid grid-cols-5 gap-1 text-center">
                  {(['Created', 'Accepted', 'Reached', 'Consultation', 'Completed'] as ReferralStatus[]).map((step, idx) => {
                    const statusOrder: ReferralStatus[] = ['Created', 'Accepted', 'Reached', 'Consultation', 'Completed'];
                    const currentIdx = statusOrder.indexOf(viewingReferral.status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = viewingReferral.status === step;

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                              : isPassed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] mt-1.5 font-semibold ${isCurrent ? 'text-blue-600' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Advance Button */}
                {viewingReferral.status !== 'Completed' && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Update current status:</span>
                    <div className="flex items-center gap-2">
                      {viewingReferral.status === 'Created' && (
                        <button
                          onClick={() => handleAdvanceStatus(viewingReferral, 'Accepted')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition"
                        >
                          Advance to "Accepted"
                        </button>
                      )}
                      {viewingReferral.status === 'Accepted' && (
                        <button
                          onClick={() => handleAdvanceStatus(viewingReferral, 'Reached')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
                        >
                          Mark as "Reached Hospital"
                        </button>
                      )}
                      {viewingReferral.status === 'Reached' && (
                        <button
                          onClick={() => handleAdvanceStatus(viewingReferral, 'Consultation')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition"
                        >
                          Advance to "In Consultation"
                        </button>
                      )}
                      {viewingReferral.status === 'Consultation' && (
                        <button
                          onClick={() => handleAdvanceStatus(viewingReferral, 'Completed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                        >
                          Mark as "Completed"
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Feature 3: Full Referral Details Dossier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Referring Entity */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Referring Health Worker</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{viewingReferral.referringWorkerName}</div>
                  <div className="text-xs text-slate-600">{viewingReferral.referringFacility}</div>
                  <div className="text-xs text-blue-600 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3" />
                    <span>{viewingReferral.referringWorkerPhone}</span>
                  </div>
                </div>

                {/* Referred Facility */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Referred Destination</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{viewingReferral.referredHospital}</div>
                  <div className="text-xs text-slate-600">{viewingReferral.referredDepartment}</div>
                  <div className="text-xs text-slate-500">Priority: <span className="font-bold text-slate-800">{viewingReferral.priority}</span></div>
                </div>
              </div>

              {/* Clinical Context & Findings */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Reason for Referral
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {viewingReferral.reasonForReferral}
                </p>
                {viewingReferral.clinicalNotes && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Clinical Notes: </span>
                    {viewingReferral.clinicalNotes}
                  </div>
                )}
              </div>

              {/* Follow-up Section in Dossier */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Scheduled Follow-up Date</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {viewingReferral.followUpDate} (Status: {viewingReferral.followUpStatus})
                  </div>
                  {viewingReferral.followUpNotes && (
                    <div className="text-xs text-slate-600 mt-0.5">{viewingReferral.followUpNotes}</div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setViewingReferral(null);
                    handleOpenFollowUpModal(viewingReferral);
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Edit Follow-up
                </button>
              </div>

              {/* Status Timeline Log */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Audit History & Timestamps
                </h4>
                <div className="space-y-2">
                  {viewingReferral.statusTimeline.map((step, sIdx) => (
                    <div key={sIdx} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="font-bold text-slate-800">{step.status}</span>
                        {step.note && <span className="text-slate-500">• {step.note}</span>}
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">{step.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  id="btn-export-slip-pdf"
                  onClick={() => {
                    exportSingleReferralSlipPDF(viewingReferral);
                    showToast(`Generated official referral slip PDF for ${viewingReferral.patientName}.`);
                  }}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                  title="Download individual official NHM referral slip as PDF"
                >
                  <FileDown className="w-4 h-4 text-indigo-600" />
                  <span>Download Referral Slip (PDF)</span>
                </button>

                <button
                  onClick={() => handleSendReminder(viewingReferral)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Bell className="w-4 h-4" />
                  <span>Send Reminder Alert ({viewingReferral.remindersSentCount})</span>
                </button>
              </div>

              <button
                onClick={() => setViewingReferral(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FOLLOW-UP MANAGEMENT (Feature 4) */}
      {managingFollowUp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Manage Follow-up: {managingFollowUp.patientName}
                </h3>
              </div>
              <button
                onClick={() => setManagingFollowUp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scheduled Follow-up Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14 Sep, 18 Sep 2026"
                  value={newFollowUpDate}
                  onChange={(e) => setNewFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Follow-up Status
                </label>
                <select
                  value={newFollowUpStatus}
                  onChange={(e) => setNewFollowUpStatus(e.target.value as FollowUpStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Missed">Missed (Action Required)</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Follow-up Notes & Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Repeat Hb test, check blood pressure, verify medication adherence..."
                  value={newFollowUpNotes}
                  onChange={(e) => setNewFollowUpNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Instant Reminder Trigger in Follow-up */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900">Frontline Reminder Dispatch</div>
                  <div className="text-[11px] text-amber-700">
                    Send SMS notification to {managingFollowUp.referringWorkerName}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendReminder(managingFollowUp)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Dispatch Reminder
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setManagingFollowUp(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFollowUp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW REFERRAL (Feature 1) */}
      {isCreatingReferral && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Register New Patient Referral
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingReferral(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewReferral} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kavita Jadhav"
                    value={newForm.patientName}
                    onChange={(e) => setNewForm({ ...newForm, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Family ID
                  </label>
                  <input
                    type="text"
                    placeholder="FAM-MH-XXXX"
                    value={newForm.familyId}
                    onChange={(e) => setNewForm({ ...newForm, familyId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newForm.patientAge}
                    onChange={(e) => setNewForm({ ...newForm, patientAge: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newForm.patientGender}
                    onChange={(e) => setNewForm({ ...newForm, patientGender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={newForm.village}
                    onChange={(e) => setNewForm({ ...newForm, village: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Category</label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value as ReferralCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Maternal & High-Risk ANC">Maternal & High-Risk ANC</option>
                    <option value="Child & Pediatric">Child & Pediatric</option>
                    <option value="Chronic Care">Chronic Care</option>
                    <option value="Emergency & Trauma">Emergency & Trauma</option>
                    <option value="General & Specialty">General & Specialty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={newForm.priority}
                    onChange={(e) => setNewForm({ ...newForm, priority: e.target.value as ReferralPriority })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Critical">Critical (Immediate Emergency)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
              </div>

              {/* High Risk Toggle */}
              <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newForm.isHighRisk}
                    onChange={(e) => setNewForm({ ...newForm, isHighRisk: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-xs font-bold text-purple-900">Mark as High-Risk Patient</span>
                </label>
                {newForm.isHighRisk && (
                  <input
                    type="text"
                    placeholder="High-Risk reason (e.g. Severe preeclampsia, SAM child, severe anemia)..."
                    value={newForm.highRiskReason}
                    onChange={(e) => setNewForm({ ...newForm, highRiskReason: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                  />
                )}
              </div>

              {/* Referred Facility & Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Referred Hospital</label>
                  <input
                    type="text"
                    value={newForm.referredHospital}
                    onChange={(e) => setNewForm({ ...newForm, referredHospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newForm.referredDepartment}
                    onChange={(e) => setNewForm({ ...newForm, referredDepartment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Referral *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Primary clinical symptoms, emergency condition or specialized test needed..."
                  value={newForm.reasonForReferral}
                  onChange={(e) => setNewForm({ ...newForm, reasonForReferral: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Referring ASHA/ANM</label>
                  <input
                    type="text"
                    value={newForm.referringWorkerName}
                    onChange={(e) => setNewForm({ ...newForm, referringWorkerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Follow-up Date</label>
                  <input
                    type="text"
                    value={newForm.followUpDate}
                    onChange={(e) => setNewForm({ ...newForm, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 -mx-5 -mb-5 mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingReferral(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Submit & Log Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
