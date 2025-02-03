import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const options = ['Bride', 'Groom'];

const BrideGroomDropdown: React.FC<{ value: string; onChange: (value: string) => void }> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center">
        <MaterialCommunityIcons name="account-heart" size={20} color="#ef4444" />
        <Text className="text-gray-700 ml-2 font-medium">Select Event Type</Text>
      </View>

      <TouchableOpacity
        className="border-gray-200 flex-row items-center justify-between rounded-xl border bg-white p-4"
        onPress={() => setOpen(!open)}>
        <Text className={`text-gray-700 ${value ? 'font-medium' : 'text-gray-400'}`}>
          {value || 'Select Event Type'}
        </Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#ef4444"
        />
      </TouchableOpacity>

      {open && (
        <View className="absolute left-0 right-0 top-full z-10 bg-white">
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              className={`flex-row items-center p-4 ${value === option ? 'bg-red-50' : ''}`}
              onPress={() => {
                onChange(option);
                setOpen(false); // Close the dropdown when an option is selected
              }}>
              <Text
                className={`ml-3 flex-1 ${value === option ? 'font-medium text-red-500' : 'text-gray-700'}`}>
                {option}
              </Text>
              {value === option && (
                <MaterialCommunityIcons name="check-circle" size={20} color="#ef4444" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default BrideGroomDropdown;
