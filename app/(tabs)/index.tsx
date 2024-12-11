import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Modal, TextInput, Button, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FAB, Provider as PaperProvider, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getDateDiffInDays from '@/helper/getDateDiffInDays';

interface Streak {
  id: number;
  title: string;
  start_date: number;
  current_streak_date: number;
  status: string;
}

export default function TabTwoScreen() {
  const db = useSQLiteContext();
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [streakName, setStreakName] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStreakStatus = (streaks: Streak[]) => {
    const today = new Date().getTime();

    // Check if any streak has been missed for 2 days or more
    return streaks.map((streak) => {
      const diffInDays = getDateDiffInDays(streak.current_streak_date)
      if (diffInDays >= 2) {
        // Update streak status to 'fail' if more than 2 days have passed without check-in
        db.runAsync(
          'UPDATE streak SET status = ? WHERE id = ?',
          'fail',
          streak.id
        );
        streak.status = 'fail'
      }

      return streak
    });
  }

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Streak>('SELECT * FROM streak WHERE status != "stopped"');
      const checkedStatus = checkStreakStatus(result)
      setStreaks(checkedStatus);
    }
    setup();
  }, [db]);

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
      const result = await db.getAllAsync<Streak>('SELECT * FROM streak');
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

    const result = await db.getAllAsync<Streak>('SELECT * FROM streak');
    setStreaks(result);
  };

  const handleDelete = async (streakId: number) => {
    await db.runAsync(
      'UPDATE streak SET status = "stopped" WHERE id = ?',
      streakId
    );

    // Remove from state without making additional calls to the database
    setStreaks((prevStreaks) => prevStreaks.filter((streak) => streak.id !== streakId));
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>How does your streak go?</Text>
        {streaks.length === 0 ? (
          <Text>No streaks found</Text>
        ) : (
          <View>
            {streaks.map((streak) => {
              const isAlreadyUpdate = getDateDiffInDays(streak.current_streak_date) === 0
              const isActive = streak.status === 'active'
              return <View style={styles.streakItemContainer} key={streak.id}>
              <Text style={{ paddingLeft: 8 }}>{streak.title}</Text>
              <View style={{  flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', columnGap: 4 }}>
                <Text style={{textAlign: "right", marginRight: 4 }} >
                  {isActive ? getDateDiffInDays(streak.start_date) : 'FAIL'}
                </Text>
                
                <IconButton
                  icon={() => (
                    <MaterialCommunityIcons
                      name="plus-circle"
                      size={24}
                      color={isAlreadyUpdate || isActive ? '#888' : '#4CAF50'}
                    />
                  )}
                  onPress={() => handleCheckIn(streak.id, streak.current_streak_date)}
                  disabled={isAlreadyUpdate}
                  style={{ margin: 0, padding: 0, width: 24, height: 24 }}
                  size={24}
                />
                <IconButton
                      icon={() => (
                        <MaterialCommunityIcons
                          name="delete"
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
        )}?
      </View>

      <FAB
        style={styles.fab}
        size="small"
        icon="plus"
        onPress={() => setModalVisible(true)}
      />

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
    paddingTop: StatusBar.currentHeight,
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
