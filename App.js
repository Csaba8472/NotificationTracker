import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getTrackedNotifications } from 'notification-tracker';

export default function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(getTrackedNotifications());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Tracker</Text>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications tracked yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    color: '#666',
  },
  item: {
    fontSize: 16,
    paddingVertical: 6,
  },
});
