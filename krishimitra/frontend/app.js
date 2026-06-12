const state = {
  apiBase: localStorage.getItem("krishi_api_base") || "http://localhost:8000",
  language: localStorage.getItem("krishi_language") || "English",
  location: JSON.parse(localStorage.getItem("krishi_location") || "null"),
  chatHistory: JSON.parse(localStorage.getItem("krishi_chat_history") || "[]"),
  requestTimeoutMs: 30000,
};

const requestBudgets = {
  scan: 60000,
  chat: 25000,
  soil: 25000,
  weather: 10000,
  yield: 12000,
};

const i18n = {
  English: {
    tagline: "Smart Crop Doctor",
    hello: "Namaste farmer",
    heroTitle: "Scan, understand, and act faster.",
    greenScore: "Green Score",
    temperature: "Temperature",
    humidity: "Humidity",
    waterSaved: "Water Saved",
    chemicalReduction: "Chemical Reduction",
    cropScan: "Crop Disease Scan",
    pestScan: "Pest Scan",
    analyzeDisease: "Analyze Disease",
    analyzePest: "Analyze Pest",
    weather: "Weather Advisory",
    getWeather: "Get Weather",
    chat: "AI Farming Chat",
    send: "Send",
    soil: "Soil Health",
    analyzeSoil: "Analyze Soil",
    yield: "Yield Prediction",
    predictYield: "Predict Yield",
    sustainability: "Sustainability",
    settings: "Settings",
    language: "Language",
    save: "Save",
    dash: "Dash",
    crop: "Crop",
    pest: "Pest",
    weatherShort: "Weather",
    chatShort: "Chat",
    soilShort: "Soil",
    yieldShort: "Yield",
    green: "Green",
    settingsShort: "Set",
  },
  Hindi: {
    tagline: "स्मार्ट फसल डॉक्टर",
    hello: "नमस्ते किसान",
    heroTitle: "स्कैन करें, समझें, जल्दी कदम उठाएं.",
    greenScore: "ग्रीन स्कोर",
    temperature: "तापमान",
    humidity: "नमी",
    waterSaved: "बचा पानी",
    chemicalReduction: "रसायन कमी",
    cropScan: "फसल रोग स्कैन",
    pestScan: "कीट स्कैन",
    analyzeDisease: "रोग जांचें",
    analyzePest: "कीट जांचें",
    weather: "मौसम सलाह",
    getWeather: "मौसम देखें",
    chat: "AI खेती चैट",
    send: "भेजें",
    soil: "मिट्टी स्वास्थ्य",
    analyzeSoil: "मिट्टी जांचें",
    yield: "उपज अनुमान",
    predictYield: "उपज बताएं",
    sustainability: "स्थिर खेती",
    settings: "सेटिंग्स",
    language: "भाषा",
    save: "सेव",
    dash: "डैश",
    crop: "फसल",
    pest: "कीट",
    weatherShort: "मौसम",
    chatShort: "चैट",
    soilShort: "मिट्टी",
    yieldShort: "उपज",
    green: "ग्रीन",
    settingsShort: "सेट",
  },
  Telugu: {
    tagline: "స్మార్ట్ పంట డాక్టర్",
    hello: "నమస్తే రైతు",
    heroTitle: "స్కాన్ చేయండి, అర్థం చేసుకోండి, త్వరగా చర్య తీసుకోండి.",
    greenScore: "గ్రీన్ స్కోర్",
    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమ",
    waterSaved: "ఆదా నీరు",
    chemicalReduction: "రసాయన తగ్గింపు",
    cropScan: "పంట వ్యాధి స్కాన్",
    pestScan: "పురుగు స్కాన్",
    analyzeDisease: "వ్యాధి విశ్లేషించు",
    analyzePest: "పురుగు విశ్లేషించు",
    weather: "వాతావరణ సలహా",
    getWeather: "వాతావరణం పొందు",
    chat: "AI వ్యవసాయ చాట్",
    send: "పంపు",
    soil: "మట్టి ఆరోగ్యం",
    analyzeSoil: "మట్టి విశ్లేషించు",
    yield: "దిగుబడి అంచనా",
    predictYield: "దిగుబడి చెప్పు",
    sustainability: "స్థిర వ్యవసాయం",
    settings: "సెట్టింగ్స్",
    language: "భాష",
    save: "సేవ్",
    dash: "డాష్",
    crop: "పంట",
    pest: "పురుగు",
    weatherShort: "వాతావరణం",
    chatShort: "చాట్",
    soilShort: "మట్టి",
    yieldShort: "దిగుబడి",
    green: "గ్రీన్",
    settingsShort: "సెట్",
  },
};

const languageOverrides = {
  English: {
    heroSub: "Clear field guidance in your language.",
    helperCrop: "Take a clear close-up photo of one affected leaf in daylight. Keep the leaf in the center.",
    helperPest: "Photograph the underside of leaves or the damaged area for better pest triage.",
    helperWeather: "Use current location or enter your district for spraying and irrigation guidance.",
    cropType: "Crop type",
    villageDistrict: "Village / District",
    cityDistrict: "City or district",
    askPlaceholder: "Ask about disease, fertilizer, pests, irrigation",
    areaAcres: "Area in acres",
    rainfallMm: "Rainfall mm",
    fertilizerKg: "Fertilizer kg",
    backendUrl: "Backend API URL",
    clearChat: "Clear chat",
    locate: "LOC",
    voice: "MIC",
    leafSpots: "Leaf spots",
    fertilizer: "Fertilizer",
    spraying: "Spraying",
    finding: "Finding",
    confidence: "Confidence",
    severityRisk: "Severity / Risk",
    affectedArea: "Affected Area",
    weatherLabel: "Weather",
    aiAdvice: "AI Advice",
    expertWarning: "Expert Warning",
    locationLabel: "Location",
    rainfall: "Rainfall",
    wind: "Wind",
    advisory: "Advisory",
    values: "Values",
    deficiencyAnalysis: "Deficiency Analysis",
    recommendedFertilizer: "Recommended Fertilizer",
    expectedYieldImprovement: "Expected Yield Improvement",
    expectedYield: "Expected Yield",
    riskCategory: "Risk Category",
    model: "Model",
    organicRecommendations: "Organic Recommendations",
    carbonImpact: "Carbon Impact",
    preparingPhoto: "Preparing photo for fast upload...",
    uploadingPhoto: "Uploading optimized photo...",
    readingSymptoms: "Reading visible leaf symptoms...",
    combiningWeather: "Combining result with weather risk...",
    preparingAdvice: "Preparing simple treatment advice...",
    checkingSymptoms: "Checking crop symptoms and local weather...",
    fetchingWeather: "Fetching weather advisory...",
    readingSoil: "Reading soil details...",
    estimatingYield: "Estimating yield...",
    checkingGuidance: "Checking local farming guidance...",
    settingsSaved: "Settings saved.",
    locationDetected: "Location detected.",
    locationUnsupported: "Geolocation is not available on this device.",
    locationFailed: "Could not detect location. Enter village or district manually.",
    chatCleared: "Chat cleared.",
    speechUnsupported: "Speech input is not supported in this browser.",
    currentLocation: "Current location",
    notDetected: "Not detected",
    low: "Low",
    medium: "Medium",
    high: "High",
    notApplicable: "Not applicable",
    notAvailable: "Not available",
    serviceError: "Service error",
    sourcesUsed: "Sources Used",
    scanVoice: "Scan result: {finding}. Severity: {severity}. Confidence: {confidence} percent.",
    photoHint: "A smaller, clearer close-up photo will upload faster.",
    timeoutMessage: "The {label} is taking longer than {seconds} seconds. Please try again with a clearer, smaller photo or check that the backend is still running.",
    backendUnreachable: "Cannot reach backend at {baseUrl}. Start FastAPI, then try again.",
    optimizedPhoto: "Photo optimized from {from} to {to}.",
    requestFailed: "Request failed. Check backend URL and network.",
    scanLabel: "crop scan",
    weatherRequest: "weather advisory",
    soilRequest: "soil analysis",
    yieldRequest: "yield prediction",
    chatRequest: "AI chat",
    visualTriageNotice: "Photo triage result. For stronger accuracy, add trained YOLO model files in the models folder.",
  },
  Hindi: {
    tagline: "स्मार्ट फसल डॉक्टर",
    hello: "नमस्ते किसान",
    heroTitle: "स्कैन करें, समझें और जल्दी कार्रवाई करें.",
    heroSub: "आपकी भाषा में साफ खेत सलाह.",
    greenScore: "ग्रीन स्कोर",
    temperature: "तापमान",
    humidity: "नमी",
    waterSaved: "बचा पानी",
    chemicalReduction: "रसायन कमी",
    cropScan: "फसल रोग स्कैन",
    pestScan: "कीट स्कैन",
    analyzeDisease: "रोग जांचें",
    analyzePest: "कीट जांचें",
    weather: "मौसम सलाह",
    getWeather: "मौसम देखें",
    chat: "AI खेती चैट",
    send: "भेजें",
    soil: "मिट्टी स्वास्थ्य",
    analyzeSoil: "मिट्टी जांचें",
    yield: "उपज अनुमान",
    predictYield: "उपज बताएं",
    sustainability: "स्थिर खेती",
    settings: "सेटिंग्स",
    language: "भाषा",
    save: "सेव",
    dash: "डैश",
    crop: "फसल",
    pest: "कीट",
    weatherShort: "मौसम",
    chatShort: "चैट",
    soilShort: "मिट्टी",
    yieldShort: "उपज",
    green: "ग्रीन",
    settingsShort: "सेट",
    helperCrop: "दिन की रोशनी में प्रभावित पत्ती की साफ नजदीकी फोटो लें. पत्ती को बीच में रखें.",
    helperPest: "बेहतर कीट जांच के लिए पत्तियों के नीचे का हिस्सा या नुकसान वाली जगह फोटो में लें.",
    helperWeather: "छिड़काव और सिंचाई सलाह के लिए वर्तमान स्थान या जिला डालें.",
    cropType: "फसल का नाम",
    villageDistrict: "गांव / जिला",
    cityDistrict: "शहर या जिला",
    askPlaceholder: "रोग, खाद, कीट या सिंचाई के बारे में पूछें",
    areaAcres: "क्षेत्रफल एकड़ में",
    rainfallMm: "वर्षा मिमी",
    fertilizerKg: "खाद किग्रा",
    backendUrl: "बैकएंड API URL",
    clearChat: "चैट साफ करें",
    locate: "स्थान",
    voice: "आवाज",
    leafSpots: "पत्ती धब्बे",
    fertilizer: "खाद",
    spraying: "छिड़काव",
    finding: "नतीजा",
    confidence: "विश्वास",
    severityRisk: "गंभीरता / जोखिम",
    affectedArea: "प्रभावित क्षेत्र",
    weatherLabel: "मौसम",
    aiAdvice: "AI सलाह",
    expertWarning: "विशेषज्ञ चेतावनी",
    locationLabel: "स्थान",
    rainfall: "वर्षा",
    wind: "हवा",
    advisory: "सलाह",
    values: "मान",
    deficiencyAnalysis: "कमी विश्लेषण",
    recommendedFertilizer: "सुझाई गई खाद",
    expectedYieldImprovement: "संभावित उपज सुधार",
    expectedYield: "संभावित उपज",
    riskCategory: "जोखिम श्रेणी",
    model: "मॉडल",
    organicRecommendations: "जैविक सुझाव",
    carbonImpact: "कार्बन प्रभाव",
    preparingPhoto: "तेज अपलोड के लिए फोटो तैयार हो रही है...",
    uploadingPhoto: "ऑप्टिमाइज फोटो अपलोड हो रही है...",
    readingSymptoms: "पत्ती के लक्षण पढ़े जा रहे हैं...",
    combiningWeather: "नतीजे को मौसम जोखिम से मिलाया जा रहा है...",
    preparingAdvice: "सरल उपचार सलाह तैयार हो रही है...",
    checkingSymptoms: "फसल लक्षण और स्थानीय मौसम जांचे जा रहे हैं...",
    fetchingWeather: "मौसम सलाह लाई जा रही है...",
    readingSoil: "मिट्टी विवरण पढ़े जा रहे हैं...",
    estimatingYield: "उपज का अनुमान लगाया जा रहा है...",
    checkingGuidance: "स्थानीय खेती सलाह जांची जा रही है...",
    settingsSaved: "सेटिंग्स सेव हो गईं.",
    locationDetected: "स्थान मिल गया.",
    locationUnsupported: "इस डिवाइस पर लोकेशन उपलब्ध नहीं है.",
    locationFailed: "स्थान नहीं मिल सका. गांव या जिला हाथ से डालें.",
    chatCleared: "चैट साफ हो गई.",
    speechUnsupported: "इस ब्राउजर में आवाज इनपुट समर्थित नहीं है.",
    currentLocation: "वर्तमान स्थान",
    notDetected: "नहीं मिला",
    low: "कम",
    medium: "मध्यम",
    high: "अधिक",
    notApplicable: "लागू नहीं",
    notAvailable: "उपलब्ध नहीं",
    serviceError: "सेवा त्रुटि",
    sourcesUsed: "स्रोत इस्तेमाल हुए",
    scanVoice: "स्कैन नतीजा: {finding}. गंभीरता: {severity}. विश्वास: {confidence} प्रतिशत.",
    photoHint: "छोटी और साफ नजदीकी फोटो तेजी से अपलोड होगी.",
    timeoutMessage: "{label} में {seconds} सेकंड से ज्यादा समय लग रहा है. कृपया साफ और छोटी फोटो से फिर कोशिश करें या देखें कि बैकएंड चल रहा है.",
    backendUnreachable: "{baseUrl} पर बैकएंड नहीं मिल रहा. FastAPI शुरू करके फिर कोशिश करें.",
    optimizedPhoto: "फोटो {from} से {to} तक ऑप्टिमाइज हुई.",
    requestFailed: "अनुरोध असफल हुआ. बैकएंड URL और नेटवर्क जांचें.",
    scanLabel: "फसल स्कैन",
    weatherRequest: "मौसम सलाह",
    soilRequest: "मिट्टी जांच",
    yieldRequest: "उपज अनुमान",
    chatRequest: "AI चैट",
    visualTriageNotice: "यह फोटो आधारित प्राथमिक जांच है. ज्यादा सटीकता के लिए models फोल्डर में प्रशिक्षित YOLO मॉडल जोड़ें.",
  },
  Telugu: {
    tagline: "స్మార్ట్ పంట డాక్టర్",
    hello: "నమస్తే రైతు",
    heroTitle: "స్కాన్ చేయండి, అర్థం చేసుకోండి, త్వరగా చర్య తీసుకోండి.",
    heroSub: "మీ భాషలో స్పష్టమైన పొలం సలహా.",
    greenScore: "గ్రీన్ స్కోర్",
    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమ",
    waterSaved: "ఆదా నీరు",
    chemicalReduction: "రసాయన తగ్గింపు",
    cropScan: "పంట వ్యాధి స్కాన్",
    pestScan: "పురుగు స్కాన్",
    analyzeDisease: "వ్యాధి చూడండి",
    analyzePest: "పురుగు చూడండి",
    weather: "వాతావరణ సలహా",
    getWeather: "వాతావరణం చూడండి",
    chat: "AI వ్యవసాయ చాట్",
    send: "పంపండి",
    soil: "మట్టి ఆరోగ్యం",
    analyzeSoil: "మట్టి చూడండి",
    yield: "దిగుబడి అంచనా",
    predictYield: "దిగుబడి చెప్పండి",
    sustainability: "స్థిర వ్యవసాయం",
    settings: "సెట్టింగ్స్",
    language: "భాష",
    save: "సేవ్",
    dash: "డాష్",
    crop: "పంట",
    pest: "పురుగు",
    weatherShort: "వాతావరణం",
    chatShort: "చాట్",
    soilShort: "మట్టి",
    yieldShort: "దిగుబడి",
    green: "గ్రీన్",
    settingsShort: "సెట్",
    helperCrop: "పగటి వెలుతురులో ప్రభావిత ఆకుకు దగ్గరగా స్పష్టమైన ఫోటో తీయండి. ఆకు మధ్యలో ఉండాలి.",
    helperPest: "మంచి పురుగు పరిశీలన కోసం ఆకుల కింద భాగం లేదా నష్టం ఉన్న చోటు ఫోటో తీయండి.",
    helperWeather: "స్ప్రే మరియు నీటి సలహా కోసం ప్రస్తుత స్థానం లేదా జిల్లా ఇవ్వండి.",
    cropType: "పంట పేరు",
    villageDistrict: "గ్రామం / జిల్లా",
    cityDistrict: "నగరం లేదా జిల్లా",
    askPlaceholder: "వ్యాధి, ఎరువు, పురుగు, నీటి గురించి అడగండి",
    areaAcres: "విస్తీర్ణం ఎకరాల్లో",
    rainfallMm: "వర్షపాతం మిమీ",
    fertilizerKg: "ఎరువు కిలోలు",
    backendUrl: "బ్యాకెండ్ API URL",
    clearChat: "చాట్ క్లియర్",
    locate: "స్థానం",
    voice: "వాయిస్",
    leafSpots: "ఆకు మచ్చలు",
    fertilizer: "ఎరువు",
    spraying: "స్ప్రే",
    finding: "ఫలితం",
    confidence: "నమ్మకం",
    severityRisk: "తీవ్రత / ప్రమాదం",
    affectedArea: "ప్రభావిత ప్రాంతం",
    weatherLabel: "వాతావరణం",
    aiAdvice: "AI సలహా",
    expertWarning: "నిపుణుల హెచ్చరిక",
    locationLabel: "స్థానం",
    rainfall: "వర్షపాతం",
    wind: "గాలి",
    advisory: "సలహా",
    values: "విలువలు",
    deficiencyAnalysis: "లోప విశ్లేషణ",
    recommendedFertilizer: "సూచించిన ఎరువు",
    expectedYieldImprovement: "అంచనా దిగుబడి మెరుగుదల",
    expectedYield: "అంచనా దిగుబడి",
    riskCategory: "ప్రమాద వర్గం",
    model: "మోడల్",
    organicRecommendations: "సేంద్రీయ సూచనలు",
    carbonImpact: "కార్బన్ ప్రభావం",
    preparingPhoto: "వేగంగా అప్లోడ్ కోసం ఫోటో సిద్ధమవుతోంది...",
    uploadingPhoto: "ఆప్టిమైజ్ చేసిన ఫోటో అప్లోడ్ అవుతోంది...",
    readingSymptoms: "ఆకు లక్షణాలు చదువుతోంది...",
    combiningWeather: "ఫలితాన్ని వాతావరణ ప్రమాదంతో కలుపుతోంది...",
    preparingAdvice: "సులభ చికిత్స సలహా సిద్ధమవుతోంది...",
    checkingSymptoms: "పంట లక్షణాలు మరియు స్థానిక వాతావరణం చూస్తోంది...",
    fetchingWeather: "వాతావరణ సలహా తెస్తోంది...",
    readingSoil: "మట్టి వివరాలు చదువుతోంది...",
    estimatingYield: "దిగుబడి అంచనా వేస్తోంది...",
    checkingGuidance: "స్థానిక వ్యవసాయ సలహా చూస్తోంది...",
    settingsSaved: "సెట్టింగ్స్ సేవ్ అయ్యాయి.",
    locationDetected: "స్థానం దొరికింది.",
    locationUnsupported: "ఈ పరికరంలో జియోలొకేషన్ లేదు.",
    locationFailed: "స్థానం దొరకలేదు. గ్రామం లేదా జిల్లా చేతితో ఇవ్వండి.",
    chatCleared: "చాట్ క్లియర్ అయింది.",
    speechUnsupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ లేదు.",
    currentLocation: "ప్రస్తుత స్థానం",
    notDetected: "కనపడలేదు",
    low: "తక్కువ",
    medium: "మధ్యస్థ",
    high: "అధిక",
    notApplicable: "వర్తించదు",
    notAvailable: "అందుబాటులో లేదు",
    serviceError: "సేవ లోపం",
    sourcesUsed: "వాడిన మూలాలు",
    scanVoice: "స్కాన్ ఫలితం: {finding}. తీవ్రత: {severity}. నమ్మకం: {confidence} శాతం.",
    photoHint: "చిన్నదిగా, స్పష్టంగా దగ్గరగా తీసిన ఫోటో వేగంగా అప్లోడ్ అవుతుంది.",
    timeoutMessage: "{label} {seconds} సెకన్ల కంటే ఎక్కువ సమయం తీసుకుంటోంది. దయచేసి స్పష్టమైన చిన్న ఫోటోతో మళ్లీ ప్రయత్నించండి లేదా బ్యాకెండ్ నడుస్తోందో చూడండి.",
    backendUnreachable: "{baseUrl} వద్ద బ్యాకెండ్ దొరకలేదు. FastAPI ప్రారంభించి మళ్లీ ప్రయత్నించండి.",
    optimizedPhoto: "ఫోటో {from} నుండి {to}కి ఆప్టిమైజ్ అయింది.",
    requestFailed: "అభ్యర్థన విఫలమైంది. బ్యాకెండ్ URL మరియు నెట్‌వర్క్ చూడండి.",
    scanLabel: "పంట స్కాన్",
    weatherRequest: "వాతావరణ సలహా",
    soilRequest: "మట్టి విశ్లేషణ",
    yieldRequest: "దిగుబడి అంచనా",
    chatRequest: "AI చాట్",
    visualTriageNotice: "ఇది ఫోటో ఆధారిత ప్రాథమిక పరీక్ష. మరింత ఖచ్చితత్వం కోసం models ఫోల్డర్‌లో శిక్షణ పొందిన YOLO మోడల్‌లు జోడించండి.",
  },
};

Object.entries(languageOverrides).forEach(([language, entries]) => {
  i18n[language] = { ...(i18n[language] || {}), ...entries };
});

const localizedTerms = {
  Hindi: {
    "AI recommendations are advisory only. If more than 30% of the field is affected, or symptoms spread quickly, consult an agricultural officer before treatment.": "AI सुझाव केवल सलाह हैं. अगर खेत का 30% से ज्यादा हिस्सा प्रभावित है या लक्षण तेजी से फैल रहे हैं, तो उपचार से पहले कृषि अधिकारी से सलाह लें.",
    "Healthy Leaf": "स्वस्थ पत्ती",
    "Visual Stress Detected": "दृश्य तनाव मिला",
    "Possible fungal or bacterial leaf disease": "संभावित फफूंद या बैक्टीरिया पत्ती रोग",
    "Possible nutrient or water stress": "संभावित पोषक तत्व या पानी का तनाव",
    "Possible pest or sucking insect damage": "संभावित कीट या रस चूसने वाले कीट का नुकसान",
    "No clear pest cluster detected": "स्पष्ट कीट समूह नहीं मिला",
    "Possible small insect or egg cluster": "संभावित छोटे कीट या अंडों का समूह",
    "Cotton Leaf Curl Virus": "कपास लीफ कर्ल वायरस",
    "Early Blight": "अगेती झुलसा",
    "Late Blight": "पछेती झुलसा",
    "Rust": "रतुआ",
    "Bacterial Spot": "बैक्टीरियल धब्बा",
    "Whitefly": "सफेद मक्खी",
    "Bollworm": "बॉलवर्म",
    "Aphids": "चेपा",
    "Thrips": "थ्रिप्स",
    "High humidity increases fungal disease risk.": "अधिक नमी से फफूंद रोग का खतरा बढ़ता है.",
    "Avoid spraying pesticide during rain or wet leaves.": "बारिश या गीली पत्तियों में कीटनाशक छिड़काव न करें.",
    "Heat stress risk: irrigate during early morning or evening.": "गर्मी तनाव का खतरा: सुबह जल्दी या शाम को सिंचाई करें.",
    "High wind can cause pesticide drift; postpone spraying.": "तेज हवा में दवा बह सकती है; छिड़काव टालें.",
    "Weather is suitable for routine field monitoring.": "मौसम सामान्य खेत निरीक्षण के लिए ठीक है.",
    "The crop": "फसल",
    "shows signs of": "में संकेत दिख रहे हैं",
    "Remove highly affected leaves": "ज्यादा प्रभावित पत्तियां हटाएं",
    "avoid blanket chemical use": "पूरे खेत में बिना जरूरत रसायन न डालें",
    "use locally approved bio-control or pesticide only after label verification": "लेबल देखकर ही स्थानीय रूप से स्वीकृत जैव-नियंत्रण या कीटनाशक इस्तेमाल करें",
    "Keep field sanitation": "खेत साफ रखें",
    "avoid overhead irrigation when humidity is high": "नमी अधिक हो तो ऊपर से सिंचाई न करें",
    "rotate crops": "फसल चक्र अपनाएं",
    "monitor weekly": "हर सप्ताह निरीक्षण करें",
    "Use targeted spraying": "जरूरत वाली जगह ही छिड़काव करें",
    "compost": "कम्पोस्ट",
    "mulching": "मल्चिंग",
    "water-efficient irrigation": "पानी बचाने वाली सिंचाई",
    "Weather note": "मौसम नोट",
    "Diagnosis": "निदान",
    "Treatment": "उपचार",
    "Prevention": "बचाव",
    "Sustainability Tips": "स्थिर खेती सुझाव",
    "Expert Warning": "विशेषज्ञ चेतावनी",
  },
  Telugu: {
    "AI recommendations are advisory only. If more than 30% of the field is affected, or symptoms spread quickly, consult an agricultural officer before treatment.": "AI సూచనలు సలహా మాత్రమే. పొలంలో 30% కంటే ఎక్కువ ప్రభావితం అయితే లేదా లక్షణాలు వేగంగా వ్యాపిస్తే, చికిత్సకు ముందు వ్యవసాయ అధికారిని సంప్రదించండి.",
    "Healthy Leaf": "ఆరోగ్యమైన ఆకు",
    "Visual Stress Detected": "దృశ్య ఒత్తిడి కనిపించింది",
    "Possible fungal or bacterial leaf disease": "సంభావ్య ఫంగల్ లేదా బ్యాక్టీరియా ఆకు వ్యాధి",
    "Possible nutrient or water stress": "సంభావ్య పోషక లేదా నీటి ఒత్తిడి",
    "Possible pest or sucking insect damage": "సంభావ్య పురుగు లేదా రసం పీల్చే పురుగు నష్టం",
    "No clear pest cluster detected": "స్పష్టమైన పురుగు సమూహం కనిపించలేదు",
    "Possible small insect or egg cluster": "సంభావ్య చిన్న పురుగు లేదా గుడ్ల సమూహం",
    "Cotton Leaf Curl Virus": "పత్తి లీఫ్ కర్ల్ వైరస్",
    "Early Blight": "ఆరంభ బ్లైట్",
    "Late Blight": "లేట్ బ్లైట్",
    "Rust": "రస్ట్",
    "Bacterial Spot": "బ్యాక్టీరియా మచ్చ",
    "Whitefly": "వైట్‌ఫ్లై",
    "Bollworm": "బాల్‌వార్మ్",
    "Aphids": "అఫిడ్స్",
    "Thrips": "త్రిప్స్",
    "High humidity increases fungal disease risk.": "అధిక తేమ ఫంగల్ వ్యాధి ప్రమాదాన్ని పెంచుతుంది.",
    "Avoid spraying pesticide during rain or wet leaves.": "వర్షంలో లేదా ఆకులు తడిగా ఉన్నప్పుడు పురుగుమందు స్ప్రే చేయవద్దు.",
    "Heat stress risk: irrigate during early morning or evening.": "వేడి ఒత్తిడి ప్రమాదం: ఉదయం తొందరగా లేదా సాయంత్రం నీరు పెట్టండి.",
    "High wind can cause pesticide drift; postpone spraying.": "బలమైన గాలి మందు చెదరగొడుతుంది; స్ప్రే వాయిదా వేయండి.",
    "Weather is suitable for routine field monitoring.": "సాధారణ పొలం పరిశీలనకు వాతావరణం అనుకూలంగా ఉంది.",
    "The crop": "పంట",
    "shows signs of": "లో లక్షణాలు కనిపిస్తున్నాయి",
    "Remove highly affected leaves": "బాగా ప్రభావిత ఆకులను తొలగించండి",
    "avoid blanket chemical use": "అవసరం లేకుండా మొత్తం పొలంలో రసాయనాలు వాడవద్దు",
    "use locally approved bio-control or pesticide only after label verification": "లేబుల్ చూసిన తర్వాతే స్థానికంగా ఆమోదించిన బయో-కంట్రోల్ లేదా పురుగుమందు వాడండి",
    "Keep field sanitation": "పొలం శుభ్రంగా ఉంచండి",
    "avoid overhead irrigation when humidity is high": "తేమ ఎక్కువగా ఉన్నప్పుడు పై నుంచి నీరు పెట్టవద్దు",
    "rotate crops": "పంట మార్పిడి చేయండి",
    "monitor weekly": "ప్రతి వారం పరిశీలించండి",
    "Use targeted spraying": "అవసరమైన చోట మాత్రమే స్ప్రే చేయండి",
    "compost": "కంపోస్ట్",
    "mulching": "మల్చింగ్",
    "water-efficient irrigation": "నీరు ఆదా చేసే సాగునీరు",
    "Weather note": "వాతావరణ గమనిక",
    "Diagnosis": "నిర్ధారణ",
    "Treatment": "చికిత్స",
    "Prevention": "నివారణ",
    "Sustainability Tips": "స్థిర వ్యవసాయ సూచనలు",
    "Expert Warning": "నిపుణుల హెచ్చరిక",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#apiBase").value = state.apiBase;
  document.querySelector("#languageSelect").value = state.language;
  applyLanguage();
  bindNavigation();
  bindForms();
  renderChat();
  registerServiceWorker();
  loadSustainability();
  loadWeather();
});

function bindNavigation() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.tab));
  });
}

function showPanel(panel) {
  document.querySelectorAll(".panel").forEach((item) => item.classList.toggle("active", item.dataset.panel === panel));
  document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item.dataset.tab === panel));
  if (panel === "sustainability") loadSustainability();
}

function bindForms() {
  document.querySelector("#saveSettings").addEventListener("click", () => {
    state.apiBase = document.querySelector("#apiBase").value.trim().replace(/\/$/, "");
    state.language = document.querySelector("#languageSelect").value;
    localStorage.setItem("krishi_api_base", state.apiBase);
    localStorage.setItem("krishi_language", state.language);
    applyLanguage();
    toast("Settings saved.");
  });

  document.querySelector("#languageSelect").addEventListener("change", (event) => {
    state.language = event.target.value;
    localStorage.setItem("krishi_language", state.language);
    applyLanguage();
  });

  document.querySelector("#locateBtn").addEventListener("click", detectLocation);
  document.querySelector("#weatherBtn").addEventListener("click", loadWeather);
  document.querySelector("#diseaseForm").addEventListener("submit", (event) => handleImageScan(event, "/detect/disease", "diseaseResult"));
  document.querySelector("#pestForm").addEventListener("submit", (event) => handleImageScan(event, "/detect/pest", "pestResult"));
  document.querySelector("#soilForm").addEventListener("submit", handleSoil);
  document.querySelector("#yieldForm").addEventListener("submit", handleYield);
  document.querySelector("#chatForm").addEventListener("submit", handleChat);
  document.querySelector("#voiceBtn").addEventListener("click", startVoiceInput);
  document.querySelector("#clearChatBtn").addEventListener("click", clearChat);
  document.querySelectorAll(".prompt-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#chatInput").value = button.dataset.prompt;
      document.querySelector("#chatInput").focus();
    });
  });
}

function applyLanguage() {
  const table = i18n[state.language] || i18n.English;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = table[element.dataset.i18n] || i18n.English[element.dataset.i18n] || element.textContent;
  });
}

async function handleImageScan(event, endpoint, resultId) {
  event.preventDefault();
  const form = event.currentTarget;
  const result = document.querySelector(`#${resultId}`);
  const payload = new FormData(form);
  const image = payload.get("image");
  payload.set("language", state.language);
  setBusy(form, true);
  const progress = scanProgress(result);
  try {
    progress.start("Preparing photo for fast upload...");
    await optimizeImagePayload(payload);
    if (state.location) {
      payload.set("lat", state.location.lat);
      payload.set("lon", state.location.lon);
    }
    progress.update("Checking crop symptoms and local weather...");
    const data = await api(endpoint, {
      method: "POST",
      body: payload,
      timeoutMs: requestBudgets.scan,
      label: "crop scan",
    });
    progress.stop();
    renderScan(result, data);
  } catch (error) {
    progress.stop();
    if (image instanceof File && image.size > 5 * 1024 * 1024) {
      error.message += " A smaller, clearer close-up photo will upload faster.";
    }
    renderError(result, error);
  } finally {
    setBusy(form, false);
  }
}

async function loadWeather() {
  const city = document.querySelector("#cityInput").value.trim();
  const body = state.location && !city ? { lat: state.location.lat, lon: state.location.lon } : { city };
  const target = document.querySelector("#weatherResult");
  const button = document.querySelector("#weatherBtn");
  setBusy(button, true);
  renderLoading(target, "Fetching weather advisory...");
  try {
    const weather = await api("/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      timeoutMs: requestBudgets.weather,
      label: "weather advisory",
    });
    document.querySelector("#weatherTemp").textContent = `${weather.temperature_c} C`;
    document.querySelector("#weatherHumidity").textContent = `${weather.humidity_percent}%`;
    renderWeather(target, weather);
  } catch (error) {
    if (target) renderError(target, error);
  } finally {
    setBusy(button, false);
  }
}

async function handleSoil(event) {
  event.preventDefault();
  const result = document.querySelector("#soilResult");
  const data = new FormData(event.currentTarget);
  setBusy(event.currentTarget, true);
  renderLoading(result, "Reading soil details...");
  try {
    renderSoil(result, await api("/soil/analyze", { method: "POST", body: data, timeoutMs: requestBudgets.soil, label: "soil analysis" }));
  } catch (error) {
    renderError(result, error);
  } finally {
    setBusy(event.currentTarget, false);
  }
}

async function handleYield(event) {
  event.preventDefault();
  const result = document.querySelector("#yieldResult");
  const form = new FormData(event.currentTarget);
  const body = Object.fromEntries(form.entries());
  body.area_acres = Number(body.area_acres);
  body.rainfall_mm = Number(body.rainfall_mm);
  body.fertilizer_kg = Number(body.fertilizer_kg);
  setBusy(event.currentTarget, true);
  renderLoading(result, "Estimating yield...");
  try {
    renderYield(result, await api("/yield/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      timeoutMs: requestBudgets.yield,
      label: "yield prediction",
    }));
  } catch (error) {
    renderError(result, error);
  } finally {
    setBusy(event.currentTarget, false);
  }
}

async function handleChat(event) {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const message = input.value.trim();
  if (!message) return;
  const form = event.currentTarget;
  state.chatHistory.push({ role: "user", content: message });
  const pending = { role: "assistant", content: "Checking local farming guidance...", pending: true };
  state.chatHistory.push(pending);
  input.value = "";
  setBusy(form, true);
  renderChat();
  try {
    const data = await api("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: state.chatHistory
          .filter((item) => !item.pending)
          .slice(-8)
          .map((h) => ({ role: h.role, content: h.content })),
        language: state.language,
      }),
      timeoutMs: requestBudgets.chat,
      label: "AI chat",
    });
    const sources = (data.sources_used || []).map((item) => item.source).join(", ");
    const reply = sources ? `${data.reply}\n\nSources Used: ${sources}` : data.reply;
    pending.content = reply;
    pending.pending = false;
    localStorage.setItem("krishi_chat_history", JSON.stringify(state.chatHistory.slice(-20)));
    renderChat();
    speak(data.reply);
  } catch (error) {
    pending.content = `Service error: ${formatErrorMessage(error)}`;
    pending.pending = false;
    renderChat();
  } finally {
    setBusy(form, false);
  }
}

async function loadSustainability() {
  const target = document.querySelector("#sustainabilityResult");
  try {
    const data = await api("/sustainability");
    document.querySelector("#greenScore").textContent = data.green_farming_score;
    document.querySelector("#waterSaved").textContent = compactLiters(data.water_saved_liters);
    document.querySelector("#chemicalReduction").textContent = `${data.chemical_reduction_percent}%`;
    renderSustainability(target, data);
  } catch (error) {
    renderError(target, error);
  }
}

function detectLocation() {
  if (!navigator.geolocation) {
    toast("Geolocation is not available on this device.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      localStorage.setItem("krishi_location", JSON.stringify(state.location));
      document.querySelectorAll(".location-field").forEach((field) => {
        if (!field.value) field.value = "Current location";
      });
      loadWeather();
      toast("Location detected.");
    },
    () => toast("Could not detect location. Enter village or district manually."),
    { enableHighAccuracy: true, timeout: 9000 }
  );
}

function clearChat() {
  state.chatHistory = [];
  localStorage.removeItem("krishi_chat_history");
  renderChat();
  toast("Chat cleared.");
}

function startVoiceInput() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    toast("Speech input is not supported in this browser.");
    return;
  }
  const recognition = new Recognition();
  recognition.lang = state.language === "Hindi" ? "hi-IN" : state.language === "Telugu" ? "te-IN" : "en-IN";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    document.querySelector("#chatInput").value = event.results[0][0].transcript;
  };
  recognition.start();
}

function speak(text) {
  if (!text || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 260));
  const lang = state.language === "Hindi" ? "hi-IN" : state.language === "Telugu" ? "te-IN" : "en-IN";
  utterance.lang = lang;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const preferred = voices.find((voice) => voice.lang.toLowerCase().startsWith(lang.split("-")[0]));
    if (preferred) utterance.voice = preferred;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

async function api(path, options = {}) {
  const timeoutMs = options.timeoutMs || state.requestTimeoutMs;
  const label = options.label || "request";
  const fetchOptions = { ...options };
  delete fetchOptions.timeoutMs;
  delete fetchOptions.label;
  let response;
  try {
    response = await fetchWithTimeout(`${state.apiBase}${path}`, fetchOptions, timeoutMs);
  } catch (error) {
    const fallbackBase = "http://127.0.0.1:8001";
    if (isAbortError(error)) {
      throw new Error(timeoutMessage(label, timeoutMs));
    }
    if (canTryFallback(state.apiBase, fallbackBase)) {
      try {
        response = await fetchWithTimeout(`${fallbackBase}${path}`, fetchOptions, timeoutMs);
      } catch (fallbackError) {
        throw new Error(apiFailureMessage(fallbackError, label, timeoutMs, fallbackBase));
      }
      state.apiBase = fallbackBase;
      localStorage.setItem("krishi_api_base", fallbackBase);
      document.querySelector("#apiBase").value = fallbackBase;
    } else {
      throw new Error(apiFailureMessage(error, label, timeoutMs, state.apiBase));
    }
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = payload?.detail ?? payload?.message ?? payload ?? "Request failed. Check backend URL and network.";
    throw new Error(formatErrorMessage(msg));
  }
  return payload;
}

function formatErrorMessage(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error && err.message) return err.message;
  if (err.message) return String(err.message);
  if (err.detail) return typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail);
  if (err.error) return typeof err.error === "string" ? err.error : JSON.stringify(err.error);
  try { return JSON.stringify(err); } catch (_) { return String(err); }
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("Request timed out", "TimeoutError")), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function optimizeImagePayload(payload) {
  const file = payload.get("image");
  if (!(file instanceof File) || !file.type.startsWith("image/")) return;
  if (file.size < 450 * 1024) return;
  const optimized = await compressImage(file, 1024, 0.74);
  if (optimized && optimized.size < file.size) {
    payload.set("image", optimized, optimized.name);
    toast(`Photo optimized from ${formatBytes(file.size)} to ${formatBytes(optimized.size)}.`);
  }
}

function scanProgress(target) {
  const messages = [
    "Uploading optimized photo...",
    "Reading visible leaf symptoms...",
    "Combining result with weather risk...",
    "Preparing simple treatment advice...",
  ];
  let timer = null;
  let step = 0;
  return {
    start(message) {
      step = 0;
      renderLoading(target, message);
      timer = setInterval(() => {
        renderLoading(target, messages[Math.min(step, messages.length - 1)]);
        step += 1;
      }, 4500);
    },
    update(message) {
      renderLoading(target, message);
    },
    stop() {
      if (timer) clearInterval(timer);
      timer = null;
    },
  };
}

function isAbortError(error) {
  return error?.name === "AbortError" || error?.name === "TimeoutError";
}

function canTryFallback(apiBase, fallbackBase) {
  return apiBase !== fallbackBase && /localhost:8000|127\.0\.0\.1:8000/.test(apiBase);
}

function apiFailureMessage(error, label, timeoutMs, baseUrl) {
  if (isAbortError(error)) return timeoutMessage(label, timeoutMs);
  return `Cannot reach backend at ${baseUrl}. Start FastAPI, then try again.`;
}

function timeoutMessage(label, timeoutMs) {
  const seconds = Math.round(timeoutMs / 1000);
  return `The ${label} is taking longer than ${seconds} seconds. Please try again with a clearer, smaller photo or check that the backend is still running.`;
}

function compressImage(file, maxSize, quality) {
  return new Promise((resolve) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) return resolve(null);
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
      }, "image/jpeg", quality);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}

function renderScan(target, data) {
  const diagnosis = data.diagnosis || {};
  const diseaseName = diagnosis.disease || diagnosis.pest || "Not detected";
  const severity = diagnosis.severity || diagnosis.risk_level || "Low";
  const affected = diagnosis.affected_area_percent != null ? `${diagnosis.affected_area_percent}%` : "Not applicable";
  target.innerHTML = `
    ${card("Finding", diseaseName)}
    ${card("Confidence", `${diagnosis.confidence || 0}%`)}
    ${card("Severity / Risk", severity)}
    ${card("Affected Area", affected)}
    ${card("Weather", (data.weather?.alerts || []).join(" "))}
    ${card("AI Advice", data.advice || "")}
    ${card("Expert Warning", data.expert_warning || "")}
  `;
}

function renderWeather(target, weather) {
  target.innerHTML = `
    ${card("Location", weather.location)}
    ${card("Temperature", `${weather.temperature_c} C`)}
    ${card("Humidity", `${weather.humidity_percent}%`)}
    ${card("Rainfall", `${weather.rainfall_mm} mm`)}
    ${card("Wind", `${weather.wind_speed_mps} m/s`)}
    ${card("Advisory", (weather.alerts || []).join(" "))}
  `;
}

function renderSoil(target, data) {
  target.innerHTML = `
    ${card("Values", JSON.stringify(data.values, null, 2))}
    ${card("Deficiency Analysis", data.deficiency_analysis.join("\n"))}
    ${card("Recommended Fertilizer", data.recommended_fertilizer.join("\n"))}
    ${card("Expected Yield Improvement", `${data.expected_yield_improvement_percent}%`)}
  `;
}

function renderYield(target, data) {
  target.innerHTML = `
    ${card("Expected Yield", `${data.expected_yield_quintals} quintals`)}
    ${card("Confidence", `${data.confidence}%`)}
    ${card("Risk Category", data.risk_category)}
    ${card("Model", data.model_status)}
  `;
}

function renderSustainability(target, data) {
  target.innerHTML = `
    ${card("Water Saved", compactLiters(data.water_saved_liters))}
    ${card("Chemical Reduction", `${data.chemical_reduction_percent}%`)}
    ${card("Organic Recommendations", data.organic_recommendations.join("\n"))}
    ${card("Carbon Impact", `${data.carbon_impact_kg_co2e_saved} kg CO2e saved`)}
    ${card("Green Farming Score", `${data.green_farming_score}/100`)}
    ${card("Expert Warning", data.expert_warning)}
  `;
}

function renderChat() {
  const box = document.querySelector("#chatMessages");
  box.innerHTML = state.chatHistory.map((message) => {
    const classes = ["msg", message.role === "user" ? "user" : "", message.pending ? "pending" : ""].filter(Boolean).join(" ");
    return `<div class="${classes}">${message.pending ? '<span class="dot-loader"></span>' : ""}${escapeHtml(message.content)}</div>`;
  }).join("");
  box.scrollTop = box.scrollHeight;
}

function renderLoading(target, message) {
  target.innerHTML = `<div class="loading"><span class="dot-loader"></span>${escapeHtml(message)}</div>`;
}

function renderError(target, error) {
  target.innerHTML = `<div class="error">${escapeHtml(formatErrorMessage(error))}</div>`;
}

function card(label, value) {
  return `<section class="mini-card"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(String(value || "Not available"))}</span></section>`;
}

function toast(message) {
  document.querySelector("#dashboardAlert").textContent = message;
}

function setBusy(target, busy) {
  const controls = target.matches?.("button") ? [target] : Array.from(target.querySelectorAll("button, input, select"));
  controls.forEach((control) => {
    control.disabled = busy;
    control.classList.toggle("is-busy", busy && control.matches("button"));
  });
}

function compactLiters(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k L` : `${value} L`;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}
