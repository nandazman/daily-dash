import ModalWrapper from "@/components/ui/Modal/ModalWrapper";
import Streak from "@/type/streak";
import { ScrollView, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();
	return (
		<ModalWrapper
			visible={visible}
			onClose={onClose}
			title={t("streak.modalFailed.title", { count: failedStreak.length })}
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
				{t("streak.modalFailed.text")}
			</ThemedText>
			<ThemedButton type="info" onPress={onClose} title="Acknowledge" />
		</ModalWrapper>
	);
}
