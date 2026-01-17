import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { database } from '../database';
import { AppItem, SearchBar } from '../components';
import { RootDrawerParamList } from '../types';
import NotificationListener from '../../modules/notification-listener';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

export function AppWiseNotificationsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [packageNames, setPackageNames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPackageNames = useCallback(async () => {
    try {
      const data = await database.getUniquePackageNames();
      setPackageNames(data);
    } catch (error) {
      console.error('Error loading package names:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPackageNames();
  }, [loadPackageNames]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPackageNames();
    setRefreshing(false);
  }, [loadPackageNames]);

  const getAppInfo = useCallback((packageName: string) => {
    if (Platform.OS === 'android') {
      return NotificationListener.getAppInfo(packageName);
    }
    return null;
  }, []);

  const filteredPackageNames = useMemo(() => {
    if (searchQuery.length < 2) {
      return packageNames;
    }
    
    const pattern = searchQuery.toLowerCase().trim();
    return packageNames.filter((packageName) => {
      const appInfo = getAppInfo(packageName);
      const appName = appInfo?.appName?.toLowerCase() ?? packageName.toLowerCase();
      return appName.includes(pattern);
    });
  }, [packageNames, searchQuery, getAppInfo]);

  const handleAppPress = useCallback((packageName: string) => {
    // @ts-ignore - Navigation type issue
    navigation.navigate('AppNotifications', { packageName });
  }, [navigation]);

  const renderItem = ({ item }: { item: string }) => (
    <AppItem
      packageName={item}
      onPress={() => handleAppPress(item)}
      getAppInfo={getAppInfo}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search apps..."
      />
      <FlatList
        data={filteredPackageNames}
        renderItem={renderItem}
        keyExtractor={(item) => item}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 16,
  },
});
