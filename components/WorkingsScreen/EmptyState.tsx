import React from 'react';
import { View, Text } from 'react-native';

export const EmptyState = () => (
  <View className="flex-1 items-center justify-center p-8">
    <View className="mb-4 rounded-full bg-red-50 p-4">
      <Text className="text-4xl">📋</Text>
    </View>
    <Text className="text-gray-800 mb-2 text-xl font-bold">No Works Found</Text>
    <Text className="text-gray-500 text-center">Try adjusting your filters to see more events</Text>
  </View>
);
