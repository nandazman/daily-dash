import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useNotificationObserver } from "@/hooks/useNotificationObserver";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	useNotificationObserver();

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider
			value={
				colorScheme === "dark"
					? {
						...DarkTheme,
						colors: {
							...DarkTheme.colors,
							background: Colors["dark"].background,
						},
					}
					: DefaultTheme
			}
		>
			<SQLiteProvider databaseName="streak.db" onInit={migrateDbIfNeeded}>
				<PaperProvider>
					<Stack
						screenOptions={{
							headerStyle: {
								backgroundColor: Colors[colorScheme ?? "light"].background,
							},
						}}
					>
						<Stack.Screen name="index" options={{ headerShown: false }} />
						<Stack.Screen name="(streak)" />
						<Stack.Screen name="(habit)" />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</PaperProvider>
			</SQLiteProvider>
		</ThemeProvider>
	);
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
	await db.execAsync(`PRAGMA foreign_keys = ON;`);

	const DATABASE_VERSION = 5;
	const result = await db.getFirstAsync<{
		user_version: number;
	}>("PRAGMA user_version");
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
			"INSERT INTO streak (title, start_date) VALUES (?, ?)",
			"My first streak!",
			currentDate.getTime()
		);
		currentDbVersion = 2;
	}

	if (currentDbVersion === 2) {
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS streak_history (
				id INTEGER PRIMARY KEY NOT NULL,
				streak_id INTEGER NOT NULL,
				action_date INTEGER NOT NULL,
				action_type TEXT NOT NULL,
				note TEXT,
				FOREIGN KEY (streak_id) REFERENCES streak(id) ON DELETE CASCADE
			);
		`);

		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS streak_photos (
				id INTEGER PRIMARY KEY NOT NULL,
				streak_id INTEGER NOT NULL,
				milestone INTEGER NOT NULL,
				photo_url TEXT NOT NULL,
				added_date INTEGER NOT NULL,
				FOREIGN KEY (streak_id) REFERENCES streak(id) ON DELETE CASCADE
			);
		`);
		currentDbVersion = 3;
	}

	if (currentDbVersion === 3) {
		await db.execAsync(`
			ALTER TABLE streak_photos ADD COLUMN message TEXT;
		`);
		currentDbVersion = 4;
	}

	if (currentDbVersion === 4) {
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS habit (
				id INTEGER PRIMARY KEY NOT NULL,
				title TEXT NOT NULL,
				start_date INTEGER,
				last_active_date INTEGER,
				count INTEGER,
				status TEXT DEFAULT 'active'
			);
		`);
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS habit_history (
				id INTEGER PRIMARY KEY NOT NULL,
				habit_id INTEGER NOT NULL,
				action_date INTEGER NOT NULL,
				action_type TEXT NOT NULL,
				note TEXT,
				FOREIGN KEY (habit_id) REFERENCES habit(id) ON DELETE CASCADE
			);
		`);

		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS habit_photos (
				id INTEGER PRIMARY KEY NOT NULL,
				habit_id INTEGER NOT NULL,
				milestone INTEGER NOT NULL,
				photo_url TEXT NOT NULL,
				added_date INTEGER NOT NULL,
				message TEXT,
				FOREIGN KEY (habit_id) REFERENCES habit(id) ON DELETE CASCADE
			);
		`);
		currentDbVersion = 5;
	}
	await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
