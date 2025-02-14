import React, { useEffect, useState } from 'react';
import { NepaliDateFormatter } from '../utils/NepaliDateFormatter';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateDisplay } from './DateDisplay';
import { SimplifiedWorkItem } from 'types/WorkingScreenTypes';

interface WorkItemProps {
  item: SimplifiedWorkItem;
  onPress: () => void;
  index: number;
}

export const WorkItem = ({ item, onPress, index }: WorkItemProps) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 120,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: index * 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onPress());
  };

  const workTypes = Array.isArray(item.workType)
    ? item.workType
    : item.workType?.split(',').map((type) => type.trim()) || [];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }, { scale: scaleAnim }],
      }}
      className="mb-4">
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.95}
        className="overflow-hidden rounded-xl bg-white">
        <View className="p-4">
          <View className="flex-row items-start">
            <DateDisplay
              date={<NepaliDateFormatter dates={item.detailNepaliDate} />}
              isUpcoming={item.isUpcoming}
            />
            <View className="ml-4 flex-1">
              <Text className="text-gray-900 text-xl font-bold">{item.companyName}</Text>

              <View className="mt-2 flex-row items-center">
                <MaterialCommunityIcons
                  name={item.isUpcoming ? 'calendar-plus' : 'calendar-check'}
                  size={16}
                  color={item.isUpcoming ? '#059669' : '#DC2626'}
                />
                <Text
                  className={`ml-1 text-sm font-semibold ${
                    item.isUpcoming ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {item.isUpcoming ? 'Upcoming' : 'Past Event'}
                </Text>
              </View>

              {item.location && (
                <View className="mt-2 flex-row items-center">
                  <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1 text-sm font-medium">{item.location}</Text>
                </View>
              )}
            </View>
          </View>

          <View className="mt-4 space-y-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3 space-x-2">
                {item.eventType && (
                  <View className="rounded-full bg-blue-100 px-3 py-1">
                    <Text className="text-sm font-medium text-blue-800">{item.eventType}</Text>
                  </View>
                )}

                {item.side && (
                  <View className="rounded-full bg-purple-100 px-3 py-1">
                    <Text className="text-sm font-medium text-purple-800">{item.side}</Text>
                  </View>
                )}

                {workTypes.map((type, index) => (
                  <View key={index} className="rounded-full bg-green-100 px-3 py-1">
                    <Text className="text-sm font-medium text-green-800">{type}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="border-gray-100 mt-4 border-t pt-3">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={handlePress} className="bg-gray-50 rounded-lg px-4 py-2">
                <Text className="text-gray-700 text-sm font-semibold">View Company Details</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-green-600">{item.earnings}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WorkItem;
