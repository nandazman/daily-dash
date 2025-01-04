import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
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
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ModalAskPolaroid from "@/components/streak/ModalAskPolaroid";
import { useStreakNotification } from "@/hooks/useStreakNotification";

export default function Home() {
	const db = useSQLiteContext();
	const [streaks, setStreaks] = useState<Streak[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalConfirmStreak, setModalConfirmStreak] = useState(false);
	const [modalFailed, setModalFailed] = useState(false);
	const [modalConfirmation, setModalConfirmation] = useState(false);
	const [modalConfirmPhoto, setModalConfirmPhoto] = useState(false);
	const [selectedStreak, setSelectedStreak] = useState<Streak | null>(null);
	const selectedStreakId = useRef(0);
	const { createNotification, removeNotification } = useStreakNotification();

	const fetchStreak = async () => {
		const streaks = await db.getAllAsync<Streak>(
			'SELECT * FROM streak WHERE status = "active"',
		);
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
		const failedStreak = updatedStreak.filter((item) => item.status === "fail");
		if (failedStreak.length > 0) {
			setModalFailed(true);
		}

		if (updatedStreak.length === failedStreak.length) {
			createNotification();
		} else {
			removeNotification();
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchStreak();
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

		const streak = result.find((item) => item.id === streakId);
		if (streak) {
			const daysDiff = getDateDiffInDays({
				startDate: streak.start_date,
				endDate: streak.current_streak_date,
			});

			if (daysDiff % 5 === 0) {
				setModalConfirmPhoto(true);
				setSelectedStreak(streak);
				return;
			}
		}
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

		setStreaks((prevStreaks) => {
			const newStreak = prevStreaks.filter((streak) => streak.id !== streakId);

			if (newStreak.length === 0) {
				removeNotification();
			}
			return newStreak;
		});
		setModalConfirmation(false);
	};

	return (
		<>
			<ThemedView style={styles.container}>
				<ThemedText style={styles.title}>
					How does your streak go? <HelloWave />
				</ThemedText>
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
											{isActive ? daysDiff.toString() : "FAIL"}
										</ThemedText>
										<ThemedText>
											<IconButton
												icon={() => (
													<MaterialCommunityIcons
														name="plus-circle"
														size={20}
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
														size={20}
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
			</ThemedView>

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
			{!!selectedStreak && (
				<ModalAskPolaroid
					visible={modalConfirmPhoto}
					onClose={() => {
						setModalConfirmPhoto(false);
						setSelectedStreak(null);
					}}
					streak={selectedStreak}
				/>
			)}
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
