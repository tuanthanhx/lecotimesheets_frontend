import { createI18n } from 'vue-i18n';
import en from './en.json';
import vi from './vi.json';

const messages = {
  en,
  vi,
};

const savedLanguage = localStorage.getItem('language') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages,
});

export default i18n;
