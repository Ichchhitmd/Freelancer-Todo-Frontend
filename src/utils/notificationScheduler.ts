import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import * as Notifications from 'expo-notifications';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Asia/Kathmandu';
dayjs.tz.setDefault(TIMEZONE);

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
    if (!Array.isArray(eventDate) || eventDate.length === 0 || !eventStartTime) {
      console.error('Invalid event data:', { eventDate, eventStartTime });
      return;
    }

    const dateStr = eventDate[0];
    if (!dateStr || !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.error('Invalid date format:', dateStr);
      return;
    }

    const timeFormat =
      eventStartTime.includes('AM') || eventStartTime.includes('PM') ? 'h:mm A' : 'HH:mm';
    const parsedTime = dayjs(eventStartTime, timeFormat);

    if (!parsedTime.isValid()) {
      console.error('Invalid time format:', eventStartTime);
      return;
    }

    const timeStr = parsedTime.format('HH:mm');
    const eventDateTime = dayjs.tz(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm', TIMEZONE);

    if (!eventDateTime.isValid()) {
      console.error('Invalid datetime:', { dateStr, timeStr });
      return;
    }

    const now = dayjs().tz(TIMEZONE);

    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const eventNotifications = existingNotifications.filter(
      (notification) => notification.content.data?.eventId === eventId
    );

    for (const notification of eventNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }

    const oneDayBefore = eventDateTime.subtract(1, 'day');
    if (oneDayBefore.isAfter(now)) {
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

    const oneHourBefore = eventDateTime.subtract(1, 'hour');
    if (oneHourBefore.isAfter(now)) {
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
