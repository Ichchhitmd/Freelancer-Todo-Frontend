import React from 'react';
import { View, Text } from 'react-native';

interface TagChipProps {
  text: string | string[];
}

export const TagChip = ({ text }: TagChipProps) => {
  return (
    <View className={` mb-2 mr-2 flex-row items-center rounded-lg px-3 py-1.5 shadow-sm`}>
      <Text className="text-sm font-medium text-white">
        {Array.isArray(text) ? text.join(', ') : text}
      </Text>
    </View>
  );
};
