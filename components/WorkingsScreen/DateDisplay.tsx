import React from 'react';
import { View, Text } from 'react-native';

interface DateDisplayProps {
  date: string | React.ReactNode;
  isUpcoming: boolean;
}

export const DateDisplay = ({ date, isUpcoming }: DateDisplayProps) => {
  return (
    <View
      className={`${isUpcoming ? 'bg-green-500' : 'bg-red-500'} flex w-16 items-center justify-center rounded-lg p-3`}>
      <Text className="text-center text-sm font-semibold text-white">{date}</Text>
    </View>
  );
};
