import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useForgotPassword } from 'hooks/useAuth';
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { mutate: forgotPassword } = useForgotPassword();

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    forgotPassword(
      { email },
      {
        onSuccess: () => {
          setIsLoading(false);
          Alert.alert(
            'OTP Sent',
            'An OTP has been sent to your email address. Please check your inbox.',
            [{ text: 'OK', onPress: () => navigation.navigate('OtpScreen', { email }) }]
          );
        },
        onError: (error: any) => {
          setIsLoading(false);
          Alert.alert('Error', error?.message || 'Failed to send OTP. Please try again.');
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
              <Text className="text-lg text-indigo-100">Enter your email to reset password</Text>
            </View>

            <View className="-mt-10 px-6">
              <View className="rounded-3xl bg-white p-6 shadow-xl">
                <View className="bg-gray-100 mb-4 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="email" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="Email Address"
                    placeholderTextColor="#333333"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {isLoading ? (
                  <ActivityIndicator size="large" color="#6366F1" className="my-4" />
                ) : (
                  <Pressable
                    className="rounded-2xl bg-primary/75 py-4 shadow-lg shadow-primary/30"
                    onPress={handleResetPassword}>
                    <Text className="text-center text-lg font-semibold text-white">
                      Reset Password
                    </Text>
                  </Pressable>
                )}

                <View className="mt-6">
                  <Text className="text-gray-600 text-center text-sm">
                    Remember your password?{' '}
                  </Text>
                  <Pressable className="mt-6" onPress={() => navigation.goBack()}>
                    <Text className="text-center text-sm text-blue-600">Back to Login</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
