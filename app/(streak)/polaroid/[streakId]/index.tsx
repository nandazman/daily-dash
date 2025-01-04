import getDateDiffInDays from "@/helper/getDateDiffInDays";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import Streak from "../../../../type/streak";
import { ThemedView } from "@/components/ThemedView";
import { useStack } from "@/providers/StackProviders";
import { TakePolaroid } from "@/components/polaroid/TakePolaroid";
import { savePhotoToAppStorage } from "@/helper/photoStorge";
import { useTranslation } from "react-i18next";

type StreakWithNote = Omit<Streak, "status"> & {
	action_date: number;
	note: string;
};
export default function PolaroidTakePhoto() {
	const { action } = useStack();
	const { streakId } = useLocalSearchParams();
	const db = useSQLiteContext();
	const { t } = useTranslation();
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
				onSavePhoto={async ({ photoUri, message }) => {
					const path = await savePhotoToAppStorage({
						uri: photoUri,
						fileName: `streak_${streakData.id}_milestone_${milestone}_${Date.now()}.jpg`,
					});
					await db.runAsync(
						`
							INSERT INTO streak_photos (streak_id, milestone, photo_url, added_date, message)
							VALUES (?, ?, ?, ?, ?)
										`,
						streakData.id,
						milestone,
						path,
						Date.now(),
						message,
					);
				}}
				onFinish={() => {
					router.push("/(streak)");
				}}
				initMessage={`${t("polaroid.initMessage", {
					title: streakData.title,
					milestone,
				})}${streakData.note ? ` ${streakData.note}` : ""}`}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		height: "100%",
	},
});
