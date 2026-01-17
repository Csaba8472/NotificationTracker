package expo.modules.notificationtracker

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NotificationTrackerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NotificationTracker")

    Function("getTrackedNotifications") {
      return@Function emptyList<String>()
    }
  }
}
