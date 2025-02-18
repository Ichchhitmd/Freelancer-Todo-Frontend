import React from 'react';
import { View, Text } from 'react-native';

interface DateDisplayProps {
  date: string | React.ReactNode;
  isUpcoming: boolean;
}

export const DateDisplay = ({ date, isUpcoming }: DateDisplayProps) => {
  return (
    <View
      className={`w-20 items-center justify-center rounded-md px-3 py-4 ${
        isUpcoming ? 'bg-green-500' : 'bg-red-500'
      }`}>
      <Text className="text-center text-sm font-semibold text-white">{date}</Text>
    </View>
  );
};
