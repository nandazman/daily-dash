import { ThemedText } from "@/components/ThemedText";
import { AntDesign } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import ModalWrapper from "./ModalWrapper";

type ModalSuccessProps = {
	visible: boolean;
	onClose: () => void;
	message?: string;
	children?: ComponentProps<"div">["children"];
};

export default function ModalSuccess({
	visible,
	onClose,
	message = "Success!",
	children,
}: ModalSuccessProps) {
	return (
		<ModalWrapper visible={visible} onClose={onClose}>
			<View style={styles.container}>
				<View style={styles.iconContainer}>
					<AntDesign name="checkcircle" size={64} color="#4CAF50" />
				</View>

				<ThemedText style={styles.message} type="defaultSemiBold">
					{message}
				</ThemedText>

				{children && <View style={styles.childrenContainer}>{children}</View>}
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingVertical: 20,
	},
	iconContainer: {
		marginBottom: 16,
	},
	message: {
		fontSize: 18,
		textAlign: "center",
	},
	childrenContainer: {
		width: "100%",
		alignItems: "center",
		marginTop: 16,
	},
});
