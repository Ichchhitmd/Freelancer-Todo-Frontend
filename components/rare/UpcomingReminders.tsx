import React from 'react';
import { Text, View, TouchableOpacity, Platform, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatNepaliDates } from '../utils/NepaliDateFormatter';

interface EventDetails {
  eventId: number;
  eventType: string;
  side: string;
  earnings: string;
  contactPerson: string;
  eventStartTime: string;
  location: string;
  clientContactPerson1: string;
  clientContactNumber1: string;
  company: {
    name: string;
  };
  eventDate: string[];
  nepaliEventDate: string[];
  detailNepaliDate: Array<{
    nepaliDay: number;
    nepaliYear: number;
    nepaliMonth: number;
  }>;
}

interface UpcomingEventReminderProps {
  events: {
    date: string;
    details: EventDetails;
  }[];
}

const UpcomingEventReminder: React.FC<UpcomingEventReminderProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.details.eventDate[0]);
    const dateB = new Date(b.details.eventDate[0]);
    return dateA.getTime() - dateB.getTime();
  });

  const formatEventName = (details: EventDetails) => `${details.eventType} (${details.side})`;

  const getDisplayName = (details: EventDetails) =>
    details.clientContactPerson1 || details.company.name;

  const handlePhonePress = (phoneNumber: string) => {
    if (Platform.OS === 'ios') {
      Linking.openURL(`telprompt:${phoneNumber}`);
    } else {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-gray-800 mb-4 text-xl font-bold">Upcoming Events</Text>
      {sortedEvents.map((event, index) => {
        const eventDate = new Date(event.details.eventDate[0]);
        const today = new Date();
        const isToday =
          eventDate.getFullYear() === today.getFullYear() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getDate() === today.getDate();
        const formattedDates = formatNepaliDates(event.details.detailNepaliDate);

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            className={`mb-4 rounded-xl bg-white shadow-sm ${isToday ? 'border-2 border-blue-500' : ''}`}>
            <View className="p-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-gray-900 text-lg font-semibold" numberOfLines={1}>
                  {formatEventName(event.details)}
                </Text>
                {isToday && (
                  <View className="rounded-full bg-blue-500 px-2 py-1">
                    <Text className="text-xs font-bold text-white">Today</Text>
                  </View>
                )}
              </View>

              <View className="mt-2 flex-row items-center">
                <MaterialCommunityIcons name="calendar-clock" size={20} color="#4B5563" />
                <Text className="text-gray-600 ml-2">
                  {formattedDates} • {event.details.eventStartTime}
                </Text>
              </View>

              <View className="mt-2 flex-row items-center">
                <MaterialCommunityIcons name="map-marker" size={20} color="#4B5563" />
                <Text className="text-gray-600 ml-2" numberOfLines={1}>
                  {event.details.location}
                </Text>
              </View>

              <View className="mt-2 flex-row items-center">
                <MaterialCommunityIcons name="account" size={20} color="#4B5563" />
                <Text className="text-gray-600 ml-2" numberOfLines={1}>
                  {getDisplayName(event.details)}
                </Text>
              </View>

              {event.details.clientContactNumber1 && (
                <TouchableOpacity
                  className="mt-2 flex-row items-center"
                  onPress={() => handlePhonePress(event.details.clientContactNumber1)}>
                  <MaterialCommunityIcons name="phone" size={20} color="#4B5563" />
                  <Text className="text-gray-600 ml-2 underline">
                    {event.details.clientContactNumber1}
                  </Text>
                </TouchableOpacity>
              )}
              <View className="mt-2 flex-row items-center">
                <Text className="ml-2 text-xl font-semibold text-green-600">
                  रू {event.details.earnings.toLocaleString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default UpcomingEventReminder;
