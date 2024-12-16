import { useSQLiteContext } from "expo-sqlite";
import { useRef, useState } from "react";
import ModalWrapper from "../ui/Modal/ModalWrapper";

import {
	ActivityIndicator,
	Button,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

export default function ModalConfirmStreak({
	visible,
	onClose,
	onConfirm,
}: {
	visible: boolean;
	onClose: () => void;
	onConfirm: (note: string) => Promise<void>;
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
		<ModalWrapper visible={visible} onClose={closeModal}>
			<Text style={{ fontWeight: 500, marginBottom: 8 }}>
				Streak going great ?
			</Text>
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
						<Button title="Procced!" onPress={updateStreak} />
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
		justifyContent: "flex-end",
		columnGap: 8,
		marginTop: 16,
	},

	saveButtonContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
});
