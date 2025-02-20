import React from 'react';
import { Text, View, TouchableOpacity, Platform, Linking, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatNepaliDates } from '../utils/NepaliDateFormatter';
import { getDaysStatus } from 'utils/utils';

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
  clientContactNumber2: string;
  company?: {
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
  const today = new Date();
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.details.eventDate[0]);
    return eventDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
  });
  const sortedEvents = [...futureEvents].sort((a, b) => {
    const dateA = new Date(a.details.eventDate[0]);
    const dateB = new Date(b.details.eventDate[0]);
    return dateA.getTime() - dateB.getTime();
  });


  const formatEventName = (details: EventDetails) => `${details.eventType} (${details.side})`;

  const getDisplayName = (details: EventDetails) => {
    if (details.company) {
      return details.company.name;
    }
    return `${details.clientContactPerson1}'s Work`;
  };

  const handlePhonePress = (phoneNumber: string) => {
    if (Platform.OS === 'ios') {
      Linking.openURL(`telprompt:${phoneNumber}`);
    } else {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  return (
    <View className="bg-gray-50 p-4">
      <Text className="text-gray-900 mb-6 text-2xl font-bold">Upcoming Events 📅</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 10 }}
        snapToInterval={360}
        decelerationRate="fast"
        snapToAlignment="center">
        {sortedEvents.map((event, index) => {
          const eventDate = new Date(event.details.eventDate[0]);
          const { statusText, statusStyle, isToday } = getDaysStatus(eventDate);

          const formattedDates = formatNepaliDates(event.details.detailNepaliDate);

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              className={`mb-5 overflow-hidden rounded-2xl border-l-4 
              bg-white shadow-sm ${isToday ? 'border-blue-500' : 'border-orange-400'}`}
              style={{
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                width: 360,
                marginRight: 0,
              }}>
              <View className="p-5">
                <View className="mb-3 flex-row items-start justify-between">
                  <View className="flex-1 pr-2">
                    <Text className="text-gray-900 text-lg font-bold" numberOfLines={2}>
                      {formatEventName(event.details)}
                    </Text>
                    <Text className="text-gray-500 mt-1 text-sm">
                      {getDisplayName(event.details)}
                    </Text>
                  </View>
                  <View className="mt-4 flex-row items-center justify-end gap-5">
                    <View className={`rounded-full px-3 py-1 ${statusStyle}`}>
                      <Text className="text-xs font-semibold">{statusText}</Text>
                    </View> 

                    <View className="flex-row items-center justify-end">
                      <View className="flex-row items-center rounded-full bg-orange-100 px-3 py-1.5">
                        <MaterialCommunityIcons name="calendar-blank" size={14} color="#F59E0B" />
                        <Text className="ml-2 text-sm font-medium text-orange-800">
                          {formattedDates}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="bg-gray-100 my-4 h-px" />

                <View className="flex-row flex-wrap">
                  <View className="mb-4 w-1/2 pr-2">
                    <View className="flex-row items-center rounded-lg bg-blue-50 p-3">
                      <MaterialCommunityIcons name="clock-outline" size={18} color="#3B82F6" />
                      <View className="ml-2">
                        <Text className="text-gray-500 text-xs">Starts at</Text>
                        <Text className="text-gray-900 text-sm font-medium">
                          {event.details.eventStartTime}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mb-4 w-1/2 pl-2">
                    <View className="flex-row items-center rounded-lg bg-green-50 p-3">
                      <MaterialCommunityIcons name="cash" size={18} color="#10B981" />
                      <View className="ml-2">
                        <Text className="text-gray-500 text-xs">Earnings</Text>
                        <Text className="text-lg font-semibold text-green-800">
                          रू {parseFloat(event.details.earnings).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Location Card */}
                  <View className="mb-4 w-full">
                    <View className="flex-row items-center rounded-lg bg-purple-50 p-3">
                      <MaterialCommunityIcons name="map-marker-outline" size={18} color="#8B5CF6" />
                      <View className="ml-2 flex-1">
                        <Text className="text-gray-500 text-xs">Location</Text>
                        <Text className="text-gray-900 text-sm font-medium" numberOfLines={2}>
                          {event.details.location}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Contact Section */}
                <View className="mt-2">
                  {event.details.clientContactNumber1 && (
                    <TouchableOpacity
                      className="bg-gray-50 mb-2 flex-row items-center rounded-lg p-3"
                      onPress={() => handlePhonePress(event.details.clientContactNumber1)}>
                      <MaterialCommunityIcons name="phone-outline" size={18} color="#6B7280" />
                      <Text className="ml-3 font-medium text-blue-600">
                        {event.details.clientContactNumber1}
                      </Text>
                      <View className="ml-auto rounded-full bg-blue-100 px-2 py-1">
                        <Text className="text-xs text-blue-800">
                          Tap to call {event.details.clientContactPerson1}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {event.details.clientContactNumber2 && (
                    <TouchableOpacity
                      className="bg-gray-50 flex-row items-center rounded-lg p-3"
                      onPress={() => handlePhonePress(event.details.clientContactNumber2)}>
                      <MaterialCommunityIcons name="phone-outline" size={18} color="#6B7280" />
                      <Text className="ml-3 font-medium text-blue-600">
                        {event.details.clientContactNumber2}
                      </Text>
                      <View className="ml-auto rounded-full bg-blue-100 px-2 py-1">
                        <Text className="text-xs text-blue-800">Tap to call</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default UpcomingEventReminder;
