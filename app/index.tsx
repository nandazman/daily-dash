import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
	View,
	StyleSheet,
	StatusBar,
	useColorScheme,
	Platform,
} from "react-native";

export default function Home() {
	const theme = useColorScheme() ?? "light";
	const borderColor =
		theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
	return (
		<View style={styles.container}>
			<View style={styles.topSection}>
				{/* Streak Section */}
				<Link href="/(streak)">
					<View style={styles.section}>
						<View
							style={{
								...styles.logoContainer,
								borderColor,
							}}
						>
							<MaterialIcons
								name="whatshot"
								size={32}
								color={theme === "dark" ? "white" : "black"}
							/>
						</View>
						<ThemedText>Streak</ThemedText>
					</View>
				</Link>

				{/* Clock-In Section */}
				<Link href="/(check-in)">
					<View style={styles.section}>
						<View
							style={{
								...styles.logoContainer,
								borderColor,
							}}
						>
							<MaterialCommunityIcons
								name="calendar-today"
								size={24}
								color={theme === "dark" ? "white" : "black"}
							/>
						</View>
						<ThemedText>Clock-In</ThemedText>
					</View>
				</Link>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: StatusBar.currentHeight,
	},
	topSection: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "flex-start",
		width: "100%",
		paddingTop: 20,
	},
	section: {
		alignItems: "center",
	},
	logoContainer: {
		width: 80,
		height: 80,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
		paddingTop: Platform.OS === "ios" ? 50 : 10,
		paddingBottom: 10,
		borderRadius: 8,
		borderWidth: 1,
	},
});
