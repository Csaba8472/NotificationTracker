const { withAndroidManifest, withPlugins } = require("expo/config-plugins");

function withNotificationListenerService(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application[0];

    // Add the NotificationService to the manifest
    if (!application.service) {
      application.service = [];
    }

    // Check if service already exists
    const serviceExists = application.service.some(
      (service) =>
        service.$["android:name"] ===
        "expo.modules.notificationlistener.NotificationService"
    );

    if (!serviceExists) {
      application.service.push({
        $: {
          "android:name":
            "expo.modules.notificationlistener.NotificationService",
          "android:exported": "true",
          "android:label": "@string/app_name",
          "android:permission":
            "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name":
                    "android.service.notification.NotificationListenerService",
                },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
}

module.exports = function withNotificationListener(config) {
  return withPlugins(config, [withNotificationListenerService]);
};
