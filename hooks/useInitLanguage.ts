import { setLanguage, SUPPORTED_LANGUAGES } from '@/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export function useInitLanguage() {
	useEffect(() => {
		const initializeLanguage = async () => {
			try {
				const savedLanguage = await AsyncStorage.getItem('userLanguage');
				if (savedLanguage) {
					await setLanguage(savedLanguage as keyof typeof SUPPORTED_LANGUAGES);
				}
			} catch (error) {
				console.error('Error initializing language:', error);
			}
		};

		initializeLanguage();
	}, []);
}
