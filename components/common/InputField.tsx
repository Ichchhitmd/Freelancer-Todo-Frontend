import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';

interface InputFieldProps {
  label: string;
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
  label,
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
  const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    animateLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) animateLabel(0);
  };

  const animateLabel = (toValue: number) => {
    Animated.timing(labelPosition, {
      toValue,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    transform: [
      {
        translateY: labelPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [19, 0],
        }),
      },
    ],
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ['#6b7280', error ? '#ef4444' : '#3b82f6'],
    }),
  };

  return (
    <View className="mb-5">
      <View
        className="bg-gray-50 relative h-16
        border border-gray/10">
        <Animated.Text style={labelStyle} className="bg-gray-50 absolute left-12 z-0 font-medium">
          {label}
        </Animated.Text>

        <View className="h-full w-full flex-row items-center gap-2 px-2">
          <MaterialCommunityIcons
            name={icon}
            size={25}
            color={error ? '#ef4444' : isFocused ? '#3b82f6' : '#6b7280'}
          />

          <TextInput
            className={`text-gray-900 flex-1 text-base ${disabled ? 'opacity-50' : ''}`}
            placeholder={isFocused ? placeholder : ''}
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
            style={{ paddingVertical: multiline ? 12 : 0 }}
          />

          {!!value && !disabled && (
            <TouchableOpacity onPress={() => onChangeText('')} className="ml-2">
              <MaterialCommunityIcons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
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
