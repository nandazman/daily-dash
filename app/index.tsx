import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";

export default function StreakLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {/* Streak Section */}
        <Link href="/(streak)">
          <View style={styles.section}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="whatshot" size={32} color="black" />
            </View>
            <Text style={styles.label}>Streak</Text>
          </View>
        </Link>

        {/* Clock-In Section */}
        <Link href="/(check-in)">
          <View style={styles.section}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons
                name="calendar-today"
                size={24}
                color="black"
              />
            </View>
            <Text style={styles.label}>Clock-In</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#fff", // Light background color to resemble a button
    // Box shadow for 3D effect
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow direction
    shadowOpacity: 0.25, // Shadow intensity
    shadowRadius: 3.5, // Shadow blur radius
    elevation: 5, // For Android devices to support shadow
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});
