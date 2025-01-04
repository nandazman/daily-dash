import ModalWrapper from "../ui/Modal/ModalWrapper";

import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import { router } from "expo-router";
import Habit from "@/type/habit";

export default function ModalAskPolaroid({
	visible,
	onClose,
	habit,
}: {
	visible: boolean;
	onClose: () => void;
	habit: Habit;
}) {
	return (
		<ModalWrapper title="Congratulations!" visible={visible} onClose={onClose}>
			<ThemedText>
				You have been doing {habit.title} for {habit.count} days. Would you like
				to take photo of it ?
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
							router.replace(`/(habit)/polaroid/${habit.id}`);
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
