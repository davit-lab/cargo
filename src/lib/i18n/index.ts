import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ka from './locales/ka.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'ka';
  }
  return 'ka';
};

i18n.use(initReactI18next).init({
  resources: {
    ka: { translation: ka },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'ka',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
