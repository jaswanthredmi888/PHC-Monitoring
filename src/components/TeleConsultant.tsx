import React, { useState } from 'react';
import { TeleconsultationRequest } from '../types';
import { DoctorConsultationRoom } from './DoctorConsultationRoom';
import { 
  Video, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface TeleConsultantProps {
  requests: TeleconsultationRequest[];
  onUpdateRequest: (updated: TeleconsultationRequest) => void;
  onAddRequest: (req: TeleconsultationRequest) => void;
}

export const TeleConsultant: React.FC<TeleConsultantProps> = ({
  requests,
  onUpdateRequest,
  onAddRequest
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeCallRequest, setActiveCallRequest] = useState<TeleconsultationRequest | null>(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // New Booking Form State
  const [newBooking, setNewBooking] = useState<Partial<TeleconsultationRequest>>({
    patientName: '',
    patientAge: 25,
    patientGender: 'Female',
    patientPhone: '',
    village: 'Chandanagiri Central',
    sector: 'CHANDANAGIRI SECTOR',
    source: 'ASHA Field Worker',
    bookedBy: 'ASHA Staff On-Duty',
    urgency: 'High',
    specialty: 'OB/GYN & Maternal',
    symptoms: '',
    pregnancyStatus: 'Pregnant (3rd Trimester)',
    vitals: {
      bloodPressure: '140/90',
      heartRate: 82,
      spo2: 98,
      temperature: 37.0,
      hemoglobin: 9.0
    },
    doctorAssigned: 'Dr. Rajesh Sharma, MD (PHC In-Charge)',
    status: 'Waiting'
  });

  const filteredRequests = requests.filter(r => {
    const matchQuery = 
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    const matchUrgency = filterUrgency === 'all' || r.urgency.toLowerCase() === filterUrgency.toLowerCase();
    const matchStatus = filterStatus === 'all' || r.status.toLowerCase() === filterStatus.toLowerCase();
    return matchQuery && matchUrgency && matchStatus;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.patientName) return;

    const created: TeleconsultationRequest = {
      id: `TC-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName: newBooking.patientName || 'Patient',
      patientAge: Number(newBooking.patientAge) || 25,
      patientGender: (newBooking.patientGender as any) || 'Female',
      patientPhone: newBooking.patientPhone || '+91 98400 00000',
      abhaId: `33-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      village: newBooking.village || 'Maharashtra Block',
      sector: newBooking.sector || 'CHANDANAGIRI SECTOR',
      source: (newBooking.source as any) || 'ASHA Field Worker',
      bookedBy: newBooking.bookedBy || 'PHC Staff',
      requestTime: 'Just Now',
      urgency: (newBooking.urgency as any) || 'High',
      specialty: (newBooking.specialty as any) || 'OB/GYN & Maternal',
      symptoms: newBooking.symptoms || 'Routine clinical tele-review',
      pregnancyStatus: newBooking.pregnancyStatus,
      vitals: newBooking.vitals || {},
      doctorAssigned: 'Dr. Rajesh Sharma, MD',
      status: 'Waiting'
    };

    onAddRequest(created);
    setShowNewBookingModal(false);
    // Auto launch call if desired or keep in waiting list
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Action Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-200 text-xs font-mono font-bold uppercase tracking-wider">
            <Video className="w-4 h-4" />
            <span>PHC Tele-Consultation Gateway</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black mt-1 font-sans">
            Real-Time Doctor Tele-Consultant Hub
          </h2>
          <p className="text-xs md:text-sm text-pink-100 mt-1 max-w-2xl leading-relaxed">
            Incoming live video and audio consultation requests booked by ASHA Field Workers and Rural Patients across Maharashtra sectors. Connect patients directly to on-duty PHC Medical Officers.
          </p>
        </div>

        <button
          onClick={() => setShowNewBookingModal(true)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Tele-Consultation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, village, symptoms, or ASHA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Urgency Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-medium text-slate-500 font-mono hidden sm:inline">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
          >
            <option value="all">All Statuses ({requests.length})</option>
            <option value="waiting">Waiting In Queue</option>
            <option value="in consultation">Active Call</option>
            <option value="completed">Completed</option>
          </select>

          <span className="text-xs font-medium text-slate-500 font-mono hidden sm:inline">Urgency:</span>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
          >
            <option value="all">All Urgencies</option>
            <option value="critical">Critical Only</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="routine">Routine</option>
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className={`bg-white rounded-xl border transition-all duration-200 shadow-xs p-5 flex flex-col justify-between ${
              req.urgency === 'Critical' && req.status === 'Waiting'
                ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {req.patientName}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      ({req.patientAge}y, {req.patientGender})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>{req.village} • {req.sector}</span>
                  </div>
                </div>

                {/* Urgency Badge */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      req.urgency === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : req.urgency === 'High'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {req.urgency}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{req.requestTime}</span>
                </div>
              </div>

              {/* Source & Booking Info */}
              <div className="my-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Booked via:</span>
                  <span className="font-semibold text-slate-900">{req.source} ({req.bookedBy})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Specialty:</span>
                  <span className="font-semibold text-blue-700">{req.specialty}</span>
                </div>
                {req.pregnancyStatus && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Pregnancy Stage:</span>
                    <span className="font-semibold text-amber-800">{req.pregnancyStatus}</span>
                  </div>
                )}
              </div>

              {/* Symptoms Description */}
              <div className="text-xs text-slate-800 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-900">Symptoms:</strong> {req.symptoms}
              </div>

              {/* Recorded Vitals */}
              {req.vitals && Object.keys(req.vitals).length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-mono">
                  {req.vitals.bloodPressure && (
                    <div className="p-2 rounded-lg bg-slate-100 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">BP</div>
                      <div className="font-bold text-slate-900 mt-0.5">{req.vitals.bloodPressure}</div>
                    </div>
                  )}
                  {req.vitals.hemoglobin && (
                    <div className="p-2 rounded-lg bg-slate-100 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Hb</div>
                      <div className="font-bold text-amber-700 mt-0.5">{req.vitals.hemoglobin} g/dL</div>
                    </div>
                  )}
                  {req.vitals.heartRate && (
                    <div className="p-2 rounded-lg bg-slate-100 text-center">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Pulse</div>
                      <div className="font-bold text-emerald-700 mt-0.5">{req.vitals.heartRate} bpm</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`w-2 h-2 rounded-full ${
                  req.status === 'Waiting' ? 'bg-amber-500 animate-pulse' : req.status === 'In Consultation' ? 'bg-blue-600' : 'bg-emerald-500'
                }`}></span>
                <span className="font-medium text-slate-700">{req.status}</span>
              </div>

              <div className="flex items-center gap-2">
                {req.status === 'Completed' ? (
                  <button
                    onClick={() => setActiveCallRequest(req)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    View e-Prescription
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveCallRequest(req)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Connect with Doctor</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Live Doctor Consultation Room Modal */}
      {activeCallRequest && (
        <DoctorConsultationRoom
          consultation={activeCallRequest}
          onClose={() => setActiveCallRequest(null)}
          onCompleteConsultation={(updated) => {
            onUpdateRequest(updated);
            setActiveCallRequest(null);
          }}
        />
      )}

      {/* Book New Consultation Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                <span>Book Doctor Tele-Consultation</span>
              </h3>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Meenakshi"
                    value={newBooking.patientName}
                    onChange={(e) => setNewBooking({ ...newBooking, patientName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age & Gender</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      placeholder="Age"
                      value={newBooking.patientAge}
                      onChange={(e) => setNewBooking({ ...newBooking, patientAge: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                    />
                    <select
                      value={newBooking.patientGender}
                      onChange={(e) => setNewBooking({ ...newBooking, patientGender: e.target.value as any })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sector / Village</label>
                  <select
                    value={newBooking.sector}
                    onChange={(e) => setNewBooking({ ...newBooking, sector: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  >
                    <option value="CHANDANAGIRI SECTOR">Chandanagiri Sector</option>
                    <option value="RAMAPURAM SECTOR">Ramapuram Sector</option>
                    <option value="GOPALAPURAM SECTOR">Gopalapuram Sector</option>
                    <option value="KALYANPUR SECTOR">Kalyanpur Sector</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Urgency Priority</label>
                  <select
                    value={newBooking.urgency}
                    onChange={(e) => setNewBooking({ ...newBooking, urgency: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-semibold text-slate-800"
                  >
                    <option value="Critical">Critical (Immediate Doctor Connect)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Routine">Routine Follow-up</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chief Symptoms & Clinical Complaint</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe patient symptoms, reported pain, gestational stage or fever duration..."
                  value={newBooking.symptoms}
                  onChange={(e) => setNewBooking({ ...newBooking, symptoms: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    placeholder="140/90"
                    value={newBooking.vitals?.bloodPressure}
                    onChange={(e) => setNewBooking({
                      ...newBooking,
                      vitals: { ...newBooking.vitals, bloodPressure: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hemoglobin</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="8.5"
                    value={newBooking.vitals?.hemoglobin}
                    onChange={(e) => setNewBooking({
                      ...newBooking,
                      vitals: { ...newBooking.vitals, hemoglobin: Number(e.target.value) }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pulse Rate</label>
                  <input
                    type="number"
                    placeholder="84"
                    value={newBooking.vitals?.heartRate}
                    onChange={(e) => setNewBooking({
                      ...newBooking,
                      vitals: { ...newBooking.vitals, heartRate: Number(e.target.value) }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Add to Live Doctor Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
