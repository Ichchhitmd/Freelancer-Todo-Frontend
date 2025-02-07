// InputField.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useCallback, memo } from 'react';
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

const InputField: React.FC<InputFieldProps> = memo(
  ({
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

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);
    const handleClear = useCallback(() => onChangeText(''), [onChangeText]);

    const containerStyle = `${multiline ? 'h-20' : 'h-14'} bg-gray-50 rounded border flex-row items-center px-2
    ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-100'}`;

    const iconColor = error ? '#ef4444' : isFocused ? '#3b82f6' : '#6b7280';

    return (
      <View className="mb-5">
        <View className={containerStyle}>
          <MaterialCommunityIcons name={icon} size={25} color={iconColor} />

          <TextInput
            className={`text-gray-900 ml-2 flex-1 text-base ${disabled ? 'opacity-50' : ''}`}
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
            <TouchableOpacity onPress={handleClear} className="ml-2 p-2">
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
  }
);

InputField.displayName = 'InputField';

export default InputField;
