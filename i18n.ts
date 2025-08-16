
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import authTranslations from './i18n.auth';
import generalTranslations from './i18n.general';

const resources = {
  en: {
    translation: {
      ...generalTranslations.en.translation,
      ...authTranslations.en.translation,
    },
  },
  uz: {
    translation: {
      ...generalTranslations.uz.translation,
      ...authTranslations.uz.translation,
    },
  },
  ru: {
    translation: {
      ...generalTranslations.ru.translation,
      ...authTranslations.ru.translation,
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (Localization.getLocales?.() && Localization.getLocales()[0]?.languageCode) || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export { i18n };
