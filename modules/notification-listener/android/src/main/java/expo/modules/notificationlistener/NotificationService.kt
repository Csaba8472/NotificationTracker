package expo.modules.notificationlistener

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationService : NotificationListenerService() {

    companion object {
        private const val TAG = "NotificationService"
        private var moduleInstance: NotificationListenerModule? = null

        fun setModule(module: NotificationListenerModule?) {
            moduleInstance = module
        }
    }

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "Notification listener service started")
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        try {
            val notificationData = NotificationListenerHelper.extractNotificationData(sbn)
            Log.i(TAG, "Notification received from: ${sbn.packageName}")
            
            moduleInstance?.sendNotificationEvent(notificationData)
        } catch (e: Exception) {
            Log.e(TAG, "Error processing notification", e)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "Notification listener service destroyed")
    }
}
