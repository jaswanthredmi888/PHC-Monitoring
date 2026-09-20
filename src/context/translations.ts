export type Language = 'mr' | 'en' | 'hi' | 'ta';
export type Theme = 'light' | 'dark';

export interface Translations {
  // Brand & Header
  appName: string;
  subtitle: string;
  commandCenter: string;
  opdQueue: string;
  teleConsult: string;
  medicineFacility: string;
  referrals: string;
  diseaseGap: string;
  quickActions: string;
  assignedCitizens: string;
  activeStaff: string;
  pendingTransfers: string;
  highRiskMothers: string;
  searchPlaceholder: string;
  syncAll: string;
  signOut: string;
  settings: string;
  language: string;
  theme: string;
  lightMode: string;
  darkMode: string;
  marathi: string;
  english: string;
  hindi: string;
  tamil: string;
  navigation: string;
  newBooking: string;
  connectDoctor: string;
  workingOffline: string;
  online: string;
  syncNoticeSuccess: string;
  activeDoctorQueue: string;
  status: string;
  urgency: string;
  caseType: string;

  // Login Page
  loginHeading: string;
  loginSubtitle: string;
  emailOrIdLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  forgotPin: string;
  dutyDesignationLabel: string;
  rememberTerminal: string;
  secureEncryption: string;
  enterPortalButton: string;
  authenticating: string;
  quickDemoLoginTitle: string;
  quickDemoLoginSub: string;
  needAssistance: string;
  helpSupport: string;
  helpModalTitle: string;
  helpDescription: string;
  close: string;
  roleMedicalOfficer: string;
  roleTeleConsultant: string;
  roleAshaSupervisor: string;
  roleEpidemiologist: string;

  // Metric Cards & Dashboard
  citizensCountLabel: string;
  coverageStat: string;
  manageLink: string;
  activeAshaCountLabel: string;
  liveInFieldStat: string;
  grassrootsHospitalReferrals: string;
  blockImmunization: string;
  nationalTargetStat: string;
  sectorLabel: string;
  complianceIndex: string;
  lastSync: string;
  refreshSync: string;
  activeAppointments: string;
  scheduledLabel: string;
  lowStockAlert: string;
  suppliesOk: string;
  transfersCountLabel: string;
  waitingConsults: string;
  criticalDeficits: string;

  // Tabs & Sections
  gisMapTitle: string;
  gisMapSub: string;
  ashaCadreTitle: string;
  citizenRegistryTitle: string;
  vaccineNutritionTitle: string;
  analyticsTitle: string;
  filterByVillage: string;
  allVillages: string;
  searchAshaCitizen: string;

  // OPD & Appointments
  tokenNo: string;
  patientName: string;
  ageGender: string;
  vitals: string;
  symptoms: string;
  assignedDoctor: string;
  action: string;
  callPatient: string;
  markDone: string;
  inConsultation: string;
  waiting: string;
  completed: string;
  newAppointmentBtn: string;
  dailyReportBtn: string;

  // Medicine & Facility
  essentialDrugsTitle: string;
  facilityInfrastructureTitle: string;
  drugName: string;
  stockLevel: string;
  batchExpiry: string;
  reorderLevel: string;
  adequateStock: string;
  criticalStock: string;
  coldChainReady: string;
  oxygenReady: string;
  ambulanceAvailable: string;
  powerBackupReady: string;

  // Referrals
  referralsTitle: string;
  referralsSubtitle: string;
  patientHospital: string;
  sourcePhc: string;
  destinationFacility: string;
  transportMode: string;
  transferReason: string;
  inTransit: string;
  admitted: string;
  discharged: string;
  createReferralBtn: string;

  // Teleconsultation
  teleconsultHubTitle: string;
  teleconsultHubSubtitle: string;
  doctorRoster: string;
  activeQueue: string;
  joinVideoCall: string;
  bookTeleConsultBtn: string;
  malePatientNotice: string;
  pregnancyStatusLabel: string;
  clinicalDomainLabel: string;

  // Disease & Gap Map
  diseaseGapTitle: string;
  diseaseGapSubtitle: string;
  outbreakAlerts: string;
  facilityDeficits: string;
  affectedPopulation: string;
  missingEquipment: string;
  emergencyActionReq: string;
  deployMobileUnit: string;

  // Common Actions
  save: string;
  cancel: string;
  submit: string;
  back: string;
  delete: string;
  edit: string;
  viewDetails: string;
  all: string;
  critical: string;
  moderate: string;
  low: string;

  // Citizen & Health Worker Management
  citizenManagementTitle: string;
  liveRegister: string;
  citizensTab: string;
  ashaWorkersTab: string;
  searchAshaPlaceholder: string;
  searchCitizenPlaceholder: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    // Brand & Header
    appName: 'SEVALink Monitoring',
    subtitle: 'Rural HealthCare System - Maharashtra',
    commandCenter: 'Center Dashboard',
    opdQueue: 'Appointment & Queue',
    teleConsult: 'Tele-Consultations',
    medicineFacility: 'Medicine & Facility Update',
    referrals: 'Referral & Follow-up',
    diseaseGap: 'Disease & Facility Gap Map',
    quickActions: 'Quick Actions',
    assignedCitizens: 'Assigned Citizens',
    activeStaff: 'Active ASHA Staff',
    pendingTransfers: 'Pending Transfers',
    highRiskMothers: 'High-Risk Mothers',
    searchPlaceholder: 'Search patient, village, or ASHA...',
    syncAll: 'Synced',
    signOut: 'Sign Out of Portal',
    settings: 'System Settings',
    language: 'System Language',
    theme: 'Theme / Appearance',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    marathi: 'मराठी',
    english: 'English',
    hindi: 'हिन्दी',
    tamil: 'தமிழ்',
    navigation: 'Navigation Menu',
    newBooking: 'New Tele-Booking',
    connectDoctor: 'Connect with Doctor',
    workingOffline: 'Working Offline',
    online: 'Online',
    syncNoticeSuccess: 'Synchronized with Maharashtra DHS Telemetry Servers',
    activeDoctorQueue: 'Real-Time Doctor Tele-Consultant Hub',
    status: 'Status',
    urgency: 'Urgency',
    caseType: 'Case Type',

    // Login Page
    loginHeading: 'SEVALink Monitoring',
    loginSubtitle: 'Rural HealthCare System - Maharashtra',
    emailOrIdLabel: 'Official Email or Employee ID',
    emailPlaceholder: 'doctor@phc.gov.in or MH-PHC-4012',
    passwordLabel: 'Security PIN / Password',
    forgotPin: 'Forgot PIN?',
    dutyDesignationLabel: 'Duty Designation',
    rememberTerminal: 'Remember this clinical terminal',
    secureEncryption: '256-Bit Encrypted',
    enterPortalButton: 'Authorize & Enter PHC Terminal',
    authenticating: 'Authorizing Access...',
    quickDemoLoginTitle: 'Quick Roster Demo Sign-In',
    quickDemoLoginSub: 'Select a clinical role to auto-populate credentials:',
    needAssistance: 'National Health Mission IT Helpdesk',
    helpSupport: 'Need assistance? View Clinical Guidelines',
    helpModalTitle: 'PHC Clinical Portal Support',
    helpDescription: 'Authorized clinical users can sign in using their registered health personnel credentials or use the quick role switcher for testing.',
    close: 'Close',
    roleMedicalOfficer: 'Medical Officer (In-Charge)',
    roleTeleConsultant: 'Tele-Consultant Specialist',
    roleAshaSupervisor: 'ASHA Field Supervisor / ANM',
    roleEpidemiologist: 'District Epidemiologist (IDSP)',

    // Metric Cards & Dashboard
    citizensCountLabel: 'Assigned Citizens',
    coverageStat: '98.6% Database coverage',
    manageLink: 'Manage →',
    activeAshaCountLabel: 'Active ASHA Staff',
    liveInFieldStat: '10 Live in field now',
    grassrootsHospitalReferrals: 'Grassroots hospital referrals',
    blockImmunization: 'Block Immunization',
    nationalTargetStat: 'National Target: 95.0%',
    sectorLabel: 'Sector',
    complianceIndex: 'Compliance Index',
    lastSync: 'Last synced',
    refreshSync: 'Refresh Cloud Sync',
    activeAppointments: 'Active Appointments',
    scheduledLabel: 'Scheduled',
    lowStockAlert: 'Low Stock Alert',
    suppliesOk: 'Supplies OK',
    transfersCountLabel: 'Transfers',
    waitingConsults: 'Waiting Cases',
    criticalDeficits: 'Deficits Identified',

    // Tabs & Sections
    gisMapTitle: 'Chandanagiri PHC Sector Surveillance & GIS Map',
    gisMapSub: 'Real-time GPS mapping of Subcenters, ASHA cadre, and disease clusters',
    ashaCadreTitle: 'ASHA & ANM Field Cadre',
    citizenRegistryTitle: 'Citizen & Family Registry',
    vaccineNutritionTitle: 'Immunization & Maternal Health Tracker',
    analyticsTitle: 'PHC Clinical Performance Analytics',
    filterByVillage: 'Filter by Village',
    allVillages: 'All Villages',
    searchAshaCitizen: 'Search citizen name, Aadhaar or ASHA...',

    // OPD & Appointments
    tokenNo: 'Token #',
    patientName: 'Patient Name',
    ageGender: 'Age / Gender',
    vitals: 'Vitals',
    symptoms: 'Symptoms / Complaint',
    assignedDoctor: 'Assigned Doctor',
    action: 'Action',
    callPatient: 'Call Patient',
    markDone: 'Mark Done',
    inConsultation: 'In Consultation',
    waiting: 'Waiting',
    completed: 'Completed',
    newAppointmentBtn: '+ New Walk-In / ASHA Appointment',
    dailyReportBtn: 'Daily Roster Report',

    // Medicine & Facility
    essentialDrugsTitle: 'Essential Medicines & Emergency Drug Stock',
    facilityInfrastructureTitle: 'PHC Infrastructure & Equipment Readiness',
    drugName: 'Medicine / Formulation',
    stockLevel: 'Current Stock',
    batchExpiry: 'Batch & Expiry',
    reorderLevel: 'Reorder Buffer',
    adequateStock: 'Adequate Stock',
    criticalStock: 'Critical Shortage',
    coldChainReady: 'Vaccine Cold Chain (ILR)',
    oxygenReady: 'Oxygen Supply & Concentrators',
    ambulanceAvailable: '108 Emergency Ambulance',
    powerBackupReady: 'Generator & Solar Backup',

    // Referrals
    referralsTitle: 'Grassroots Patient Referral & Care Continuity',
    referralsSubtitle: 'Seamless patient transfers to Sub-District & District Hospitals',
    patientHospital: 'Patient & Destination',
    sourcePhc: 'Source PHC / Subcenter',
    destinationFacility: 'Transfer Destination',
    transportMode: 'Ambulance / Transit',
    transferReason: 'Clinical Reason',
    inTransit: 'In Transit',
    admitted: 'Admitted',
    discharged: 'Discharged',
    createReferralBtn: '+ New Referral Case',

    // Teleconsultation
    teleconsultHubTitle: 'Real-Time Doctor Tele-Consultant Hub',
    teleconsultHubSubtitle: 'High-definition video consultations with District Hospital specialists',
    doctorRoster: 'Specialist Doctor Roster',
    activeQueue: 'Tele-Consultation Queue',
    joinVideoCall: 'Join Consultation',
    bookTeleConsultBtn: '+ Request Tele-Consultation',
    malePatientNotice: 'Male Patient (General OPD - Pregnancy details not applicable)',
    pregnancyStatusLabel: 'Obstetric Status: Pregnancy Stage or Not Details',
    clinicalDomainLabel: 'Clinical Specialty Consultation Domain',

    // Disease & Gap Map
    diseaseGapTitle: 'Disease Outbreak Surveillance & Facility Gap Analysis',
    diseaseGapSubtitle: 'Tracking infection clusters and identifying missing diagnostic/treatment infrastructure',
    outbreakAlerts: 'Active Disease Outbreak Clusters',
    facilityDeficits: 'Local Healthcare Facility Deficits',
    affectedPopulation: 'Population at Risk',
    missingEquipment: 'Missing Equipment / Specialist',
    emergencyActionReq: 'Emergency Escalation Required',
    deployMobileUnit: 'Deploy Mobile Medical Unit',

    // Common Actions
    save: 'Save Changes',
    cancel: 'Cancel',
    submit: 'Submit',
    back: 'Back',
    delete: 'Delete',
    edit: 'Edit',
    viewDetails: 'View Details',
    all: 'All',
    critical: 'Critical',
    moderate: 'Moderate',
    low: 'Normal',

    // Citizen & Health Worker Management
    citizenManagementTitle: 'Citizen & Health Worker Management',
    liveRegister: 'Live Register',
    citizensTab: 'Citizens',
    ashaWorkersTab: 'ASHA & ANM Workers',
    searchAshaPlaceholder: 'Search worker name, sector, sub-center...',
    searchCitizenPlaceholder: 'Search citizen name, ABHA ID, village, ASHA...'
  },

  mr: {
    // Brand & Header
    appName: 'सेवा लिंक मॉनिटरिंग',
    subtitle: 'ग्रामीण आरोग्य व्यवस्था - महाराष्ट्र शासन',
    commandCenter: 'कमांड सेंटर डॅशबोर्ड',
    opdQueue: 'ओपीडी यादी व रांग',
    teleConsult: 'डॉक्टर टेलि-सल्ला',
    medicineFacility: 'औषधे व आरोग्य सुविधा',
    referrals: 'रेफरल व पाठपुरावा',
    diseaseGap: 'रोग व आरोग्य अंतर नकाशा',
    quickActions: 'त्वरित कृती',
    assignedCitizens: 'नोंदणीकृत नागरिक',
    activeStaff: 'सक्रिय आशा कर्मचारी',
    pendingTransfers: 'प्रलंबित संदर्भ रुग्ण',
    highRiskMothers: 'अतिजोखमीच्या माता (ANC)',
    searchPlaceholder: 'रुग्णाचे नाव, गाव किंवा आशा शोधा...',
    syncAll: 'सिंक झाले',
    signOut: 'पोर्टलमधून लॉगआउट करा',
    settings: 'प्रणाली सेटिंग्ज',
    language: 'प्रणाली भाषा',
    theme: 'थीम / रंगरूप',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    marathi: 'मराठी',
    english: 'English',
    hindi: 'हिन्दी',
    tamil: 'தமிழ்',
    navigation: 'नेव्हिगेशन मेनू',
    newBooking: 'नवीन टेलि-बुकिंग',
    connectDoctor: 'डॉक्टरांशी जोडा',
    workingOffline: 'ऑफलाइन मोड',
    online: 'ऑनलाइन',
    syncNoticeSuccess: 'महाराष्ट्र आरोग्य संचालनालय सर्व्हरशी समक्रमित केले',
    activeDoctorQueue: 'थेट डॉक्टर टेलि-सल्लागार केंद्र',
    status: 'स्थिती',
    urgency: 'प्राधान्य',
    caseType: 'प्रकार',

    // Login Page
    loginHeading: 'सेवा लिंक मॉनिटरिंग',
    loginSubtitle: 'ग्रामीण आरोग्य व्यवस्था - महाराष्ट्र शासन',
    emailOrIdLabel: 'अधिकृत ईमेल किंवा कर्मचारी कोड',
    emailPlaceholder: 'doctor@phc.gov.in किंवा MH-PHC-4012',
    passwordLabel: 'सुरक्षा पिन / पासवर्ड',
    forgotPin: 'पिन विसरलात?',
    dutyDesignationLabel: 'कर्तव्य पद / पदनाम',
    rememberTerminal: 'हा क्लिनिकल टर्मिनल लक्षात ठेवा',
    secureEncryption: '२५६-बिट एनक्रिप्टेड सुरक्षित',
    enterPortalButton: 'प्रमाणित करा व पोर्टलमध्ये प्रवेश करा',
    authenticating: 'प्रवेश प्रमाणित करत आहे...',
    quickDemoLoginTitle: 'त्वरित रोस्टर चाचणी लॉगिन',
    quickDemoLoginSub: 'क्रेडेंशियल्स आपोआप भरण्यासाठी वैद्यकीय पद निवडा:',
    needAssistance: 'राष्ट्रीय आरोग्य अभियान आयटी मदत कक्ष',
    helpSupport: 'मदत हवी आहे? क्लिनिकल मार्गदर्शक तत्त्वे पहा',
    helpModalTitle: 'प्राथमिक आरोग्य केंद्र क्लिनिकल पोर्टल सहाय्य',
    helpDescription: 'अधिकृत आरोग्य कर्मचारी त्यांच्या नोंदणीकृत ओळखपत्राने लॉग इन करू शकतात किंवा चाचणीसाठी थेट वरील त्वरित भूमिका निवडू शकतात.',
    close: 'बंद करा',
    roleMedicalOfficer: 'वैद्यकीय अधिकारी (प्रभारी)',
    roleTeleConsultant: 'टेलि-सल्लागार तज्ज्ञ डॉक्टर',
    roleAshaSupervisor: 'आशा क्षेत्रीय पर्यवेक्षक / एएनएम',
    roleEpidemiologist: 'जिल्हा साथरोग तज्ज्ञ (IDSP)',

    // Metric Cards & Dashboard
    citizensCountLabel: 'नोंदणीकृत नागरिक',
    coverageStat: '९८.६% डेटाबेस नोंदणी पूर्ण',
    manageLink: 'व्यवस्थापित करा →',
    activeAshaCountLabel: 'सक्रिय आशा कर्मचारी',
    liveInFieldStat: '१० सध्या गावात कार्यरत',
    grassrootsHospitalReferrals: 'ग्रामीण रुग्णालय संदर्भ प्रकरणे',
    blockImmunization: 'गट लसीकरण प्रमाण',
    nationalTargetStat: 'राष्ट्रीय उद्दिष्ट: ९५.०%',
    sectorLabel: 'विभाग / सेक्टर',
    complianceIndex: 'अनुपालन निर्देशांक',
    lastSync: 'शेवटचा सिंक',
    refreshSync: 'क्लाउड सिंक रिफ्रेश करा',
    activeAppointments: 'सक्रिय भेटी / ओपीडी',
    scheduledLabel: 'नियोजित',
    lowStockAlert: 'कमी औषध साठा इशारा',
    suppliesOk: 'पुरवठा पुरेसा',
    transfersCountLabel: 'रुग्ण स्थानांतरणे',
    waitingConsults: 'प्रतीक्षा यादी',
    criticalDeficits: 'गंभीर सुविधा त्रुटी',

    // Tabs & Sections
    gisMapTitle: 'चंदनगिरी प्राथमिक आरोग्य केंद्र क्षेत्र व जीआयएस नकाशा',
    gisMapSub: 'उपकेंद्र, आशा कर्मचारी व रोग प्रादुर्भाव क्षेत्रांचे थेट जीपीएस मॅपिंग',
    ashaCadreTitle: 'आशा व एएनएम क्षेत्रीय कर्मचारी',
    citizenRegistryTitle: 'नागरिक व कुटुंब नोंदवही',
    vaccineNutritionTitle: 'लसीकरण व माता आरोग्य ट्रॅकर',
    analyticsTitle: 'प्राथमिक आरोग्य केंद्र कामगिरी विश्लेषण',
    filterByVillage: 'गावानुसार फिल्टर',
    allVillages: 'सर्व गावे',
    searchAshaCitizen: 'नागरिकाचे नाव, आधार किंवा आशा शोधा...',

    // OPD & Appointments
    tokenNo: 'टोकन क्र.',
    patientName: 'रुग्णाचे नाव',
    ageGender: 'वय / लिंग',
    vitals: 'तपासणी (बीपी/नाडी)',
    symptoms: 'लक्षणे व तक्रार',
    assignedDoctor: 'नेमलेले डॉक्टर',
    action: 'कृती',
    callPatient: 'रुग्णास बोलवा',
    markDone: 'पूर्ण नोंदवा',
    inConsultation: 'तपासणी सुरू',
    waiting: 'प्रतीक्षेत',
    completed: 'पूर्ण',
    newAppointmentBtn: '+ नवीन थेट / आशा रुग्ण नोंदणी',
    dailyReportBtn: 'दैनंदिन अहवाल पहा',

    // Medicine & Facility
    essentialDrugsTitle: 'आवश्यक व आपत्कालीन औषध साठा',
    facilityInfrastructureTitle: 'आरोग्य केंद्र पायाभूत सुविधा व यंत्रसामग्री सज्जता',
    drugName: 'औषध व फॉर्म्युलेशन',
    stockLevel: 'सध्याचा साठा',
    batchExpiry: 'बॅच व अंतिम मुदत',
    reorderLevel: 'किमान राखीव मर्यादा',
    adequateStock: 'पुरेसा साठा उपलब्ध',
    criticalStock: 'गंभीर तुटवडा',
    coldChainReady: 'लस शीत साखळी (ILR)',
    oxygenReady: 'ऑक्सिजन पुरवठा व कॉन्सन्ट्रेटर',
    ambulanceAvailable: '१०८ रुग्णवाहिका सेवा',
    powerBackupReady: 'जनरेटर व वीज बॅकअप',

    // Referrals
    referralsTitle: 'ग्रामीण रुग्ण संदर्भ व अखंड आरोग्य सेवा',
    referralsSubtitle: 'उपजिल्हा व जिल्हा रुग्णालयात सुरक्षित रुग्ण स्थानांतरण व पाठपुरावा',
    patientHospital: 'रुग्ण व पाठवलेले रुग्णालय',
    sourcePhc: 'मूळ प्राथमिक आरोग्य केंद्र / उपकेंद्र',
    destinationFacility: 'संदर्भ रुग्णालय',
    transportMode: 'वाहतूक व रुग्णवाहिका',
    transferReason: 'वैद्यकीय कारण',
    inTransit: 'रस्त्यात / प्रवासात',
    admitted: 'दाखल केले',
    discharged: 'घरी सोडले',
    createReferralBtn: '+ नवीन संदर्भ रुग्ण नोंदवा',

    // Teleconsultation
    teleconsultHubTitle: 'थेट डॉक्टर टेलि-सल्लागार केंद्र',
    teleconsultHubSubtitle: 'जिल्हा रुग्णालयातील तज्ज्ञ डॉक्टरांशी उच्च दर्जाचे व्हिडिओ संभाषण',
    doctorRoster: 'तज्ज्ञ डॉक्टरांची यादी',
    activeQueue: 'टेलि-सल्ला प्रतीक्षा यादी',
    joinVideoCall: 'कॉलमध्ये सहभागी व्हा',
    bookTeleConsultBtn: '+ नवीन टेलि-सल्ला नोंदणी',
    malePatientNotice: 'पुरुष रुग्ण (सामान्य ओपीडी - गरोदरपणाची माहिती लागू नाही)',
    pregnancyStatusLabel: 'प्रसूती स्थिती: गरोदरपणाचा टप्पा किंवा इतर माहिती',
    clinicalDomainLabel: 'क्लिनिकल सल्लागार वैद्यकीय विभाग',

    // Disease & Gap Map
    diseaseGapTitle: 'रोग प्रादुर्भाव सर्वेक्षण व आरोग्य सुविधा त्रुटी विश्लेषण',
    diseaseGapSubtitle: 'संसर्गजन्य रोगांचा मागोवा आणि स्थानिक वैद्यकीय उपचारांमधील त्रुटी',
    outbreakAlerts: 'सक्रिय रोग प्रादुर्भाव क्षेत्रे',
    facilityDeficits: 'स्थानिक आरोग्य सुविधा त्रुटी',
    affectedPopulation: 'धोक्यातील लोकसंख्या',
    missingEquipment: 'आवश्यक साधनसामग्री / तज्ज्ञ डॉक्टर',
    emergencyActionReq: 'तातडीची शासकीय कार्यवाही आवश्यक',
    deployMobileUnit: 'फिरते वैद्यकीय पथक पाठवा',

    // Common Actions
    save: 'बदल जतन करा',
    cancel: 'रद्द करा',
    submit: 'सादर करा',
    back: 'मागे',
    delete: 'हटवा',
    edit: 'संपादित करा',
    viewDetails: 'तपशील पहा',
    all: 'सर्व',
    critical: 'अतिगंभीर',
    moderate: 'मध्यम',
    low: 'सामान्य',

    // Citizen & Health Worker Management
    citizenManagementTitle: 'नागरिक व आरोग्य सेवक व्यवस्थापन',
    liveRegister: 'थेट नोंदवही',
    citizensTab: 'नागरिक',
    ashaWorkersTab: 'आशा व एएनएम सेविका',
    searchAshaPlaceholder: 'आरोग्य सेविकेचे नाव, उपकेंद्र शोधा...',
    searchCitizenPlaceholder: 'नागरिकाचे नाव, आभा आयडी, गाव शोधा...'
  },

  hi: {
    // Brand & Header
    appName: 'सेवा लिंक मॉनिटरिंग',
    subtitle: 'ग्रामीण स्वास्थ्य सेवा प्रणाली - महाराष्ट्र शासन',
    commandCenter: 'कमांड सेंटर डैशबोर्ड',
    opdQueue: 'ओपीडी कतार व रोस्टर',
    teleConsult: 'डॉक्टर टेली-परामर्श',
    medicineFacility: 'दवाएं व स्वास्थ्य सुविधा',
    referrals: 'रेफरल व फॉलो-अप',
    diseaseGap: 'बीमारी व स्वास्थ्य गैप मैप',
    quickActions: 'त्वरित कार्य',
    assignedCitizens: 'आवंटित नागरिक',
    activeStaff: 'सक्रिय आशा स्टाफ',
    pendingTransfers: 'लंबित रेफरल केस',
    highRiskMothers: 'उच्च जोखिम वाली माताएं (ANC)',
    searchPlaceholder: 'मरीज़ का नाम, गाँव या आशा खोजें...',
    syncAll: 'सिंक हुआ',
    signOut: 'पोर्टल से साइन आउट करें',
    settings: 'सिस्टम सेटिंग्स',
    language: 'सिस्टम भाषा',
    theme: 'थीम / दिखावट',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    marathi: 'मराठी',
    english: 'English',
    hindi: 'हिन्दी',
    tamil: 'தமிழ்',
    navigation: 'नेविगेशन मेनू',
    newBooking: 'नई टेली-बुकिंग',
    connectDoctor: 'डॉक्टर से जुड़ें',
    workingOffline: 'ऑफ़लाइन मोड',
    online: 'ऑनलाइन',
    syncNoticeSuccess: 'महाराष्ट्र स्वास्थ्य टेलीमेट्री सर्वर से समन्वयित',
    activeDoctorQueue: 'रियल-टाइम डॉक्टर टेली-कंसल्टेंट हब',
    status: 'स्थिति',
    urgency: 'प्राथमिकता',
    caseType: 'प्रकार',

    // Login Page
    loginHeading: 'सेवा लिंक मॉनिटरिंग',
    loginSubtitle: 'ग्रामीण स्वास्थ्य सेवा प्रणाली - महाराष्ट्र शासन',
    emailOrIdLabel: 'आधिकारिक ईमेल या कर्मचारी आईडी',
    emailPlaceholder: 'doctor@phc.gov.in या MH-PHC-4012',
    passwordLabel: 'सुरक्षा पिन / पासवर्ड',
    forgotPin: 'पिन भूल गए?',
    dutyDesignationLabel: 'कार्य पदनाम',
    rememberTerminal: 'इस क्लिनिकल टर्मिनल को याद रखें',
    secureEncryption: '256-बिट एन्क्रिप्टेड सुरक्षित',
    enterPortalButton: 'सत्यापित करें और टर्मिनल में प्रवेश करें',
    authenticating: 'सत्यापित किया जा रहा है...',
    quickDemoLoginTitle: 'त्वरित रोस्टर परीक्षण लॉगिन',
    quickDemoLoginSub: 'क्रेडेंशियल्स स्वतः भरने के लिए कोई पद चुनें:',
    needAssistance: 'राष्ट्रीय स्वास्थ्य मिशन आईटी हेल्पडेस्क',
    helpSupport: 'सहायता चाहिए? क्लिनिकल दिशानिर्देश देखें',
    helpModalTitle: 'प्राथमिक स्वास्थ्य केंद्र क्लिनिकल सहायता',
    helpDescription: 'अधिकृत स्वास्थ्य कर्मी अपने पंजीकृत पहचान पत्र से लॉगिन कर सकते हैं अथवा परीक्षण हेतु त्वरित पद का चयन कर सकते हैं।',
    close: 'बंद करें',
    roleMedicalOfficer: 'चिकित्सा अधिकारी (प्रभारी)',
    roleTeleConsultant: 'टेली-परामर्श विशेषज्ञ डॉक्टर',
    roleAshaSupervisor: 'आशा क्षेत्रीय पर्यवेक्षक / एएनएम',
    roleEpidemiologist: 'जिला महामारी विशेषज्ञ (IDSP)',

    // Metric Cards & Dashboard
    citizensCountLabel: 'आवंटित नागरिक',
    coverageStat: '98.6% डेटाबेस कवरेज',
    manageLink: 'प्रबंधित करें →',
    activeAshaCountLabel: 'सक्रिय आशा स्टाफ',
    liveInFieldStat: '10 अभी फील्ड में कार्यरत',
    grassrootsHospitalReferrals: 'प्राथमिक अस्पताल रेफरल मामले',
    blockImmunization: 'ब्लॉक टीकाकरण दर',
    nationalTargetStat: 'राष्ट्रीय लक्ष्य: 95.0%',
    sectorLabel: 'सेक्टर / प्रभाग',
    complianceIndex: 'अनुपालन सूचकांक',
    lastSync: 'अंतिम सिंक',
    refreshSync: 'क्लाउड सिंक रिफ्रेश करें',
    activeAppointments: 'सक्रिय ओपीडी अपॉइंटमेंट',
    scheduledLabel: 'निर्धारित',
    lowStockAlert: 'दवा की कमी की चेतावनी',
    suppliesOk: 'आपूर्ति सामान्य',
    transfersCountLabel: 'मरीज़ स्थानांतरण',
    waitingConsults: 'प्रतीक्षारत मामले',
    criticalDeficits: 'गंभीर सुविधाएं कम',

    // Tabs & Sections
    gisMapTitle: 'चंदनगिरी पीएचसी सेक्टर निगरानी और जीआईएस मैप',
    gisMapSub: 'उपकेंद्र, आशा कार्यकर्ता और रोग प्रकोप क्षेत्रों की लाइव जीपीएस मैपिंग',
    ashaCadreTitle: 'आशा व एएनएम फील्ड कैडर',
    citizenRegistryTitle: 'नागरिक व परिवार रजिस्ट्री',
    vaccineNutritionTitle: 'टीकाकरण व मातृ स्वास्थ्य ट्रैकर',
    analyticsTitle: 'पीएचसी क्लिनिकल प्रदर्शन विश्लेषण',
    filterByVillage: 'गाँव अनुसार फ़िल्टर',
    allVillages: 'सभी गाँव',
    searchAshaCitizen: 'मरीज़ का नाम, आधार या आशा खोजें...',

    // OPD & Appointments
    tokenNo: 'टोकन नं.',
    patientName: 'मरीज़ का नाम',
    ageGender: 'आयु / लिंग',
    vitals: 'जांच (बीपी / नब्ज़)',
    symptoms: 'लक्षण व शिकायत',
    assignedDoctor: 'नियुक्त डॉक्टर',
    action: 'कार्रवाई',
    callPatient: 'मरीज़ को बुलाएं',
    markDone: 'पूर्ण चिह्नित करें',
    inConsultation: 'परामर्श जारी',
    waiting: 'प्रतीक्षारत',
    completed: 'पूर्ण',
    newAppointmentBtn: '+ नया वॉक-इन / आशा अपॉइंटमेंट',
    dailyReportBtn: 'दैनिक रोस्टर रिपोर्ट',

    // Medicine & Facility
    essentialDrugsTitle: 'आवश्यक व आपातकालीन दवा स्टॉक',
    facilityInfrastructureTitle: 'स्वास्थ्य केंद्र अवसंरचना व उपकरण तत्परता',
    drugName: 'दवा व निर्माण',
    stockLevel: 'वर्तमान स्टॉक',
    batchExpiry: 'बैच व समाप्ति तिथि',
    reorderLevel: 'सुरक्षा बफर सीमा',
    adequateStock: 'पर्याप्त स्टॉक उपलब्ध',
    criticalStock: 'गंभीर कमी',
    coldChainReady: 'टीका कोल्ड चेन (ILR)',
    oxygenReady: 'ऑक्सीजन आपूर्ति व सांद्रक',
    ambulanceAvailable: '108 आपातकालीन एम्बुलेंस',
    powerBackupReady: 'जनरेटर व बिजली बैकअप',

    // Referrals
    referralsTitle: 'ग्रामीण मरीज़ रेफरल व निरंतर देखभाल',
    referralsSubtitle: 'उप-जिला व जिला अस्पतालों में सुरक्षित मरीज़ स्थानांतरण व फॉलो-अप',
    patientHospital: 'मरीज़ व गंतव्य अस्पताल',
    sourcePhc: 'मूल स्वास्थ्य केंद्र / उपकेंद्र',
    destinationFacility: 'रेफरल अस्पताल',
    transportMode: 'परिवहन व एम्बुलेंस',
    transferReason: 'क्लिनिकल कारण',
    inTransit: 'रास्ते में / ट्रांजिट',
    admitted: 'भर्ती हैं',
    discharged: 'छुट्टी दे दी गई',
    createReferralBtn: '+ नया रेफरल केस दर्ज करें',

    // Teleconsultation
    teleconsultHubTitle: 'रियल-टाइम डॉक्टर टेली-परामर्श हब',
    teleconsultHubSubtitle: 'जिला अस्पताल के विशेषज्ञ डॉक्टरों के साथ वीडियो परामर्श',
    doctorRoster: 'विशेषज्ञ डॉक्टर सूची',
    activeQueue: 'टेली-परामर्श प्रतीक्षा सूची',
    joinVideoCall: 'कॉल में शामिल हों',
    bookTeleConsultBtn: '+ नया टेली-परामर्श अनुरोध',
    malePatientNotice: 'पुरुष मरीज़ (सामान्य ओपीडी - गर्भावस्था विवरण लागू नहीं)',
    pregnancyStatusLabel: 'प्रसूति स्थिति: गर्भावस्था का चरण अथवा विवरण',
    clinicalDomainLabel: 'क्लिनिकल परामर्श विशेषज्ञता क्षेत्र',

    // Disease & Gap Map
    diseaseGapTitle: 'रोग प्रकोप निगरानी व स्वास्थ्य सुविधा गैप विश्लेषण',
    diseaseGapSubtitle: 'संक्रामक क्लस्टर्स की निगरानी और स्थानीय उपचार सुविधाओं की कमी का विश्लेषण',
    outbreakAlerts: 'सक्रिय रोग प्रकोप क्लस्टर्स',
    facilityDeficits: 'स्थानीय स्वास्थ्य सुविधा कमियां',
    affectedPopulation: 'प्रभावित आबादी',
    missingEquipment: 'आवश्यक उपकरण / विशेषज्ञ',
    emergencyActionReq: 'आपातकालीन सरकारी कार्रवाई आवश्यक',
    deployMobileUnit: 'मोबाइल मेडिकल यूनिट तैनात करें',

    // Common Actions
    save: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    back: 'वापस',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    viewDetails: 'विवरण देखें',
    all: 'सभी',
    critical: 'गंभीर',
    moderate: 'मध्यम',
    low: 'सामान्य',

    // Citizen & Health Worker Management
    citizenManagementTitle: 'नागरिक एवं स्वास्थ्य कार्यकर्ता प्रबंधन',
    liveRegister: 'लाइव रजिस्टर',
    citizensTab: 'नागरिक',
    ashaWorkersTab: 'आशा व एएनएम कार्यकर्ता',
    searchAshaPlaceholder: 'कार्यकर्ता का नाम, सेक्टर, उपकेंद्र खोजें...',
    searchCitizenPlaceholder: 'नागरिक का नाम, आभा आईडी, गांव खोजें...'
  },

  ta: {
    // Brand & Header
    appName: 'சேவாலிங்க் கண்காணிப்பு',
    subtitle: 'கிராமப்புற சுகாதார அமைப்பு - மகாராஷ்டிரா அரசு',
    commandCenter: 'கட்டளை மைய டாஷ்போர்டு',
    opdQueue: 'ஓபிடி பட்டியல் மற்றும் வரிசை',
    teleConsult: 'மருத்துவர் டெலி-ஆலோசனை',
    medicineFacility: 'மருந்துகள் மற்றும் வசதிகள் புதுப்பிப்பு',
    referrals: 'பரிந்துரை மற்றும் பின்தொடர்தல்',
    diseaseGap: 'நோய் மற்றும் இடைவெளி வரைபடம்',
    quickActions: 'விரைவு நடவடிக்கைகள்',
    assignedCitizens: 'ஒதுக்கப்பட்ட குடிமக்கள்',
    activeStaff: 'செயலில் உள்ள ஆஷா ஊழியர்கள்',
    pendingTransfers: 'நிலுவையில் உள்ள பரிந்துரைகள்',
    highRiskMothers: 'அதிக ஆபத்துள்ள தாய்மார்கள் (ANC)',
    searchPlaceholder: 'நோயாளி பெயர், கிராமம் அல்லது ஆஷா தேடவும்...',
    syncAll: 'ஒத்திசைக்கப்பட்டது',
    signOut: 'போர்ட்டலில் இருந்து வெளியேறு',
    settings: 'கணினி அமைப்புகள்',
    language: 'கணினி மொழி',
    theme: 'தோற்றம் / தீம்',
    lightMode: 'ஒளிப் பயன்முறை',
    darkMode: 'இருண்ட பயன்முறை',
    marathi: 'मराठी',
    english: 'English',
    hindi: 'हिन्दी',
    tamil: 'தமிழ்',
    navigation: 'வழிசெலுத்தல் பட்டி',
    newBooking: 'புதிய டெலி-பதிவு',
    connectDoctor: 'மருத்துவருடன் இணைக்கவும்',
    workingOffline: 'ஆஃப்லைனில் வேலை செய்கிறது',
    online: 'ஆன்லைன்',
    syncNoticeSuccess: 'மகாராஷ்டிரா சுகாதாரத் தரவு சேவையகங்களுடன் ஒத்திசைக்கப்பட்டது',
    activeDoctorQueue: 'நேரடி மருத்துவர் டெலி-ஆலோசனை மையம்',
    status: 'நிலை',
    urgency: 'அவசரம்',
    caseType: 'வகை',

    // Login Page
    loginHeading: 'சேவாலிங்க் கண்காணிப்பு',
    loginSubtitle: 'கிராமப்புற சுகாதார அமைப்பு - மகாராஷ்டிரா அரசு',
    emailOrIdLabel: 'அதிகாரப்பூர்வ மின்னஞ்சல் அல்லது ஊழியர் எண்',
    emailPlaceholder: 'doctor@phc.gov.in அல்லது MH-PHC-4012',
    passwordLabel: 'பாதுகாப்பு பின் / கடவுச்சொல்',
    forgotPin: 'பின் மறந்துவிட்டதா?',
    dutyDesignationLabel: 'பணி பதவி',
    rememberTerminal: 'இந்த மருத்துவ முனையத்தை நினைவில் கொள்க',
    secureEncryption: '256-பிட் குறியாக்கம் பாதுகாப்பானது',
    enterPortalButton: 'அங்கீகரித்து போர்ட்டலில் நுழையவும்',
    authenticating: 'அங்கீகரிக்கப்படுகிறது...',
    quickDemoLoginTitle: 'விரைவு மாதிரி உள்நுழைவு',
    quickDemoLoginSub: 'விவரங்களை தானாக நிரப்ப மருத்துவப் பதவியைத் தேர்ந்தெடுக்கவும்:',
    needAssistance: 'தேசிய சுகாதார இயக்கம் உதவி மையம்',
    helpSupport: 'உதவி தேவையா? மருத்துவ வழிகாட்டுதல்களைப் பார்க்கவும்',
    helpModalTitle: 'ஆரம்ப சுகாதார நிலைய ஆதரவு',
    helpDescription: 'அங்கீகரிக்கப்பட்ட ஊழியர்கள் தங்கள் சான்றுகளைப் பயன்படுத்தி உள்நுழையலாம் அல்லது சோதனைக்காக மாதிரி பாத்திரங்களைத் தேர்ந்தெடுக்கலாம்.',
    close: 'மூடுக',
    roleMedicalOfficer: 'மருத்துவ அதிகாரி (பொறுப்பு)',
    roleTeleConsultant: 'டெலி-ஆலோசனை நிபுணர் மருத்துவர்',
    roleAshaSupervisor: 'ஆஷா மேற்பார்வையாளர் / வி.எச்.என்',
    roleEpidemiologist: 'மாவட்ட தொற்றுநோயியல் நிபுணர் (IDSP)',

    // Metric Cards & Dashboard
    citizensCountLabel: 'ஒதுக்கப்பட்ட குடிமக்கள்',
    coverageStat: '98.6% தரவுத்தள கவரேஜ்',
    manageLink: 'நிர்வகி →',
    activeAshaCountLabel: 'செயலில் உள்ள ஆஷா ஊழியர்கள்',
    liveInFieldStat: '10 களத்தில் செயலில் உள்ளனர்',
    grassrootsHospitalReferrals: 'மருத்துவமனை பரிந்துரைகள்',
    blockImmunization: 'தடுப்பூசி விகிதம்',
    nationalTargetStat: 'தேசிய இலக்கு: 95.0%',
    sectorLabel: 'பிரிவு / மண்டலம்',
    complianceIndex: 'இணக்கக் குறியீடு',
    lastSync: 'கடைசி ஒத்திசைவு',
    refreshSync: 'கிளவுட் ஒத்திசைவை புதுப்பிக்கவும்',
    activeAppointments: 'செயலில் உள்ள முன்பதிவுகள்',
    scheduledLabel: 'திட்டமிடப்பட்டது',
    lowStockAlert: 'குறைந்த இருப்பு எச்சரிக்கை',
    suppliesOk: 'மருந்துகள் போதுமானது',
    transfersCountLabel: 'நோயாளி இடமாற்றங்கள்',
    waitingConsults: 'காத்திருக்கும் வழக்குகள்',
    criticalDeficits: 'கண்டறியப்பட்ட பற்றாக்குறைகள்',

    // Tabs & Sections
    gisMapTitle: 'சந்தனகிரி ஆரம்ப சுகாதார நிலைய ஜிஐஎஸ் வரைபடம்',
    gisMapSub: 'துணை மையங்கள், ஆஷா பணியாளர்கள் மற்றும் நோய் பரவல் பகுதிகளின் நேரடி வரைபடம்',
    ashaCadreTitle: 'ஆஷா மற்றும் வி.எச்.என் கள ஊழியர்கள்',
    citizenRegistryTitle: 'குடிமக்கள் மற்றும் குடும்பப் பதிவேடு',
    vaccineNutritionTitle: 'தடுப்பூசி மற்றும் தாய் சேய் நல கண்காணிப்பு',
    analyticsTitle: 'ஆரம்ப சுகாதார நிலைய செயல்திறன் பகுப்பாய்வு',
    filterByVillage: 'கிராமத்தின்படி வடிகட்டவும்',
    allVillages: 'அனைத்து கிராமங்களும்',
    searchAshaCitizen: 'குடிமகன் பெயர், ஆதார் அல்லது ஆஷா தேடவும்...',

    // OPD & Appointments
    tokenNo: 'டோக்கன் எண்',
    patientName: 'நோயாளி பெயர்',
    ageGender: 'வயது / பாலினம்',
    vitals: 'உயிர்க்குறிகள் (இரத்த அழுத்தம் / நாடி)',
    symptoms: 'அறிகுறிகள் / புகார்',
    assignedDoctor: 'ஒதுக்கப்பட்ட மருத்துவர்',
    action: 'நடவடிக்கை',
    callPatient: 'நோயாளியை அழைக்கவும்',
    markDone: 'முடிந்தது எனக் குறிக்கவும்',
    inConsultation: 'ஆலோசனையில் உள்ளது',
    waiting: 'காத்திருக்கிறது',
    completed: 'முடிந்தது',
    newAppointmentBtn: '+ புதிய நோயாளி முன்பதிவு',
    dailyReportBtn: 'தினசரி அறிக்கை',

    // Medicine & Facility
    essentialDrugsTitle: 'அத்தியாவசிய மற்றும் அவசர மருந்து இருப்பு',
    facilityInfrastructureTitle: 'சுகாதார நிலைய உள்கட்டமைப்பு மற்றும் உபகரண தயார்நிலை',
    drugName: 'மருந்து பெயர்',
    stockLevel: 'தற்போதைய இருப்பு',
    batchExpiry: 'தொகுதி மற்றும் காலாவதி தேதி',
    reorderLevel: 'மறுவரிசை இருப்பு அளவு',
    adequateStock: 'போதுமான இருப்பு',
    criticalStock: 'கடுமையான தட்டுப்பாடு',
    coldChainReady: 'தடுப்பூசி குளிர்சாதனப் பெட்டி (ILR)',
    oxygenReady: 'ஆக்ஸிஜன் சிலிண்டர்கள் மற்றும் செறிவூட்டிகள்',
    ambulanceAvailable: '108 அவசர ஆம்புலன்ஸ் சேவை',
    powerBackupReady: 'ஜெனரேட்டர் மற்றும் மின் காப்பு',

    // Referrals
    referralsTitle: 'கிராமப்புற நோயாளி பரிந்துரை மற்றும் தொடர் கவனிப்பு',
    referralsSubtitle: 'வட்டார மற்றும் மாவட்ட மருத்துவமனைகளுக்கு பாதுகாப்பான இடமாற்றம்',
    patientHospital: 'நோயாளி மற்றும் சேருமிடம்',
    sourcePhc: 'தொடக்க சுகாதார நிலையம் / துணை மையம்',
    destinationFacility: 'பரிந்துரைக்கப்படும் மருத்துவமனை',
    transportMode: 'போக்குவரத்து மற்றும் ஆம்புலன்ஸ்',
    transferReason: 'மருத்துவக் காரணம்',
    inTransit: 'பயணத்தில் உள்ளது',
    admitted: 'அனுமதிக்கப்பட்டுள்ளார்',
    discharged: 'விடுவிக்கப்பட்டுள்ளார்',
    createReferralBtn: '+ புதிய பரிந்துரை பதிவு',

    // Teleconsultation
    teleconsultHubTitle: 'நேரடி மருத்துவர் டெலி-ஆலோசனை மையம்',
    teleconsultHubSubtitle: 'மாவட்ட மருத்துவமனை நிபுணர்களுடன் உயர் தெளிவுத்திறன் வீடியோ ஆலோசனை',
    doctorRoster: 'நிபுணத்துவ மருத்துவர் பட்டியல்',
    activeQueue: 'டெலி-ஆலோசனை காத்திருப்பு வரிசை',
    joinVideoCall: 'அழைப்பில் இணையவும்',
    bookTeleConsultBtn: '+ புதிய டெலி-ஆலோசனை கோரிக்கை',
    malePatientNotice: 'ஆண் நோயாளி (பொது ஓபிடி - கர்ப்ப விவரங்கள் பொருந்தாது)',
    pregnancyStatusLabel: 'கர்ப்ப நிலை: கர்ப்ப நிலை அல்லது விவரங்கள்',
    clinicalDomainLabel: 'மருத்துவ சிறப்பு ஆலோசனைப் பிரிவு',

    // Disease & Gap Map
    diseaseGapTitle: 'நோய் பரவல் கண்காணிப்பு மற்றும் வசதி இடைவெளி பகுப்பாய்வு',
    diseaseGapSubtitle: 'தொற்றுநோய்களைக் கண்காணித்தல் மற்றும் உள்ளூர் சிகிச்சை வசதிகளின் பற்றாக்குறை',
    outbreakAlerts: 'செயலில் உள்ள நோய் பரவல் பகுதிகள்',
    facilityDeficits: 'உள்ளூர் சுகாதார வசதி பற்றாக்குறைகள்',
    affectedPopulation: 'ஆபத்தில் உள்ள மக்கள் தொகை',
    missingEquipment: 'தேவைப்படும் உபகரணங்கள் / நிபுணர்கள்',
    emergencyActionReq: 'அவசர அரசு நடவடிக்கை தேவைப்படுகிறது',
    deployMobileUnit: 'நடமாடும் மருத்துவக் குழுவை அனுப்பவும்',

    // Common Actions
    save: 'சேமிக்க',
    cancel: 'ரத்து செய்',
    submit: 'சமர்ப்பிக்க',
    back: 'பின்செல்',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    viewDetails: 'விவரங்களைப் பார்க்க',
    all: 'அனைத்தும்',
    critical: 'ஆபத்தானது',
    moderate: 'மிதமான',
    low: 'சாதாரண',

    // Citizen & Health Worker Management
    citizenManagementTitle: 'குடிமக்கள் மற்றும் சுகாதாரப் பணியாளர்கள் மேலாண்மை',
    liveRegister: 'நேரலை பதிவேடு',
    citizensTab: 'குடிமக்கள்',
    ashaWorkersTab: 'ஆஷா மற்றும் ஏஎன்எம் பணியாளர்கள்',
    searchAshaPlaceholder: 'பணியாளர் பெயர், துணை மையம் தேடவும்...',
    searchCitizenPlaceholder: 'குடிமகன் பெயர், ஆபா ஐடி, கிராமம் தேடவும்...'
  }
};
