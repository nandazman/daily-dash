import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { FAB, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getDateDiffInDays from "@/helper/getDateDiffInDays";
import { useFocusEffect } from "expo-router";
import { HelloWave } from "@/components/HelloWave";
import Streak from "../../type/streak";
import ModalFailedStreak from "../../components/streak/ModalFailedStreak";
import ModalAddStreak from "../../components/streak/ModalAddStreak";
import checkStreakStatus from "../../helper/streak/checkStreakStatus";
import insertStreakHistory from "../../sql/streak/insertStreakHistory";
import updateStreakFail from "../../sql/streak/updateStreakFail";
import ModalStopStreak from "../../components/streak/ModalStopStreak";
import ModalConfirmStreak from "@/components/streak/ModalConfirmStreak";

export default function Home() {
	const db = useSQLiteContext();
	const [streaks, setStreaks] = useState<Streak[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalConfirmStreak, setModalConfirmStreak] = useState(false);
	const [modalFailed, setModalFailed] = useState(false);
	const [modalConfirmation, setModalConfirmation] = useState(false);
	const selectedStreakId = useRef(0);

	const fetchStreak = async () => {
		const streaks = await db.getAllAsync<Streak>(
			'SELECT * FROM streak WHERE status = "active"',
		);
		console.log({
			test: await db.getAllAsync<Streak>(
				'SELECT * FROM streak_history',
			),
		});
		const updatedStreak = await checkStreakStatus({
			streaks,
			async onUpdateStatus(id) {
				db.withTransactionAsync(async () => {
					await updateStreakFail({ db, id });

					await insertStreakHistory({
						db,
						payload: {
							action_type: "fail",
							streak_id: id,
						},
					});
				});
			},
		});
		setStreaks(updatedStreak);

		if (updatedStreak.some((item) => item.status === "fail")) {
			setModalFailed(true);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchStreak();
			return () => {
				// Do something when the screen is unfocused
				// Useful for cleanup functions
			};
		}, [db]),
	);

	const handleCheckIn = async (note: string) => {
		const today = new Date().getTime();
		const streakId = selectedStreakId.current;
		await db.withTransactionAsync(async () => {
			await db.runAsync(
				"UPDATE streak SET current_streak_date = ? WHERE id = ?",
				[today, streakId],
			);

			await insertStreakHistory({
				db,
				payload: {
					action_type: "increase",
					streak_id: selectedStreakId.current,
					note,
				},
			});
		});

		const result = await db.getAllAsync<Streak>(
			'SELECT * FROM streak WHERE status = "active"',
		);
		setStreaks(result);
		setModalConfirmStreak(false);
	};

	const handleDelete = async (note: string) => {
		const streakId = selectedStreakId.current;
		const query = 'UPDATE streak SET status = "stop" WHERE id = ?';

		await db.withTransactionAsync(async () => {
			await db.runAsync(query, streakId);
			await insertStreakHistory({
				db,
				payload: {
					action_type: "stop",
					streak_id: selectedStreakId.current,
					note,
				},
			});
		});

		setStreaks((prevStreaks) =>
			prevStreaks.filter((streak) => streak.id !== streakId),
		);
		setModalConfirmation(false);
	};

	return (
		<>
			<View style={styles.container}>
				<Text style={styles.title}>
					How does your streak go? <HelloWave />
				</Text>
				{streaks.length === 0 ? (
					<Text style={{ paddingHorizontal: 16 }}>No streaks found</Text>
				) : (
					<View>
						{streaks.map((streak, index) => {
							const daysDiff = getDateDiffInDays({
								startDate: streak.start_date,
								endDate: streak.current_streak_date,
							});
							const isAlreadyUpdate =
								getDateDiffInDays({ startDate: streak.current_streak_date }) <
								1;
							const isActive = streak.status === "active";
							return (
								<View
									style={{
										...styles.streakItemContainer,
										paddingTop: index === 0 ? 0 : undefined,
									}}
									key={streak.id}
								>
									<Text style={{ paddingLeft: 8 }}>{streak.title}</Text>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "flex-end",
											columnGap: 4,
										}}
									>
										<Text style={{ textAlign: "right", marginRight: 4 }}>
											{isActive ? daysDiff.toString() : "FAIL"}
										</Text>
										<Text>
											<IconButton
												icon={() => (
													<MaterialCommunityIcons
														name="plus-circle"
														size={24}
														color={
															isAlreadyUpdate || !isActive ? "#888" : "#4CAF50"
														}
													/>
												)}
												onPress={() => {
													setModalConfirmStreak(true);
													selectedStreakId.current = streak.id;
												}}
												disabled={isAlreadyUpdate || !isActive}
												style={{ margin: 0, padding: 0, width: 24, height: 24 }}
												size={24}
											/>
											<IconButton
												icon={() => (
													<MaterialCommunityIcons
														name="stop-circle"
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
										</Text>
									</View>
								</View>
							);
						})}
					</View>
				)}
			</View>

			<FAB
				style={styles.fab}
				size="small"
				icon="plus"
				onPress={() => {
					setTimeout(() => {
						setModalVisible(true);
					}, 200);
				}}
			/>

			<ModalFailedStreak
				streaks={streaks}
				visible={modalFailed}
				onClose={() => setModalFailed(false)}
			/>
			<ModalAddStreak
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onFinishSave={() => {
					fetchStreak();
					setModalVisible(false);
				}}
			/>
			<ModalStopStreak
				visible={modalConfirmation}
				onClose={() => setModalConfirmation(false)}
				onConfirm={(note: string) => {
					handleDelete(note);
				}}
			/>
			<ModalConfirmStreak
				visible={modalConfirmStreak}
				onClose={() => setModalConfirmStreak(false)}
				onConfirm={async (note: string) => {
					handleCheckIn(note);
				}}
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
		backgroundColor: "#fff",
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
