import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useSignup } from 'hooks/useAuth';
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
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    email: '',
    role: 'freelancer',
    username: '',
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const navigation = useNavigation();
  const { mutate: signup, status } = useSignup();

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setFormData((prev) => ({
        ...prev,
        location: `${loc.coords.latitude}, ${loc.coords.longitude}`,
      }));
    };

    getLocation();
  }, []);

  const handleRegister = () => {
    console.log(formData);
    if (!privacyAccepted) {
      Alert.alert('Error', 'Please accept the Privacy Policy and Terms');
      return;
    }

    const { name, phone, password, email, username } = formData;
    if (!name || !phone || !password || !email || !username) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    signup(formData, {
      onSuccess: (data) => {
        console.log(data);
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('LoginScreen');
      },
      onError: (error) => {
        console.log(error);
        Alert.alert('Signup Failed', error);
      },
    });
  };

  const handleOpenPrivacyPolicy = async () => {
    try {
      const url = 'http://xitoapps.com/privacy-policy/';
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open the privacy policy URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open privacy policy');
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
              <Text className="mb-2 text-4xl font-bold text-white">Create Account</Text>
              <Text className="text-lg text-indigo-100">Join our community today</Text>
            </View>

            <View className="-mt-10 px-6">
              <View className="rounded-3xl bg-white p-6 shadow-xl">
                <View className="bg-gray-100 mb-4 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="person" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="Full Name"
                    placeholderTextColor="#333333"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                </View>

                <View className="bg-gray-100 mb-4 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="person" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="Username"
                    placeholderTextColor="#333333"
                    value={formData.username}
                    onChangeText={(text) => setFormData({ ...formData, username: text })}
                  />
                </View>

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
                  <MaterialIcons name="email" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="Email"
                    placeholderTextColor="#333333"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View className="bg-gray-100 mb-4 flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="lock" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="Password"
                    placeholderTextColor="#333333"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                  />
                </View>

                <View className="mt-4 flex-row items-center">
                  <TouchableOpacity
                    onPress={() => setPrivacyAccepted(!privacyAccepted)}
                    className="mr-2">
                    <MaterialIcons
                      name={privacyAccepted ? 'check-box' : 'check-box-outline-blank'}
                      size={24}
                      color={privacyAccepted ? '#E50914' : '#666'}
                    />
                  </TouchableOpacity>
                  <View className="flex-1">
                  <Text className="text-gray-600">I agree to the </Text>
                  <TouchableOpacity onPress={handleOpenPrivacyPolicy}>
                    <Text className="text-primary">Privacy Policy & Terms of Service</Text>
                  </TouchableOpacity>
                  </View>
                </View>

                {status === 'pending' ? (
                  <ActivityIndicator size="large" color="#6366F1" className="my-4" />
                ) : (
                  <Pressable
                    className="mt-2 rounded-2xl bg-primary/75 py-4 shadow-lg shadow-primary/30"
                    onPress={
                      privacyAccepted
                        ? handleRegister
                        : () => Alert.alert('Error', 'Please accept the Privacy Policy and Terms')
                    }>
                    <Text className="text-center text-lg font-semibold text-white">
                      Create Account
                    </Text>
                  </Pressable>
                )}

                <Pressable className="mt-6" onPress={() => navigation.navigate('LoginScreen')}>
                  <Text className="text-gray-600 text-center text-sm">
                    Already have an account?{' '}
                    <Text className="font-semibold text-indigo-600">Login</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
