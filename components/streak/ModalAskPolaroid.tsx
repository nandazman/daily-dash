import ModalWrapper from "../ui/Modal/ModalWrapper";

import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import Streak from "@/type/streak";
import getDateDiffInDays from "@/helper/getDateDiffInDays";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();
	return (
		<ModalWrapper
			title={t("streak.modalPolaroid.title")}
			visible={visible}
			onClose={onClose}
		>
			<ThemedText>
				{t("streak.modalPolaroid.description", {
					title: streak.title,
					days: daysDiff,
				})}
			</ThemedText>
			<View style={styles.modalActions}>
				<View style={styles.buttonStyle}>
					<ThemedButton
						title={t("streak.modalPolaroid.cancel")}
						onPress={onClose}
						type="transparent"
					/>
				</View>
				<View style={styles.saveButtonContainer}>
					<ThemedButton
						type="confirmation"
						title={t("streak.modalPolaroid.confirm")}
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
