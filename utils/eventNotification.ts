// utils/eventNotification.ts
import * as Notifications from 'expo-notifications';
import { convertNepaliToEnglish } from './dateConversionToAd';

const scheduledEventIds = new Set<string>();

export async function scheduleEventNotification(nepaliDate: string, eventDetails: any) {
  console.log('[Notification] Starting scheduling for event:', eventDetails.id);
  console.log('[Notification] Original Nepali dates:', nepaliDate);

  try {
    // Split and process multiple dates
    const dateStrings = nepaliDate.split(',').map((d) => d.trim());

    for (const dateStr of dateStrings) {
      const englishDate = convertNepaliToEnglish(dateStr);
      if (!englishDate) {
        continue;
      }

      const notificationId = `${eventDetails.id}-${dateStr}`;

      // Check for existing notification
      if (scheduledEventIds.has(notificationId)) {
        continue;
      }

      // Calculate notification time (1 day before at 10 AM)
      const notificationDate = new Date(englishDate);
      notificationDate.setDate(notificationDate.getDate() - 1);
      notificationDate.setHours(10, 0, 0, 0);

      // Skip if notification time has passed
      if (notificationDate <= new Date()) {
        continue;
      }

      console.log('Scheduling notification for:', notificationDate);

      // Schedule the notification with direct date trigger
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Upcoming Event Tomorrow`,
          body: `You have a ${eventDetails.eventType} (${eventDetails.side}) with ${
            eventDetails.contactPerson || eventDetails.company.name
          }`,
          data: { ...eventDetails, originalDate: dateStr },
        },
        trigger: {
          date: notificationDate,  // Direct date trigger
        },
      });

      // Track scheduled notification
      scheduledEventIds.add(notificationId);
    }
  } catch (error) {
    console.error('[Notification] Error:', {
      eventId: eventDetails.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

