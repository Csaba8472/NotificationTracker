package expo.modules.notificationlistener

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NotificationListenerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NotificationListener")

    Events("onNotificationReceived")

    Function("isNotificationListenerEnabled") {
      val context = appContext.reactContext ?: return@Function false
      NotificationListenerHelper.isNotificationServiceEnabled(context)
    }

    Function("requestNotificationListenerPermission") {
      val context = appContext.reactContext ?: return@Function
      NotificationListenerHelper.openNotificationListenerSettings(context)
    }

    Function("getInstalledApps") {
      val context = appContext.reactContext ?: return@Function emptyList<Map<String, String>>()
      NotificationListenerHelper.getInstalledApps(context)
    }

    Function("getAppInfo") { packageName: String ->
      val context = appContext.reactContext ?: return@Function null
      NotificationListenerHelper.getAppInfo(context, packageName)
    }

    OnCreate {
      val context = appContext.reactContext ?: return@OnCreate
      NotificationService.setModule(this@NotificationListenerModule)
    }

    OnDestroy {
      NotificationService.setModule(null)
    }
  }

  fun sendNotificationEvent(notification: Map<String, Any?>) {
    sendEvent("onNotificationReceived", notification)
  }
}
