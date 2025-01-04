import { ComponentProps } from "react";
import { View, StyleSheet } from "react-native";
import ModalWrapper from "./ModalWrapper";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useTranslation } from "react-i18next";

type ConfirmModalProps = {
	visible: boolean;
	title: string;
	onClose: () => void;
	onConfirm: () => void;
	confirmText?: string;
	children?: ComponentProps<"div">["children"];
	description?: string;
};

export default function ConfirmationModal({
	visible,
	title,
	description,
	onClose,
	onConfirm,
	confirmText,
	children,
}: ConfirmModalProps) {
	const { t } = useTranslation();
	return (
		<ModalWrapper visible={visible} title={title} onClose={onClose}>
			<View>
				<ThemedText style={{ marginBottom: 8 }}>{description}</ThemedText>
				{children}
				<View style={styles.buttonContainer}>
					<View style={styles.button}>
						<ThemedButton
							title={t("common.cancel")}
							type="transparent"
							onPress={onClose}
						/>
					</View>
					<View style={styles.button}>
						<ThemedButton
							title={confirmText || t("common.confirm")}
							onPress={onConfirm}
							type="confirmation"
						/>
					</View>
				</View>
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
	},
	button: {
		flex: 1,
		marginHorizontal: 5,
	},
});
