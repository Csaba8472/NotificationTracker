package expo.modules.notificationlistener

import android.app.Notification
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings
import android.text.TextUtils
import android.util.Base64
import androidx.core.graphics.drawable.toBitmap
import java.io.ByteArrayOutputStream

object NotificationListenerHelper {

    fun isNotificationServiceEnabled(context: Context): Boolean {
        val pkgName = context.packageName
        val flat: String? = Settings.Secure.getString(
            context.contentResolver,
            "enabled_notification_listeners"
        )
        if (!flat.isNullOrEmpty()) {
            val names = flat.split(":").filter { it.isNotEmpty() }
            for (name in names) {
                val cn = ComponentName.unflattenFromString(name)
                if (cn != null && TextUtils.equals(pkgName, cn.packageName)) {
                    return true
                }
            }
        }
        return false
    }

    fun openNotificationListenerSettings(context: Context) {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }

    fun getInstalledApps(context: Context): List<Map<String, String>> {
        val pm = context.packageManager
        val apps = mutableListOf<Map<String, String>>()
        
        val packages = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            pm.getInstalledApplications(PackageManager.ApplicationInfoFlags.of(0))
        } else {
            @Suppress("DEPRECATION")
            pm.getInstalledApplications(0)
        }
        
        for (app in packages) {
            if ((app.flags and ApplicationInfo.FLAG_SYSTEM) == 0) {
                val appName = pm.getApplicationLabel(app).toString()
                apps.add(mapOf(
                    "packageName" to app.packageName,
                    "appName" to appName
                ))
            }
        }
        return apps
    }

    fun getAppInfo(context: Context, packageName: String): Map<String, Any?>? {
        return try {
            val pm = context.packageManager
            val appInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                pm.getApplicationInfo(packageName, PackageManager.ApplicationInfoFlags.of(0))
            } else {
                @Suppress("DEPRECATION")
                pm.getApplicationInfo(packageName, 0)
            }
            val appName = pm.getApplicationLabel(appInfo).toString()
            val icon = pm.getApplicationIcon(packageName)
            val bitmap = icon.toBitmap()
            val outputStream = ByteArrayOutputStream()
            bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream)
            val iconBase64 = Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)
            
            mapOf(
                "packageName" to packageName,
                "appName" to appName,
                "iconBase64" to iconBase64
            )
        } catch (e: PackageManager.NameNotFoundException) {
            mapOf(
                "packageName" to packageName,
                "appName" to "Uninstalled App",
                "iconBase64" to null
            )
        }
    }

    fun extractNotificationData(sbn: android.service.notification.StatusBarNotification): Map<String, Any?> {
        val notification = sbn.notification
        val extras = notification.extras
        
        return mapOf(
            "packageName" to sbn.packageName,
            "title" to (extras.getString(Notification.EXTRA_TITLE) ?: ""),
            "text" to (extras.getString(Notification.EXTRA_TEXT) ?: ""),
            "postTime" to sbn.postTime
        )
    }
}
