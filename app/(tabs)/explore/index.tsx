import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getDateDiffInDays } from './helper';

interface Streak {
  id: number;
  title: string;
  start_date: number;
}

export default function TabTwoScreen() {
  const db = useSQLiteContext();
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Streak>('SELECT * FROM streak');
      setStreaks(result);
    }
    setup();
  }, [db]); 

  return (


    <View style={styles.container}>
        <Text style={styles.title}>How does your streak go?</Text>
      {streaks.length === 0 ? (
        <Text>No streaks found</Text>
      ) : (
        <View>

            {streaks.map((streak) => (
              <View style={styles.streakItemContainer} key={streak.id}>
                <Text style={{
                    flexGrow: 8,
                    paddingLeft: 8
                }}>{streak.title}</Text>
                <Text style={{
                    flexGrow: 1,
                    textAlign: "right",
                    paddingRight: 8
                }}>{getDateDiffInDays(streak.start_date)}</Text>
              </View>
            ))}
        </View>
      )}
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
    height:"100%"
  },

  streakItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 4
  },
});
