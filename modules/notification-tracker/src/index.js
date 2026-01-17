import { requireOptionalNativeModule } from 'expo-modules-core';

const nativeModule = requireOptionalNativeModule('NotificationTracker');

export function getTrackedNotifications() {
  if (nativeModule?.getTrackedNotifications) {
    return nativeModule.getTrackedNotifications();
  }

  return [];
}
