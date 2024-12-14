import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Modal, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FAB, Provider as PaperProvider, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getDateDiffInDays from '@/helper/getDateDiffInDays';
import { useFocusEffect } from 'expo-router';
import { HelloWave } from '@/components/HelloWave';
import Streak from '../../type/streak';

export default function Home() {
  const db = useSQLiteContext();
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFailed, setModalFailed] = useState(false);
  const [streakName, setStreakName] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStreakStatus = (streaks: Streak[]) => {
    const updatedStreak = []
    for (let i = 0; i < streaks.length; i++) {
      const streak = streaks[i];
      const diffInDays = getDateDiffInDays({ startDate: streak.current_streak_date })
      if (diffInDays >= 2) {
        db.runAsync(
          'UPDATE streak SET status = ? WHERE id = ?',
          'fail',
          streak.id
        );
        streak.status = 'fail'
      }
      updatedStreak.push(streak)
    }
    return updatedStreak
  }

  const handleAcknowledgeFailedStreaks = async () => {
    setModalFailed(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      async function setup() {
        const result = await db.getAllAsync<Streak>('SELECT * FROM streak WHERE status = "active"')
        const updatedStreak = checkStreakStatus(result)
        setStreaks(updatedStreak);
  
        if (updatedStreak.some((item) => item.status === 'fail')) {
          setModalFailed(true)
        }
      }
      setup();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [db])
  );


  const handleSave = async () => {
    if (streakName.trim() === "") {
      return;
    }
    setLoading(true);
    const currentDate = new Date().getTime(); 
    try {
      await db.runAsync(
        'INSERT INTO streak (title, start_date, current_streak_date, status) VALUES (?, ?, ?, ?)',
        streakName,
        currentDate,
        currentDate,
        "active"
      );
      setModalVisible(false);
      const result = await db.getAllAsync<Streak>('SELECT * FROM streak WHERE status = "active"');
      setStreaks(result);
      setStreakName("");
      setLoading(false);

    } catch (err) {
      console.error({ err })
    }
  };

  const handleCheckIn = async (streakId: number, currentStreakDate: number) => {
    const today = new Date().getTime();

    if (currentStreakDate === today) return;


    await db.runAsync(
      'UPDATE streak SET current_streak_date = ? WHERE id = ?',
      today,
      streakId
    );

    const result = await db.getAllAsync<Streak>('SELECT * FROM streak WHERE status = "active"');
    setStreaks(result);
  };

  const handleDelete = async (streakId: number) => {
    await db.runAsync(
      'UPDATE streak SET status = "fail" WHERE id = ?',
      streakId
    );

    // Remove from state without making additional calls to the database
    setStreaks((prevStreaks) => prevStreaks.filter((streak) => streak.id !== streakId));
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>How does your streak go? <HelloWave /></Text>
        {streaks.length === 0 ? (
          <Text style={{ paddingHorizontal: 16}}>No streaks found</Text>
        ) : (
          <View>
            {streaks.map((streak) => {
              const daysDiff = getDateDiffInDays({ startDate: streak.start_date, endDate: streak.current_streak_date})
              const isAlreadyUpdate = getDateDiffInDays({ startDate: streak.current_streak_date }) < 1
              const isActive = streak.status === 'active'
              return <View style={styles.streakItemContainer} key={streak.id}>
              <Text style={{ paddingLeft: 8 }}>{streak.title}</Text>
              <View style={{  flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', columnGap: 4 }}>
                <Text style={{textAlign: "right", marginRight: 4 }} >
                  {isActive ? daysDiff.toString() : 'FAIL'}
                </Text>
                
                <IconButton
                  icon={() => (
                    <MaterialCommunityIcons
                      name="plus-circle"
                      size={24}
                      color={isAlreadyUpdate || !isActive ? '#888' : '#4CAF50'}
                    />
                  )}
                  onPress={() => handleCheckIn(streak.id, streak.current_streak_date)}
                  disabled={isAlreadyUpdate || !isActive}
                  style={{ margin: 0, padding: 0, width: 24, height: 24 }}
                  size={24}
                />
                <IconButton
                      icon={() => (
                        <MaterialCommunityIcons
                          name="stop-circle"
                          size={24}
                          color="#f28585"
                        />
                      )}
                      onPress={() => handleDelete(streak.id)}
                      style={{ margin: 0, padding: 0, width: 24, height: 24 }}
                      size={24}
                    />
                
              </View>
            </View>
            })}
          </View>
        )}
      </View>

      <FAB
        style={styles.fab}
        size="small"
        icon="plus"
        onPress={() => setModalVisible(true)}
      />

    <Modal
          visible={modalFailed}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalFailed(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>😢 Failed Streaks</Text>
              <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
      {streaks
        .map((item, index) => (
          <View key={item.id?.toString()} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16 }}>{`${index + 1}`}. {item.title}</Text>
          </View>
        ))}
    </ScrollView>
              <Text style={{ fontSize: 14, marginBottom: 16 }}>
                The above streaks have been inactive for more than 2 days. They will be removed from active streaks and added to the history page.
              </Text>
              <Button
                title="Acknowledge"
                onPress={handleAcknowledgeFailedStreaks}
              />
            </View>
          </View>
        </Modal>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Streak to Break Next!</Text>
            <TextInput
              style={styles.input}
              placeholder="Name of the streak"
              value={streakName}
              onChangeText={setStreakName}
            />
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="#888"
                disabled={loading}
              />
              <View style={styles.saveButtonContainer}>
                {loading ? (
                  <ActivityIndicator size="small" color="#000" animating={loading} />
                ) : (
                  <Button
                    title="Let's Streak!"
                    onPress={handleSave}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </PaperProvider>
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
    paddingTop: 16,
    backgroundColor: "#fff",
    height: "100%"
  },
  fab: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -28 }],
    bottom: 16,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 4,
  },
  saveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: "center",
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 8
  },
});
