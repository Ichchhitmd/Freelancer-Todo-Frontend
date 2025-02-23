import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import getInitials from 'utils/initialsName';
import { getGreeting } from 'utils/utils';

interface HeaderSectionProps {
  user: string | undefined;
  remainingAmount: number | undefined;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ user, remainingAmount }) => {
  const insets = useSafeAreaInsets();
  const greeting = getGreeting();

  return (
    <View className="bg-red-50" style={{ paddingTop: insets.top }}>
      <View className="pb-3 pt-2">
        <Text className="text-center text-xl font-semibold text-red-900">{greeting}</Text>
      </View>

      <View className="bg-white">
        <Pressable
          className="flex-row items-center p-4"
          android_ripple={{ color: 'rgba(239, 68, 68, 0.1)' }}>
          <View className="mr-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-red-400">
              <Text className="text-3xl font-bold text-white">{getInitials(user)}</Text>
            </View>
          </View>

          <View className="flex-1">
            <Text className="mb-1 text-sm font-semibold text-red-400">Welcome back,</Text>
            <Text className="text-2xl font-extrabold text-red-900" numberOfLines={1}>
              {user || 'Guest'}
            </Text>
            <Text className="text-lg font-semibold text-red-500">Due: ₹{remainingAmount || 0}</Text>
          </View>
        </Pressable>
      </View>

      <View className="h-3 bg-red-50" />
    </View>
  );
};

export default HeaderSection;
