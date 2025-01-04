import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import ConfirmationModal from "@/components/ui/Modal/ConfirmationModal";
import insertHabitHistory from "@/sql/habit/insertHabitHistory";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Habit from "@/type/habit";
import ModalRestartHabit from "@/components/habit/ModalRestartHabit";

export default function TabTwoScreen() {
	const db = useSQLiteContext();
	const [habits, setHabits] = useState<Habit[]>([]);
	const [modalConfirmation, setModalConfirmation] = useState(false);
	const [modalRestart, setModalRestart] = useState(false);
	const selectedHabitId = useRef(0);

	useFocusEffect(
		React.useCallback(() => {
			async function setup() {
				const result = await db.getAllAsync<Habit>(
					'SELECT * FROM habit WHERE status != "active"',
				);
				setHabits(result);
			}
			setup();
		}, [db]),
	);

	const handleDelete = async () => {
		const habitId = selectedHabitId.current;
		await db.runAsync("DELETE FROM habit WHERE id = ?", habitId);

		setHabits((prevHabits) =>
			prevHabits.filter((habit) => habit.id !== habitId),
		);
		setModalConfirmation(false);
	};

	const handleResume = async (note: string) => {
		const currentDate = new Date().getTime();
		const habitId = selectedHabitId.current;
		await db.withTransactionAsync(async () => {
			await db.runAsync(
				"UPDATE habit SET status = ?, start_date = ?, last_active_date = ? WHERE id = ?",
				"active",
				currentDate,
				currentDate,
				habitId,
			);

			await insertHabitHistory({
				db,
				payload: {
					action_type: "restart",
					habit_id: habitId,
					note,
				},
			});
		});

		const result = await db.getAllAsync<Habit>(
			'SELECT * FROM habit WHERE status != "active"',
		);
		setHabits(result);
		setModalRestart(false);
	};
	return (
		<ThemedView style={styles.container}>
			<ThemedText style={styles.title}>Your habit history!</ThemedText>
			{habits.length === 0 ? (
				<ThemedText style={{ paddingHorizontal: 16 }}>
					No habits found
				</ThemedText>
			) : (
				<View>
					{habits.map((habit, index) => {
						return (
							<View
								style={{
									...styles.habitItemContainer,
									paddingTop: index === 0 ? 0 : undefined,
								}}
								key={habit.id}
							>
								<ThemedText style={{ paddingLeft: 8 }}>
									{habit.title}
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
										{habit.count}
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
												selectedHabitId.current = habit.id;
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
												selectedHabitId.current = habit.id;
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
			<ModalRestartHabit
				visible={modalRestart}
				onClose={() => setModalRestart(false)}
				onConfirm={(note: string) => {
					handleResume(note);
				}}
			/>
			<ConfirmationModal
				visible={modalConfirmation}
				title="Remove habit ?"
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
	habitItemContainer: {
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		marginBottom: 10,
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
	},
});
