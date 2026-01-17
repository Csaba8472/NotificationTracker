import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { database, NotifInfo } from '../database';
import { NotificationItem, SearchBar } from '../components';
import { RootDrawerParamList } from '../types';
import NotificationListener from '../../modules/notification-listener';

type AppNotificationsRouteProp = RouteProp<RootDrawerParamList, 'AppNotifications'>;

export function AppNotificationsScreen() {
  const route = useRoute<AppNotificationsRouteProp>();
  const { packageName } = route.params;
  
  const [notifications, setNotifications] = useState<NotifInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [notifs, total, today] = await Promise.all([
        database.getAppNotifications(packageName),
        database.getAppNotificationCount(packageName),
        database.getAppNotificationCountToday(packageName),
      ]);
      setNotifications(notifs);
      setTotalCount(total);
      setTodayCount(today);
    } catch (error) {
      console.error('Error loading app notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [packageName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getAppInfo = useCallback((pkg: string) => {
    if (Platform.OS === 'android') {
      return NotificationListener.getAppInfo(pkg);
    }
    return null;
  }, []);

  const filteredNotifications = useMemo(() => {
    if (searchQuery.length < 2) {
      return notifications;
    }
    
    const pattern = searchQuery.toLowerCase().trim();
    return notifications.filter((notif) => 
      notif.heading.toLowerCase().includes(pattern) ||
      notif.bodyText.toLowerCase().includes(pattern)
    );
  }, [notifications, searchQuery]);

  const renderItem = ({ item }: { item: NotifInfo }) => (
    <NotificationItem notification={item} getAppInfo={getAppInfo} />
  );

  const renderHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.chip}>
        <Text style={styles.chipText}>Today's Notifs: {todayCount}</Text>
      </View>
      <View style={styles.chip}>
        <Text style={styles.chipText}>Total Notifs: {totalCount}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search notifications..."
      />
      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() ?? item.time.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: '#E8DEF8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    color: '#6200EE',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
});
