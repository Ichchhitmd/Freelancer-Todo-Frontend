import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import axios from 'axios';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export async function registerForPushNotificationsAsync(authToken: string) {
  let token;

  if (!Device.isDevice) {
    alert('Physical device required for Push Notifications');
    return;
  }

  // Check if we have permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  try {
    // Get Expo push token
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: '96689133-fca2-4b3a-acc5-07bd1b5a2949', // Get this from app.json
    })).data;

    // Send token to backend
    await axios.patch(
      `${process.env.BASE_URL_ANDROID_DEV}/users/push-token`,
      { expoPushToken: token },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Error registering push token:', error);
    alert('Failed to register notification token');
  }
}

export async function schedulePushNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: null,
  });
}