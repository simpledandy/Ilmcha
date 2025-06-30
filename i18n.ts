import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Define translations
const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Ilmcha!',
      welcomeSubtitle: 'The best learning platform for your child',
      login: 'I have an account',
      signup: 'Create account',
      parentalZoneTitle: 'For Parents',
      reports: 'Reports',
      blockFunctions: 'Block Features',
      screenTime: 'Manage Screen Time',
      otherDevices: 'Other Devices',
      settings: 'Settings',

      // Auth translations
      signupTitle: 'Ready for a new adventure?',
      signupButton: 'Sign Up',
      haveAccount: 'Already have an account? Log In',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Your email address',
      passwordPlaceholder: 'Your password',
      confirmPasswordPlaceholder: 'Confirm Password',
      allFieldsRequired: 'All fields are required',
      passwordsDontMatch: 'Passwords do not match',
      signupError: 'Error during signup',
      loginTitle: 'Welcome back!',
      loginButton: 'Log In',
      noAccount: "Don't have an account? Create one",
      forgotPassword: 'Forgot password?',
      loginError: 'Login error occurred',
      forgotPasswordTitle: 'Reset Password',
      forgotPasswordSubtitle: 'Enter your email address. We will send you instructions to reset your password.',
      resetPasswordButton: 'Reset Password',
      backToLoginButton: 'Back to Login',
      resetSuccessMessage: 'Password reset instructions have been sent to your email',
      emailRequiredError: 'Email is required',
      resetError: 'An error occurred. Please try again',

      // Onboarding translations
      newAccount: 'New Account',
      back: '← Back',
      childNamePlaceholder: "Your child's name",
      childAgePlaceholder: "Your child's age",
      save: 'SAVE',
      logout: 'Log Out',
      ageGroupLabel: 'Select Age Group',
      ageGroup_2_3: '2-3 years',
      ageGroup_4_5: '4-5 years',
      ageGroup_6_7: '6-7 years',
      ageGroup_7_plus: '7+ years',

      // General UI
      letters: 'LETTERS',
      numbers: 'NUMBERS',
      next: 'NEXT',
      loading: 'Loading...',
      error: 'Error',
      continue: 'Continue',
      complete: 'Complete',
      goBack: 'Go Back',
      cancel: 'Cancel',
      leave: 'Leave',
      congratulations: 'Congratulations!',

      // Island Names and Subtitles
      islandAlphabetTitle: 'Alifboland',
      islandAlphabetSubtitle: 'Alphabet & Basic Words',
      islandBasicsTitle: 'Greetings',
      islandBasicsSubtitle: 'Greetings & Basics',
      islandNumbersTitle: 'Numeria',
      islandNumbersSubtitle: 'Numbers 1-10',
      islandShapesTitle: 'Shapes',
      islandShapesSubtitle: 'Coming Soon',
      islandColorsTitle: 'Colors',
      islandColorsSubtitle: 'Coming Soon',
      islandFamilyTitle: 'Family',
      islandFamilySubtitle: 'Coming Soon',
      islandFoodTitle: 'Food',
      islandFoodSubtitle: 'Coming Soon',
      islandConversationTitle: 'Conversation',
      islandConversationSubtitle: 'Coming Soon',

      // Lessons
      lessonCountingFishTitle: "Let's count fish",
      lessonCountingFishDescription: "Let's count the fish together!",
      lessonDummyTitle: "Coming Soon",
      lessonDummyDescription: "This lesson is not yet available.",

      // Tales
      taleNotFound: "Ertak topilmadi",
    },
  },
  uz: {
    translation: {
      welcome: 'Ilmcha ga xush kelibsiz!',
      welcomeSubtitle: 'Uchun eng yaxshi o`qish platformasi',
      login: 'Mening hisobim bor',
      signup: 'Hisob yaratish',
      parentalZoneTitle: 'Ota-onalar uchun',
      reports: 'Hisobotlar',
      blockFunctions: 'Blok xususiyatlari',
      screenTime: 'Ekranga vaqt boshqarish',
      otherDevices: 'Boshqa qurilmalar',
      settings: 'Sozlamalar',

      // Auth translations
      signupTitle: 'Yangi avazga hazir bo`lishingiz kerakmi?',
      signupButton: 'Ro`yxatdan o`tish',
      haveAccount: 'Hisobingiz bormi? Kirish',
      namePlaceholder: 'Sizning ismingiz',
      emailPlaceholder: 'Elektron pochta',
      passwordPlaceholder: 'Parolingiz',
      confirmPasswordPlaceholder: 'Parolni takrorlash',
      allFieldsRequired: 'Barcha maydonlar talab qilinadi',
      passwordsDontMatch: 'Parollar mos kelmadi',
      signupError: 'Ro`yxatdan o`tishda xatolik',
      loginTitle: 'Qaytib keldingiz!',
      loginButton: 'Kirish',
      noAccount: "Hisobingiz yo`qmi? Yangi yarating",
      forgotPassword: 'Parolni unutdingizmi?',
      loginError: 'Kirishda xatolik yuz berdi',
      forgotPasswordTitle: 'Parolni tiklash',
      forgotPasswordSubtitle: 'Elektron pochta manzilini kiriting. Parolingizni tiklash bo`yicha buyruqlar yuboriladi.',
      resetPasswordButton: 'Parolni tiklash',
      backToLoginButton: 'Kirishga qaytish',
      resetSuccessMessage: 'Parolni tiklash bo`yicha buyruqlar elektron pochtaga yuborildi',
      emailRequiredError: 'Elektron pochta talab qilinadi',
      resetError: 'Xatolik yuz berdi. Iltimos, qayta urinib ko`ring',

      // Onboarding translations
      newAccount: 'Yangi Hisob',
      back: '← Orqaga',
      childNamePlaceholder: "Boshqa ismingiz",
      childAgePlaceholder: "Boshqa yosh",
      save: 'SAQLASH',
      logout: 'Chiqish',
      ageGroupLabel: 'Yosh guruhi tanlash',
      ageGroup_2_3: '2-3 yosh',
      ageGroup_4_5: '4-5 yosh',
      ageGroup_6_7: '6-7 yosh',
      ageGroup_7_plus: '7+ yosh',

      // General UI
      letters: 'Harflar',
      numbers: 'Raqamlar',
      next: 'KEYINGI',
      loading: 'Yuklanmoqda...',
      error: 'Xatolik',
      continue: 'Davom etish',
      complete: 'Tamomlash',
      goBack: 'Orqaga qaytish',
      cancel: 'Bekor qilish',
      leave: 'Qoldirish',
      congratulations: 'Tabriklaymiz!',

      // Island Names and Subtitles
      islandAlphabetTitle: 'Alifboland',
      islandAlphabetSubtitle: 'Alifbo va Asosiy So`zlar',
      islandBasicsTitle: 'Salomlashuvlar',
      islandBasicsSubtitle: 'Salomlashuvlar va Asosiy',
      islandNumbersTitle: 'Numeria',
      islandNumbersSubtitle: 'Raqamlar 1-10',
      islandShapesTitle: 'Shakllar',
      islandShapesSubtitle: 'Keyinroq',
      islandColorsTitle: 'Ranglar',
      islandColorsSubtitle: 'Keyinroq',
      islandFamilyTitle: 'Oila',
      islandFamilySubtitle: 'Keyinroq',
      islandFoodTitle: 'Oziq-ovqat',
      islandFoodSubtitle: 'Keyinroq',
      islandConversationTitle: 'Suhbat',
      islandConversationSubtitle: 'Keyinroq',

      // Lessons
      lessonCountingFishTitle: "Baliqlarni sanaymiz",
      lessonCountingFishDescription: "Keling, birga baliqlarni sanaymiz!",
      lessonDummyTitle: "Tez kunda",
      lessonDummyDescription: "Bu dars hali mavjud emas.",

      // Tales
      taleNotFound: "Ertak topilmadi",
    },
  },
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.startsWith('uz') ? 'uz' : 'en',
  fallbackLng: 'uz',
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
