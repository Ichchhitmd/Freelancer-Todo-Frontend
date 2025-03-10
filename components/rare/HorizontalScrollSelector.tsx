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
  value: string | string[];
  onChange: (value: string | string[]) => void;
  selectMultiple?: boolean;
}

const HorizontalSelector: React.FC<HorizontalSelectorProps> = ({
  options,
  value,
  onChange,
  selectMultiple = false,
}) => {
  const handleSelection = (optionId: string) => {
    if (selectMultiple) {
      if (Array.isArray(value)) {
        if (value.includes(optionId)) {
          onChange(value.filter((id) => id !== optionId));
        } else {
          onChange([...value, optionId]);
        }
      } else {
        onChange([optionId]);
      }
    } else {
      onChange(optionId);
    }
  };

  return (
    <View className="mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-2"
        contentContainerStyle={{ paddingRight: 16 }}>
        {options.map((option) => {
          const isSelected = Array.isArray(value) ? value.includes(option.id) : value === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleSelection(option.id)}
              activeOpacity={0.7}
              className={`shadow-gray-200 mr-3 flex-row items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm`}>
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
