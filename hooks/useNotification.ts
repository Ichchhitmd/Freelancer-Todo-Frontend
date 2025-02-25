import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

export function useNotifications() {
  const navigation = useNavigation();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Handle notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const eventData = notification.request.content.data;
      console.log('Notification received:', eventData);
    });

    // Handle notification when user taps on it
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const eventData = response.notification.request.content.data;
      // Navigate to event details when notification is tapped
      if (eventData.eventId) {
        navigation.navigate('DateDetails', {
          id: eventData.eventId,
          date: eventData.eventDate,
          time: eventData.eventTime,
        });
      }
    });

    // Cleanup
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [navigation]);

  return null;
}
