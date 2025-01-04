import ConfirmationModal from "@/components/ui/Modal/ConfirmationModal";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

export default function ModalStopStreak({
	visible,
	onClose,
	onConfirm,
}: {
	visible: boolean;
	onClose: () => void;
	onConfirm: (_: string) => void;
}) {
	const { t } = useTranslation();
	const note = useRef("");

	const closeModal = () => {
		onClose();
		note.current = "";
	};

	const confirmStop = () => {
		onConfirm(note.current);
		note.current = "";
	};
	return (
		<ConfirmationModal
			visible={visible}
			title={t("streak.modalStop.title")}
			description={t("streak.modalStop.description")}
			onClose={closeModal}
			onConfirm={confirmStop}
			confirmText={t("streak.modalStop.confirm")}
		>
			<View style={styles.inputContainer}>
				<TextInput
					editable
					multiline
					numberOfLines={4}
					placeholder={t("streak.modalStop.placeholder")}
					placeholderTextColor="#666"
					onChangeText={(text) => {
						note.current = text;
					}}
					style={styles.textInput}
				/>
			</View>
		</ConfirmationModal>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		width: "100%",
	},
	textInput: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		minHeight: 100,
		textAlignVertical: "top",
		fontSize: 14,
		color: "#333",
	},
});
