import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AntDesign } from "@expo/vector-icons";
import { ComponentProps } from "react";
import {
	Dimensions,
	Modal,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Portal } from "react-native-paper";

export default function ModalWrapper({
	visible,
	onClose,
	children,
	title,
}: {
	visible: boolean;
	onClose: () => void;
	children: ComponentProps<"div">["children"];
	title?: string;
}) {
	const backgroundColor = useThemeColor(
		{},
		"modalBackground",
	);
	return (
		<Portal>
			<Modal
				animationType="slide"
				transparent={true}
				visible={visible}
				onRequestClose={onClose}
			>
				<ThemedView style={styles.centeredView}>
					<View style={{ ...styles.modalView, backgroundColor }}>
						<View style={styles.modalHeader}>
							{title && (
								<ThemedText
									style={{ flex: 1 }}
									type="defaultSemiBold"
								>
									{title}
								</ThemedText>
							)}

							<TouchableOpacity onPress={onClose} style={styles.closeButton}>
								<AntDesign
									style={{ marginLeft: "auto", width: 24 }}
									name="close"
									size={24}
									color="#999"
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.modalContent}>{children}</View>
					</View>
				</ThemedView>
			</Modal>
		</Portal>
	);
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	closeButton: {
		padding: 5,
		flex: 1,
		
	},
	modalView: {
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: width * 0.8,
	},
	modalHeader: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	modalContent: {
		width: "100%",
	},
});
