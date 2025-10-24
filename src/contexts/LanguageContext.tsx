import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort by',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.findRide': 'Find a Ride',
    'nav.offerRide': 'Offer a Ride',
    'nav.myTrips': 'My Trips',
    'nav.messages': 'Messages',
    'nav.payments': 'Payments',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Trip
    'trip.from': 'From',
    'trip.to': 'To',
    'trip.date': 'Date',
    'trip.time': 'Time',
    'trip.type': 'Trip Type',
    'trip.wasel': 'Wasel (One-way)',
    'trip.raje3': 'Raje3 (Return)',
    'trip.price': 'Price',
    'trip.seats': 'Seats',
    'trip.availableSeats': 'Available Seats',
    'trip.status': 'Status',
    'trip.driver': 'Driver',
    'trip.passenger': 'Passenger',
    'trip.request': 'Request to Join',
    'trip.accept': 'Accept',
    'trip.reject': 'Reject',
    'trip.cancel': 'Cancel Trip',
    
    // Profile
    'profile.edit': 'Edit Profile',
    'profile.bio': 'Bio',
    'profile.rating': 'Rating',
    'profile.trips': 'Trips',
    'profile.verification': 'Verification',
    'profile.preferences': 'Preferences',
    'profile.emergencyContacts': 'Emergency Contacts',
    
    // Verification
    'verify.verified': 'Verified',
    'verify.pending': 'Pending',
    'verify.notVerified': 'Not Verified',
    'verify.id': 'ID Verification',
    'verify.phone': 'Phone Verification',
    'verify.email': 'Email Verification',
    'verify.license': 'Driver License',
    
    // Review
    'review.rate': 'Rate Your Experience',
    'review.submit': 'Submit Review',
    'review.comment': 'Comment',
    'review.punctuality': 'Punctuality',
    'review.cleanliness': 'Cleanliness',
    'review.communication': 'Communication',
    
    // Safety
    'safety.sos': 'Emergency SOS',
    'safety.shareTrip': 'Share Trip',
    'safety.emergencyContacts': 'Emergency Contacts',
    
    // Payments
    'payment.method': 'Payment Method',
    'payment.card': 'Credit/Debit Card',
    'payment.cash': 'Cash',
    'payment.wallet': 'Wallet',
    'payment.history': 'Transaction History',
    'payment.pending': 'Pending',
    'payment.completed': 'Completed',
    'payment.failed': 'Failed',
    
    // Messages
    'message.send': 'Send',
    'message.typing': 'typing...',
    'message.online': 'Online',
    'message.offline': 'Offline',
  },
  ar: {
    // Common
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب حسب',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.close': 'إغلاق',
    'common.confirm': 'تأكيد',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.findRide': 'ابحث عن رحلة',
    'nav.offerRide': 'اعرض رحلة',
    'nav.myTrips': 'رحلاتي',
    'nav.messages': 'الرسائل',
    'nav.payments': 'المدفوعات',
    'nav.settings': 'الإعدادات',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    
    // Trip
    'trip.from': 'من',
    'trip.to': 'إلى',
    'trip.date': 'التاريخ',
    'trip.time': 'الوقت',
    'trip.type': 'نوع الرحلة',
    'trip.wasel': 'واصل (ذهاب فقط)',
    'trip.raje3': 'راجع (ذهاب وعودة)',
    'trip.price': 'السعر',
    'trip.seats': 'المقاعد',
    'trip.availableSeats': 'المقاعد المتاحة',
    'trip.status': 'الحالة',
    'trip.driver': 'السائق',
    'trip.passenger': 'الراكب',
    'trip.request': 'طلب الانضمام',
    'trip.accept': 'قبول',
    'trip.reject': 'رفض',
    'trip.cancel': 'إلغاء الرحلة',
    
    // Profile
    'profile.edit': 'تعديل الملف الشخصي',
    'profile.bio': 'نبذة',
    'profile.rating': 'التقييم',
    'profile.trips': 'الرحلات',
    'profile.verification': 'التحقق',
    'profile.preferences': 'التفضيلات',
    'profile.emergencyContacts': 'جهات الاتصال الطارئة',
    
    // Verification
    'verify.verified': 'موثق',
    'verify.pending': 'قيد المراجعة',
    'verify.notVerified': 'غير موثق',
    'verify.id': 'التحقق من الهوية',
    'verify.phone': 'التحقق من الهاتف',
    'verify.email': 'التحقق من البريد الإلكتروني',
    'verify.license': 'رخصة القيادة',
    
    // Review
    'review.rate': 'قيّم تجربتك',
    'review.submit': 'إرسال التقييم',
    'review.comment': 'تعليق',
    'review.punctuality': 'الالتزام بالوقت',
    'review.cleanliness': 'النظافة',
    'review.communication': 'التواصل',
    
    // Safety
    'safety.sos': 'نداء الطوارئ',
    'safety.shareTrip': 'مشاركة الرحلة',
    'safety.emergencyContacts': 'جهات الاتصال الطارئة',
    
    // Payments
    'payment.method': 'طريقة الدفع',
    'payment.card': 'بطاقة ائتمان/خصم',
    'payment.cash': 'نقداً',
    'payment.wallet': 'المحفظة',
    'payment.history': 'سجل المعاملات',
    'payment.pending': 'معلق',
    'payment.completed': 'مكتمل',
    'payment.failed': 'فشل',
    
    // Messages
    'message.send': 'إرسال',
    'message.typing': 'يكتب...',
    'message.online': 'متصل',
    'message.offline': 'غير متصل',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('wassel_language');
    return (stored as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('wassel_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL: language === 'ar',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
