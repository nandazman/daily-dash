import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { FAB, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getDateDiffInDays from "@/helper/getDateDiffInDays";
import { useFocusEffect } from "expo-router";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Habit from "@/type/habit";
import ModalAddHabit from "@/components/habit/ModalAddHabit";
import insertHabitHistory from "@/sql/habit/insertHabitHistory";
import ModalConfirmHabit from "@/components/habit/ModalConfirmHabit";
import ModalStopHabit from "@/components/habit/ModalStopHabit";
import { useHabitNotification } from "@/hooks/useHabitNotification";
import ModalAskPolaroid from "@/components/habit/ModalAskPolaroid";

export default function HabitHome() {
	const db = useSQLiteContext();
	const [habits, setHabit] = useState<Habit[]>([]);
	const [isShowModalAdd, setShowModalAdd] = useState(false);
	const [isShowModalConfirm, setShowModalConfirm] = useState(false);
	const [isShowModalDelte, setShowModalDelete] = useState(false);
	const [isShowAskPolaroid, setShowAskPolaroid] = useState(false);
	const { createNotification, removeNotification } = useHabitNotification();
	const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
	const selectedHabitId = useRef(0);

	const fetchHabit = async () => {
		const habits = await db.getAllAsync<Habit>(
			'SELECT * FROM habit WHERE status = "active"',
		);
		if (habits.length > 0) {
			createNotification();
		} else {
			removeNotification();
		}
		setHabit(habits);
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchHabit();
		}, [db]),
	);

	const handleCheckIn = async (note: string) => {
		const today = new Date().getTime();
		const habitId = selectedHabitId.current;
		const selectedHabit = habits.find((item) => item.id === habitId);

		if (!selectedHabit) return;
		await db.withTransactionAsync(async () => {
			await db.runAsync(
				"UPDATE habit SET last_active_date = ?, count = ? WHERE id = ?",
				[today, selectedHabit.count + 1, habitId],
			);
			await insertHabitHistory({
				db,
				payload: {
					action_type: "increase",
					habit_id: habitId,
					note,
				},
			});
		});

		fetchHabit();
		setShowModalConfirm(false);
		selectedHabit.count += 1;
		if (selectedHabit.count % 5 === 0) {
			setShowAskPolaroid(true);
			setSelectedHabit(selectedHabit);
			return;
		}
	};

	const handleDelete = async (note: string) => {
		const habitId = selectedHabitId.current;
		const query = 'UPDATE habit SET status = "stop" WHERE id = ?';
		try {
			await db.withTransactionAsync(async () => {
				await db.runAsync(query, habitId);
				await insertHabitHistory({
					db,
					payload: {
						action_type: "stop",
						habit_id: habitId,
						note,
					},
				});
			});
		} catch (err) {
			console.error({ err });
		}
		fetchHabit();
		setShowModalDelete(false);
	};

	return (
		<>
			<ThemedView style={styles.container}>
				<ThemedText style={styles.title}>
					How is your habits going? <HelloWave />
				</ThemedText>
				{habits.length === 0 ? (
					<ThemedText style={{ paddingHorizontal: 16 }}>
						No habits found
					</ThemedText>
				) : (
					<View>
						{habits.map((habit, index) => {
							const isAlreadyUpdate =
								getDateDiffInDays({ startDate: habit.last_active_date }) < 1;
							return (
								<View
									style={{
										...styles.streakItemContainer,
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
														name="plus-circle"
														size={20}
														color={isAlreadyUpdate ? "#888" : "#4CAF50"}
													/>
												)}
												onPress={() => {
													setShowModalConfirm(true);
													selectedHabitId.current = habit.id;
												}}
												disabled={isAlreadyUpdate}
												style={{ margin: 0, padding: 0, width: 24, height: 24 }}
												size={24}
											/>
											<IconButton
												icon={() => (
													<MaterialCommunityIcons
														name="stop-circle"
														size={20}
														color="#f28585"
													/>
												)}
												onPress={() => {
													setShowModalDelete(true);
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
			</ThemedView>

			<FAB
				style={styles.fab}
				size="small"
				icon="plus"
				onPress={() => {
					setTimeout(() => {
						setShowModalAdd(true);
					}, 200);
				}}
			/>
			<ModalAddHabit
				onClose={() => {
					setShowModalAdd(false);
				}}
				visible={isShowModalAdd}
				onFinishSave={() => {
					fetchHabit();
					setShowModalAdd(false);
				}}
			/>
			{!!selectedHabit && (
				<ModalAskPolaroid
					habit={selectedHabit}
					onClose={() => {
						setSelectedHabit(null);
						setShowAskPolaroid(false);
					}}
					visible={isShowAskPolaroid}
				/>
			)}

			<ModalConfirmHabit
				visible={isShowModalConfirm}
				onClose={() => {
					setShowModalConfirm(false);
				}}
				onConfirm={handleCheckIn}
			/>
			<ModalStopHabit
				visible={isShowModalDelte}
				onClose={() => {
					setShowModalDelete(false);
				}}
				onConfirm={handleDelete}
			/>
		</>
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
	fab: {
		position: "absolute",
		left: "50%",
		transform: [{ translateX: -28 }],
		bottom: 16,
		backgroundColor: "#fff",
		borderRadius: 50,
		padding: 4,
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
