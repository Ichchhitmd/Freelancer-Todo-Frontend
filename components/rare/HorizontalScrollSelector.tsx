import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Option {
  id: string;
  label: string;
  icon?: string;
}

interface HorizontalSelectorProps {
  label: string;
  icon: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const HorizontalSelector: React.FC<HorizontalSelectorProps> = ({
  label,
  icon,
  options,
  value,
  onChange,
}) => {
  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center">
        <MaterialCommunityIcons name={icon} size={20} color="#dc2626" />
        <Text className="text-gray-700 ml-2 font-medium">{label}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onChange(option.id)}
            className={`mr-2 flex-row items-center rounded-full px-3 py-2 ${
              value === option.id ? 'bg-red-500' : 'border-gray-200 border bg-white'
            }`}>
            {option.icon && (
              <MaterialCommunityIcons
                name={option.icon}
                size={18}
                color={value === option.id ? 'white' : '#6b7280'}
                className="mr-1"
              />
            )}
            <Text className={`${value === option.id ? 'font-medium text-white' : 'text-gray-700'}`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HorizontalSelector;
