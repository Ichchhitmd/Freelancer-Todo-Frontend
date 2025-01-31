import React from 'react';
import { View, Text, Switch } from 'react-native';
import { User } from 'react-native-feather';
import { getGreeting } from 'utils/utils';

const HeaderSection: React.FC<{
  user: any;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ user, isActive, setIsActive }) => {
  const greeting = getGreeting();

  return (
    <View className="top-0 rounded-b-xl bg-white p-6 shadow-md">
      <View className="mt-4 flex-row items-center">
        <View className="mr-4 rounded-full bg-blue-100 p-4">
          <User stroke="#4f46e5" width={24} height={24} />
        </View>
        <View className="flex-1">
          <Text className="text-sm text-gray-500">{greeting}</Text>
          <Text className="text-2xl font-semibold text-gray-900">{user.name}</Text>
        </View>
        <View className="items-center">
          <Switch
            value={isActive}
            onValueChange={() => setIsActive(!isActive)}
            trackColor={{ false: '#e2e8f0', true: '#c7d2fe' }}
            thumbColor={isActive ? '#4f46e5' : '#f8fafc'}
          />
          <Text className="mt-2 text-xs text-gray-500">{isActive ? 'AVAILABLE' : 'OFFLINE'}</Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderSection;
