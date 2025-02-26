import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the timezone for Nepal
const TIMEZONE = 'Asia/Kathmandu';
dayjs.tz.setDefault(TIMEZONE);

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface EventNotificationProps {
  eventId: number;
  eventDate: string[];
  eventStartTime: string;
  eventType: string;
  location?: string;
}

export const scheduleEventNotifications = async ({
  eventId,
  eventDate,
  eventStartTime,
  eventType,
  location,
}: EventNotificationProps) => {
  try {
    // Validate inputs
    if (!Array.isArray(eventDate) || eventDate.length === 0 || !eventStartTime) {
      console.error('Invalid event data:', { eventDate, eventStartTime });
      return;
    }

    // Get the first date from the array (format: "YYYY-MM-DD")
    const dateStr = eventDate[0];
    if (!dateStr || !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.error('Invalid date format:', dateStr);
      return;
    }

    // Parse the time (format: "h:mm A" or "HH:mm")
    const timeFormat =
      eventStartTime.includes('AM') || eventStartTime.includes('PM') ? 'h:mm A' : 'HH:mm';
    const parsedTime = dayjs(eventStartTime, timeFormat);

    if (!parsedTime.isValid()) {
      console.error('Invalid time format:', eventStartTime);
      return;
    }

    // Combine date and time with timezone
    const timeStr = parsedTime.format('HH:mm');
    const eventDateTime = dayjs.tz(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm', TIMEZONE);

    if (!eventDateTime.isValid()) {
      console.error('Invalid datetime:', { dateStr, timeStr });
      return;
    }

    const now = dayjs().tz(TIMEZONE);

    console.log('Time details:', {
      currentTime: now.format('YYYY-MM-DD HH:mm'),
      eventTime: eventDateTime.format('YYYY-MM-DD HH:mm'),
      oneDayBefore: eventDateTime.subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
      oneHourBefore: eventDateTime.subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    });

    // Cancel any existing notifications for this event
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const eventNotifications = existingNotifications.filter(
      (notification) => notification.content.data?.eventId === eventId
    );

    for (const notification of eventNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }

    // Schedule notification for 1 day before
    const oneDayBefore = eventDateTime.subtract(1, 'day');
    if (oneDayBefore.isAfter(now)) {
      console.log('Scheduling 1 day notification for:', oneDayBefore.format('YYYY-MM-DD HH:mm'));
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Upcoming ${eventType} Tomorrow`,
          body: `You have a ${eventType} tomorrow at ${eventStartTime}${location ? ` at ${location}` : ''}`,
          data: { eventId },
        },
        trigger: {
          date: oneDayBefore.toDate(),
        },
      });
    }

    // Schedule notification for 1 hour before
    const oneHourBefore = eventDateTime.subtract(1, 'hour');
    if (oneHourBefore.isAfter(now)) {
      console.log('Scheduling 1 hour notification for:', oneHourBefore.format('YYYY-MM-DD HH:mm'));
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${eventType} Starting Soon`,
          body: `Your ${eventType} starts in 1 hour${location ? ` at ${location}` : ''}`,
          data: { eventId },
        },
        trigger: {
          date: oneHourBefore.toDate(),
        },
      });
    }
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};
