import React from 'react';
import { View, Text, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getGreeting } from 'utils/utils';

interface HeaderSectionProps {
  user: any;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ user, isActive, setIsActive }) => {
  const greeting = getGreeting();

  return (
    <View className="bg-white">
      <View className="px-4 pb-8 pt-10">
        <Text className="text-center text-lg font-semibold text-gray-800">{greeting}</Text>
      </View>

      <View className="relative">
        <View className="mx-4 -mb-4 rounded-xl bg-white p-4 shadow-lg">
          <View className="flex-row items-center">
            <View className="mr-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <MaterialCommunityIcons name="account" size={32} color="#ef4444" />
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">{user}</Text>
              <Text className="text-base text-gray-800">Photographer</Text>
            </View>

            <View className="items-center">
              <Switch
                value={isActive}
                onValueChange={() => setIsActive(!isActive)}
                trackColor={{ false: '#fca5a5', true: '#E50914' }}
                thumbColor={isActive ? '#E50914' : '#f8fafc'}
              />
              <View className="mt-1 rounded-full bg-gray-100 px-3 py-1">
                <Text className="text-xs font-medium text-gray-600">
                  {isActive ? 'AVAILABLE' : 'OFFLINE'}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between border-t border-gray-100 pt-4">
            <View className="items-center">
              <Text className="text-sm font-medium text-gray-500">Total Events</Text>
              <Text className="text-lg font-bold text-red-500">24</Text>
            </View>
            <View className="items-center">
              <Text className="text-sm font-medium text-gray-500">This Month</Text>
              <Text className="text-lg font-bold text-red-500">5</Text>
            </View>
            <View className="items-center">
              <Text className="text-sm font-medium text-gray-500">Earnings</Text>
              <Text className="text-lg font-bold text-red-500">₹45K</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeaderSection;
