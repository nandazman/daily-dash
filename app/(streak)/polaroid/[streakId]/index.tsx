import getDateDiffInDays from "@/helper/getDateDiffInDays";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import Streak from "../../../../type/streak";
import { ThemedView } from "@/components/ThemedView";
import { useStack } from "@/providers/StackProviders";
import { TakePolaroid } from "@/components/polaroid/TakePolaroid";

type StreakWithNote = Omit<Streak, "status"> & {
	action_date: number;
	note: string;
};
export default function PolaroidTakePhoto() {
	const { action } = useStack();
	const { streakId } = useLocalSearchParams();
	const db = useSQLiteContext();

	const [streakData, setStreakData] = useState<StreakWithNote | null>(null);
	const fetchStreak = async () => {
		const streak = await db.getAllAsync<StreakWithNote>(
			`SELECT 
                s.id AS id,
                s.title,
                s.start_date,
                s.current_streak_date,
                sh.note
            FROM 
                streak s
            LEFT JOIN 
                streak_history sh
            ON 
                s.id = sh.streak_id
            WHERE 
                s.id = ${+streakId}
            ORDER BY 
                sh.action_date DESC
            LIMIT 1;`,
		);

		if (!streak[0]) return;
		setStreakData(streak[0]);
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchStreak();
		}, [db]),
	);
	useFocusEffect(
		useCallback(() => {
			action.setNavigationVisibility(false);
			return () => {
				action.setNavigationVisibility(true);
			};
		}, []),
	);

	if (!streakData) return <ThemedView style={styles.container} />;

	const milestone = getDateDiffInDays({
		startDate: streakData.start_date,
		endDate: streakData.current_streak_date,
	});

	return (
		<ThemedView style={styles.container}>
			<TakePolaroid
				streakId={streakData.id}
				note={streakData.note}
				title={streakData.title}
				milestone={milestone}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		height: "100%",
	}
});
