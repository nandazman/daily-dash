import getDateDiffInDays from "@/helper/getDateDiffInDays";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import Streak from "../../../type/streak";
import ConfirmationModal from "@/components/ui/Modal/ConfirmationModal";
import insertStreakHistory from "@/sql/streak/insertStreakHistory";
import ModalRestartStreak from "@/components/streak/ModalRestartStreak";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
	const db = useSQLiteContext();
	const [streaks, setStreaks] = useState<Streak[]>([]);
	const [modalConfirmation, setModalConfirmation] = useState(false);
	const [modalRestart, setModalRestart] = useState(false);
	const selectedStreakId = useRef(0);

	useFocusEffect(
		React.useCallback(() => {
			async function setup() {
				const result = await db.getAllAsync<Streak>(
					'SELECT * FROM streak WHERE status != "active"',
				);
				setStreaks(result);
			}
			setup();
			return () => {
				// Do something when the screen is unfocused
				// Useful for cleanup functions
			};
		}, [db]),
	);

	const handleDelete = async () => {
		const streakId = selectedStreakId.current;
		await db.runAsync("DELETE FROM streak WHERE id = ?", streakId);

		setStreaks((prevStreaks) =>
			prevStreaks.filter((streak) => streak.id !== streakId),
		);
		setModalConfirmation(false);
	};

	const handleResume = async (note: string) => {
		const currentDate = new Date().getTime();
		const streakId = selectedStreakId.current;
		console.log({ note })
		await db.withTransactionAsync(async () => {
			await db.runAsync(
				"UPDATE streak SET status = ?, start_date = ?, current_streak_date = ? WHERE id = ?",
				"active",
				currentDate,
				currentDate,
				streakId,
			);

			await insertStreakHistory({
				db,
				payload: {
					action_type: "restart",
					streak_id: streakId,
					note,
				},
			});
		});

		const result = await db.getAllAsync<Streak>(
			'SELECT * FROM streak WHERE status != "active"',
		);
		setStreaks(result);
		setModalRestart(false);
	};
	return (
		<ThemedView style={styles.container}>
			<ThemedText style={styles.title}>Your history streak!</ThemedText>
			{streaks.length === 0 ? (
				<ThemedText style={{ paddingHorizontal: 16 }}>
					No streaks found
				</ThemedText>
			) : (
				<View>
					{streaks.map((streak, index) => {
						const daysDiff = getDateDiffInDays({
							startDate: streak.start_date,
							endDate: streak.current_streak_date,
						});
						return (
							<View
								style={{
									...styles.streakItemContainer,
									paddingTop: index === 0 ? 0 : undefined,
								}}
								key={streak.id}
							>
								<ThemedText style={{ paddingLeft: 8 }}>
									{streak.title}
								</ThemedText>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "flex-end",
										columnGap: 4,
									}}
								>
									<ThemedText style={{ textAlign: "right", marginRight: 4 }}>
										{`${daysDiff.toString()}`}
									</ThemedText>
									<ThemedText>
										<IconButton
											icon={() => (
												<MaterialCommunityIcons
													name="restart"
													size={24}
													color="#4CAF50"
												/>
											)}
											onPress={() => {
												selectedStreakId.current = streak.id;
												setModalRestart(true);
											}}
											style={{ margin: 0, padding: 0, width: 24, height: 24 }}
											size={24}
										/>
										<IconButton
											icon={() => (
												<MaterialCommunityIcons
													name="delete"
													size={24}
													color="#f28585"
												/>
											)}
											onPress={() => {
												setModalConfirmation(true);
												selectedStreakId.current = streak.id;
											}}
											style={{ margin: 0, padding: 0, width: 24, height: 24 }}
											size={24}
										/>
									</ThemedText>
								</View>
							</View>
						);
					})}
				</View>
			)}
			<ModalRestartStreak
				visible={modalRestart}
				onClose={() => setModalRestart(false)}
				onConfirm={(note: string) => {
					handleResume(note);
				}}
			/>
			<ConfirmationModal
				visible={modalConfirmation}
				title="Remove streak ?"
				description="You can't restore it"
				onClose={() => setModalConfirmation(false)}
				onConfirm={() => {
					handleDelete();
				}}
				confirmText="Delete!"
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		paddingBottom: 4,
		marginBottom: 16,
	},
	container: {
		paddingTop: 16,
		height: "100%",
	},
	streakItemContainer: {
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		marginBottom: 10,
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
	},
});
