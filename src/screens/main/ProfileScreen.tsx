import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

export default function ProfileScreen() {
  const username = useSelector((state: RootState) => state.auth.name);

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <View className="mt-12">
        <Text className="text-3xl font-bold text-gray-900">Profile</Text>

        <View className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <Text className="text-xl font-semibold text-gray-800">Account Information</Text>
          <View className="mt-4">
            <Text className="text-gray-600">Hello, {username}</Text>
            <Text className="mt-1 font-medium text-gray-900"></Text>
          </View>
        </View>

        <Pressable className="mt-6 rounded-lg bg-red-500 py-4">
          <Text className="text-center text-lg font-medium text-white">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
