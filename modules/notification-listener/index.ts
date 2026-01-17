import { requireNativeModule, EventEmitter } from 'expo-modules-core';
import { Platform } from 'react-native';

export interface NotificationData {
  packageName: string;
  title: string;
  text: string;
  postTime: number;
}

export interface AppInfo {
  packageName: string;
  appName: string;
  iconBase64?: string | null;
}

interface NotificationListenerModuleType {
  isNotificationListenerEnabled(): boolean;
  requestNotificationListenerPermission(): void;
  getInstalledApps(): AppInfo[];
  getAppInfo(packageName: string): AppInfo | null;
}

// Define event types for the emitter
type NotificationListenerEvents = {
  onNotificationReceived: (notification: NotificationData) => void;
};

// Get the native module
const NotificationListenerModule = Platform.OS === 'android' 
  ? requireNativeModule<NotificationListenerModuleType>('NotificationListener')
  : null;

const emitter = Platform.OS === 'android' && NotificationListenerModule
  ? new EventEmitter(NotificationListenerModule as any)
  : null;

export function isNotificationListenerEnabled(): boolean {
  if (Platform.OS !== 'android') {
    return false;
  }
  return NotificationListenerModule?.isNotificationListenerEnabled() ?? false;
}

export function requestNotificationListenerPermission(): void {
  if (Platform.OS !== 'android') {
    console.warn('Notification listener is only supported on Android');
    return;
  }
  NotificationListenerModule?.requestNotificationListenerPermission();
}

export function getInstalledApps(): AppInfo[] {
  if (Platform.OS !== 'android') {
    return [];
  }
  return NotificationListenerModule?.getInstalledApps() ?? [];
}

export function getAppInfo(packageName: string): AppInfo | null {
  if (Platform.OS !== 'android') {
    return null;
  }
  return NotificationListenerModule?.getAppInfo(packageName) ?? null;
}

export type NotificationListenerSubscription = { remove: () => void } | null;

export function addNotificationListener(
  listener: (notification: NotificationData) => void
): NotificationListenerSubscription {
  if (Platform.OS !== 'android' || !emitter) {
    return null;
  }
  return (emitter as any).addListener('onNotificationReceived', listener);
}

export default {
  isNotificationListenerEnabled,
  requestNotificationListenerPermission,
  getInstalledApps,
  getAppInfo,
  addNotificationListener,
};
