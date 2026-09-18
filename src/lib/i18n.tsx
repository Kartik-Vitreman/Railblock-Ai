import React, { createContext, useContext, useState, useEffect } from 'react'

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te'

export interface LanguageOption {
  code: SupportedLanguage
  label: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
]

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Top banner & Header
    'gov.india': 'Government of India',
    'min.railways': 'Ministry of Railways',
    'app.title': 'RAILBLOCK AI',
    'app.subtitle': 'Integrated Maintenance Block Planning & Decision Support System',
    'clock.ist': 'IST Control Clock',
    'lang.switch': 'Language',
    'role.switch': 'Switch Clearance',
    'role.admin': 'Administration (Sr. DOM)',
    'role.ops': 'Operational Dept (Controller)',
    'role.worker': 'Workers & Engineering (SSE P-Way)',
    'sign.out': 'Sign Out',
    'sign.in': 'Sign In',

    // Navigation
    'nav.dashboard': 'Control Dashboard',
    'nav.operations': 'OPERATIONS',
    'nav.trains': 'Train Operations',
    'nav.blocks': 'Block Planning',
    'nav.network': 'Schedule & National GIS',
    'nav.maintenance': 'MAINTENANCE',
    'nav.maint_requests': 'Maintenance Requests',
    'nav.assets': 'Asset Intelligence',
    'nav.alerts': 'Operational Alerts',
    'nav.ai_support': 'AI & DECISION SUPPORT',
    'nav.optimization': 'Plan Optimization',
    'nav.simulation': 'What-If Simulation',
    'nav.scenarios': 'Scenario Catalog',
    'nav.reports': 'Official Reports',
    'nav.admin_compliance': 'ADMINISTRATION & COMPLIANCE',
    'nav.audit': 'Audit Compliance',

    // Role-specific badges & descriptions
    'role.admin_desc': 'Executive Sanction Authority • CP-SAT Optimization Tuning',
    'role.ops_desc': 'Real-Time Train Movements • Headway Regulation • Punctuality',
    'role.worker_desc': 'P-Way Track Maintenance • Defect Logs • Machine Requisition',
    'role.badge.admin': 'DRM / HQ LEVEL',
    'role.badge.ops': 'SECTION CONTROL',
    'role.badge.worker': 'FIELD P-WAY',

    // Common Buttons & Tooltips
    'btn.approve': 'Sanction Block',
    'btn.reject': 'Reject Block',
    'btn.optimize': 'Run CP-SAT Solver',
    'btn.new_block': 'Propose Block',
    'btn.new_task': 'Log Maintenance Order',
    'btn.export': 'Export Report',
    'btn.filter': 'Filter',
    'btn.reset': 'Reset',
    'btn.close': 'Close',
    'btn.details': 'View Details',
    'btn.slide_table': 'Live Operations Table',

    // Tooltip explanations
    'tt.lang': 'Change platform interface language (English, Hindi, Tamil, Telugu)',
    'tt.role': 'Switch operational clearance between Administration, Operations, and Workers',
    'tt.clock': 'Coordinated Indian Standard Time (IST) synced with CRIS RailNet NTP servers',
    'tt.logout': 'Securely end session and return to authentication gateway',
    'tt.corner_table': 'Slide open or collapse the live multi-corridor operations monitor',
    'tt.approve_btn': 'Authorize track possession and notify Section Controllers',
    'tt.reject_btn': 'Disallow maintenance block due to high train headway impact',
    'tt.cpsat_btn': 'Execute Google OR-Tools CP-SAT discrete optimization solver',
    'tt.mobile_menu': 'Toggle mobile and tablet navigation menu',

    // Login page
    'login.title': 'Department Clearance & Sign-In',
    'login.desc': 'Select your railway department role below to authenticate with designated operational clearance and credentials.',
    'login.subheading': 'Control Office Integrated Maintenance & Decision Support Platform • Central Railway & National Corridors',
    'login.email': 'RailNet Authorized Email / Employee ID',
    'login.pass': 'Access PIN / Password',
    'login.or': 'Or Authenticate with RailNet Credentials',
    'login.secure_btn': 'Secure Sign-In',
    'login.cris_audit': 'Indian Railways CRIS Security Compliant • 256-bit Encrypted',
    'login.worker_tools': 'Field Work Orders, USFD rail defect logs, OHE inspection check',
    'login.ops_tools': 'Real-time train monitoring, timetable regulation, headway buffer safety',
    'login.admin_tools': 'Block approval authority, CP-SAT algorithmic solver, statutory audit',

    // Corner slide table
    'cst.title': 'Real-Time Operational Monitor',
    'cst.blocks': 'Active Blocks',
    'cst.trains': 'Live Train Delays',
    'cst.alerts': 'Safety Alerts',
    'cst.minimize': 'Minimize',
    'cst.expand': 'Expand Table',
  },
  hi: {
    // Top banner & Header
    'gov.india': 'भारत सरकार',
    'min.railways': 'रेल मंत्रालय',
    'app.title': 'रेल-ब्लॉक एआई',
    'app.subtitle': 'एकीकृत रेल रखरखाव ब्लॉक नियोजन एवं निर्णय सहायता प्रणाली',
    'clock.ist': 'आईएसटी नियंत्रण घड़ी',
    'lang.switch': 'भाषा चुनें',
    'role.switch': 'अधिकार बदलें',
    'role.admin': 'प्रशासन (वरिष्ठ मंडल परिचालन प्रबंधक - Sr. DOM)',
    'role.ops': 'परिचालन विभाग (सेक्शन नियंत्रक)',
    'role.worker': 'कार्यकर्ता व फील्ड इंजीनियरिंग (एसएसई पी-वे)',
    'sign.out': 'लॉग आउट',
    'sign.in': 'साइन इन करें',

    // Navigation
    'nav.dashboard': 'नियंत्रण डैशबोर्ड',
    'nav.operations': 'परिचालन',
    'nav.trains': 'ट्रेन परिचालन व समय-सारणी',
    'nav.blocks': 'ब्लॉक योजना व स्वीकृति',
    'nav.network': 'राष्ट्रीय जीआईएस नेटवर्क',
    'nav.maintenance': 'रखरखाव कार्य',
    'nav.maint_requests': 'रखरखाव कार्य आदेश',
    'nav.assets': 'रेल संपत्ति प्रबंधन',
    'nav.alerts': 'परिचालन चेतावनियां',
    'nav.ai_support': 'एआई एवं निर्णय सहायता',
    'nav.optimization': 'सीपी-सैट प्लान अनुकूलन',
    'nav.simulation': 'सिमुलेशन विश्लेषण',
    'nav.scenarios': 'परिदृश्य सूची',
    'nav.reports': 'आधिकारिक रिपोर्ट',
    'nav.admin_compliance': 'प्रशासन एवं अनुपालन',
    'nav.audit': 'सुरक्षा ऑडिट एवं लॉग',

    // Role-specific badges & descriptions
    'role.admin_desc': 'कार्यकारी स्वीकृति अधिकार • सीपी-सैट ऑप्टिमाइज़ेशन नियंत्रण',
    'role.ops_desc': 'वास्तविक समय ट्रेन संचलन • समय-सारणी हेडवे नियंत्रण',
    'role.worker_desc': 'ट्रैक रखरखाव • रेल दोष लॉगिंग • ट्रैक मशीन मांग',
    'role.badge.admin': 'मंडल रेल प्रबंधक स्तर',
    'role.badge.ops': 'नियंत्रण कक्ष',
    'role.badge.worker': 'फील्ड पी-वे स्टाफ',

    // Common Buttons & Tooltips
    'btn.approve': 'ब्लॉक स्वीकृत करें',
    'btn.reject': 'ब्लॉक अस्वीकृत करें',
    'btn.optimize': 'सीपी-सैट सॉल्वर चलाएं',
    'btn.new_block': 'नया ब्लॉक प्रस्तावित करें',
    'btn.new_task': 'रखरखाव कार्य दर्ज करें',
    'btn.export': 'रिपोर्ट डाउनलोड करें',
    'btn.filter': 'फ़िल्टर करें',
    'btn.reset': 'रीसेट',
    'btn.close': 'बंद करें',
    'btn.details': 'विवरण देखें',
    'btn.slide_table': 'लाइव परिचालन तालिका',

    // Tooltip explanations
    'tt.lang': 'इंटरफ़ेस भाषा बदलें (अंग्रेज़ी, हिन्दी, तमिल, तेलुगु)',
    'tt.role': 'प्रशासन, परिचालन और फील्ड कार्यकर्ताओं के बीच अधिकार बदलें',
    'tt.clock': 'भारतीय मानक समय (IST) क्रिस रेलनेट सर्वर से सिंक्रनाइज़्ड',
    'tt.logout': 'सुरक्षित रूप से सत्र समाप्त करें',
    'tt.corner_table': 'कोने में स्थित लाइव परिचालन मॉनिटर तालिका को खोलें या समेटें',
    'tt.approve_btn': 'ट्रैक ब्लॉक की आधिकारिक स्वीकृति दें',
    'tt.reject_btn': 'ट्रेन विलंब के कारण ब्लॉक अस्वीकार करें',
    'tt.cpsat_btn': 'गूगल ओआर-टूल्स सीपी-सैट एल्गोरिथम चलाएं',
    'tt.mobile_menu': 'मोबाइल और टैबलेट नेविगेशन मेनू खोलें',

    // Login page
    'login.title': 'विभागीय अधिकार एवं साइन-इन',
    'login.desc': 'निर्धारित परिचालन अनुमतियों और प्रमाण-पत्रों के साथ प्रमाणित करने के लिए नीचे अपनी भूमिका चुनें।',
    'login.subheading': 'नियंत्रण कार्यालय एकीकृत रखरखाव एवं निर्णय सहायता प्रणाली • भारतीय रेल',
    'login.email': 'रेलनेट अधिकृत ईमेल / कर्मचारी आईडी',
    'login.pass': 'पासवर्ड / एक्सेस पिन',
    'login.or': 'या रेलनेट क्रेडेंशियल से लॉगिन करें',
    'login.secure_btn': 'सुरक्षित लॉगिन करें',
    'login.cris_audit': 'भारतीय रेल क्रिस सुरक्षा प्रमाणित • 256-बिट एन्क्रिप्शन',
    'login.worker_tools': 'फील्ड कार्य आदेश, यूएसएफडी रेल दोष लॉग, ओएचई निरीक्षण चेकलिस्ट',
    'login.ops_tools': 'रीयल-टाइम ट्रेन मॉनिटरिंग, समय-सारणी नियमन, हेडवे बफर सुरक्षा',
    'login.admin_tools': 'ब्लॉक स्वीकृति अधिकार, सीपी-सैट सॉल्वर, वैधानिक ऑडिट रिपोर्ट',

    // Corner slide table
    'cst.title': 'वास्तविक समय परिचालन मॉनिटर',
    'cst.blocks': 'सक्रिय ब्लॉक',
    'cst.trains': 'लाइव ट्रेन विलंब',
    'cst.alerts': 'सुरक्षा चेतावनियां',
    'cst.minimize': 'छोटा करें',
    'cst.expand': 'तालिका विस्तृत करें',
  },
  ta: {
    // Top banner & Header
    'gov.india': 'இந்திய அரசு',
    'min.railways': 'ரயில்வே அமைச்சகம்',
    'app.title': 'ரயில்பிளாக் AI',
    'app.subtitle': 'ஒருங்கிணைந்த பராமரிப்பு பிளாக் திட்டமிடல் & முடிவு ஆதரவு தளம்',
    'clock.ist': 'IST கட்டுப்பாட்டு கடிகாரம்',
    'lang.switch': 'மொழி மாற்றம்',
    'role.switch': 'அதிகார மாற்றம்',
    'role.admin': 'நிர்வாகம் (சீனியர் DOM)',
    'role.ops': 'செயல்பாட்டுத் துறை (கட்டுப்பாட்டாளர்)',
    'role.worker': 'களப் பொறியியல் தொழிலாளர்கள் (SSE P-Way)',
    'sign.out': 'வெளியேறு',
    'sign.in': 'உள்நுழைக',

    // Navigation
    'nav.dashboard': 'கட்டுப்பாட்டு பலகை',
    'nav.operations': 'செயல்பாடுகள்',
    'nav.trains': 'ரயில் இயக்கங்கள் & அட்டவணை',
    'nav.blocks': 'பிளாக் திட்டமிடல்',
    'nav.network': 'தேசிய GIS வரைபடம்',
    'nav.maintenance': 'பராமரிப்பு',
    'nav.maint_requests': 'பராமரிப்பு கோரிக்கைகள்',
    'nav.assets': 'சொத்து நுண்ணறிவு',
    'nav.alerts': 'செயல்பாட்டு எச்சரிக்கைகள்',
    'nav.ai_support': 'AI & முடிவு ஆதரவு',
    'nav.optimization': 'CP-SAT தேர்வுமுறை',
    'nav.simulation': 'மாதிரி உருவகப்படுத்துதல்',
    'nav.scenarios': 'சூழ்நிலைகள் பட்டியல்',
    'nav.reports': 'அதிகாரப்பூர்வ அறிக்கைகள்',
    'nav.admin_compliance': 'நிர்வாகம் & இணக்கம்',
    'nav.audit': 'தணிக்கை & பதிவுகள்',

    // Role-specific badges & descriptions
    'role.admin_desc': 'நிர்வாக ஒப்புதல் அதிகாரம் • CP-SAT உகப்பாக்கம் கட்டுப்பாடு',
    'role.ops_desc': 'நிகழ்நேர ரயில் இயக்கம் • நேரக் கட்டுப்பாடு • தாமத தடுப்பு',
    'role.worker_desc': 'தண்டவாள பராமரிப்பு • குறைபாடு பதிவு • இயந்திர கோரிக்கை',
    'role.badge.admin': 'தலைமையக அதிகாரம்',
    'role.badge.ops': 'கட்டுப்பாட்டு அறை',
    'role.badge.worker': 'களப் பணியாளர்',

    // Common Buttons & Tooltips
    'btn.approve': 'பிளாக் அனுமதி',
    'btn.reject': 'பிளாக் நிராகரி',
    'btn.optimize': 'CP-SAT தேர்வுமுறை இயக்கு',
    'btn.new_block': 'புதிய பிளாக் முன்மொழிவு',
    'btn.new_task': 'பராமரிப்பு பதிவு செய்',
    'btn.export': 'அறிக்கை பதிவிறக்கு',
    'btn.filter': 'வடிகட்டுக',
    'btn.reset': 'மீட்டமை',
    'btn.close': 'மூடு',
    'btn.details': 'விவரம் பார்',
    'btn.slide_table': 'நேரலை செயல்பாட்டு அட்டவணை',

    // Tooltip explanations
    'tt.lang': 'தளத்தின் மொழியை மாற்றுக (ஆங்கிலம், இந்தி, தமிழ், தெலுங்கு)',
    'tt.role': 'நிர்வாகம், செயல்பாடுகள் மற்றும் களத் தொழிலாளர் பொறுப்பை மாற்றுக',
    'tt.clock': 'இந்திய நிலையான நேரம் (IST) நேரலை கட்டுப்பாட்டு கடிகாரம்',
    'tt.logout': 'அமர்வை முடித்து வெளியேறுக',
    'tt.corner_table': 'மூலையில் உள்ள நேரலை செயல்பாட்டு அட்டவணையை விரிக்க/மறைக்க',
    'tt.approve_btn': 'ரயில் பாதையில் பராமரிப்பு பணிக்கு அதிகாரப்பூர்வ அனுமதி வழங்குக',
    'tt.reject_btn': 'ரயில் தாமதத்தைக் குறைக்க பிளாக்கை நிராகரிக்கவும்',
    'tt.cpsat_btn': 'Google OR-Tools CP-SAT உகப்பாக்க அல்காரிதத்தை இயக்குக',
    'tt.mobile_menu': 'மொபைல் மற்றும் டேப்லெட் வழிசெலுத்தல் மெனுவை மாற்றுக',

    // Login page
    'login.title': 'துறை அனுமதி மற்றும் உள்நுழைவு',
    'login.desc': 'குறிப்பிட்ட செயல்பாட்டு அனுமதிகளுடன் உள்நுழைய உங்கள் துறைப் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்.',
    'login.subheading': 'கட்டுப்பாட்டு அலுவலக ஒருங்கிணைந்த பராமரிப்பு தளம் • தெற்கு & இந்திய ரயில்வே',
    'login.email': 'ரயில்நெட் அங்கீகரிக்கப்பட்ட மின்னஞ்சல் / பணியாளர் எண்',
    'login.pass': 'கடவுச்சொல் / அணுகல் பின்',
    'login.or': 'அல்லது ரயில்நெட் சான்றுகளுடன் உள்நுழைக',
    'login.secure_btn': 'பாதுகாப்பான உள்நுழைவு',
    'login.cris_audit': 'இந்திய ரயில்வே CRIS பாதுகாப்பு இணக்கமானது • 256-பிட் குறியாக்கம்',
    'login.worker_tools': 'களப்பணி உத்தரவுகள், USFD தண்டவாள குறைபாடு பதிவு, OHE ஆய்வு பட்டியல்',
    'login.ops_tools': 'நிகழ்நேர ரயில் கண்காணிப்பு, அட்டவணை ஒழுங்குமுறை, பாதுகாப்பு இடைவெளி',
    'login.admin_tools': 'பிளாக் அனுமதி அதிகாரம், CP-SAT உகப்பாக்கி, தணிக்கை அறிக்கை',

    // Corner slide table
    'cst.title': 'நிகழ்நேர செயல்பாட்டு மானிட்டர்',
    'cst.blocks': 'செயலில் உள்ள பிளாக்குகள்',
    'cst.trains': 'ரயில் தாமதங்கள்',
    'cst.alerts': 'பாதுகாப்பு எச்சரிக்கைகள்',
    'cst.minimize': 'சுருக்குக',
    'cst.expand': 'விரிவாக்கு',
  },
  te: {
    // Top banner & Header
    'gov.india': 'భారత ప్రభుత్వం',
    'min.railways': 'రైల్వే మంత్రిత్వ శాఖ',
    'app.title': 'రైల్‌బ్లాక్ AI',
    'app.subtitle': 'సమగ్ర నిర్వహణ బ్లాక్ ప్రణాళిక & నిర్ణయ మద్దతు వ్యవస్థ',
    'clock.ist': 'IST కంట్రోల్ క్లాక్',
    'lang.switch': 'భాష మార్పు',
    'role.switch': 'అధికార మార్పు',
    'role.admin': 'పరిపాలన (సీనియర్ DOM)',
    'role.ops': 'కార్యాచరణ విభాగం (కంట్రోలర్)',
    'role.worker': 'ఫీల్డ్ ఇంజనీరింగ్ వర్కర్లు (SSE P-Way)',
    'sign.out': 'సైన్ అవుట్',
    'sign.in': 'సైన్ ఇన్',

    // Navigation
    'nav.dashboard': 'కంట్రోల్ డాష్‌బోర్డ్',
    'nav.operations': 'కార్యాచరణలు',
    'nav.trains': 'రైలు కార్యకలాపాలు & షెడ్యూల్',
    'nav.blocks': 'బ్లాక్ ప్రణాళిక & అనుమతులు',
    'nav.network': 'జాతీయ GIS నెట్‌వర్క్',
    'nav.maintenance': 'నిర్వహణ పనులు',
    'nav.maint_requests': 'నిర్వహణ అభ్యర్థనలు',
    'nav.assets': 'రైల్వే ఆస్తుల నిర్వహణ',
    'nav.alerts': 'ఆపరేషనల్ హెచ్చరికలు',
    'nav.ai_support': 'AI & నిర్ణయ మద్దతు',
    'nav.optimization': 'CP-SAT ప్లాన్ ఆప్టిమైజేషన్',
    'nav.simulation': 'వాట్-ఇఫ్ సిమ్యులేషన్',
    'nav.scenarios': 'సన్నివేశాల కేటలాగ్',
    'nav.reports': 'అధికారిక నివేదికలు',
    'nav.admin_compliance': 'పరిపాలన & వర్తింపు',
    'nav.audit': 'ఆడిట్ & భద్రతా రికార్డులు',

    // Role-specific badges & descriptions
    'role.admin_desc': 'ఎగ్జిక్యూటివ్ అనుమతి అధికారం • CP-SAT ఆప్టిమైజేషన్ ట్యూనింగ్',
    'role.ops_desc': 'నిజ-సమయ రైలు కదలికలు • షెడ్యూల్ నియంత్రణ • సమయపాలన',
    'role.worker_desc': 'ట్రాక్ నిర్వహణ • లోపాల నమోదు • ట్రాక్ మెషిన్ రిక్విజిషన్',
    'role.badge.admin': 'DRM / ప్రధాన కార్యాలయ స్థాయి',
    'role.badge.ops': 'సెక్షన్ కంట్రోల్ రూమ్',
    'role.badge.worker': 'ఫీల్డ్ P-WAY సిబ్బంది',

    // Common Buttons & Tooltips
    'btn.approve': 'బ్లాక్ ఆమోదించండి',
    'btn.reject': 'బ్లాక్ తిరస్కరించండి',
    'btn.optimize': 'CP-SAT సాల్వర్ రన్ చేయండి',
    'btn.new_block': 'కొత్త బ్లాక్ ప్రతిపాదించండి',
    'btn.new_task': 'నిర్వహణ పని నమోదు చేయండి',
    'btn.export': 'రిపోర్ట్ డౌన్‌లోడ్',
    'btn.filter': 'ఫిల్టర్',
    'btn.reset': 'రీసెట్',
    'btn.close': 'మూసివేయి',
    'btn.details': 'వివరాలు చూడండి',
    'btn.slide_table': 'ప్రత్యక్ష కార్యాచరణ పట్టిక',

    // Tooltip explanations
    'tt.lang': 'సిస్టమ్ భాషను మార్చండి (ఇంగ్లీష్, హిందీ, తమిళం, తెలుగు)',
    'tt.role': 'పరిపాలన, ఆపరేషన్స్ మరియు ఫీల్డ్ వర్కర్ల మధ్య క్లియరెన్స్ మార్చండి',
    'tt.clock': 'భారత ప్రామాణిక సమయం (IST) రైల్‌నెట్ సర్వర్‌లతో సమకాలీకరించబడింది',
    'tt.logout': 'సురక్షితంగా లాగౌట్ చేయండి',
    'tt.corner_table': 'మూలలో ఉన్న ప్రత్యక్ష కార్యాచరణ మానిటర్ పట్టికను తెరవండి లేదా దాచండి',
    'tt.approve_btn': 'ట్రాక్ నిర్వహణ కోసం అధికారిక బ్లాక్ మంజూరు చేయండి',
    'tt.reject_btn': 'రైలు ఆలస్యం నివారించడానికి బ్లాక్ తిరస్కరించండి',
    'tt.cpsat_btn': 'Google OR-Tools CP-SAT అల్గోరిథంను అమలు చేయండి',
    'tt.mobile_menu': 'మొబైల్ మరియు టాబ్లెట్ మెనూను తెరవండి/మూసివేయండి',

    // Login page
    'login.title': 'విభాగం క్లియరెన్స్ & సైన్-ఇన్',
    'login.desc': 'నియమించబడిన అధికారాలు మరియు ఆధారాలతో ధృవీకరించడానికి క్రింద మీ విభాగాన్ని ఎంచుకోండి.',
    'login.subheading': 'కంట్రోల్ ఆఫీస్ ఇంటిగ్రేటెడ్ మెయింటెనెన్స్ & డెసిషన్ సపోర్ట్ ప్లాట్‌ఫారమ్ • ఇండియన్ రైల్వేస్',
    'login.email': 'రైల్‌నెట్ అధీకృత ఈమెయిల్ / ఎంప్లాయ్ ఐడీ',
    'login.pass': 'యాక్సెస్ పిన్ / పాస్‌వర్డ్',
    'login.or': 'లేదా రైల్‌నెట్ ఆధారాలతో లాగిన్ అవ్వండి',
    'login.secure_btn': 'సురక్షిత సైన్-ఇన్',
    'login.cris_audit': 'ఇండియన్ రైల్వేస్ CRIS భద్రతా ప్రమాణాలకు అనుగుణంగా • 256-బిట్ ఎన్క్రిప్షన్',
    'login.worker_tools': 'ఫీల్డ్ వర్క్ ఆర్డర్లు, USFD రైలు లోపాల రికార్డు, OHE తనిఖీ చెక్‌లిస్ట్',
    'login.ops_tools': 'నిజ-సమయ రైలు పర్యవేక్షణ, షెడ్యూల్ నియంత్రణ, భద్రతా హెడ్‌వే రక్షణ',
    'login.admin_tools': 'బ్లాక్ ఆమోదం అధికారం, CP-SAT సాల్వర్, చట్టబద్ధమైన ఆడిట్ నివేదిక',

    // Corner slide table
    'cst.title': 'ప్రత్యక్ష కార్యాచరణ మానిటర్',
    'cst.blocks': 'క్రియాశీల బ్లాక్‌లు',
    'cst.trains': 'ప్రత్యక్ష రైలు ఆలస్యాలు',
    'cst.alerts': 'భద్రతా హెచ్చరికలు',
    'cst.minimize': 'చిన్నది చేయి',
    'cst.expand': 'పట్టిక విస్తరించు',
  },
}

interface I18nContextType {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('railblock_language')
    if (saved === 'hi' || saved === 'ta' || saved === 'te' || saved === 'en') {
      return saved
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('railblock_language', language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang)
  }

  const t = (key: string, fallback?: string): string => {
    const currentDict = translations[language]
    if (currentDict && currentDict[key]) {
      return currentDict[key]
    }
    const englishDict = translations.en
    if (englishDict && englishDict[key]) {
      return englishDict[key]
    }
    return fallback || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'en' as SupportedLanguage,
      setLanguage: () => {},
      t: (key: string, fallback?: string) => translations.en[key] || fallback || key,
    }
  }
  return context
}
