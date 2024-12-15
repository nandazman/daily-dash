import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { PaperProvider } from 'react-native-paper';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<SQLiteProvider databaseName="streak.db" onInit={migrateDbIfNeeded}>
				<PaperProvider>
					<Stack>
						<Stack.Screen name="index" options={{ headerShown: false }} />
						<Stack.Screen name="(streak)" />
						<Stack.Screen name="(check-in)" />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</PaperProvider>
			</SQLiteProvider>
		</ThemeProvider>
	);
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
	const DATABASE_VERSION = 2;
	const result = await db.getFirstAsync<{
    user_version: number;
  }>('PRAGMA user_version');
	const currentDate = new Date();
	let { user_version: currentDbVersion } = result || { user_version: 1 };
	if (currentDbVersion >= DATABASE_VERSION) {
		return;
	}
	if (currentDbVersion === 0) {
		await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS streak (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        start_date INTEGER
      );
    `);
		currentDbVersion = 1;
	}
	if (currentDbVersion === 1) {
		await db.execAsync(`
      ALTER TABLE streak ADD COLUMN current_streak_date INTEGER;
      ALTER TABLE streak ADD COLUMN status TEXT DEFAULT 'active';
    `);

		await db.runAsync(
			'INSERT INTO streak (title, start_date) VALUES (?, ?)',
			'My first streak!',
			currentDate.getTime(),
			currentDate.getTime()
		);
		currentDbVersion = 2;
	}
	await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
