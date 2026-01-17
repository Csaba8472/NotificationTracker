![Google Pixel 4 XL Presentation (3)](https://github.com/Miihir79/NotificationTracker/assets/66465511/7e9c8318-3964-48b3-b302-42db4ce32074)

# **NotificationTracker 🔔**

<p>
<img src="https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo&logoColor=white"/>
<img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white"/>

</p>


An app that helps keep track of your 🔔Notifications🔔

### Idea behind the app

#### Ever swiped away a notification mindlessly ❌ and then never found out what it was❓ Well, that's how I ended up creating this app 💡.

<img src="https://user-images.githubusercontent.com/66465511/231824133-c93954c1-fa79-4767-98c6-bf535fa19629.png" width="500">

### About the app

Never miss a notification again with Notification Tracker app. This app has features like:

- List of 10 most recent notifications on home screen 🔟
- List of all notification
- List of app wise notification
- Notification Count
- Search feature🔎 to help you find that missed notification!
- Get the text message if even if the sender deletes it 🔕 as long as you've received it as a notification

### 📸 Screenshots of the app
<table>
  <tr>
    <td>Home Page<img src="https://user-images.githubusercontent.com/66465511/230773107-306e83f8-24dc-4d31-8dd2-ea6acfcc1117.jpg" width="350">
    <td>All Notifs<img src="https://user-images.githubusercontent.com/66465511/230773113-2ef63c2d-57fc-4873-8a11-41132c838adf.jpg" width="350">
    <td>App wise Notifs<img src="https://user-images.githubusercontent.com/66465511/230773116-4b82d32b-98ca-4511-84b0-acbc1f01af49.jpg" width="350">
  <tr>
    <td>Search for app<img src="https://user-images.githubusercontent.com/66465511/230773120-aec7fbbc-1c0e-4fe7-835e-414b29561f63.jpg" width="350">
    <td>List of app notif<img src="https://user-images.githubusercontent.com/66465511/230971032-afba0495-3dbc-43ff-a07c-50b16bdbe941.jpg" width="350">
    <td>Search app notifs<img src="https://user-images.githubusercontent.com/66465511/230971041-f37b502b-f11d-4ab7-9767-2783a7109079.jpg" width="350">
</table>

### Project Structure
    
    NotificationTracker                  # Root Directory
    .
    ├── App.tsx                          # Main application entry point
    ├── src/
    │   ├── components/                  # Reusable UI components
    │   │   ├── NotificationItem.tsx     # Notification list item
    │   │   ├── AppItem.tsx              # App list item for app-wise view
    │   │   └── SearchBar.tsx            # Search input component
    │   ├── screens/                     # App screens
    │   │   ├── HomeScreen.tsx           # Home with recent notifications
    │   │   ├── AllNotificationsScreen.tsx
    │   │   ├── AppWiseNotificationsScreen.tsx
    │   │   └── AppNotificationsScreen.tsx
    │   ├── navigation/                  # Navigation configuration
    │   │   └── AppNavigator.tsx         # Drawer navigation setup
    │   ├── database/                    # SQLite database layer
    │   │   └── index.ts                 # Database operations
    │   └── types/                       # TypeScript type definitions
    │       └── index.ts
    └── modules/
        └── notification-listener/       # Expo Native Module
            ├── index.ts                 # TypeScript API
            ├── expo-module.config.json
            ├── app.plugin.js            # Expo config plugin
            └── android/                 # Android native code
                └── src/main/java/expo/modules/notificationlistener/
                    ├── NotificationListenerModule.kt
                    ├── NotificationListenerHelper.kt
                    └── NotificationService.kt
        
## Built Using 🛠
- [Expo SDK 54](https://expo.dev/changelog/sdk-54) - React Native development platform
- [React Native](https://reactnative.dev/) - Cross-platform mobile framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) - SQLite database
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [Expo Native Modules](https://docs.expo.dev/modules/native-module-tutorial/) - Custom native code integration

## Native Module

The notification tracking functionality requires native Android code to access the `NotificationListenerService` API. This is implemented as an Expo native module following the [Expo Modules API](https://docs.expo.dev/modules/native-module-tutorial/).

The native module provides:
- `isNotificationListenerEnabled()` - Check if permission is granted
- `requestNotificationListenerPermission()` - Open settings to grant permission
- `getAppInfo(packageName)` - Get app name and icon
- `onNotificationReceived` event - Listen for incoming notifications

## ⚠️ Permissions ⚠️
This app requires special permissions:
- **BIND_NOTIFICATION_LISTENER_SERVICE** : To access incoming notifications
- **QUERY_ALL_PACKAGES** : To get app names and icons

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Android Studio (for Android development)
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/Miihir79/NotificationTracker.git
cd NotificationTracker

# Install dependencies
npm install

# Start the development server
npm start

# Run on Android (requires Android emulator or device)
npm run android
```

### Building for Production

```bash
# Build for Android
npx eas build --platform android
```

## How to contribute?
### What do you need to get started?
#### Node.js, npm, and familiarity with React Native/Expo development.
All contributions are welcomed. Properly describe changes made and attach supporting ScreenShots in the PR. For major changes first open an issue.

## Author
Initial work: <a href="https://github.com/Miihir79">***Mihir Shah***</a> <br>
