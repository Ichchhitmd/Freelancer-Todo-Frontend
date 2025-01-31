import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Input Field Component
interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
  icon: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  icon,
}) => {
  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center">
        <MaterialCommunityIcons name={icon} size={20} color="#ef4444" />
        <Text className="ml-2 font-medium text-gray-700">{label}</Text>
      </View>
      <View className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <View className="flex-row items-center">
          <View className="px-4 py-3">
            <MaterialCommunityIcons name={icon} size={20} color="#9ca3af" />
          </View>
          <View className="flex-1 border-l border-gray-200">
            <TextInput
              className="px-4 py-3"
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default InputField;
