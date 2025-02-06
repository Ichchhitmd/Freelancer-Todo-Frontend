import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  multiline?: boolean;
  icon: string;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  icon,
  secureTextEntry = false,
  error,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View className="mb-5">
      <View
        className={`${multiline ? 'h-20' : 'h-14'} bg-gray-50 rounded border flex-row items-center px-2
          ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-100'}`}
      >
        <MaterialCommunityIcons
          name={icon}
          size={25}
          color={error ? '#ef4444' : isFocused ? '#3b82f6' : '#6b7280'}
        />

        <TextInput
          className={`flex-1 ml-2 text-base text-gray-900 ${disabled ? 'opacity-50' : ''}`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
        />

        {!!value && !disabled && (
          <TouchableOpacity onPress={() => onChangeText('')} className="ml-2 p-2">
            <MaterialCommunityIcons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View className="mt-1.5 flex-row items-center">
          <MaterialCommunityIcons name="alert-circle" size={14} color="#ef4444" />
          <Text className="ml-1.5 text-sm text-red-500">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default InputField;