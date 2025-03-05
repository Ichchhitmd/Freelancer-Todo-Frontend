import { useNavigation, useRoute } from '@react-navigation/native';
import { useResendOtp, useVerifyOtp } from 'hooks/useAuth';
import React, { useState, useRef, useEffect } from 'react';
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

export default function OtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const { mutate: verifyOtp } = useVerifyOtp();
  const { mutate: resendOtp } = useResendOtp();
  const navigation = useNavigation();
  const route = useRoute();
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const { email } = route.params as { email: string };

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setCanResendOtp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canResendOtp]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      verifyOtp(
        { email, otp: otpCode },
        {
          onSuccess: () => {
            navigation.navigate('PasswordResetScreen', { email });
          },
          onError: () => {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
          },
        }
      )
    }, 2000);
  };

  const handleResendOtp = () => {
    if (!canResendOtp) {
      Alert.alert('Please wait', `You can resend OTP in ${remainingTime} seconds`);
      return;
    }

    setIsResendLoading(true);
    resendOtp(
      { email },
      {
        onSuccess: () => {
          setCanResendOtp(false);
          setRemainingTime(120);
          setIsResendLoading(false);
          Alert.alert('OTP Resent', 'A new OTP has been sent to your email.');
        },
        onError: () => {
          setIsResendLoading(false);
          Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        },
      }
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
              <Text className="mb-2 text-4xl font-bold text-white">Verify OTP</Text>
              <Text className="text-lg text-indigo-100">
                Enter the 4-digit code sent to {email}
              </Text>
            </View>

            <View className="-mt-10 px-6">
              <View className="rounded-3xl bg-white p-6 shadow-xl">
                <View className="mb-6 flex-row justify-between">
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={inputRefs[index]}
                      className="bg-gray-100 border-gray-200 h-16 w-16 rounded-lg border text-center text-2xl"
                      keyboardType="numeric"
                      maxLength={1}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                    />
                  ))}
                </View>

                {isLoading ? (
                  <ActivityIndicator size="large" color="#6366F1" className="my-4" />
                ) : (
                  <Pressable
                    className="mb-4 rounded-2xl bg-primary/75 py-4 shadow-lg shadow-primary/30"
                    onPress={handleVerifyOtp}>
                    <Text className="text-center text-lg font-semibold text-white">Verify OTP</Text>
                  </Pressable>
                )}

                <Pressable onPress={handleResendOtp} disabled={!canResendOtp || isResendLoading}>
                  {isResendLoading ? (
                    <ActivityIndicator size="small" color="#6366F1" />
                  ) : (
                    <Text
                      className={`text-center text-sm ${canResendOtp ? 'text-primary' : 'text-gray-400'}`}>
                      {canResendOtp ? 'Resend OTP' : `Resend OTP in ${formatTime(remainingTime)}`}
                    </Text>
                  )}
                </Pressable>

                <Pressable className="mt-6" onPress={() => navigation.goBack()}>
                  <Text className="text-gray-600 text-center text-sm">Back to Email Entry</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
