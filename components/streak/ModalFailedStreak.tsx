import ModalWrapper from "@/components/ui/Modal/ModalWrapper";
import Streak from "@/type/streak";
import { ScrollView, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";

export default function ModalFailedStreak({
	visible,
	onClose,
	streaks,
}: {
	visible: boolean;
	onClose: () => void;
	streaks: Streak[];
}) {
	const failedStreak = streaks.filter((item) => item.status !== "active");
	return (
		<ModalWrapper
			visible={visible}
			onClose={onClose}
			title={`😢 ${failedStreak.length} Failed Streaks`}
		>
			<ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
				{failedStreak.map((item, index) => (
					<View key={item.id?.toString()} style={{ marginBottom: 8 }}>
						<ThemedText>
							{`${index + 1}`}. {item.title}
						</ThemedText>
					</View>
				))}
			</ScrollView>
			<ThemedText style={{ marginBottom: 16 }}>
				The above streaks have been inactive for more than 2 days. They will be
				removed from active streaks and added to the history page.
			</ThemedText>
			<ThemedButton type="info" onPress={onClose} title="Acknowledge" />
		</ModalWrapper>
	);
}
