import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { NotifInfo, AppInfo } from '../types';

interface Props {
  notification: NotifInfo;
  getAppInfo?: (packageName: string) => AppInfo | null;
}

export function NotificationItem({ notification, getAppInfo }: Props) {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    if (getAppInfo && Platform.OS === 'android') {
      const info = getAppInfo(notification.packageName);
      setAppInfo(info);
    }
  }, [notification.packageName, getAppInfo]);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const appName = appInfo?.appName ?? notification.packageName.split('.').pop() ?? 'Unknown App';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {appInfo?.iconBase64 ? (
          <Image
            source={{ uri: `data:image/png;base64,${appInfo.iconBase64}` }}
            style={styles.icon}
          />
        ) : (
          <View style={[styles.icon, styles.iconPlaceholder]}>
            <Text style={styles.iconPlaceholderText}>
              {appName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.appName} numberOfLines={1}>
            {appName}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {notification.heading || 'No title'}
          </Text>
        </View>
      </View>
      <Text style={styles.body} numberOfLines={3}>
        {notification.bodyText || 'No content'}
      </Text>
      <Text style={styles.time}>{formatTime(notification.time)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  iconPlaceholder: {
    backgroundColor: '#E8DEF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  headerText: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  body: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});
