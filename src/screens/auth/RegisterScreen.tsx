import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useSignup } from 'hooks/useAuth';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const navigation = useNavigation();
  const { mutate: signup } = useSignup();

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

    const payload = {
      name,
      phone,
      password,
      email,
      location,
      role: 'freelancer',
    };

    console.log('Sending data to backend:', payload);

    signup(payload, {
      onSuccess: (data) => {
        console.log('Signup success:', data);
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('LoginScreen');
      },
      onError: (error) => {
        console.error('Signup error:', error);
        Alert.alert('Signup Failed', error.message || 'An error occurred');
      },
    });
  };

  return (
    <View className="bg-gray-50 flex-1 justify-center p-6">
      <View className="rounded-2xl bg-white p-8 shadow-lg">
        <Text className="text-gray-900 mb-2 text-center text-3xl font-bold">Create Account</Text>
        <Text className="text-gray-600 mb-8 text-center text-base">Join our community today</Text>

        <View className="border-gray-200 bg-gray-100 mb-4 flex-row items-center rounded-lg border p-3">
          <MaterialIcons name="person" size={20} className="text-gray-500 mr-3" />
          <TextInput
            className="text-gray-900 flex-1 text-base"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="border-gray-200 bg-gray-100 mb-4 flex-row items-center rounded-lg border p-3">
          <MaterialIcons name="phone" size={20} className="text-gray-500 mr-3" />
          <TextInput
            className="text-gray-900 flex-1 text-base"
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View className="border-gray-200 bg-gray-100 mb-4 flex-row items-center rounded-lg border p-3">
          <MaterialIcons name="email" size={20} className="text-gray-500 mr-3" />
          <TextInput
            className="text-gray-900 flex-1 text-base"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="border-gray-200 bg-gray-100 mb-4 flex-row items-center rounded-lg border p-3">
          <MaterialIcons name="lock" size={20} className="text-gray-500 mr-3" />
          <TextInput
            className="text-gray-900 flex-1 text-base"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="border-gray-200 bg-gray-100 mb-6 flex-row items-center rounded-lg border p-3">
          <MaterialIcons name="location-on" size={20} className="text-gray-500 mr-3" />
          <TextInput
            className="text-gray-900 flex-1 text-base"
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
          <Text className="text-gray-600 text-center text-sm">
            Already have an account? <Text className="font-semibold text-blue-500">Login</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
