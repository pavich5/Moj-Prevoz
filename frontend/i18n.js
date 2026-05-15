import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import mk from '../frontend/app/locales/mk.json';
import en from '../frontend/app/locales/en.json';

const initLanguage = async () => {
  if (Platform.OS !== 'web') {
    // AsyncStorage is only available in React Native (not on the web)
    const savedLanguage = await AsyncStorage.getItem('language');
    return savedLanguage || 'mk';
  } else {
    // Fallback for web or other environments
    return 'mk';
  }
};

const setupI18n = async () => {
  const languageToUse = await initLanguage();
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        mk: { translation: mk },
        en: { translation: en },
      },
      lng: languageToUse,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

setupI18n();

export default i18n;
