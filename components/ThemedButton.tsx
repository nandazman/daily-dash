import React from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	type TouchableOpacityProps,
	useColorScheme,
} from "react-native";

export type ThemedButtonProps = TouchableOpacityProps & {
	type?:
		| "default"
		| "success"
		| "danger"
		| "transparent"
		| "info"
		| "confirmation";
	title: string;
};

export const Colors = {
	light: {
		button: {
			default: {
				background: "#FFFFFF",
				text: "#1F2933",
			},
			success: {
				background: "#4CAF50",
				text: "#FFFFFF",
			},
			danger: {
				background: "#F44336",
				text: "#FFFFFF",
			},
			info: {
				background: "#2196F3",
				text: "#FFFFFF",
			},
			transparent: {
				background: "transparent",
				text: "#1F2933",
			},
			confirmation: {
				background: "#8BC34A", // Light green color for confirmation
				text: "#FFFFFF", // White text for contrast
			},
		},
	},
	dark: {
		button: {
			default: {
				background: "#2D2D2D",
				text: "#E8EAED",
			},
			success: {
				background: "#81C784",
				text: "#FFFFFF",
			},
			danger: {
				background: "#E57373",
				text: "#FFFFFF",
			},
			info: {
				background: "#64B5F6",
				text: "#FFFFFF",
			},
			transparent: {
				background: "transparent",
				text: "#E8EAED",
			},
			confirmation: {
				background: "#388E3C", // Dark green color for confirmation
				text: "#FFFFFF", // White text for contrast
			},
		},
	},
};

export function ThemedButton({
	title,
	type = "default",
	...rest
}: ThemedButtonProps) {
	const theme = useColorScheme() ?? "light";
	const buttonColors = Colors[theme].button[type]; // Fetch colors based on the theme and button type

	return (
		<TouchableOpacity
			style={[styles.base, { backgroundColor: buttonColors.background }]}
			{...rest}
		>
			<Text style={[styles.text, { color: buttonColors.text }]}>{title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	base: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontSize: 16,
		fontWeight: "600",
	},
});
