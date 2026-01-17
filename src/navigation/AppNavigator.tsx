import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  HomeScreen,
  AllNotificationsScreen,
  AppWiseNotificationsScreen,
  AppNotificationsScreen,
} from '../screens';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        drawerActiveTintColor: '#6200EE',
        drawerInactiveTintColor: '#666',
        drawerStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="AllNotifications"
        component={AllNotificationsScreen}
        options={{
          title: 'View All Notifs',
        }}
      />
      <Drawer.Screen
        name="AppWiseNotifications"
        component={AppWiseNotificationsScreen}
        options={{
          title: 'App Wise Notifications',
        }}
      />
    </Drawer.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen
          name="AppNotifications"
          component={AppNotificationsScreen}
          options={{
            headerShown: true,
            title: 'Notifications of this app',
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#000',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
