import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SimplifiedWorkItem } from 'types/WorkingScreenTypes';

import { NepaliDateFormatter } from '../utils/NepaliDateFormatter';

const PAYMENT_STATUS_CONFIG = {
  UNPAID: { color: '#EF4444', label: 'Unpaid' },
  PAID: { color: '#10B981', label: 'Paid' },
  PARTIALLY_PAID: { color: '#F59E0B', label: 'Partially Paid' },
} as const;

type PaymentStatusKey = keyof typeof PAYMENT_STATUS_CONFIG;

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

  const paymentStatus = (item.originalEvent?.paymentStatus || 'UNPAID') as PaymentStatusKey;
  const statusConfig = PAYMENT_STATUS_CONFIG[paymentStatus] || PAYMENT_STATUS_CONFIG.UNPAID;

  const dueAmount = item.originalEvent?.dueAmount || (item as any).dueAmount || 0;

  const shouldShowDueAmount =
    (paymentStatus === 'UNPAID' || paymentStatus === 'PARTIALLY_PAID') && dueAmount > 0;

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
          <View className="flex-row items-center justify-between">
            <View
              className={`rounded-lg px-4 py-2 ${
                item.isToday
                  ? 'bg-blue-500'
                  : item.daysDifference < 0
                    ? 'bg-red-500'
                    : 'bg-green-500'
              }`}>
              <Text className="text-base font-semibold text-white">
                <NepaliDateFormatter dates={item.detailNepaliDate} />
              </Text>
            </View>

            <View className="bg-gray-100 rounded-md px-3 py-1">
              <Text className="text-gray-700 text-sm font-medium">{item.statusText}</Text>
            </View>

            <View
              className="flex-row items-center rounded-full px-2 py-1"
              style={{ backgroundColor: `${statusConfig.color}20` }}>
              <View
                className="mr-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: statusConfig.color }}
              />
              <Text className="text-xs font-semibold" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

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
            {shouldShowDueAmount && (
              <View className="rounded-lg p-2" style={{ backgroundColor: '#FEF3C7' }}>
                <Text className="text-lg font-semibold text-yellow-700">
                  Due: {dueAmount.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WorkItem;
