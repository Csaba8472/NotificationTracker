import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { AppInfo } from '../types';

interface Props {
  packageName: string;
  onPress: () => void;
  getAppInfo?: (packageName: string) => AppInfo | null;
}

export function AppItem({ packageName, onPress, getAppInfo }: Props) {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    if (getAppInfo && Platform.OS === 'android') {
      const info = getAppInfo(packageName);
      setAppInfo(info);
    }
  }, [packageName, getAppInfo]);

  const appName = appInfo?.appName ?? packageName.split('.').pop() ?? 'Unknown App';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
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
      <Text style={styles.appName} numberOfLines={1}>
        {appName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  iconPlaceholder: {
    backgroundColor: '#E8DEF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  appName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
