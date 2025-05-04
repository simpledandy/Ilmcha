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
      startLesson: 'Start Lesson',
      colorsIsland: 'Colors Island',
      shapesIsland: 'Shapes Island',
      welcomeTales: 'Welcome to Tales',
      parentalZoneTitle: 'For Parents',
      reports: 'Reports',
      blockFunctions: 'Block Features',
      screenTime: 'Manage Screen Time',
      otherDevices: 'Other Devices',
      settings: 'Settings',

      // New translations from signup.tsx
      signupTitle: 'Ready for a new adventure?',
      signupButton: 'Sign Up',
      haveAccount: 'Already have an account? Log In',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
      confirmPasswordPlaceholder: 'Confirm Password',
      allFieldsRequired: 'All fields are required',
      passwordsDontMatch: 'Passwords do not match',
      signupError: 'Error during signup',
      
      // New translations from login.tsx
      loginTitle: 'Welcome back!',
      loginButton: 'Log In',
      noAccount: "Don't have an account? Create one",
      forgotPassword: 'Forgot password?',
      loginError: 'Login error occurred',

      // New translations from onboarding.tsx
      newAccount: 'New Account',
      back: '← Back',
      childNamePlaceholder: "Your child's name",
      childAgePlaceholder: "Your child's age",
      save: 'SAVE',
      logout: 'Log Out',
    },
  },
  uz: {
    translation: {
      welcome: 'Ilmchaga xush kelibsiz!',
      welcomeSubtitle: "Farzandingiz uchun eng yaxshi o'quv platforma",
      login: 'Akkauntim bor',
      signup: 'Akkaunt yaratish',
      startLesson: 'Darsni boshlash',
      colorsIsland: 'Ranglar oroli',
      shapesIsland: 'Shakllar oroli',
      welcomeTales: 'Ertaklarga xush kelibsiz',
      parentalZoneTitle: 'Ota-onalar uchun',
      reports: 'Hisobotlar',
      blockFunctions: 'Funktsiyalarni bloklash',
      screenTime: 'Ekran vaqtini boshqarish',
      otherDevices: 'Boshqa qurilmalar',
      settings: 'Sozlamalar',

      // New translations from signup.tsx
      signupTitle: 'Yangi sarguzashtga tayyormisiz?',
      signupButton: "Ro'yxatdan o'tish",
      haveAccount: "Akkauntingiz bormi? Kiring",
      namePlaceholder: 'Ismingiz',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Parol',
      confirmPasswordPlaceholder: 'Parolni tasdiqlang',
      allFieldsRequired: "Barcha maydonlar to'ldirilishi shart",
      passwordsDontMatch: 'Parollar mos kelmadi',
      signupError: "Ro'yxatdan o'tishda xatolik yuz berdi",

      // New translations from login.tsx
      loginTitle: 'Qaytib kelganingizdan xursandmiz!',
      loginButton: 'Kirish',
      noAccount: "Akkauntingiz yo'qmi? Ro'yxatdan o'ting",
      forgotPassword: 'Parolni unutdingizmi?',
      loginError: 'Login xatoligi yuz berdi',

      // New translations from onboarding.tsx
      newAccount: 'Yangi Hisob',
      back: '← Orqaga',
      childNamePlaceholder: "Farzandingiz ismi",
      childAgePlaceholder: "Farzandingiz yoshi",
      save: 'SAQLASH',
      logout: 'Chiqish',
    },
  },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.startsWith('uz') ? 'uz' : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
