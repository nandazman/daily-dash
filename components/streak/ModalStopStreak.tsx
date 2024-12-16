import ConfirmationModal from "@/components/ui/Modal/ConfirmationModal";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export default function ModalStopStreak({
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
			description="Stop streak ? It will be moved to your history"
			onClose={closeModal}
			onConfirm={confirmStop}
			confirmText="confirmStop!"
		>
			<TextInput
				editable
				multiline
				numberOfLines={4}
				maxLength={40}
				onChangeText={(text) => {
					note.current = text;
				}}
				style={styles.textInput}
			/>
		</ConfirmationModal>
	);
}

const styles = StyleSheet.create({
	textInput: {
		padding: 10,
	},
});
