import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useStack } from "@/providers/StackProviders";
import { TakePolaroid } from "@/components/polaroid/TakePolaroid";
import Habit from "@/type/habit";
import { savePhotoToAppStorage } from "@/helper/photoStorge";
import { useTranslation } from "react-i18next";

type HabitWithNote = Omit<Habit, "status"> & {
	action_date: number;
	note: string;
};
export default function PolaroidTakePhoto() {
	const { action } = useStack();
	const { habitId } = useLocalSearchParams();
	const db = useSQLiteContext();
	const { t } = useTranslation();
	const [habitData, setHabitData] = useState<HabitWithNote | null>(null);
	const fetchHabit = async () => {
		const habit = await db.getAllAsync<HabitWithNote>(
			`SELECT 
                h.id AS id,
                h.title,
                h.start_date,
                h.count,
                hh.note
            FROM 
                habit h
            LEFT JOIN 
                habit_history hh
            ON 
                h.id = hh.habit_id
            WHERE 
                h.id = ${+habitId}
            ORDER BY 
                hh.action_date DESC
            LIMIT 1;`,
		);

		if (!habit[0]) return;
		setHabitData(habit[0]);
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchHabit();
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
	
	if (!habitData) return <ThemedView style={styles.container} />;

	const milestone = habitData.count;

	return (
		<ThemedView style={styles.container}>
			<TakePolaroid
				initMessage={`${t("polaroid.initMessage", {
					title: habitData.title,
					milestone,
				})}${habitData.note ? ` ${habitData.note}` : ""}`}
				onSavePhoto={async ({ photoUri, message }) => {
					const path = await savePhotoToAppStorage({
						uri: photoUri,
						fileName: `habit_${habitData.id}_milestone_${milestone}_${Date.now()}.jpg`,
					});
					await db.runAsync(
						`
							INSERT INTO habit_photos (habit_id, milestone, photo_url, added_date, message)
							VALUES (?, ?, ?, ?, ?)
						`,
						habitData.id,
						milestone,
						path,
						Date.now(),
						message,
					);
				}}
				onFinish={() => {
					router.push("/(habit)");
				}}
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
