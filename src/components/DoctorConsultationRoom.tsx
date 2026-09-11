import React, { useState } from 'react';
import { TeleconsultationRequest } from '../types';
import { AppLogo } from './AppLogo';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Heart, 
  Activity, 
  Thermometer, 
  Send,
  AlertOctagon,
  Building,
  User,
  ShieldCheck
} from 'lucide-react';

interface DoctorConsultationRoomProps {
  consultation: TeleconsultationRequest;
  onClose: () => void;
  onCompleteConsultation: (updated: TeleconsultationRequest) => void;
}

export const DoctorConsultationRoom: React.FC<DoctorConsultationRoomProps> = ({
  consultation,
  onClose,
  onCompleteConsultation
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [doctorNotes, setDoctorNotes] = useState(consultation.doctorNotes || '');
  const [prescriptions, setPrescriptions] = useState<{
    medicineName: string;
    dosage: string;
    duration: string;
    instructions: string;
  }[]>([
    { medicineName: 'Paracetamol 500mg', dosage: '1 Tab TID (SOS)', duration: '3 Days', instructions: 'Take after meals' },
    { medicineName: 'IFA Tablets (Iron Folic Acid)', dosage: '1 Tab OD', duration: '30 Days', instructions: 'Take with lemon juice, avoid milk' }
  ]);
  const [newMed, setNewMed] = useState({ medicineName: '', dosage: '1 Tab OD', duration: '5 Days', instructions: 'After meals' });
  const [isReferralNeeded, setIsReferralNeeded] = useState(false);
  const [referralNotes, setReferralNotes] = useState('');

  // Call AI Clinical Assistant API
  const handleFetchAiAssist = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/gemini/teleconsult-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: consultation.patientName,
          age: consultation.patientAge,
          gender: consultation.patientGender,
          symptoms: consultation.symptoms,
          vitals: consultation.vitals,
          pregnancyStatus: consultation.pregnancyStatus,
          medicalHistory: consultation.urgency === 'Critical' ? 'High gestational hypertension risk' : 'None reported'
        })
      });
      const data = await response.json();
      setAiSuggestions(data);
      if (data.doctorNotesSummary) {
        setDoctorNotes(prev => prev ? `${prev}\n\n[AI Clinical Assist]: ${data.doctorNotesSummary}` : data.doctorNotesSummary);
      }
      if (data.suggestedMedications && data.suggestedMedications.length > 0) {
        const mapped = data.suggestedMedications.map((m: any) => ({
          medicineName: m.name,
          dosage: m.dosage,
          duration: m.duration,
          instructions: 'As advised by doctor'
        }));
        setPrescriptions(prev => [...prev, ...mapped]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddMedication = () => {
    if (!newMed.medicineName.trim()) return;
    setPrescriptions([...prescriptions, newMed]);
    setNewMed({ medicineName: '', dosage: '1 Tab OD', duration: '5 Days', instructions: 'After meals' });
  };

  const handleRemoveMedication = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleFinishConsultation = () => {
    const updated: TeleconsultationRequest = {
      ...consultation,
      status: 'Completed',
      doctorNotes,
      prescriptions,
      referralDetails: isReferralNeeded ? referralNotes || 'Referred to Maharashtra District Hospital for obstetric review' : undefined
    };

    onCompleteConsultation(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Room Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppLogo size="xs" />
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">
                  Live Tele-Consultation: {consultation.patientName} ({consultation.patientAge}y / {consultation.patientGender})
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  consultation.urgency === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-900'
                }`}>
                  {consultation.urgency} Urgency
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Source: {consultation.bookedBy} ({consultation.village}) • Assigned: {consultation.doctorAssigned}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800 text-xs font-semibold"
          >
            Minimize / Close
          </button>
        </div>

        {/* Main Split Grid: Left Video Stream & Right Clinical HUD */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* Left Column: Live Video Streams (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 p-4 flex flex-col justify-between gap-4">
            
            {/* Primary Video Feed (Patient & ASHA Worker) */}
            <div className="relative w-full h-64 sm:h-80 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
              {isVideoOn ? (
                <div className="w-full h-full bg-radial from-slate-800 to-slate-950 flex flex-col items-center justify-center text-center p-4">
                  {/* Visual simulated stream avatar */}
                  <div className="w-20 h-20 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center text-blue-300 text-2xl font-bold mb-3 shadow-xs">
                    {consultation.patientName.charAt(0)}
                  </div>
                  <div className="text-white font-bold text-sm sm:text-base">
                    {consultation.patientName} & ASHA Field Bridge
                  </div>
                  <div className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live 1080p Tele-Link • Low Latency (48ms)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 max-w-sm">
                    {consultation.symptoms}
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-sm font-semibold flex flex-col items-center">
                  <VideoOff className="w-8 h-8 mb-2" />
                  <span>Video Feed Paused</span>
                </div>
              )}

              {/* Floating Doctor Picture-in-Picture */}
              <div className="absolute top-3 right-3 w-28 h-20 bg-slate-950 rounded-lg border border-slate-600 overflow-hidden shadow-md flex flex-col items-center justify-center text-center p-1">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mb-0.5">
                  DR
                </div>
                <span className="text-[9px] text-slate-200 font-medium truncate w-full px-1">
                  Dr. Rajesh
                </span>
                <span className="text-[8px] text-emerald-400 font-mono">PHC Cam Active</span>
              </div>

              {/* Patient ABHA & Location Pill */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] text-slate-300 font-mono border border-slate-700">
                ABHA: {consultation.abhaId || '33-9821-4401-2098'}
              </div>
            </div>

            {/* Live Vitals HUD Strip */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                  <Activity className="w-3 h-3 text-blue-400" />
                  <span>Blood Pressure</span>
                </div>
                <div className="text-sm font-bold text-blue-300 mt-0.5">
                  {consultation.vitals.bloodPressure || '158/104'} mmHg
                </div>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>Heart Rate</span>
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {consultation.vitals.heartRate || 88} bpm
                </div>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                  <Activity className="w-3 h-3 text-blue-400" />
                  <span>SpO2 / Sugar</span>
                </div>
                <div className="text-sm font-bold text-blue-300 mt-0.5">
                  {consultation.vitals.spo2 || 98}% / {consultation.vitals.bloodSugar || 112} mg/dL
                </div>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  <span>Hemoglobin</span>
                </div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">
                  {consultation.vitals.hemoglobin || 8.2} g/dL
                </div>
              </div>
            </div>

            {/* Video Call Controls */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full transition ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition ${
                  isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={handleFinishConsultation}
                className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Complete & End Call</span>
              </button>
            </div>

          </div>

          {/* Right Column: AI Clinical Decision & e-Prescription (5 Cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-white space-y-4 overflow-y-auto">
            
            {/* AI Assistant Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    Gemini AI Clinical Assist
                  </span>
                </div>
                <button
                  onClick={handleFetchAiAssist}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {isAiLoading ? 'Analyzing...' : 'Generate Guidance'}
                </button>
              </div>

              {aiSuggestions && (
                <div className="text-xs space-y-2 text-slate-700 pt-1">
                  <div>
                    <span className="font-bold text-slate-900">Differential Diagnosis:</span>
                    <ul className="list-disc list-inside mt-0.5 text-slate-600">
                      {aiSuggestions.differentialDiagnosis?.map((d: string, i: number) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Clinical Actions:</span>
                    <ul className="list-disc list-inside mt-0.5 text-slate-600">
                      {aiSuggestions.recommendedActions?.map((a: string, i: number) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor's Clinical Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                Doctor's Clinical Notes & Advice
              </label>
              <textarea
                rows={3}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Enter patient diagnosis, advice, and instructions for ASHA..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              ></textarea>
            </div>

            {/* Digital e-Prescription Composer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Digital e-Prescription</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">{prescriptions.length} items</span>
              </div>

              {/* Medication List */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {prescriptions.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{p.medicineName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.dosage} • {p.duration} ({p.instructions})
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMedication(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Medication Inline Form */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Medicine name (e.g. IFA Tab)"
                  value={newMed.medicineName}
                  onChange={(e) => setNewMed({ ...newMed, medicineName: e.target.value })}
                  className="sm:col-span-2 p-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="px-2 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Hospital Referral Option */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isReferralNeeded}
                  onChange={(e) => setIsReferralNeeded(e.target.checked)}
                  className="rounded-sm text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Escalate / Refer to District Hospital</span>
              </label>

              {isReferralNeeded && (
                <input
                  type="text"
                  placeholder="Referral reason (e.g. Secondary hypertension workup & NICU standby)"
                  value={referralNotes}
                  onChange={(e) => setReferralNotes(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden"
                />
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={handleFinishConsultation}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save e-Prescription & Notify ASHA / Patient</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
