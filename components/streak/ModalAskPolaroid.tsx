import ModalWrapper from "../ui/Modal/ModalWrapper";

import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import Streak from "@/type/streak";
import getDateDiffInDays from "@/helper/getDateDiffInDays";
import { router } from "expo-router";

export default function ModalAskPolaroid({
	visible,
	onClose,
	streak,
}: {
	visible: boolean;
	onClose: () => void;
	streak: Streak;
}) {
	const daysDiff = getDateDiffInDays({
		startDate: streak.start_date,
		endDate: streak.current_streak_date,
	});
	return (
		<ModalWrapper title="Congratulations!" visible={visible} onClose={onClose}>
			<ThemedText>
				You have been doing {streak.title} for the last {daysDiff} days. Would
				you like to take photo of it ?
			</ThemedText>
			<View style={styles.modalActions}>
				<View style={styles.buttonStyle}>
					<ThemedButton title="Not now" onPress={onClose} type="transparent" />
				</View>
				<View style={styles.saveButtonContainer}>
					<ThemedButton
						type="confirmation"
						title="Take Picture!"
						onPress={() => {
							router.replace(`/(streak)/polaroid/${streak.id}`);
							onClose();
						}}
					/>
				</View>
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	modalActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		columnGap: 8,
		marginTop: 16,
	},

	saveButtonContainer: {
		flex: 1,
	},
	buttonStyle: {
		flex: 1,
	},
});
