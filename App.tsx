import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation';
import { database } from './src/database';
import NotificationListener, { NotificationData, addNotificationListener } from './modules/notification-listener';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  // Initialize database
  useEffect(() => {
    const initDb = async () => {
      try {
        await database.initialize();
        setIsDbReady(true);
      } catch (error) {
        console.error('Database initialization error:', error);
        Alert.alert('Error', 'Failed to initialize database');
      }
    };
    initDb();
  }, []);

  // Check and handle notification listener permission
  useEffect(() => {
    if (Platform.OS !== 'android') {
      setIsCheckingPermission(false);
      return;
    }

    const checkPermission = () => {
      const enabled = NotificationListener.isNotificationListenerEnabled();
      setIsPermissionGranted(enabled);
      setIsCheckingPermission(false);
    };

    checkPermission();

    // Re-check permission when app comes to foreground
    const interval = setInterval(checkPermission, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle incoming notifications
  const handleNotification = useCallback(async (notification: NotificationData) => {
    if (!isDbReady) return;

    try {
      await database.addNotification({
        packageName: notification.packageName,
        heading: notification.title,
        bodyText: notification.text,
        time: notification.postTime,
      });
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }, [isDbReady]);

  // Subscribe to notification events
  useEffect(() => {
    if (Platform.OS !== 'android' || !isDbReady) return;

    const subscription = addNotificationListener(handleNotification);
    return () => {
      subscription?.remove();
    };
  }, [isDbReady, handleNotification]);

  const handleRequestPermission = () => {
    NotificationListener.requestNotificationListenerPermission();
  };

  // Show loading while database initializes
  if (!isDbReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  // Show permission request screen on Android if not granted
  if (Platform.OS === 'android' && !isCheckingPermission && !isPermissionGranted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Notification Access Required</Text>
        <Text style={styles.permissionText}>
          This app needs notification listener permission to track your notifications.
          {'\n\n'}
          Please enable "NotificationTracker" in the notification access settings.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={handleRequestPermission}
        >
          <Text style={styles.permissionButtonText}>Open Settings</Text>
        </TouchableOpacity>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppNavigator />
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
