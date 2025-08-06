'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Language interface
interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Platform introduction content in multiple languages
const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bh', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
];

// Content translations
const content = {
  en: {
    title: "Welcome to Ol! - India's Premier Influencer Marketplace",
    subtitle: "Connect Local Businesses with Authentic Influencers",
    description: "Ol! connects shop owners, startups, and product promoters with budget-friendly, location-based influencers. Whether you're a local business looking to promote your products or an influencer wanting to earn from your content, we make it simple and effective.",
    
    // Features
    features: {
      title: "Why Choose Ol!?",
      items: [
        {
          title: "For Influencers",
          description: "Create your profile, boost your reach, and chat directly with promoters",
          icon: "🎯"
        },
        {
          title: "For Promoters", 
          description: "Find budget-friendly influencers in your location, chat and verify easily",
          icon: "🏪"
        },
        {
          title: "Location Based",
          description: "Connect with influencers in your specific city or area",
          icon: "📍"
        },
        {
          title: "Budget Friendly",
          description: "Affordable influencer marketing for small businesses and startups",
          icon: "💰"
        }
      ]
    },

    // How it works for Influencers
    influencerFlow: {
      title: "How It Works for Influencers",
      steps: [
        {
          title: "Create Profile",
          description: "Sign up and create your influencer profile with your content details"
        },
        {
          title: "Boost Your Reach",
          description: "Showcase your content and get discovered by local promoters"
        },
        {
          title: "Chat & Connect",
          description: "Direct chat with promoters and negotiate your terms"
        },
        {
          title: "Earn & Grow",
          description: "Complete campaigns and build long-term partnerships"
        }
      ]
    },

    // How it works for Promoters
    promoterFlow: {
      title: "How It Works for Promoters",
      steps: [
        {
          title: "Find Influencers",
          description: "Search for influencers in your location and budget range"
        },
        {
          title: "Chat & Verify",
          description: "Direct chat with influencers and verify their authenticity"
        },
        {
          title: "Negotiate Terms",
          description: "Discuss requirements, pricing, and campaign details"
        },
        {
          title: "Launch Campaign",
          description: "Start your promotion and track performance"
        }
      ]
    },

    // CTA
    cta: {
      title: "Ready to Get Started?",
      subtitle: "Join thousands of influencers and promoters already using Ol!",
      influencerBtn: "Join as Influencer",
      promoterBtn: "Join as Promoter",
      loginBtn: "Already have an account? Login"
    },

    // Stats
    stats: [
      { number: "10K+", label: "Active Influencers" },
      { number: "2K+", label: "Local Promoters" },
      { number: "₹25M+", label: "Total Transactions" },
      { number: "95%", label: "Satisfaction Rate" }
    ],

    // Video section
    video: {
      title: "See Ol! in Action",
      subtitle: "Watch how influencers and promoters connect on our platform",
      videoUrl: "https://www.youtube.com/embed/demo-video-id"
    },

    // Trusted brands section
    trustedBrands: {
      title: "Trusted by Local Businesses",
      subtitle: "Join these successful promoters and influencers"
    }
  },

  hi: {
    title: "Ol! में आपका स्वागत है - भारत का प्रमुख इन्फ्लुएंसर मार्केटप्लेस",
    subtitle: "स्थानीय व्यवसायों को वास्तविक इन्फ्लुएंसर्स से जोड़ें",
    description: "Ol! दुकान मालिकों, स्टार्टअप्स और उत्पाद प्रमोटर्स को बजट-अनुकूल, स्थान-आधारित इन्फ्लुएंसर्स से जोड़ता है। चाहे आप कोई स्थानीय व्यवसाय हों जो अपने उत्पादों को प्रचारित करना चाहते हैं या कोई इन्फ्लुएंसर जो अपनी सामग्री से कमाई करना चाहता है, हम इसे सरल और प्रभावी बनाते हैं।",
    
    features: {
      title: "Ol! को क्यों चुनें?",
      items: [
        {
          title: "इन्फ्लुएंसर्स के लिए",
          description: "अपना प्रोफाइल बनाएं, अपनी पहुंच बढ़ाएं और प्रमोटर्स से सीधे चैट करें",
          icon: "🎯"
        },
        {
          title: "प्रमोटर्स के लिए",
          description: "अपने स्थान पर बजट-अनुकूल इन्फ्लुएंसर्स खोजें, चैट करें और आसानी से सत्यापित करें",
          icon: "🏪"
        },
        {
          title: "स्थान आधारित",
          description: "अपने विशिष्ट शहर या क्षेत्र में इन्फ्लुएंसर्स से जुड़ें",
          icon: "📍"
        },
        {
          title: "बजट अनुकूल",
          description: "छोटे व्यवसायों और स्टार्टअप्स के लिए सस्ती इन्फ्लुएंसर मार्केटिंग",
          icon: "💰"
        }
      ]
    },

    influencerFlow: {
      title: "इन्फ्लुएंसर्स के लिए यह कैसे काम करता है",
      steps: [
        {
          title: "प्रोफाइल बनाएं",
          description: "साइन अप करें और अपनी सामग्री के विवरण के साथ इन्फ्लुएंसर प्रोफाइल बनाएं"
        },
        {
          title: "अपनी पहुंच बढ़ाएं",
          description: "अपनी सामग्री प्रदर्शित करें और स्थानीय प्रमोटर्स द्वारा खोजे जाएं"
        },
        {
          title: "चैट और जुड़ें",
          description: "प्रमोटर्स से सीधे चैट करें और अपनी शर्तों पर बातचीत करें"
        },
        {
          title: "कमाएं और बढ़ें",
          description: "अभियान पूरे करें और दीर्घकालिक साझेदारी बनाएं"
        }
      ]
    },

    promoterFlow: {
      title: "प्रमोटर्स के लिए यह कैसे काम करता है",
      steps: [
        {
          title: "इन्फ्लुएंसर्स खोजें",
          description: "अपने स्थान और बजट सीमा में इन्फ्लुएंसर्स खोजें"
        },
        {
          title: "चैट और सत्यापित करें",
          description: "इन्फ्लुएंसर्स से सीधे चैट करें और उनकी प्रामाणिकता सत्यापित करें"
        },
        {
          title: "शर्तों पर बातचीत करें",
          description: "आवश्यकताओं, मूल्य निर्धारण और अभियान विवरण पर चर्चा करें"
        },
        {
          title: "अभियान शुरू करें",
          description: "अपना प्रचार शुरू करें और प्रदर्शन ट्रैक करें"
        }
      ]
    },

    cta: {
      title: "शुरू करने के लिए तैयार हैं?",
      subtitle: "हजारों इन्फ्लुएंसर्स और प्रमोटर्स में शामिल हों जो पहले से ही Ol! का उपयोग कर रहे हैं",
      influencerBtn: "इन्फ्लुएंसर के रूप में जुड़ें",
      promoterBtn: "प्रमोटर के रूप में जुड़ें",
      loginBtn: "पहले से खाता है? लॉगिन करें"
    },

    stats: [
      { number: "10K+", label: "सक्रिय इन्फ्लुएंसर्स" },
      { number: "2K+", label: "स्थानीय प्रमोटर्स" },
      { number: "₹25M+", label: "कुल लेनदेन" },
      { number: "95%", label: "संतुष्टि दर" }
    ],

    video: {
      title: "Ol! को कार्य में देखें",
      subtitle: "देखें कि कैसे इन्फ्लुएंसर्स और प्रमोटर्स हमारे प्लेटफॉर्म पर जुड़ते हैं",
      videoUrl: "https://www.youtube.com/embed/demo-video-id"
    },

    trustedBrands: {
      title: "स्थानीय व्यवसायों द्वारा विश्वसनीय",
      subtitle: "इन सफल प्रमोटर्स और इन्फ्लुएंसर्स में शामिल हों"
    }
  }
};

// Trusted Brands Data
const trustedBrands = [
  { name: "Local Fashion Store", logo: "/images/brands/fashion-store.png", type: "Promoter" },
  { name: "Food Startup", logo: "/images/brands/food-startup.png", type: "Promoter" },
  { name: "Beauty Salon", logo: "/images/brands/beauty-salon.png", type: "Promoter" },
  { name: "Tech Gadgets", logo: "/images/brands/tech-gadgets.png", type: "Promoter" },
  { name: "Fitness Influencer", logo: "/images/influencers/fitness.png", type: "Influencer" },
  { name: "Food Blogger", logo: "/images/influencers/food-blogger.png", type: "Influencer" },
  { name: "Fashion Influencer", logo: "/images/influencers/fashion.png", type: "Influencer" },
  { name: "Tech Reviewer", logo: "/images/influencers/tech-reviewer.png", type: "Influencer" }
];

// QR Code Scanner Component
const QRCodeScanner = ({ onScan, isDark }: { onScan: (data: string) => void; isDark: boolean }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate QR code scan
    setTimeout(() => {
      onScan('https://olaa.influencer.com');
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="text-center p-6">
      <div className={`w-48 h-48 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100'
      }`}>
        {isScanning ? (
          <div className="animate-pulse">
            <svg className={`w-16 h-16 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        ) : (
          <svg className={`w-16 h-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        )}
      </div>
      <button
        onClick={handleScan}
        disabled={isScanning}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        {isScanning ? 'Scanning...' : 'Scan QR Code'}
      </button>
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isDark 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

// Platform Introduction Component
const PlatformIntroduction = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showScanner, setShowScanner] = useState(false);
  const [activeFlow, setActiveFlow] = useState<'influencer' | 'promoter'>('influencer');
  const [isDark, setIsDark] = useState(true); // Default to dark theme
  const router = useRouter();

  const currentContent = content[selectedLanguage as keyof typeof content] || content.en;

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleQRScan = (data: string) => {
    // Handle QR code scan - redirect to appropriate page
    router.push('/login');
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Ol!</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className={`appearance-none rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {currentContent.title}
          </h1>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {currentContent.subtitle}
          </p>
          <p className={`text-lg mb-12 max-w-4xl mx-auto leading-relaxed ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {currentContent.description}
          </p>

          {/* QR Code Scanner */}
          {showScanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <QRCodeScanner onScan={handleQRScan} isDark={isDark} />
            </motion.div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setShowScanner(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📱 Scan QR Code
            </button>
            <Link
              href="/login"
              className={`border-2 border-purple-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800 text-purple-400 hover:bg-gray-700' 
                  : 'bg-white text-purple-600 hover:bg-purple-50'
              }`}
            >
              🚀 Get Started
            </Link>
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {currentContent.video.title}
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {currentContent.video.subtitle}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-20 h-20 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <p className="text-xl font-semibold">Watch Demo Video</p>
                  <p className="text-sm opacity-90">See how Ol! works in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {currentContent.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                {stat.number}
              </div>
              <div className={`text-sm md:text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {currentContent.features.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.features.items.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              How It Works
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveFlow('influencer')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeFlow === 'influencer'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                For Influencers
              </button>
              <button
                onClick={() => setActiveFlow('promoter')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeFlow === 'promoter'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                For Promoters
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFlow}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {(activeFlow === 'influencer' ? currentContent.influencerFlow : currentContent.promoterFlow).steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Trusted Brands Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {currentContent.trustedBrands.title}
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {currentContent.trustedBrands.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {trustedBrands.map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 text-center ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                  isDark 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                    : 'bg-gradient-to-br from-purple-100 to-blue-100'
                }`}>
                  <span className="text-2xl">🏪</span>
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {brand.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  brand.type === 'Promoter' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {brand.type}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            {currentContent.cta.title}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {currentContent.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/influencer-registration"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {currentContent.cta.influencerBtn}
            </Link>
            <Link
              href="/promoter-registration"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {currentContent.cta.promoterBtn}
            </Link>
          </div>
          <div className="mt-6">
            <Link
              href="/login"
              className="text-white underline hover:no-underline font-medium"
            >
              {currentContent.cta.loginBtn}
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className={`py-12 mt-16 transition-all duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-900 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="text-xl font-bold">Ol!</span>
            </div>
            <p className="text-gray-400">
              © 2024 Ol! - India's Premier Influencer Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlatformIntroduction; 