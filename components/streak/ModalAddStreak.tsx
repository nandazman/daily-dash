import ModalWrapper from '@/components/ui/Modal/ModalWrapper';
import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ModalAddStreak({
	visible,
	onClose,
	onFinishSave,
}: {
  visible: boolean;
  onClose: () => void;
  onFinishSave: () => void;
}) {
	const db = useSQLiteContext();
	const streakName = useRef('');
	const [loading, setLoading] = useState(false);
	const closeModal = () => {
		onClose();
		streakName.current = ''
	};
	const handleSave = async () => {
		if (streakName.current.trim() === '') {
			return;
		}
		setLoading(true);
		const currentDate = new Date().getTime();
		try {
			await db.runAsync(
				'INSERT INTO streak (title, start_date, current_streak_date, status) VALUES (?, ?, ?, ?)',
				streakName.current.trim(),
				currentDate,
				currentDate,
				'active'
			);

			onFinishSave();
			streakName.current = '';
			setLoading(false);
		} catch (err) {
			console.error({ err });
		}
	};
	return (
		<ModalWrapper visible={visible} onClose={closeModal}>
			<Text style={styles.modalLabel}>Streak to Break Next!</Text>
			<TextInput
				style={styles.input}
				placeholder="Name of the streak"
				onChangeText={(text) => {
					streakName.current = text;
				}}
			/>
			<View style={styles.modalActions}>
				<Button
					title="Cancel"
					onPress={closeModal}
					color="#888"
					disabled={loading}
				/>
				<View style={styles.saveButtonContainer}>
					{loading ? (
						<ActivityIndicator size="small" color="#000" animating={loading} />
					) : (
						<Button title="Let's Streak!" onPress={handleSave} />
					)}
				</View>
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	saveButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	modalLabel: {
		fontSize: 16,
		marginBottom: 10,
		fontWeight: '600',
		color: '#333',
	},
	input: {
		height: 40,
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 4,
		paddingHorizontal: 8,
		marginBottom: 20,
	},
	modalActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		columnGap: 8,
	},
});