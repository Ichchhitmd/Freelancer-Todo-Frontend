import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FilterButtonProps {
  active: boolean;
  onPress: () => void;
  icon: string;
  label: string;
}

export const FilterButton = ({ active, onPress, icon, label }: FilterButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mr-2 flex-row items-center rounded-full px-4 py-2 ${
      active ? 'bg-red-500' : 'bg-gray-100'
    }`}>
    <MaterialCommunityIcons
      name={icon}
      size={16}
      color={active ? '#ffffff' : '#666666'}
      style={{ marginRight: 4 }}
    />
    <Text
      className={`text-sm font-medium ${
        active ? 'text-white' : 'text-gray-600'
      }`}>
      {label}
    </Text>
  </TouchableOpacity>
);