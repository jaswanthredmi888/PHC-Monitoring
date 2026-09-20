import React, { useState } from 'react';
import { TeleconsultationRequest } from '../types';
import { DoctorConsultationRoom } from './DoctorConsultationRoom';
import { 
  Video, 
  Search, 
  Plus, 
  MapPin, 
  Baby, 
  User, 
  Heart, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Calendar,
  Sparkles,
  Stethoscope,
  X
} from 'lucide-react';

// Structured Authentic Maharashtra Location Hierarchy
export interface MaharashtraDistrictConfig {
  district: string;
  talukas: {
    name: string;
    sector: string;
    villages: string[];
  }[];
}

export const MAHARASHTRA_DISTRICT_PLACES: MaharashtraDistrictConfig[] = [
  {
    district: 'Pune District',
    talukas: [
      {
        name: 'Mulshi Taluka (Paud Block)',
        sector: 'PAUD - MULSHI SECTOR',
        villages: ['Paud Gaon', 'Pirangut Pada', 'Lavasa Valley Settlement', 'Khadakwasla Wasti', 'Kolwan Pada', 'Male Gaon']
      },
      {
        name: 'Haveli Taluka (Wagholi Block)',
        sector: 'WAGHOLI - HAVELI SECTOR',
        villages: ['Wagholi Rural Hamlet', 'Bakori Wasti', 'Kesnand Gaon', 'Manjari Khurd', 'Loni Kalbhor Hamlet']
      },
      {
        name: 'Junnar Taluka (Otur Tribal Block)',
        sector: 'OTUR - JUNNAR SECTOR',
        villages: ['Otur East Hamlet', 'Karanjale Tribal Settlement', 'Alme Gaon', 'Dingore Pada', 'Khireshwar Ghats']
      },
      {
        name: 'Baramati Taluka',
        sector: 'BARAMATI RURAL SECTOR',
        villages: ['Malegaon Budruk', 'Supe Village', 'Karkhel Wasti', 'Nira Left Bank Pada', 'Dorlewadi']
      },
      {
        name: 'Khed Taluka (Rajgurunagar)',
        sector: 'KHED - CHAKAN SECTOR',
        villages: ['Rajgurunagar Rural', 'Chakan Shindi Pada', 'Waki Gaon', 'Shel Pimpalgaon', 'Bhimashankar Forest Settlement']
      },
      {
        name: 'Shirur Taluka',
        sector: 'SHIRUR PHC SECTOR',
        villages: ['Shikrapur Rural Hamlet', 'Sanaswadi Wasti', 'Nhavare Gaon', 'Koregaon Bhima Hamlet']
      }
    ]
  },
  {
    district: 'Nashik District',
    talukas: [
      {
        name: 'Trimbakeshwar Tribal Taluka',
        sector: 'TRIMBAKESHWAR TRIBAL PHC',
        villages: ['Trimbak Tribal Pada', 'Harsul Forest Hamlet', 'Torangan Pada', 'Metghar Tribal Settlement', 'Velunje Gaon']
      },
      {
        name: 'Sinnar Taluka',
        sector: 'SINNAR RURAL SECTOR',
        villages: ['Sinnar Gaon', 'Musgaon Wasti', 'Dapur Hamlet', 'Panchale Pada', 'Wavi Village']
      },
      {
        name: 'Igatpuri Taluka (Western Ghats)',
        sector: 'IGATPURI GHATS SECTOR',
        villages: ['Igatpuri Ghat Settlement', 'Kavnai Pada', 'Ghoti Rural Wasti', 'Bhavali Dam Hamlet', 'Taked Village']
      },
      {
        name: 'Dindori Tribal Taluka',
        sector: 'DINDORI TRIBAL SECTOR',
        villages: ['Dindori Central', 'Nanashi Tribal Wasti', 'Umrale Gaon', 'Khadak Jambhul Pada']
      }
    ]
  },
  {
    district: 'Satara District',
    talukas: [
      {
        name: 'Wai Taluka (Krishna Valley)',
        sector: 'WAI GHATS SECTOR',
        villages: ['Wai Gaon', 'Dhom Dam Wasti', 'Menavali Hamlet', 'Bhilare Pada', 'Bhuinj Village']
      },
      {
        name: 'Karad Taluka',
        sector: 'KARAD RURAL SECTOR',
        villages: ['Karad Rural Wasti', 'Shenoli Hamlet', 'Ond Village', 'Kale Pada', 'Koyna Sangam Settlement']
      },
      {
        name: 'Mahabaleshwar Taluka',
        sector: 'MAHABALESHWAR HILL PHC',
        villages: ['Tapola Forest Hamlet', 'Metgutad Pada', 'Kshetra Mahabaleshwar Wasti', 'Pratapgad Foothills']
      }
    ]
  },
  {
    district: 'Nagpur District',
    talukas: [
      {
        name: 'Hingna Taluka',
        sector: 'HINGNA RURAL SECTOR',
        villages: ['Hingna Gaon', 'Wanadongri Wasti', 'Kanhan River Hamlet', 'Mohgaon Pada', 'Adegaon Village']
      },
      {
        name: 'Saoner Taluka',
        sector: 'SAONER BLOCK SECTOR',
        villages: ['Saoner Central', 'Kelod Rural Settlement', 'Khapa Wasti', 'Parseoni Border Hamlet']
      },
      {
        name: 'Umred Taluka',
        sector: 'UMRED SUB-DISTRICT SECTOR',
        villages: ['Umred Rural', 'Kuhi Gaon', 'Bhiwapur Border Pada', 'Sirsi Hamlet', 'Makardhokra Village']
      }
    ]
  },
  {
    district: 'Chhatrapati Sambhajinagar',
    talukas: [
      {
        name: 'Paithan Taluka (Godavari Basin)',
        sector: 'PAITHAN RURAL SECTOR',
        villages: ['Paithan Gaon', 'Jayakwadi Dam Settlement', 'Bidle Pada', 'Navgaon Wasti', 'Shekta Village']
      },
      {
        name: 'Gangapur Taluka',
        sector: 'GANGAPUR PHC SECTOR',
        villages: ['Gangapur Rural', 'Lasur Station Wasti', 'Shilapur Pada', 'Waluj Rural Outskirts']
      }
    ]
  },
  {
    district: 'Palghar & Thane District',
    talukas: [
      {
        name: 'Jawhar Tribal Taluka',
        sector: 'JAWHAR TRIBAL PHC',
        villages: ['Jawhar Forest Pada', 'Dabhosa Waterfall Settlement', 'Apatale Tribal Hamlet', 'Khadkhad Pada']
      },
      {
        name: 'Mokhada Taluka',
        sector: 'MOKHADA GHATS SECTOR',
        villages: ['Mokhada Rural Wasti', 'Khoj Tribal Hamlet', 'Poshera Pada', 'Ase Gaon']
      },
      {
        name: 'Dahanu Coastal Taluka',
        sector: 'DAHANU TRIBAL SECTOR',
        villages: ['Gholvad Rural', 'Bordi Coastal Pada', 'Kasa Tribal Settlement', 'Chinchani Wasti']
      }
    ]
  }
];

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
  const [filterPregnancy, setFilterPregnancy] = useState<string>('all'); // all | pregnant | non-pregnant | postpartum
  const [activeCallRequest, setActiveCallRequest] = useState<TeleconsultationRequest | null>(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // New Booking Modal State: Maharashtra Place Selectors
  const [distIndex, setDistIndex] = useState<number>(0);
  const [talukaIndex, setTalukaIndex] = useState<number>(0);
  const [customVillage, setCustomVillage] = useState<string>('Paud Gaon');

  // New Booking Modal State: Pregnancy Status & Details
  const [pregnancyOption, setPregnancyOption] = useState<'no' | 'yes' | 'postpartum'>('yes');
  const [trimesterStage, setTrimesterStage] = useState<'1st Trimester (Weeks 1-12)' | '2nd Trimester (Weeks 13-27)' | '3rd Trimester (Weeks 28-40+)'>('3rd Trimester (Weeks 28-40+)');
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(32);
  const [gravidaPara, setGravidaPara] = useState<string>('G2P1');
  const [eddDate, setEddDate] = useState<string>('2026-11-15');
  const [selectedRiskFlags, setSelectedRiskFlags] = useState<string[]>([
    'Preeclampsia Risk (BP ≥ 140/90)'
  ]);

  // Non-Obstetric Specialty
  const [nonObstetricCategory, setNonObstetricCategory] = useState<string>('General Physician');

  // Patient Basic Info
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(24);
  const [patientGender, setPatientGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [patientPhone, setPatientPhone] = useState('+91 98220 11450');
  const [urgency, setUrgency] = useState<'Critical' | 'High' | 'Medium' | 'Routine'>('High');
  const [bookedBy, setBookedBy] = useState('ASHA Sunita Patil (Field Duty)');
  const [source, setSource] = useState<'ASHA Field Worker' | 'Direct Patient' | 'Sub-Center ANM'>('ASHA Field Worker');
  const [symptoms, setSymptoms] = useState('');
  
  // Vitals
  const [vitals, setVitals] = useState({
    bloodPressure: '142/92',
    heartRate: 84,
    spo2: 98,
    temperature: 37.0,
    hemoglobin: 8.8,
    bloodSugar: 108
  });

  // Current selected district & taluka objects
  const currentDistrict = MAHARASHTRA_DISTRICT_PLACES[distIndex] || MAHARASHTRA_DISTRICT_PLACES[0];
  const currentTaluka = currentDistrict.talukas[talukaIndex] || currentDistrict.talukas[0];

  const handleDistrictChange = (idx: number) => {
    setDistIndex(idx);
    setTalukaIndex(0);
    const newDistrict = MAHARASHTRA_DISTRICT_PLACES[idx];
    if (newDistrict && newDistrict.talukas[0] && newDistrict.talukas[0].villages[0]) {
      setCustomVillage(newDistrict.talukas[0].villages[0]);
    }
  };

  const handleTalukaChange = (idx: number) => {
    setTalukaIndex(idx);
    const newTaluka = currentDistrict.talukas[idx];
    if (newTaluka && newTaluka.villages[0]) {
      setCustomVillage(newTaluka.villages[0]);
    }
  };

  const toggleRiskFlag = (flag: string) => {
    if (selectedRiskFlags.includes(flag)) {
      setSelectedRiskFlags(selectedRiskFlags.filter(f => f !== flag));
    } else {
      setSelectedRiskFlags([...selectedRiskFlags, flag]);
    }
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    let pregnancyStatusFormatted = '';
    let isPregnantBool = false;
    let assignedSpecialty: any = 'General Physician';

    if (patientGender === 'Male') {
      isPregnantBool = false;
      assignedSpecialty = (nonObstetricCategory as any) || 'General Physician';
      pregnancyStatusFormatted = 'N/A (Male Patient)';
    } else if (pregnancyOption === 'yes') {
      isPregnantBool = true;
      assignedSpecialty = 'OB/GYN & Maternal';
      pregnancyStatusFormatted = `Pregnant (${trimesterStage.split(' ')[0]} - ${gestationalWeeks} Wks)`;
    } else if (pregnancyOption === 'postpartum') {
      isPregnantBool = false;
      assignedSpecialty = 'OB/GYN & Maternal';
      pregnancyStatusFormatted = 'Postpartum (Lactating Mother)';
    } else {
      isPregnantBool = false;
      assignedSpecialty = nonObstetricCategory as any;
      pregnancyStatusFormatted = `Not Pregnant (${nonObstetricCategory})`;
    }

    const created: TeleconsultationRequest = {
      id: `TC-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName: patientName.trim(),
      patientAge: Number(patientAge) || 25,
      patientGender,
      patientPhone: patientPhone || '+91 98220 00000',
      abhaId: `27-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      district: currentDistrict.district,
      taluka: currentTaluka.name,
      sector: currentTaluka.sector,
      village: `${customVillage}, ${currentTaluka.name.split(' ')[0]}, ${currentDistrict.district.replace(' District', '')}`,
      source,
      bookedBy,
      requestTime: 'Just Now',
      urgency,
      specialty: assignedSpecialty,
      symptoms: symptoms || (pregnancyOption === 'yes' ? `Antenatal tele-review at ${gestationalWeeks} weeks gestation.` : 'Routine clinical tele-consultation evaluation.'),
      isPregnant: isPregnantBool,
      pregnancyStage: pregnancyOption === 'yes' ? trimesterStage : pregnancyOption === 'postpartum' ? 'Postpartum (0-6 Months)' : 'Not Pregnant',
      gestationalWeeks: pregnancyOption === 'yes' ? gestationalWeeks : undefined,
      gravidaPara: pregnancyOption === 'yes' ? gravidaPara : undefined,
      edd: pregnancyOption === 'yes' ? eddDate : undefined,
      maternalRiskFlags: pregnancyOption === 'yes' ? selectedRiskFlags : undefined,
      clinicalCategory: pregnancyOption === 'no' ? nonObstetricCategory : undefined,
      pregnancyStatus: pregnancyStatusFormatted,
      vitals,
      doctorAssigned: 'Dr. Rajesh Sharma, MD (PHC In-Charge)',
      status: 'Waiting'
    };

    onAddRequest(created);
    setShowNewBookingModal(false);
    
    // Reset basic state
    setPatientName('');
    setSymptoms('');
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    const matchQuery = 
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.district && r.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.symptoms.toLowerCase().includes(searchQuery.toLowerCase());

    const matchUrgency = filterUrgency === 'all' || r.urgency.toLowerCase() === filterUrgency.toLowerCase();
    const matchStatus = filterStatus === 'all' || r.status.toLowerCase() === filterStatus.toLowerCase();
    
    let matchPregnancy = true;
    if (filterPregnancy === 'pregnant') {
      matchPregnancy = r.isPregnant === true || (r.pregnancyStatus && r.pregnancyStatus.toLowerCase().includes('pregnant') && !r.pregnancyStatus.toLowerCase().includes('not'));
    } else if (filterPregnancy === 'non-pregnant') {
      matchPregnancy = r.isPregnant === false || (r.pregnancyStatus && r.pregnancyStatus.toLowerCase().includes('not'));
    } else if (filterPregnancy === 'postpartum') {
      matchPregnancy = r.pregnancyStage?.includes('Postpartum') || (r.pregnancyStatus && r.pregnancyStatus.toLowerCase().includes('postpartum'));
    }

    return matchQuery && matchUrgency && matchStatus && matchPregnancy;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Action Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-200 text-xs font-mono font-bold uppercase tracking-wider">
            <Video className="w-4 h-4" />
            <span>PHC Tele-Consultation Gateway • Maharashtra State Health</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black mt-1 font-sans">
            Real-Time Doctor Tele-Consultant Hub
          </h2>
          <p className="text-xs md:text-sm text-pink-100 mt-1 max-w-2xl leading-relaxed">
            Live video and audio tele-triage bookings across Maharashtra rural circles (Pune, Nashik, Satara, Nagpur, Sambhajinagar, Palghar). Complete gestational trimester monitoring, high-risk ANC tracking, and pediatric & general medicine calls.
          </p>
        </div>

        <button
          onClick={() => setShowNewBookingModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-pink-50 text-rose-700 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-rose-600" />
          <span>New Maharashtra Tele-Booking</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, Maharashtra village, taluka, symptoms, or ASHA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pregnancy Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-500 font-mono hidden sm:inline">Case:</span>
            <select
              value={filterPregnancy}
              onChange={(e) => setFilterPregnancy(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Cases ({requests.length})</option>
              <option value="pregnant">🤰 Pregnant Only (ANC)</option>
              <option value="non-pregnant">👤 Non-Obstetric Only</option>
              <option value="postpartum">🍼 Postpartum Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-500 font-mono hidden sm:inline">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="waiting">Waiting In Queue</option>
              <option value="in consultation">Active Call</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1">
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
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="col-span-2 p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
            <User className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700">No teleconsultation requests match your filters.</p>
            <p className="text-xs text-slate-400">Try changing your search terms or clearing the pregnancy filter.</p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isPregnant = req.isPregnant || (req.pregnancyStatus && req.pregnancyStatus.toLowerCase().includes('pregnant') && !req.pregnancyStatus.toLowerCase().includes('not'));
            const isPostpartum = req.pregnancyStage?.includes('Postpartum') || (req.pregnancyStatus && req.pregnancyStatus.toLowerCase().includes('postpartum'));

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs p-5 flex flex-col justify-between ${
                  req.urgency === 'Critical' && req.status === 'Waiting'
                    ? 'border-rose-300 ring-2 ring-rose-200/80 bg-rose-50/15'
                    : isPregnant
                    ? 'border-pink-200/90 hover:border-pink-300 bg-linear-to-b from-pink-50/20 to-transparent'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Card Header: Patient Name, Gender, Urgency & Location */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {req.patientName}
                        </h3>
                        <span className="text-xs font-medium text-slate-500">
                          ({req.patientAge}y, {req.patientGender})
                        </span>
                      </div>
                      
                      {/* Maharashtra Location Tag */}
                      <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="truncate max-w-xs sm:max-w-sm" title={req.village}>
                          {req.village}
                        </span>
                      </div>
                      {req.sector && (
                        <div className="text-[10px] text-slate-400 font-mono ml-5">
                          PHC Sector: {req.sector}
                        </div>
                      )}
                    </div>

                    {/* Urgency Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                          req.urgency === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : req.urgency === 'High'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {req.urgency}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{req.requestTime}</span>
                    </div>
                  </div>

                  {/* PREGNANCY STAGE OR NOT STATUS PILL */}
                  <div className="my-3">
                    {isPregnant ? (
                      <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200/90 text-pink-950 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-pink-900">
                            <Baby className="w-3.5 h-3.5 text-pink-600" />
                            <span>{req.pregnancyStatus || req.pregnancyStage || 'Pregnant (Antenatal Care)'}</span>
                          </div>
                          {req.gravidaPara && (
                            <span className="text-[10px] font-mono font-bold bg-pink-200/70 text-pink-900 px-2 py-0.5 rounded">
                              {req.gravidaPara}
                            </span>
                          )}
                        </div>

                        {/* Extra Pregnancy Details: EDD & Gestational Weeks */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-pink-800 font-medium">
                          {req.gestationalWeeks && (
                            <span>Gestation: <strong className="font-semibold">{req.gestationalWeeks} Weeks</strong></span>
                          )}
                          {req.edd && (
                            <span>• EDD: <strong className="font-semibold">{req.edd}</strong></span>
                          )}
                        </div>

                        {/* Risk Flags */}
                        {req.maternalRiskFlags && req.maternalRiskFlags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {req.maternalRiskFlags.map((flag, idx) => (
                              <span key={idx} className="text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded">
                                ⚠️ {flag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : isPostpartum ? (
                      <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Baby className="w-3.5 h-3.5 text-purple-600" />
                          <span>{req.pregnancyStatus || 'Postpartum / Lactating Mother'}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-purple-200/70 px-2 py-0.5 rounded">
                          HBNC Follow-up
                        </span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>{req.pregnancyStatus || 'Not Pregnant (General Outpatient)'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                          {req.clinicalCategory || req.specialty}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Source & Booking Info */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Booked by:</span>
                      <span className="font-semibold text-slate-900">{req.source} ({req.bookedBy})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Assigned Doctor:</span>
                      <span className="font-semibold text-blue-700">{req.doctorAssigned}</span>
                    </div>
                  </div>

                  {/* Symptoms Description */}
                  <div className="mt-2.5 text-xs text-slate-800 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                    <strong className="text-slate-900">Symptoms & Clinical Presentation:</strong> {req.symptoms}
                  </div>

                  {/* Recorded Vitals */}
                  {req.vitals && Object.keys(req.vitals).length > 0 && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-1.5 text-[11px] font-mono">
                      {req.vitals.bloodPressure && (
                        <div className="p-1.5 rounded-lg bg-slate-100 text-center border border-slate-200/60">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">BP</div>
                          <div className={`font-bold mt-0.5 ${
                            req.vitals.bloodPressure.includes('15') || req.vitals.bloodPressure.includes('14')
                              ? 'text-rose-600'
                              : 'text-slate-900'
                          }`}>
                            {req.vitals.bloodPressure}
                          </div>
                        </div>
                      )}
                      {req.vitals.hemoglobin && (
                        <div className="p-1.5 rounded-lg bg-slate-100 text-center border border-slate-200/60">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Hb</div>
                          <div className={`font-bold mt-0.5 ${
                            req.vitals.hemoglobin < 9.0 ? 'text-amber-700' : 'text-slate-900'
                          }`}>
                            {req.vitals.hemoglobin} g/dL
                          </div>
                        </div>
                      )}
                      {req.vitals.heartRate && (
                        <div className="p-1.5 rounded-lg bg-slate-100 text-center border border-slate-200/60">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Pulse</div>
                          <div className="font-bold text-emerald-700 mt-0.5">{req.vitals.heartRate} bpm</div>
                        </div>
                      )}
                      {req.vitals.spo2 && (
                        <div className="p-1.5 rounded-lg bg-slate-100 text-center border border-slate-200/60">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">SpO2</div>
                          <div className="font-bold text-blue-700 mt-0.5">{req.vitals.spo2}%</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={`w-2 h-2 rounded-full ${
                      req.status === 'Waiting' ? 'bg-amber-500 animate-pulse' : req.status === 'In Consultation' ? 'bg-blue-600' : 'bg-emerald-500'
                    }`}></span>
                    <span className="font-semibold text-slate-700">{req.status}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'Completed' ? (
                      <button
                        onClick={() => setActiveCallRequest(req)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer"
                      >
                        View e-Prescription
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveCallRequest(req)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Connect with Doctor</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
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

      {/* ========================================================================= */}
      {/* BOOK NEW TELE-CONSULTATION MODAL (ENRICHED MAHARASHTRA & PREGNANCY DETAILS) */}
      {/* ========================================================================= */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-t-2xl shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-600" />
                  <span>Book Doctor Tele-Consultation (Maharashtra PHC)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Register rural patients, capture authentic Maharashtra taluka/hamlet, and specify maternal pregnancy stage
                </p>
              </div>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleCreateBooking} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              
              {/* 1. PATIENT BASIC DEMOGRAPHICS */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Patient Identity & Demographics</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohini Rajesh Shinde"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98220 XXXXX"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => {
                        const g = e.target.value as any;
                        setPatientGender(g);
                        if (g === 'Male') {
                          setPregnancyOption('no');
                        }
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Urgency Triage</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-bold text-slate-800"
                    >
                      <option value="Critical">🔴 Critical (Immediate)</option>
                      <option value="High">🟠 High Priority</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Routine">🟢 Routine Follow-up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Source Cadre</label>
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                    >
                      <option value="ASHA Field Worker">ASHA Field Worker</option>
                      <option value="Sub-Center ANM">Sub-Center ANM</option>
                      <option value="Direct Patient">Direct Patient Walk-in</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. MAHARASHTRA PLACES SELECTION (PROMINENT & AUTHENTIC) */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-800 font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Maharashtra Administrative Sector & Place Details</span>
                  </h4>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                    Maharashtra State Hub
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* District Selection */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">District (Maharashtra)</label>
                    <select
                      value={distIndex}
                      onChange={(e) => handleDistrictChange(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {MAHARASHTRA_DISTRICT_PLACES.map((d, i) => (
                        <option key={d.district} value={i}>
                          {d.district}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Taluka / Sub-Sector */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Taluka / PHC Block</label>
                    <select
                      value={talukaIndex}
                      onChange={(e) => handleTalukaChange(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {currentDistrict.talukas.map((t, i) => (
                        <option key={t.name} value={i}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Village / Hamlet Dropdown or Custom Input */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Village / Hamlet / Wasti</label>
                    <select
                      value={customVillage}
                      onChange={(e) => setCustomVillage(e.target.value)}
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {currentTaluka.villages.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Village text if needed */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-blue-200/50">
                  <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Selected Location:</span>
                    <strong className="text-blue-950 font-bold">
                      {customVillage}, {currentTaluka.name}, {currentDistrict.district}
                    </strong>
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono">
                    Sector: {currentTaluka.sector}
                  </span>
                </div>
              </div>

              {/* 3. OBSTETRIC STATUS (ONLY FOR FEMALE / OTHER PATIENTS) */}
              {patientGender !== 'Male' ? (
                <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-200/90 space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-pink-800 font-mono flex items-center gap-1.5">
                      <Baby className="w-4 h-4 text-pink-600" />
                      <span>Obstetric Status: Pregnancy Stage or Not Details *</span>
                    </h4>
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded">
                      MCH Surveillance
                    </span>
                  </div>

                  {/* Segmented Choice: Is Patient Pregnant? */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPregnancyOption('yes')}
                      className={`p-2.5 rounded-xl border font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                        pregnancyOption === 'yes'
                          ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Baby className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-xs">Yes - Currently Pregnant</div>
                        <div className={`text-[9px] font-normal ${pregnancyOption === 'yes' ? 'text-pink-100' : 'text-slate-400'}`}>
                          Active Antenatal Cohort
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPregnancyOption('no')}
                      className={`p-2.5 rounded-xl border font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                        pregnancyOption === 'no'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-xs">No - Not Pregnant</div>
                        <div className={`text-[9px] font-normal ${pregnancyOption === 'no' ? 'text-blue-100' : 'text-slate-400'}`}>
                          Non-Obstetric / General
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPregnancyOption('postpartum')}
                      className={`p-2.5 rounded-xl border font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                        pregnancyOption === 'postpartum'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-xs">Postpartum / Lactating</div>
                        <div className={`text-[9px] font-normal ${pregnancyOption === 'postpartum' ? 'text-purple-100' : 'text-slate-400'}`}>
                          0–6 Months Post-Delivery
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* WHEN PREGNANT: Trimester, Gestation, Gravida/Para & Risk Factors */}
                  {pregnancyOption === 'yes' && (
                    <div className="p-3.5 bg-white rounded-xl border border-pink-200 space-y-3 mt-2 animate-fadeIn">
                      
                      {/* Trimester Segmented Selector */}
                      <div>
                        <label className="block font-bold text-pink-900 mb-1.5">
                          Current Gestational Trimester Stage *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { stage: '1st Trimester (Weeks 1-12)', label: '1st Trimester', sub: 'Weeks 1 – 12', note: 'Early dating USG & IFA' },
                            { stage: '2nd Trimester (Weeks 13-27)', label: '2nd Trimester', sub: 'Weeks 13 – 27', note: 'Anomaly scan & GDM' },
                            { stage: '3rd Trimester (Weeks 28-40+)', label: '3rd Trimester', sub: 'Weeks 28 – 40+', note: 'Delivery plan & BP monitoring' }
                          ].map((t) => (
                            <button
                              key={t.stage}
                              type="button"
                              onClick={() => setTrimesterStage(t.stage as any)}
                              className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                                trimesterStage === t.stage
                                  ? 'bg-pink-50 border-pink-500 ring-1 ring-pink-500 text-pink-950 font-bold'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div className="text-xs font-bold">{t.label}</div>
                              <div className="text-[10px] text-pink-700 font-mono">{t.sub}</div>
                              <div className="text-[9px] text-slate-400">{t.note}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gestational Weeks, Gravida/Para & EDD */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-pink-100">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Gestational Age (Weeks)
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="1"
                              max="42"
                              value={gestationalWeeks}
                              onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                            />
                            <span className="text-xs text-slate-500 font-bold shrink-0">Wks</span>
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Gravida / Parity
                          </label>
                          <select
                            value={gravidaPara}
                            onChange={(e) => setGravidaPara(e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium"
                          >
                            <option value="G1P0">G1P0 (Primigravida - First Child)</option>
                            <option value="G2P1">G2P1 (Second Pregnancy)</option>
                            <option value="G3P2">G3P2 (Third Pregnancy)</option>
                            <option value="G4+">G4+ (Grand Multipara)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Expected Delivery Date (EDD)
                          </label>
                          <input
                            type="date"
                            value={eddDate}
                            onChange={(e) => setEddDate(e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>

                      {/* High Risk Maternal Complications Multi-Select */}
                      <div className="pt-2 border-t border-pink-100">
                        <label className="block font-semibold text-pink-900 mb-1.5">
                          High-Risk Maternal Flags (Select all applicable)
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Preeclampsia Risk (BP ≥ 140/90)',
                            'Severe Anemia (Hb < 8.5)',
                            'Gestational Diabetes (GDM)',
                            'Previous C-Section / LSCS Scar',
                            'Severe Pedal Edema',
                            'Oligohydramnios / Twin Gestation',
                            'Normal Low-Risk ANC'
                          ].map((flag) => {
                            const isSelected = selectedRiskFlags.includes(flag);
                            return (
                              <button
                                key={flag}
                                type="button"
                                onClick={() => toggleRiskFlag(flag)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border ${
                                  isSelected
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-2xs font-semibold'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {isSelected ? '✓ ' : '+ '}{flag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WHEN NOT PREGNANT: Specialty Selection */}
                  {pregnancyOption === 'no' && (
                    <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2 mt-2 animate-fadeIn">
                      <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Non-Obstetric Case: Select Clinical Domain</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          'General Physician',
                          'Pediatrics & Child Health',
                          'Cardiology / Hypertension',
                          'Geriatric Care'
                        ].map((spec) => (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => setNonObstetricCategory(spec)}
                            className={`p-2 rounded-lg text-left border text-xs font-semibold transition cursor-pointer ${
                              nonObstetricCategory === spec
                                ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {spec}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WHEN POSTPARTUM: Notes */}
                  {pregnancyOption === 'postpartum' && (
                    <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-2 mt-2 animate-fadeIn text-xs text-purple-900">
                      <div className="font-bold flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-purple-600" />
                        <span>Postnatal Care & Lactation Follow-up</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        Follow-up for HBNC Day 3, 7, 14, 21, 28, or 42. Active check for postpartum hemorrhage, wound infection, and neonatal feeding.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* FOR MALE PATIENTS: General Clinical Domain Selection (DOES NOT ASK PREGNANCY DETAILS) */
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Clinical Specialty Consultation Domain *</span>
                    </h4>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded">
                      Male Patient (General OPD)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Select the relevant clinical domain for specialist consultation triage:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'General Physician',
                      'Pediatrics & Child Health',
                      'Cardiology / Hypertension',
                      'Geriatric Care'
                    ].map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => setNonObstetricCategory(spec)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition cursor-pointer ${
                          nonObstetricCategory === spec
                            ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. CHIEF SYMPTOMS & CLINICAL COMPLAINT */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chief Symptoms & Clinical Complaint *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={
                    pregnancyOption === 'yes'
                      ? "e.g. Gestational 32 weeks, frontal headache, epigastric pain, field BP 150/98 mmHg, decreased fetal movements..."
                      : "e.g. Continuous high fever for 3 days, watery stools, dehydration signs, body ache..."
                  }
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* 5. FIELD VITALS */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                  <span>Recorded Field Vitals (By ASHA / ANM)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">BP (mmHg)</label>
                    <input
                      type="text"
                      placeholder="140/90"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">Hb (g/dL)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="8.8"
                      value={vitals.hemoglobin}
                      onChange={(e) => setVitals({ ...vitals, hemoglobin: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">Pulse (bpm)</label>
                    <input
                      type="number"
                      placeholder="84"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">SpO2 (%)</label>
                    <input
                      type="number"
                      placeholder="98"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
                  Auto-assigned: Dr. Rajesh Sharma, MD (PHC In-Charge)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewBookingModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Add to Maharashtra Doctor Queue</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
