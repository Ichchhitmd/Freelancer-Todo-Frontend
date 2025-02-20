import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { loginSuccess } from 'redux/slices/authSlices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleAxiosError } from 'helper/errorHandling/AxiosErrorHandle';
import * as LocalAuthentication from 'expo-local-authentication';
import { useLogin } from 'hooks/useAuth';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    role: 'freelancer',
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { mutate: loginUser, status, isError, error } = useLogin();

  useEffect(() => {
    const initialize = async () => {
      await checkBiometricSupport();
      const cachedCredentials = await AsyncStorage.getItem('cachedCredentials');
      if (cachedCredentials) {
        const { phone, password } = JSON.parse(cachedCredentials);
        setFormData(prev => ({ ...prev, phone, password }));
      }
      setIsLoading(false);
    };
    
    initialize();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
      const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isBiometricAvailable || !isBiometricEnrolled) {
        console.log('Biometric authentication not available');
      }
    } catch (error) {
      console.error('Biometric check error:', error);
    }
  };

  const handleLogin = () => {
    const { phone, password, role } = formData;
    if (!phone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    loginUser(
      { phone, password, role },
      {
        onSuccess: async (data) => {
          try {
            await AsyncStorage.setItem('cachedCredentials', JSON.stringify({ phone, password }));
            dispatch(loginSuccess(data));
          } catch (error) {
            console.error('Error caching credentials:', error);
            dispatch(loginSuccess(data));
          }
        },
        onError: (error) => {
          console.error('Login Failed:', error);
          Alert.alert('Login Error', handleAxiosError(error));
        },
      }
    );
  };

  const handleBiometricLogin = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
      });

      if (!success) {
        Alert.alert('Error', 'Authentication failed');
        return;
      }

      const cachedCredentials = await AsyncStorage.getItem('cachedCredentials');
      if (!cachedCredentials) {
        Alert.alert('Error', 'No saved credentials found');
        return;
      }

      const { phone, password } = JSON.parse(cachedCredentials);
      loginUser(
        { phone, password, role: 'freelancer' },
        {
          onSuccess: (data) => {
            dispatch(loginSuccess(data));
          },
          onError: (error) => {
            Alert.alert('Login Error', handleAxiosError(error));
            AsyncStorage.removeItem('cachedCredentials');
          },
        }
      );
    } catch (error) {
      console.error('Biometric error:', error);
      Alert.alert('Error', 'Failed to authenticate');
    }
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
              <Text className="mb-2 text-4xl font-bold text-white">Welcome Back</Text>
              <Text className="text-lg text-indigo-100">Sign in to continue</Text>
            </View>

            <View className="-mt-10 px-6">
              <View className="rounded-3xl bg-white p-6 shadow-xl">
                <View className="bg-gray-100 mb-4 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="phone" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="Phone Number"
                    placeholderTextColor="#333333"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Password Input */}
                <View className="bg-gray-100 mb-6 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="lock" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray"
                    placeholder="Password"
                    placeholderTextColor="#333333"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                  />
                </View>

                {status === 'pending' ? (
                  <ActivityIndicator size="large" color="#6366F1" className="my-4" />
                ) : (
                  <View className="space-y-4">
                    <Pressable
                      className="rounded-2xl bg-primary/75 py-4 shadow-lg shadow-primary/30"
                      onPress={handleLogin}>
                      <Text className="text-center text-lg font-semibold text-white">Sign In</Text>
                    </Pressable>

                    <View className="my-2 flex-row items-center">
                      <View className="bg-gray-300 h-[1px] flex-1" />
                      <Text className="text-gray-500 mx-4">or</Text>
                      <View className="bg-gray-300 h-[1px] flex-1" />
                    </View>

                    <Pressable
                      className="rounded-2xl border-2 border-emerald-500 bg-white py-4"
                      onPress={handleBiometricLogin}>
                      <View className="flex-row items-center justify-center space-x-2">
                        <MaterialIcons name="fingerprint" size={28} color="#10B981" />
                        <Text className="text-lg font-semibold text-emerald-500">
                          Use Fingerprint
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                )}

                <Pressable className="mt-6" onPress={() => navigation.navigate('RegisterScreen')}>
                  <Text className="text-gray-600 text-center text-sm">
                    Don't have an account?{' '}
                    <Text className="font-semibold text-indigo-600">Create Account</Text>
                  </Text>
                </Pressable>
              </View>
            </View>

            {isError && (
              <View className="mx-6 mt-4">
                <View className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <Text className="text-center text-sm text-red-600">
                    {handleAxiosError(error)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
