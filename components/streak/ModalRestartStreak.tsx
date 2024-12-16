import ConfirmationModal from "@/components/ui/Modal/ConfirmationModal";
import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function ModalRestartStreak({
	visible,
	onClose,
	onConfirm,
}: {
	visible: boolean;
	onClose: () => void;
	onConfirm: (note: string) => void;
}) {
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
			description="Resume streak ?"
			onClose={closeModal}
			onConfirm={confirmStop}
			confirmText="Go!"
		>
			<View style={styles.inputContainer}>
				<TextInput
					editable
					multiline
					numberOfLines={4}
					placeholder="Add a note (optional)"
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
		marginBottom: 10,
		paddingHorizontal: 10,
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
