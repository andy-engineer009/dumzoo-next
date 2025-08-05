// components/UserRolePopup.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUserRole, setHasVisitedBefore, selectHasVisitedBefore } from '../store/userRoleSlice';

type Language = 'en' | 'hi' | 'pa' | 'bh' | 'ur' | 'ta' | 'bo';
type Translations = {
  [key in Language]: {
    title: string;
    subtitle: string;
    influencerOption: string;
    businessOption: string;
    selectLanguage: string;
  };
};

export default function UserRolePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  
  // Redux hooks
  const dispatch = useAppDispatch();
  const hasVisitedBefore = useAppSelector(selectHasVisitedBefore);

  const translations: Translations = {
    en: {
      title: "How would you like to use our platform?",
      subtitle: "Select your primary goal to get personalized experience",
      influencerOption: "Earn money as an influencer",
      businessOption: "Promote my product/business",
      selectLanguage: "Select Language"
    },
    hi: {
      title: "आप हमारे प्लेटफॉर्म का उपयोग कैसे करना चाहेंगे?",
      subtitle: "व्यक्तिगत अनुभव के लिए अपना प्राथमिक लक्ष्य चुनें",
      influencerOption: "इन्फ्लुएंसर बनकर पैसे कमाएं",
      businessOption: "अपने उत्पाद/व्यवसाय को प्रचारित करें",
      selectLanguage: "भाषा चुनें"
    },
    pa: {
      title: "ਤੁਸੀਂ ਸਾਡੇ ਪਲੇਟਫਾਰਮ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰਨਾ ਚਾਹੋਗੇ?",
      subtitle: "ਨਿੱਜੀਕ੍ਰਿਤ ਅਨੁਭਵ ਲਈ ਆਪਣਾ ਮੁੱਖ ਟੀਚਾ ਚੁਣੋ",
      influencerOption: "ਇਨਫਲੂਐਂਸਰ ਬਣ ਕੇ ਪੈਸੇ ਕਮਾਓ",
      businessOption: "ਆਪਣੇ ਉਤਪਾਦ/ਵਪਾਰ ਨੂੰ ਪ੍ਰਚਾਰ ਕਰੋ",
      selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ"
    },
    bh: {
      title: "आप हमार प्लेटफॉर्म कइसे इस्तेमाल करे चाहब?",
      subtitle: "निजी अनुभव खातिर अपन मुख्य लक्ष्य चुनीं",
      influencerOption: "इन्फ्लुएंसर बनके पैसा कमाइए",
      businessOption: "अपन उत्पाद/व्यवसाय के प्रचार करीं",
      selectLanguage: "भाषा चुनीं"
    },
    ur: {
      title: "آپ ہمارے پلیٹ فارم کو کیسے استعمال کرنا چاہیں گے؟",
      subtitle: "ذاتی تجربے کے لیے اپنا بنیادی مقصد منتخب کریں",
      influencerOption: "اثر انداز بن کر پیسے کمائیں",
      businessOption: "اپنی مصنوعات/کاروبار کو فروغ دیں",
      selectLanguage: "زبان منتخب کریں"
    },
    ta: {
      title: "நீங்கள் எங்கள் தளத்தை எவ்வாறு பயன்படுத்த விரும்புகிறீர்கள்?",
      subtitle: "தனிப்பட்ட அனுபவத்திற்கு உங்கள் முதன்மை இலக்கைத் தேர்ந்தெடுக்கவும்",
      influencerOption: "பொறிமுதலாளியாக பணம் சம்பாதிக்கவும்",
      businessOption: "எனது தயாரிப்பு/வணிகத்தை விளம்பரப்படுத்தவும்",
      selectLanguage: "மொழியை தேர்ந்தெடு"
    },
    bo: {
      title: "हमर प्लेटफॉर्म के कइसे इस्तेमाल करे चाहब?",
      subtitle: "निजी अनुभव खातिर अपन मुख्य लक्ष्य चुनीं",
      influencerOption: "इन्फ्लुएंसर बनके पैसा कमाइए",
      businessOption: "अपन उत्पाद/कारोबार के प्रचार करीं",
      selectLanguage: "भाषा चुनीं"
    }
  };

  useEffect(() => {
    const visited = localStorage.getItem('hasVisitedBefore') === 'true';
    const role = localStorage.getItem('userRole');

    dispatch(setHasVisitedBefore(visited));
    dispatch(setUserRole(role === '2' || role === '3' ? role : null));
  }, []);

  useEffect(() => {
    // Check if user is new (first time visiting) using Redux state
    if (!hasVisitedBefore && hasVisitedBefore !== null) {
      setIsOpen(true);
      // Mark user as having visited using Redux action
      dispatch(setHasVisitedBefore(true));
    }
  }, [hasVisitedBefore, dispatch]);

  const handleSelection = (role: string) => {
    // Dispatch Redux action to set user role
    if (role === 'influencer') {
      dispatch(setUserRole('2'));
    } else if (role === 'business') {
      dispatch(setUserRole('3'));
    }
    
    // Close the popup
    setIsOpen(false);
  };

  const currentText = translations[selectedLanguage];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            
            <div className="p-6">
              <div className="flex flex-col items-center mb-4 relative">
                {/* Centered icon */}
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                {/* Language selector below icon */}
                <div className="absolute top-0 right-0 w-[100px] max-w-xs">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                    className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                    <option value="bh">भोजपुरी (Bhojpuri)</option>
                    <option value="ur">اردو (Urdu)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="bo">भोजपुरी (Bhojpuri)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                {currentText.title}
              </h2>
              <p className="text-gray-500 text-center mb-6">
                {currentText.subtitle}
              </p>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelection('influencer')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
                >
                  <span>{currentText.influencerOption}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelection('business')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md"
                >
                  <span>{currentText.businessOption}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}