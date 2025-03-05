import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { handleAxiosError } from 'helper/errorHandling/AxiosErrorHandle';
import { useResetPassword } from 'hooks/useAuth';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function PasswordResetScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: resetPassword } = useResetPassword();
  const navigation = useNavigation();
  const route = useRoute();

  const { email } = route.params as { email: string };

  const handlePasswordReset = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter both new password and confirm password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters long and include a letter, a number, and a special character'
      );
      return;
    }

    setIsLoading(true);
    resetPassword(
      { email, newPassword },
      {
        onSuccess: () => {
          setIsLoading(false);
          Alert.alert('Password Reset', 'Your password has been successfully reset.', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('LoginScreen'),
            },
          ]);
        },
        onError: (error) => {
          setIsLoading(false);
          Alert.alert('Password Reset Failed', handleAxiosError(error));
        },
      }
    );
  };

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center">
            <View className="rounded-b-[40px] bg-primary/30 px-6 pb-16 pt-12">
              <Text className="mb-2 text-4xl font-bold text-white">Reset Password</Text>
              <Text className="text-lg text-indigo-100">Create a new password for {email}</Text>
            </View>

            <View className="-mt-10 px-6">
              <View className="rounded-3xl bg-white p-6 shadow-xl">
                <View className="bg-gray-100 mb-4 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="lock" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="New Password"
                    placeholderTextColor="#333333"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#6b7280"
                    />
                  </Pressable>
                </View>

                <View className="bg-gray-100 mb-4 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="lock-outline" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="Confirm New Password"
                    placeholderTextColor="#333333"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>

                {isLoading ? (
                  <ActivityIndicator size="large" color="#6366F1" className="my-4" />
                ) : (
                  <Pressable
                    className="rounded-2xl bg-primary/75 py-4 shadow-lg shadow-primary/30"
                    onPress={handlePasswordReset}>
                    <Text className="text-center text-lg font-semibold text-white">
                      Reset Password
                    </Text>
                  </Pressable>
                )}

                <Pressable className="mt-6" onPress={() => navigation.goBack()}>
                  <Text className="text-gray-600 text-center text-sm">Back to Previous Step</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
