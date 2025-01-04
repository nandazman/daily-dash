import { useRef, useState } from "react";
import ModalWrapper from "../ui/Modal/ModalWrapper";

import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { ThemedButton } from "../ThemedButton";
import { useTranslation } from "react-i18next";

export default function ModalConfirmStreak({
	visible,
	onClose,
	onConfirm,
}: {
	visible: boolean;
	onClose: () => void;
	onConfirm: (_: string) => Promise<void>;
}) {
	const { t } = useTranslation();
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
		<ModalWrapper
			title={t("streak.modalConfirm.title")}
			visible={visible}
			onClose={closeModal}
		>
			<TextInput
				editable
				multiline
				numberOfLines={4}
				onChangeText={(text) => {
					note.current = text;
				}}
				style={styles.textInput}
				placeholder={t("streak.modalConfirm.placeholder")}
			/>
			<View style={styles.modalActions}>
				<View style={styles.buttonStyle}>
					<ThemedButton
						title={t("common.cancel")}
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
							title={t("streak.modalConfirm.confirm")}
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
		flex: 1,
	},
});
