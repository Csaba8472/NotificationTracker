package expo.modules.notificationtracker

import expo.modules.kotlin.AppContext
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModulePackage

class NotificationTrackerPackage : ModulePackage {
  override fun createModules(appContext: AppContext): List<Module> {
    return listOf(NotificationTrackerModule())
  }
}
