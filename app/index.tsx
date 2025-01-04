import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	View,
	StyleSheet,
	StatusBar,
	useColorScheme,
	Platform,
} from "react-native";

export default function Home() {
	const theme = useColorScheme() ?? "light";
	const { t } = useTranslation();
	
	const borderColor =
		theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
	return (
		<>
			<ThemedView style={styles.container}>
				<View style={styles.topSection}>
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
							<ThemedText>{t("streak.title")}</ThemedText>
						</View>
					</Link>

					<Link href="/(habit)">
						<View style={styles.section}>
							<View
								style={{
									...styles.logoContainer,
									borderColor,
								}}
							>
								<MaterialIcons
									name="local-activity"
									size={24}
									color={theme === "dark" ? "white" : "black"}
								/>
							</View>
							<ThemedText>{t("habit.title")}</ThemedText>
						</View>
					</Link>
				</View>
			</ThemedView>
			<LanguageSelector />
		</>
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
