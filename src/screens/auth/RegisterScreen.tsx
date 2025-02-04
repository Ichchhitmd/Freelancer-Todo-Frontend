import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useSignup } from 'hooks/useAuth';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading, setError, setUser } from 'redux/slices/authSlices';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mutate: signup, error } = useSignup();

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is needed for automatic location input.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(`${loc.coords.latitude}, ${loc.coords.longitude}`); // Store coordinates as a string
    };

    getLocation();
  }, []);

  const handleRegister = () => {
    if (!name || !phone || !password || !email || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    signup(
      { name, phone, password, email, location, role: 'freelancer' },
      {
        onSuccess: (data) => {
          dispatch(loginSuccess(data));
          console.log(data);
          navigation.navigate('LoginScreen');
        },
      }
    );
  };

  return (
    <View className="flex-1 justify-center bg-gray-50 p-6">
      <View className="rounded-2xl bg-white p-8 shadow-lg">
        <Text className="mb-2 text-center text-3xl font-bold text-gray-900">Create Account</Text>
        <Text className="mb-8 text-center text-base text-gray-600">Join our community today</Text>

        <View className="mb-4 flex-row items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
          <MaterialIcons name="person" size={20} className="mr-3 text-gray-500" />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-4 flex-row items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
          <MaterialIcons name="phone" size={20} className="mr-3 text-gray-500" />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4 flex-row items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
          <MaterialIcons name="email" size={20} className="mr-3 text-gray-500" />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-4 flex-row items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
          <MaterialIcons name="lock" size={20} className="mr-3 text-gray-500" />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="mb-6 flex-row items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
          <MaterialIcons name="location-on" size={20} className="mr-3 text-gray-500" />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Fetching location..."
            value={location}
            editable={false} // Make it read-only
          />
        </View>

        <Pressable
          className="rounded-lg bg-blue-500 py-4 shadow-md shadow-blue-500/30 active:bg-blue-600"
          onPress={handleRegister}>
          <Text className="text-center text-lg font-semibold text-white">Create Account</Text>
        </Pressable>

        <Pressable className="mt-6" onPress={() => navigation.navigate('LoginScreen')}>
          <Text className="text-center text-sm text-gray-600">
            Already have an account? <Text className="font-semibold text-blue-500">Login</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
