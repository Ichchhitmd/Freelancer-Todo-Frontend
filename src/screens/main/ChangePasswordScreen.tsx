import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { changePassword } from '../../../helper/authRequest';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    // Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword
      });

      // Show success alert
      Alert.alert('Success', 'Password changed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white-100">
      <View className="bg-red-500 h-1/4">
        <View className="p-6 mt-14">
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900">Change Password</Text>
          </View>
        </View>
      </View>
      <View className="p-6 rounded-lg">
        <View className="mb-4">
          <Text className="text-gray-700 mb-2">Current Password</Text>
          <View className="flex-row items-center bg-white rounded-lg p-3">
            <MaterialCommunityIcons name="lock" size={20} color="gray" className="mr-2" />
            <TextInput
              className="flex-1"
              secureTextEntry
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>
        </View>
        <View className="mb-4">
          <Text className="text-gray-700 mb-2">New Password</Text>
          <View className="flex-row items-center bg-white rounded-lg p-3">
            <MaterialCommunityIcons name="lock" size={20} color="gray" className="mr-2" />
            <TextInput
              className="flex-1"
              secureTextEntry
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
        </View>
        <View className="mb-8">
          <Text className="text-gray-700 mb-2">Confirm New Password</Text>
          <View className="flex-row items-center bg-white rounded-lg p-3">
            <MaterialCommunityIcons name="lock" size={20} color="gray" className="mr-2" />
            <TextInput
              className="flex-1"
              secureTextEntry
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>
        <Pressable
          onPress={handleChangePassword}
          className={`rounded-lg p-4 items-center ${isLoading ? 'bg-gray-400' : 'bg-black'}`}
          disabled={isLoading}
        >
          <Text className="text-white text-lg font-semibold">
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}