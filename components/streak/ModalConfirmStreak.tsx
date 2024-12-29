
import { useRef, useState } from "react";
import ModalWrapper from "../ui/Modal/ModalWrapper";

import {
	ActivityIndicator,
	Button,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";

export default function ModalConfirmStreak({
	visible,
	onClose,
	onConfirm,
}: {
	visible: boolean;
	onClose: () => void;
	onConfirm: (_: string) => Promise<void>;
}) {
	const note = useRef("");
	const [loading, setLoading] = useState(false);
	const closeModal = () => {
		onClose();
		note.current = "";
	};

	const updateStreak = async () => {
		setLoading(true);
		await onConfirm(note.current);
		note.current = "";
		setLoading(false);
	};

	return (
		<ModalWrapper title="Going Great ?" visible={visible} onClose={closeModal}>
			<TextInput
				editable
				multiline
				numberOfLines={4}
				onChangeText={(text) => {
					note.current = text;
				}}
				style={styles.textInput}
				placeholder="Optional"
			/>
			<View style={styles.modalActions}>
				<View style={styles.buttonStyle}>
					<ThemedButton
						title="Cancel"
						onPress={closeModal}
						disabled={loading}
						type="transparent"
					/>
				</View>
				<View style={styles.saveButtonContainer}>
					{loading ? (
						<ActivityIndicator size="small" color="#000" animating={loading} />
					) : (
						<ThemedButton
							type="confirmation"
							title="Procced!"
							onPress={updateStreak}
						/>
					)}
				</View>
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
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
		flex: 1
	}
});
