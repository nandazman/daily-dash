import ModalWrapper from '@/components/ui/Modal/ModalWrapper';
import Streak from '@/type/streak';
import { Button, ScrollView, Text, View } from 'react-native';

export default function ModalFailedStreak({
	visible,
	onClose,
	streaks,
}: {
  visible: boolean;
  onClose: () => void;
  streaks: Streak[];
}) {
	return (
		<ModalWrapper visible={visible} onClose={onClose}>
			<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        😢 Failed Streaks
			</Text>
			<ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
				{streaks.map((item, index) => (
					<View key={item.id?.toString()} style={{ marginBottom: 8 }}>
						<Text style={{ fontSize: 16 }}>
							{`${index + 1}`}. {item.title}
						</Text>
					</View>
				))}
			</ScrollView>
			<Text style={{ fontSize: 14, marginBottom: 16 }}>
        The above streaks have been inactive for more than 2 days. They will be
        removed from active streaks and added to the history page.
			</Text>
			<Button title="Acknowledge" onPress={onClose} />
		</ModalWrapper>
	);
}
