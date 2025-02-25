import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
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

export const WorkItem = ({ item, index }: WorkItemProps) => {
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(50);

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

  const workTypes = Array.isArray(item.workType)
    ? item.workType
    : item.workType?.split(',').map((type) => type.trim()) || [];

  const paymentStatus = (item.originalEvent?.paymentStatus || item.paymentStatus || 'UNPAID') as PaymentStatusKey;
  const statusConfig = PAYMENT_STATUS_CONFIG[paymentStatus] || PAYMENT_STATUS_CONFIG.UNPAID;

  const dueAmount = item.originalEvent?.dueAmount || 0;
  const shouldShowDueAmount = (paymentStatus === 'UNPAID' || paymentStatus === 'PARTIALLY_PAID') && dueAmount > 0;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
      className="mb-4 mx-4">
      <View className="rounded-2xl bg-white shadow-sm">
        <View className="p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center space-x-2">
              <View
                className={`rounded-lg px-3 py-1.5 ${
                  item.isToday
                    ? 'bg-blue-500'
                    : item.daysDifference < 0
                    ? 'bg-red-500/10'
                    : 'bg-green-500/10'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    item.isToday
                      ? 'text-white'
                      : item.daysDifference < 0
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}>
                  <NepaliDateFormatter dates={item.detailNepaliDate} />
                </Text>
              </View>
              <View className="bg-gray-100 rounded-lg px-3 py-1.5">
                <Text className="text-gray-700 text-sm font-medium">
                  {item.isToday
                    ? 'Today'
                    : item.daysDifference > 0
                    ? `In ${item.daysDifference} days`
                    : `${Math.abs(item.daysDifference)} days ago`}
                </Text>
              </View>
            </View>

            <View
              className="flex-row items-center rounded-full px-3 py-1.5"
              style={{ backgroundColor: `${statusConfig.color}15` }}>
              <View
                className="mr-2 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: statusConfig.color }}
              />
              <Text className="text-xs font-medium" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Company Name */}
          <Text className="text-gray-900 text-lg font-semibold mb-2">
            {item.companyName || 'Untitled Event'}
          </Text>

          {/* Location */}
          {item.location && (
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1 text-sm">{item.location}</Text>
            </View>
          )}

          {/* Tags */}
          <View className="flex-row flex-wrap gap-1.5 mb-3">
            {item.eventType && (
              <View className="rounded-full bg-blue-50 px-2.5 py-1">
                <Text className="text-xs font-medium text-blue-700">{item.eventType}</Text>
              </View>
            )}
            {item.side && (
              <View className="rounded-full bg-purple-50 px-2.5 py-1">
                <Text className="text-xs font-medium text-purple-700">{item.side}</Text>
              </View>
            )}
            {workTypes.map((type, idx) => (
              <View key={idx} className="rounded-full bg-green-50 px-2.5 py-1">
                <Text className="text-xs font-medium text-green-700">{type}</Text>
              </View>
            ))}
          </View>

          {/* Money Info */}
          <View className="flex-row items-center justify-between">
            {item.earnings && parseFloat(item.earnings) > 0 && (
              <Text className="text-lg font-bold text-green-600">
                रू {parseFloat(item.earnings).toLocaleString()}
              </Text>
            )}
            {shouldShowDueAmount && (
              <View className="rounded-lg bg-yellow-50 px-3 py-1.5">
                <Text className="text-sm font-medium text-yellow-700">
                  Due: रू {dueAmount.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default WorkItem;
