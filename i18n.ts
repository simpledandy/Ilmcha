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
