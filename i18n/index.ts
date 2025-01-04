import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en.json';
import id from './translations/id.json';

export const SUPPORTED_LANGUAGES = {
	en: 'English',
	id: 'Indonesia',
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

const loadedLanguages: Record<string, boolean> = { en: true };

i18next
	.use(initReactI18next)
	.init({
		resources: {
			en: {
				translation: en
			},
			id: {
				translation: id
			}
		},
		lng: Localization.locale,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false
		},
		defaultNS: 'translation'
	});


export const loadLanguage = async (langCode: LanguageCode): Promise<boolean> => {
	try {
		if (loadedLanguages[langCode]) {
			return true;
		}

		const cachedTranslations = await AsyncStorage.getItem(`translations_${langCode}`);
		if (cachedTranslations) {
			await i18next.addResourceBundle(langCode, 'translation', JSON.parse(cachedTranslations));
			loadedLanguages[langCode] = true;
			return true;
		}

		const response = await fetch(`https://your-api.com/translations/${langCode}.json`);
		const translations = await response.json();
    
		await AsyncStorage.setItem(`translations_${langCode}`, JSON.stringify(translations));
    
		await i18next.addResourceBundle(langCode, 'translation', translations);
		loadedLanguages[langCode] = true;
    
		return true;
	} catch (error) {
		console.error('Error loading language:', error);
		return false;
	}
};

export const setLanguage = async (langCode: LanguageCode): Promise<void> => {
	// TODO: for now all translation already on local
	// if (langCode !== 'en') {
	// 	await loadLanguage(langCode);
	// }
	await i18next.changeLanguage(langCode);
	await AsyncStorage.setItem('userLanguage', langCode);
};


export const formatters = {
	number: (value: number, options: Intl.NumberFormatOptions = {}): string => {
		return new Intl.NumberFormat(i18next.language, options).format(value);
	},

	currency: (value: number): string => {
		return new Intl.NumberFormat(i18next.language, {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	},

	date: (value: Date | number | string, options: Intl.DateTimeFormatOptions = {}): string => {
		return new Intl.DateTimeFormat(i18next.language, options).format(new Date(value));
	},

	relativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit): string => {
		return new Intl.RelativeTimeFormat(i18next.language, { numeric: 'auto' })
			.format(value, unit);
	}
};