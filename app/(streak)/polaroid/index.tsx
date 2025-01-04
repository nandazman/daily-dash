import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PolaroidView } from "@/components/polaroid/PolaroidView";
import { StreakPhoto } from "@/type/streakPhotos";
import { useTranslation } from "react-i18next";

export default function TabTwoScreen() {
	const db = useSQLiteContext();
	const [streaks, setStreaks] = useState<StreakPhoto[]>([]);
	const { t } = useTranslation();

	useFocusEffect(
		React.useCallback(() => {
			async function setup() {
				const result = await db.getAllAsync<StreakPhoto>(
					"SELECT * FROM streak_photos",
				);
				setStreaks(result);
			}
			setup();
		}, [db]),
	);

	const renderItem = ({ item }: { item: StreakPhoto }) => (
		<PolaroidView message={item.message} uri={item.photo_url} key={item.id} />
	);
	return (
		<ThemedView style={styles.container}>
			<ThemedText style={styles.title}>
				{t("streak.polaroid.heading")}
			</ThemedText>
			{!streaks.length && (
				<ThemedText style={{ paddingHorizontal: 16 }}>
					{t("streak.polaroid.empty")}
				</ThemedText>
			)}

			{streaks.length > 0 && (
				<FlatList
					data={streaks}
					renderItem={renderItem}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		marginBottom: 16,
		paddingBottom: 4,
	},
	container: {
		paddingTop: 16,
		height: "100%",
	},
	scrollContent: {
		paddingBottom: 16,
		rowGap: 16,
		alignItems: "center",
	},
});
