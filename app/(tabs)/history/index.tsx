import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function TabTwoScreen() {
  return (

      <View style={styles.container}>
        <Text style={styles.title}>Your fail streak :(</Text>

      </View>


  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
    marginBottom: 16
  },
  container: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#fff",
    height: "100%"
  },
});
