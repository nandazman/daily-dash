import { ComponentProps } from "react";
import { View, StyleSheet } from "react-native";
import ModalWrapper from "./ModalWrapper";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

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
	confirmText = "Confirm",
	children,
}: ConfirmModalProps) {
	return (
		<ModalWrapper visible={visible} title={title} onClose={onClose}>
			<View>
				<ThemedText style={{ marginBottom: 8 }}>{description}</ThemedText>
				{children}
				<View style={styles.buttonContainer}>
					<View style={styles.button}>
						<ThemedButton title="Cancel" type="transparent" onPress={onClose} />
					</View>
					<View style={styles.button}>
						<ThemedButton
							title={confirmText}
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
