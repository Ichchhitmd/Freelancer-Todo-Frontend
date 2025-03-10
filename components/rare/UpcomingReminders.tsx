import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import { EventResponse } from 'types/eventTypes';
import type { RootStackParamList } from 'types/navigation';
import { getDaysStatus } from 'utils/utils';

import { formatNepaliDates } from '../utils/NepaliDateFormatter';

interface UpcomingEventReminderProps {
  events: EventResponse[];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UpcomingEventReminder: React.FC<UpcomingEventReminderProps> = ({ events }) => {
  const today = new Date();
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate[0]);
    return eventDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
  });
  const sortedEvents = [...futureEvents].sort((a, b) => {
    const dateA = new Date(a.eventDate[0]);
    const dateB = new Date(b.eventDate[0]);
    return dateA.getTime() - dateB.getTime();
  });

  const formatEventName = (event: EventResponse) => {
    const categoryName = event.eventCategory?.name || 'Event';
    return `${categoryName} (${event.side})`;
  };

  const getDisplayName = (event: EventResponse) => {
    if (event.companyId && event.company) {
      return event.company.name || event.venueDetails?.name || `Event #${event.id}`;
    }
    return `${event.assignedBy}'s Work`;
  };

  const handlePhonePress = (phoneNumber?: string) => {
    if (!phoneNumber) return;
    Linking.openURL(Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`);
  };

  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="bg-gray-50 p-4">
      <Text className="text-gray-900 mb-6 text-2xl font-bold">Upcoming Events</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 10 }}
        snapToInterval={Dimensions.get('window').width - 32}
        decelerationRate="fast"
        snapToAlignment="center">
        {sortedEvents.map((event, index) => {
          const eventDate = new Date(event.eventDate[0]);
          const { statusText, statusStyle, isToday } = getDaysStatus(eventDate);
          const formattedDates = formatNepaliDates(event.detailNepaliDate);

          return (
            <TouchableOpacity
              key={event.id}
              activeOpacity={0.9}
              onPress={() => {
                navigation.navigate('DateDetails', { details: event });
              }}
              className={`mb-5 overflow-hidden rounded-2xl border-l-4 
              bg-white shadow-sm ${isToday ? 'border-blue-500' : 'border-orange-400'}`}
              style={{
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                width: Dimensions.get('window').width - 47,
                marginRight: 16,
              }}>
              <View className="p-5">
                <View className="mb-3 flex-row items-start justify-between">
                  <View className=" pr-2 w-1/3">
                    <Text className="text-gray-900 text-lg font-bold" numberOfLines={3}>
                      {getDisplayName(event)}
                    </Text>
                    <Text className="text-gray-600 text-sm">{formatEventName(event)}</Text>
                  </View>
                  <View className="mt-4 flex-row items-center justify-end gap-5">
                    <View className={`rounded-full px-3 py-1 ${statusStyle}`}>
                      <Text className="text-xs font-semibold">{statusText}</Text>
                    </View>

                    <View className="flex-row items-center">
                      <View className="flex-row items-center rounded-full bg-orange-100 px-3 py-1.5">
                        <MaterialCommunityIcons name="calendar-blank" size={14} color="#F59E0B" />
                        <Text className="ml-2 text-base font-medium text-orange-800">
                          {formattedDates}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="bg-gray-100 my-4 h-px" />

                <View className="flex-row flex-wrap">
                  {event.eventStartTime && (
                    <View className="mb-4 w-1/2 pr-2">
                      <View className="flex-row items-center rounded-lg bg-blue-50 p-3">
                        <MaterialCommunityIcons name="clock-outline" size={18} color="#3B82F6" />
                        <View className="ml-2">
                          <Text className="text-gray-500 text-xs">Starts at</Text>
                          <Text className="text-gray-900 text-sm font-medium">
                            {event.eventStartTime}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  <View className="mb-4 w-1/2 pl-2">
                    <View className="flex-row items-center rounded-lg bg-green-50 p-3">
                      <MaterialCommunityIcons name="cash" size={18} color="#10B981" />
                      <View className="ml-2">
                        <Text className="text-gray-500 text-xs">Earnings</Text>
                        <Text className="text-lg font-semibold text-green-800">
                          रू {Number(event.earnings).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {event.venueDetails?.location && (
                    <View className="mb-4 w-full">
                      <View className="flex-row items-center rounded-lg bg-purple-50 p-3">
                        <MaterialCommunityIcons
                          name="map-marker-outline"
                          size={18}
                          color="#8B5CF6"
                        />
                        <View className="ml-2 flex-1">
                          <Text className="text-gray-500 text-xs">Location</Text>
                          <Text className="text-gray-900 text-sm font-medium" numberOfLines={2}>
                            {event.venueDetails.location}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <View className="space-y-2">
                  {event.primaryContact?.phoneNumber && (
                    <TouchableOpacity
                      onPress={() => handlePhonePress(event.primaryContact?.phoneNumber)}
                      className="bg-gray-50 flex-row items-center rounded-lg p-3">
                      <MaterialCommunityIcons name="phone-outline" size={18} color="#6B7280" />
                      <Text className="ml-3 font-medium text-blue-600">
                        {event.side
                          ? `Call ${event.primaryContact?.name} (${event.side})`
                          : 'Primary Contact'}
                      </Text>
                      <View className="ml-auto rounded-full bg-blue-100 px-2 py-1">
                        <Text className="text-xs text-blue-800">
                          {event.primaryContact.phoneNumber}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {event.secondaryContact?.phoneNumber && (
                    <TouchableOpacity
                      onPress={() => handlePhonePress(event.secondaryContact?.phoneNumber)}
                      className="bg-gray-50 flex-row items-center rounded-lg p-3">
                      <MaterialCommunityIcons name="phone-plus-outline" size={18} color="#6B7280" />
                      <Text className="ml-3 font-medium text-blue-600">
                        {event.side
                          ? `Call ${event.secondaryContact?.name} (Secondary)`
                          : 'Secondary Contact'}
                      </Text>
                      <View className="ml-auto rounded-full bg-blue-100 px-2 py-1">
                        <Text className="text-xs text-blue-800">
                          {event.secondaryContact.phoneNumber}
                        </Text>
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
