import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

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
    <View className="mb-6">
      <View className="mb-3 flex-row items-center px-2">
        <MaterialCommunityIcons name={icon} size={24} color="primary" />
        <Text className="text-gray-900 ml-2 text-lg font-semibold">{label}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-2"
        contentContainerStyle={{ paddingRight: 16 }}>
        {options.map((option) => {
          const isSelected = value === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onChange(option.id)}
              activeOpacity={0.7}
              className={`border-gray-200 shadow-gray-200 mr-3 flex-row items-center rounded-lg border bg-white px-4 py-2.5 shadow-sm`}>
              {option.icon && (
                <MaterialCommunityIcons
                  name={option.icon}
                  size={20}
                  color={isSelected ? '#E50914' : '#6b7280'}
                  className="mr-2"
                />
              )}
              <Text
                className={`text-base ${
                  isSelected ? 'font-semibold text-primary' : 'text-gray-600'
                }`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HorizontalSelector;
