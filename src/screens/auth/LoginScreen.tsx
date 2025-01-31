import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLogin } from 'hooks/useAuth';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/slices/authSlices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    role: 'freelancer',
  });
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mutate: login, error } = useLogin();

  useEffect(() => {
    checkCachedCredentials();
    checkBiometricSupport();
  }, []);

  const checkCachedCredentials = async () => {
    try {
      const cachedCredentials = await AsyncStorage.getItem('cachedCredentials');
      if (cachedCredentials) {
        Alert.alert(
          'Cached Credentials Found',
          'Would you like to use your saved credentials or log in manually?',
          [
            {
              text: 'Use Saved Credentials',
              onPress: () => {
                const { phone, password } = JSON.parse(cachedCredentials);
                setFormData({ ...formData, phone, password });
              },
            },
            {
              text: 'Log In Manually',
              onPress: () => setFormData({ phone: '', password: '', role: 'freelancer' }),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Failed to load cached credentials', error);
    }
  };

  const checkBiometricSupport = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (isBiometricAvailable && isBiometricEnrolled) {
      console.log('Biometric authentication is available and enrolled');
    } else {
      console.log('Biometric authentication is not available or not enrolled');
    }
  };

  const handleLogin = () => {
    const { phone, password, role } = formData;
  
    console.log('Login Request:', { phone, password, role });
  
    login(
      { phone, password, role },
      {
        onSuccess: (data) => {
          console.log('Login Success:', data);
          dispatch(setUser(data));
          AsyncStorage.setItem('cachedCredentials', JSON.stringify({ phone, password }));
          navigation.navigate('MainTabs');
        },
        onError: (error) => {
          Alert.alert('Login Error', error?.message || 'Something went wrong.');
        },
      }
    );
  };
  

  const handleBiometricLogin = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
      });

      if (success) {
        const cachedCredentials = await AsyncStorage.getItem('cachedCredentials');
        if (cachedCredentials) {
          const { phone, password } = JSON.parse(cachedCredentials);
          login(
            { phone, password, role: 'freelancer' },
            {
              onSuccess: (data) => {
                dispatch(setUser(data));
                navigation.navigate('MainTabs');
              },
            }
          );
        } else {
          Alert.alert('Error', 'No cached credentials found. Please login manually.');
        }
      } else {
        Alert.alert('Error', 'Biometric authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Biometric authentication failed', error);
      Alert.alert('Error', 'An error occurred during biometric authentication.');
    }
  };

  return (
    <View className="bg-gray-900 flex-1 justify-center p-6">
      <View className="rounded-2xl border-primary bg-white p-8 shadow-lg">
        <Text className="text-gray-900 mb-2 text-center text-3xl font-bold">Welcome Back</Text>
        <Text className="text-gray-900 mb-8 text-center text-base">Login to your account</Text>

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

        <View className="bg-gray-100 mb-4 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
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

        <Pressable
          className="rounded-lg bg-primary py-4 shadow-md shadow-primary/30 active:bg-primary"
          onPress={handleLogin}>
          <Text className="text-center text-lg font-semibold text-white">Login</Text>
        </Pressable>

        <Pressable
          className="mt-4 rounded-lg bg-green-500 py-4 shadow-md shadow-green-500/30 active:bg-green-600"
          onPress={handleBiometricLogin}>
          <Text className="text-center text-lg font-semibold text-white">
            Login with Fingerprint
          </Text>
        </Pressable>

        <Pressable className="mt-6" onPress={() => navigation.navigate('RegisterScreen')}>
          <Text className="text-gray-900 text-center text-sm">
            Don't have an account? <Text className="font-semibold text-primary">Sign up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
