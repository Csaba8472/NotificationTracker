import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Platform } from 'react-native';
import { database, NotifInfo } from '../database';
import { NotificationItem } from '../components';
import NotificationListener from '../../modules/notification-listener';

export function AllNotificationsScreen() {
  const [notifications, setNotifications] = useState<NotifInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await database.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, [loadNotifications]);

  const getAppInfo = useCallback((packageName: string) => {
    if (Platform.OS === 'android') {
      return NotificationListener.getAppInfo(packageName);
    }
    return null;
  }, []);

  const renderItem = ({ item }: { item: NotifInfo }) => (
    <NotificationItem notification={item} getAppInfo={getAppInfo} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() ?? item.time.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});
