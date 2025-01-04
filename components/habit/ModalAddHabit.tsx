import ModalWrapper from "@/components/ui/Modal/ModalWrapper";
import { useSQLiteContext } from "expo-sqlite";
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { ThemedButton } from "../ThemedButton";
import { useTranslation } from "react-i18next";

export default function ModalAddHabit({
	visible,
	onClose,
	onFinishSave,
}: {
	visible: boolean;
	onClose: () => void;
	onFinishSave: () => void;
}) {
	const { t } = useTranslation();
	const db = useSQLiteContext();
	const habitName = useRef("");
	const [loading, setLoading] = useState(false);
	const closeModal = () => {
		onClose();
		habitName.current = "";
	};
	const handleSave = async () => {
		if (habitName.current.trim() === "") {
			return;
		}
		setLoading(true);
		const currentDate = new Date().getTime();
		try {
			await db.runAsync(
				"INSERT INTO habit (title, start_date, last_active_date, status, count) VALUES (?, ?, ?, ?, ?)",
				habitName.current.trim(),
				currentDate,
				currentDate,
				"active",
				0,
			);

			onFinishSave();
			habitName.current = "";
			setLoading(false);
		} catch (err) {
			console.error({ err });
		}
	};
	return (
		<ModalWrapper
			visible={visible}
			title="Habit to Create!"
			onClose={closeModal}
		>
			<TextInput
				style={styles.input}
				placeholder={t("habit.modalAdd.title")}
				onChangeText={(text) => {
					habitName.current = text;
				}}
			/>
			<View style={styles.modalActions}>
				<View style={{ flex: 1 }}>
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
							title={t("habit.modalAdd.confirm")}
							onPress={handleSave}
						/>
					)}
				</View>
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	saveButtonContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	input: {
		height: 40,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 4,
		paddingHorizontal: 8,
		marginBottom: 20,
		backgroundColor: "#fff",
	},
	modalActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		columnGap: 8,
	},
});
