import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { setUser } from 'redux/slices/authSlices';
import { useDispatch } from 'react-redux';
import { loginUser } from 'helper/api';
import { useLogin } from 'hooks/useAuth';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    role: 'freelancer',
  });
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { mutate: login, error } = useLogin();

  const handleLogin = () => {
    const { phone, password, role } = formData;
    login(
      { phone, password, role },
      {
        onSuccess: (data) => {
          dispatch(setUser(data));
          console.log(data);
          navigation.navigate('MainTabs');
        },
      }
    );
  };

  return (
    <View className="flex-1 justify-center bg-gray-50 p-6">
      <View className="rounded-2xl bg-white p-8 shadow-lg">
        <Text className="mb-2 text-center text-3xl font-bold text-gray-900">Welcome Back</Text>
        <Text className="mb-8 text-center text-base text-gray-600">Login to your account</Text>

        <View className="mb-4 flex-row items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
          <MaterialIcons name="phone" size={20} className="mr-3 text-gray-500" />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Phone Number"
            placeholderTextColor="#9CA3AF"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-6 flex-row items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
          <MaterialIcons name="lock" size={20} className="mr-3 text-gray-500" />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />
        </View>

        <Pressable
          className="rounded-lg bg-blue-500 py-4 shadow-md shadow-blue-500/30 active:bg-blue-600"
          onPress={handleLogin}>
          <Text className="text-center text-lg font-semibold text-white">Login</Text>
        </Pressable>

        <Pressable className="mt-6" onPress={() => navigation.navigate('RegisterScreen')}>
          <Text className="text-center text-sm text-gray-600">
            Don't have an account? <Text className="font-semibold text-blue-500">Sign up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
