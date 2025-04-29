import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Define translations
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      startLesson: 'Start Lesson',
      colorsIsland: 'Colors Island',
      shapesIsland: 'Shapes Island',
    },
  },
  uz: {
    translation: {
      welcome: 'Xush kelibsiz',
      startLesson: 'Darsni boshlash',
      colorsIsland: 'Ranglar oroli',
      shapesIsland: 'Shakllar oroli',
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
