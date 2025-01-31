import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
}) => {
  return (
    <View className="mb-4">
      <Text className="mb-1 font-medium text-gray-700">{label}</Text>
      <TextInput
        className="rounded-lg bg-gray-100 p-4"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
};

export default InputField;
