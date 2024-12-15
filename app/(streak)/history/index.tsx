import getDateDiffInDays from '@/helper/getDateDiffInDays';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Streak from '../../../type/streak';
import ConfirmationModal from '@/components/ui/Modal/ConfirmationModal';

export default function TabTwoScreen() {
	const db = useSQLiteContext();
	const [streaks, setStreaks] = useState<Streak[]>([]);
	const [modalConfirmation, setModalConfirmation] = useState(false);
	const selectedStreakId = useRef(0);

	useFocusEffect(
		React.useCallback(() => {
			async function setup() {
				const result = await db.getAllAsync<Streak>(
					'SELECT * FROM streak WHERE status != "active"'
				);
				setStreaks(result);
			}
			setup();
			return () => {
				// Do something when the screen is unfocused
				// Useful for cleanup functions
			};
		}, [db])
	);

	const handleDelete = async () => {
		const streakId = selectedStreakId.current;
		await db.runAsync('DELETE FROM streak WHERE id = ?', streakId);

		// Remove from state without making additional calls to the database
		setStreaks((prevStreaks) =>
			prevStreaks.filter((streak) => streak.id !== streakId)
		);
		setModalConfirmation(false);
	};
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Your history streak!</Text>
			{streaks.length === 0 ? (
				<Text style={{ paddingHorizontal: 16 }}>No streaks found</Text>
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
								<Text style={{ paddingLeft: 8 }}>{streak.title}</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'flex-end',
										columnGap: 4,
									}}
								>
									<Text style={{ textAlign: 'right', marginRight: 4 }}>
										{`${daysDiff.toString()}`}
									</Text>
									<Text>
										<IconButton
											icon={() => (
												<MaterialCommunityIcons
													name="restart"
													size={24}
													color="#4CAF50"
												/>
											)}
											onPress={async () => {
												const currentDate = new Date().getTime();
												await db.runAsync(
													'UPDATE streak SET status = ?, start_date = ?, current_streak_date = ? WHERE id = ?',
													'active',
													currentDate,
													currentDate,
													streak.id
												);

												// Fetch and update streaks after the operation
												const result = await db.getAllAsync<Streak>(
													'SELECT * FROM streak WHERE status != "active"'
												);
												setStreaks(result);
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
									</Text>
								</View>
							</View>
						);
					})}
				</View>
			)}
			<ConfirmationModal
				visible={modalConfirmation}
				description="Remove streak ? You can't restore it"
				onClose={() => setModalConfirmation(false)}
				onConfirm={() => {
					handleDelete();
				}}
				confirmText="Delete!"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingBottom: 4,
		marginBottom: 16,
	},
	container: {
		paddingTop: 16,
		backgroundColor: '#fff',
		height: '100%',
	},
	streakItemContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		marginBottom: 10,
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 8,
	},
});
