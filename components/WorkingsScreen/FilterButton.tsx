import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const FilterButton = ({ label, isActive, onPress }: FilterButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mr-2 rounded-full px-4 py-2 ${
      isActive ? 'bg-red-500' : 'bg-gray-100'
    } active:opacity-80`}>
    <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);