import React, { useEffect } from 'react';
import { NepaliDateFormatter } from '../utils/NepaliDateFormatter';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SimplifiedWorkItem } from 'types/WorkingScreenTypes';

interface WorkItemProps {
  item: SimplifiedWorkItem;
  onPress: () => void;
  index: number;
}

export const WorkItem = ({ item, onPress, index }: WorkItemProps) => {
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(50);
  const scaleAnim = new Animated.Value(1);

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
      className="mb-6">
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.95}
        className="rounded-2xl bg-white shadow-lg">
        <View className="p-6">
          {/* Header Section */}
          <View className="flex-row items-center justify-between">
            {/* Highlighted Date */}
            <View className="rounded-lg bg-blue-100 px-4 py-2">
              <Text className="text-base font-semibold text-blue-800">
                <NepaliDateFormatter dates={item.detailNepaliDate} />
              </Text>
            </View>

            {/* Status Label */}
            <View className={`bg-gray-100 rounded-md px-3 py-1`}>
              <Text className="text-gray-700 text-sm font-medium">{item.statusText}</Text>
            </View>
          </View>

          {/* Main Content */}
          <View className="mt-4">
            <Text className="text-gray-900 text-xl font-bold">{item.companyName}</Text>
            {item.location && (
              <View className="mt-2 flex-row items-center">
                <MaterialCommunityIcons name="map-marker" size={18} color="#6B7280" />
                <Text className="text-gray-600 ml-1 text-sm">{item.location}</Text>
              </View>
            )}
          </View>

          <View className="mt-4 flex-row flex-wrap gap-2">
            {item.eventType && (
              <View className="rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-sm font-medium text-blue-700">{item.eventType}</Text>
              </View>
            )}
            {item.side && (
              <View className="rounded-full bg-purple-50 px-3 py-1">
                <Text className="text-sm font-medium text-purple-700">{item.side}</Text>
              </View>
            )}
            {workTypes.map((type, index) => (
              <View key={index} className="rounded-full bg-green-50 px-3 py-1">
                <Text className="text-sm font-medium text-green-700">{type}</Text>
              </View>
            ))}
          </View>

          <View className="border-gray-200 mt-6 flex-row items-center justify-between border-t pt-4">
            <Text className="text-2xl font-bold text-green-600">{item.earnings}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WorkItem;
