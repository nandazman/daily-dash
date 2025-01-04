import { Tabs, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { StackProviders } from "@/providers/StackProviders";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
	const colorScheme = useColorScheme() ?? "light";
	const navigation = useNavigation();
	const { t } = useTranslation();
	useEffect(() => {
		navigation.setOptions({ title: t("streak.title") });
	}, [navigation]);

	return (
		<StackProviders>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme].tint,
					headerShown: false,
					tabBarButton: HapticTab,
					tabBarBackground: TabBarBackground,
					tabBarStyle: Platform.select({
						ios: {
							position: "absolute",
							backgroundColor: Colors[colorScheme].background,
						},
						default: {
							backgroundColor: Colors[colorScheme].background,
						},
					}),
				}}
			>
				<Tabs.Screen
					name="index" // This is for the Home screen
					options={{
						title: "Home",
						tabBarIcon: ({ color }) => (
							<IconSymbol size={28} name="house.fill" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="history/index" // Correct path to the history screen
					options={{
						title: "History",
						tabBarIcon: ({ color }) => (
							<IconSymbol size={28} name="history" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="polaroid/index"
					options={{
						title: "Memories",
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons name="polaroid" size={28} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="polaroid/[streakId]/index"
					options={{
						href: null,
					}}
				/>
			</Tabs>
		</StackProviders>
	);
}
