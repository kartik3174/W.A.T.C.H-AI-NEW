"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = {
  code: string
  name: string
  nativeName: string
}

type LanguageContextType = {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  languages: Language[]
  translations: Record<string, Record<string, string>>
  t: (key: string) => string
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
]

// Default translations for common UI elements
const translations: Record<string, Record<string, string>> = {
  en: {
    "app.title": "Wildlife AI Tracking and Conservation Hub",
    dashboard: "Dashboard",
    reports: "Reports",
    alerts: "Alerts",
    search: "Search",
    settings: "Settings",
    profile: "Profile",
    analytics: "Analytics",
    "ai.monitoring": "AI Monitoring",
    tracking: "Tracking",
    "animal.care": "Animal Care",
    staff: "Staff",
    database: "Database",
    "settings.appearance": "Appearance",
    "settings.privacy": "Privacy",
    "settings.notifications": "Notifications",
    "settings.language": "Language",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "motion.detected": "Motion Detected!",
    "save.changes": "Save Changes",
    "clear.alerts": "Clear Alerts",
  },
  hi: {
    "app.title": "वन्यजीव AI ट्रैकिंग और संरक्षण हब",
    dashboard: "डैशबोर्ड",
    reports: "रिपोर्ट",
    alerts: "अलर्ट",
    search: "खोज",
    settings: "सेटिंग्स",
    profile: "प्रोफाइल",
    analytics: "एनालिटिक्स",
    "ai.monitoring": "AI निगरानी",
    tracking: "ट्रैकिंग",
    "animal.care": "पशु देखभाल",
    staff: "स्टाफ",
    database: "��ेटाबेस",
    "settings.appearance": "उपस्थिति",
    "settings.privacy": "गोपनीयता",
    "settings.notifications": "सूचनाएं",
    "settings.language": "भाषा",
    "theme.light": "हल्का",
    "theme.dark": "गहरा",
    "theme.system": "सिस्टम",
    "motion.detected": "गति का पता चला!",
    "save.changes": "परिवर्तन सहेजें",
    "clear.alerts": "अलर्ट साफ़ करें",
  },
  ta: {
    "app.title": "வனவிலங்கு AI கண்காணிப்பு மற்றும் பாதுகாப்பு மையம்",
    dashboard: "டாஷ்போர்டு",
    reports: "அறிக்கைகள்",
    alerts: "எச்சரிக்கைகள்",
    search: "தேடல்",
    settings: "அமைப்புகள்",
    profile: "சுயவிவரம்",
    analytics: "பகுப்பாய்வு",
    "ai.monitoring": "AI கண்காணிப்பு",
    tracking: "கண்காணிப்பு",
    "animal.care": "விலங்கு பராமரிப்பு",
    staff: "ஊழியர்கள்",
    database: "தரவுத்தளம்",
    "settings.appearance": "தோற்றம்",
    "settings.privacy": "தனியுரிமை",
    "settings.notifications": "அறிவிப்புகள்",
    "settings.language": "மொழி",
    "theme.light": "வெளிச்சம்",
    "theme.dark": "இருள்",
    "theme.system": "கணினி",
    "motion.detected": "அசைவு கண்டறியப்பட்டது!",
    "save.changes": "மாற்றங்களை சேமி",
    "clear.alerts": "எச்சரிக்கைகளை அழி",
  },
  te: {
    "app.title": "వన్యప్రాణి AI ట్రాకింగ్ మరియు కన్జర్వేషన్ హబ్",
    dashboard: "డాష్‌బోర్డ్",
    reports: "నివేదికలు",
    alerts: "హెచ్చరికలు",
    search: "శోధన",
    settings: "సెట్టింగ్‌లు",
    profile: "ప్రొఫైల్",
    analytics: "విశ్లేషణలు",
    "ai.monitoring": "AI పర్యవేక్షణ",
    tracking: "ట్రాకింగ్",
    "animal.care": "జంతు సంరక్షణ",
    staff: "సిబ్బంది",
    database: "డేటాబేస్",
    "settings.appearance": "రూపం",
    "settings.privacy": "గోప్యత",
    "settings.notifications": "నోటిఫికేషన్లు",
    "settings.language": "భాష",
    "theme.light": "లైట్",
    "theme.dark": "డార్క్",
    "theme.system": "సిస్టమ్",
    "motion.detected": "కదలిక గుర్తించబడింది!",
    "save.changes": "మార్పులను సేవ్ చేయండి",
    "clear.alerts": "హెచ్చరికలను క్లియర్ చేయండి",
  },
  kn: {
    "app.title": "ವನ್ಯಜೀವಿ AI ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸಂರಕ್ಷಣಾ ಕೇಂದ್ರ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    reports: "ವರದಿಗಳು",
    alerts: "ಎಚ್ಚರಿಕೆಗಳು",
    search: "ಹುಡುಕಿ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    profile: "ಪ್ರೊಫೈಲ್",
    analytics: "ವಿಶ್ಲೇಷಣೆಗಳು",
    "ai.monitoring": "AI ಮೇಲ್ವಿಚಾರಣೆ",
    tracking: "ಟ್ರ್ಯಾಕಿಂಗ್",
    "animal.care": "ಪ್ರಾಣಿ ಆರೈಕೆ",
    staff: "ಸಿಬ್ಬಂದಿ",
    database: "ಡೇಟಾಬೇಸ್",
    "settings.appearance": "ರೂಪ",
    "settings.privacy": "ಗೌಪ್ಯತೆ",
    "settings.notifications": "ಅಧಿಸೂಚನೆಗಳು",
    "settings.language": "ಭಾಷೆ",
    "theme.light": "ಬೆಳಕು",
    "theme.dark": "ಕತ್ತಲೆ",
    "theme.system": "ಸಿಸ್ಟಮ್",
    "motion.detected": "ಚಲನೆ ಪತ್ತೆಯಾಗಿದೆ!",
    "save.changes": "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    "clear.alerts": "ಎಚ್ಚರಿಕೆಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
  },
  mr: {
    "app.title": "वन्यजीव AI ट्रॅकिंग आणि संवर्धन केंद्र",
    dashboard: "डॅशबोर्ड",
    reports: "अहवाल",
    alerts: "सूचना",
    search: "शोध",
    settings: "सेटिंग्ज",
    profile: "प्रोफाइल",
    analytics: "विश्लेषण",
    "ai.monitoring": "AI निरीक्षण",
    tracking: "ट्रॅकिंग",
    "animal.care": "प्राणी काळजी",
    staff: "कर्मचारी",
    database: "डेटाबेस",
    "settings.appearance": "दिसणे",
    "settings.privacy": "गोपनीयता",
    "settings.notifications": "सूचना",
    "settings.language": "भाषा",
    "theme.light": "प्रकाश",
    "theme.dark": "गडद",
    "theme.system": "सिस्टम",
    "motion.detected": "हालचाल आढळली!",
    "save.changes": "बदल जतन करा",
    "clear.alerts": "सूचना साफ करा",
  },
  ur: {
    "app.title": "جنگلی حیات AI ٹریکنگ اور تحفظ مرکز",
    dashboard: "ڈیش بورڈ",
    reports: "رپورٹس",
    alerts: "الرٹس",
    search: "تلاش",
    settings: "ترتیبات",
    profile: "پروفائل",
    analytics: "تجزیات",
    "ai.monitoring": "AI نگرانی",
    tracking: "ٹریکنگ",
    "animal.care": "جانوروں کی دیکھ بھال",
    staff: "عملہ",
    database: "ڈیٹا بیس",
    "settings.appearance": "ظاہری شکل",
    "settings.privacy": "رازداری",
    "settings.notifications": "اطلاعات",
    "settings.language": "زبان",
    "theme.light": "روشن",
    "theme.dark": "تاریک",
    "theme.system": "سسٹم",
    "motion.detected": "حرکت کا پتہ چلا!",
    "save.changes": "تبدیلیاں محفوظ کریں",
    "clear.alerts": "الرٹس صاف کریں",
  },
  bn: {
    "app.title": "বন্যপ্রাণী AI ট্র্যাকিং এবং সংরক্ষণ কেন্দ্র",
    dashboard: "ড্যাশবোর্ড",
    reports: "রিপোর্ট",
    alerts: "সতর্কতা",
    search: "অনুসন্ধান",
    settings: "সেটিংস",
    profile: "প্রোফাইল",
    analytics: "বিশ্লেষণ",
    "ai.monitoring": "AI পর্যবেক্ষণ",
    tracking: "ট্র্যাকিং",
    "animal.care": "প্রাণী যত্ন",
    staff: "কর্মচারী",
    database: "ডাটাবেস",
    "settings.appearance": "চেহারা",
    "settings.privacy": "গোপনীয়তা",
    "settings.notifications": "বিজ্ঞপ্তি",
    "settings.language": "ভাষা",
    "theme.light": "হালকা",
    "theme.dark": "গাঢ়",
    "theme.system": "সিস্টেম",
    "motion.detected": "গতি সনাক্ত হয়েছে!",
    "save.changes": "পরিবর্তনগুলি সংরক্ষণ করুন",
    "clear.alerts": "সতর্কতা মুছুন",
  },
  gu: {
    "app.title": "વન્યજીવન AI ટ્રેકિંગ અને સંરક્ષણ કેન્દ્ર",
    dashboard: "ડેશબોર્ડ",
    reports: "રિપોર્ટ્સ",
    alerts: "એલર્ટ્સ",
    search: "શોધ",
    settings: "સેટિંગ્સ",
    profile: "પ્રોફાઇલ",
    analytics: "એનાલિટિક્સ",
    "ai.monitoring": "AI મોનિટરિંગ",
    tracking: "ટ્રેકિંગ",
    "animal.care": "પ્રાણી સંભાળ",
    staff: "સ્ટાફ",
    database: "ડેટાબેઝ",
    "settings.appearance": "દેખાવ",
    "settings.privacy": "ગોપનીયતા",
    "settings.notifications": "સૂચનાઓ",
    "settings.language": "ભાષા",
    "theme.light": "પ્રકાશ",
    "theme.dark": "અંધારું",
    "theme.system": "સિસ્ટમ",
    "motion.detected": "ગતિ શોધાઈ!",
    "save.changes": "ફેરફારો સાચવો",
    "clear.alerts": "એલર્ટ્સ સાફ કરો",
  },
  ml: {
    "app.title": "വന്യജീവി AI ട്രാക്കിംഗ് ആൻഡ് കൺസർവേഷൻ ഹബ്",
    dashboard: "ഡാഷ്ബോർഡ്",
    reports: "റിപ്പോർട്ടുകൾ",
    alerts: "അലേർട്ടുകൾ",
    search: "തിരയൽ",
    settings: "ക്രമീകരണങ്ങൾ",
    profile: "പ്രൊഫൈൽ",
    analytics: "അനലിറ്റിക്സ്",
    "ai.monitoring": "AI നിരീക്ഷണം",
    tracking: "ട്രാക്കിംഗ്",
    "animal.care": "മൃഗ പരിപാലനം",
    staff: "ജീവനക്കാർ",
    database: "ഡാറ്റാബേസ്",
    "settings.appearance": "രൂപം",
    "settings.privacy": "സ്വകാര്യത",
    "settings.notifications": "അറിയിപ്പുകൾ",
    "settings.language": "ഭാഷ",
    "theme.light": "വെളിച്ചം",
    "theme.dark": "ഇരുട്ട്",
    "theme.system": "സിസ്റ്റം",
    "motion.detected": "ചലനം കണ്ടെത്തി!",
    "save.changes": "മാറ്റങ്ങൾ സംരക്ഷിക്കുക",
    "clear.alerts": "അലേർട്ടുകൾ മായ്ക്കുക",
  },
}

const defaultLanguage = languages[0]

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  languages,
  translations,
  t: (key: string) => key,
})

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLanguage)

  // Load saved language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage)
      if (language) {
        setCurrentLanguage(language)
      }
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem("language", language.code)
    // Update HTML lang attribute
    document.documentElement.lang = language.code
    // For RTL languages like Urdu
    document.documentElement.dir = language.code === "ur" ? "rtl" : "ltr"
  }

  // Translation function
  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage.code]
    return langTranslations && langTranslations[key] ? langTranslations[key] : key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages, translations, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
