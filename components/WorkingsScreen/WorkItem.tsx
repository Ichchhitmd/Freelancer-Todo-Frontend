import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateDisplay } from './DateDisplay';
import { TagChip } from './TagChip';
import { SimplifiedWorkItem } from 'types/WorkingScreenTypes';

interface WorkItemProps {
  item: SimplifiedWorkItem;
  onPress: () => void;
  index: number;
}

export const WorkItem = ({ item, onPress, index }: WorkItemProps) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // const getStatusColor = (status?: string) => {
  //   switch (status) {
  //     case 'confirmed':
  //       return 'bg-blue-500';
  //     case 'completed':
  //       return 'bg-green-500';
  //     case 'cancelled':
  //       return 'bg-gray-500';
  //     default:
  //       return 'bg-yellow-500'; // pending
  //   }
  // };

  // const getStatusIcon = (status?: string) => {
  //   switch (status) {
  //     case 'confirmed':
  //       return 'check-circle';
  //     case 'completed':
  //       return 'check-circle-outline';
  //     case 'cancelled':
  //       return 'close-circle';
  //     default:
  //       return 'clock-outline'; // pending
  //   }
  // };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
      className="mb-3">
      <TouchableOpacity
        onPress={onPress}
        className="active:bg-gray-50 overflow-hidden rounded-xl bg-white"
        style={{
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}>
        {/* <View className={`${getStatusColor(item.status)} px-4 py-1`}>
          <Text className="text-xs font-medium text-white">
            <MaterialCommunityIcons name={getStatusIcon(item.status)} size={12} />{' '}
            {item.status || 'Pending'}
          </Text>
        </View> */}

        <View className="mt-5 p-4">
          <View className="flex-row">
            <DateDisplay date={item.eventDate} isUpcoming={item.isUpcoming} />
            <View className="ml-4 flex-1">
              <Text className="text-gray-800 text-xl font-bold">{item.companyName}</Text>
              <View className="mt-1 flex-row items-center">
                <MaterialCommunityIcons
                  name={item.isUpcoming ? 'calendar-plus' : 'calendar-check'}
                  size={16}
                  color={item.isUpcoming ? '#059669' : '#DC2626'}
                />
                <Text
                  className={`ml-1 text-sm font-medium ${
                    item.isUpcoming ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {item.isUpcoming ? 'Upcoming' : 'Past Event'}
                </Text>
              </View>
              {item.location && (
                <View className="mt-1 flex-row items-center">
                  <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
                  <Text className="text-gray-500 ml-1 text-sm">{item.location}</Text>
                </View>
              )}
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 mb-3 mt-3">
            <TagChip text={item.eventType} />
            <TagChip colors="bg-red-400" text={item.side} />
            <TagChip text={item.workType} />
          </ScrollView>

          <View className="border-gray-100 mt-2 flex-row items-center justify-between border-t pt-2">
            <Text className="text-gray-500 text-sm font-medium">Earnings</Text>
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-red-600">{item.earnings}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
