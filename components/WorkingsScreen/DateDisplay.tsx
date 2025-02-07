import React from 'react';
import { View, Text } from 'react-native';
import { ParsedDate } from 'types/WorkingScreenTypes';

interface DateDisplayProps {
  date: ParsedDate;
  isUpcoming: boolean;
}

export const DateDisplay = ({ date, isUpcoming }: DateDisplayProps) => (
  <View className={`${isUpcoming ? 'bg-green-500' : 'bg-red-500'} w-16 rounded-lg p-2 shadow-sm`}>
    <Text className="text-center text-xl font-bold text-white">{date.day}</Text>
    <Text className="text-center text-xs font-medium text-white">{date.month}</Text>
    <Text className="text-center text-xs text-white">{date.year}</Text>
  </View>
);
