import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PolicyModal from 'components/rare/PrivacyPolicyModel';
import * as Location from 'expo-location';
import { handleAxiosError } from 'helper/errorHandling/AxiosErrorHandle';
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
} from 'react-native';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    email: '',
    location: '',
    role: 'freelancer',
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'privacyPolicy' | 'termsOfService'>('privacyPolicy');
  const navigation = useNavigation();
  const { mutate: signup, status } = useSignup();

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is needed for automatic location input.');
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
    if (!privacyAccepted) {
      Alert.alert('Error', 'Please accept the Privacy Policy and Terms');
      return;
    }

    const { name, phone, password, email, location } = formData;
    if (!name || !phone || !password || !email || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    signup(formData, {
      onSuccess: (data) => {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('LoginScreen');
      },
      onError: (error) => {
        console.error('Signup error:', error);
        Alert.alert('Signup Failed', handleAxiosError(error));
      },
    });
  };

  const togglePrivacyAccepted = () => {
    setPrivacyAccepted(!privacyAccepted);
  };

  const showPrivacyPolicy = () => {
    setModalType('privacyPolicy' as 'privacyPolicy' | 'termsOfService');
    setModalVisible(true);
  };

  const showTermsOfService = () => {
    setModalType('termsOfService' as 'privacyPolicy' | 'termsOfService');
    setModalVisible(true);
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

                <View className="bg-gray-100 mb-6 hidden flex-row items-center rounded-lg border-[0.5px] border-slate-200 p-3">
                  <MaterialIcons name="location-on" size={20} className="text-gray-900 mr-3" />
                  <TextInput
                    className="text-gray-900 flex-1 text-base"
                    placeholder="Fetching location..."
                    placeholderTextColor="#333333"
                    value={formData.location}
                    editable={false}
                  />
                </View>

                {/* Privacy Policy Checkbox */}
                <View className="mb-6 flex-row items-center">
                  <TouchableOpacity
                    onPress={togglePrivacyAccepted}
                    className={`h-6 w-6 items-center justify-center rounded border ${
                      privacyAccepted
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-400 bg-white'
                    }`}>
                    {privacyAccepted && <MaterialIcons name="check" size={16} color="white" />}
                  </TouchableOpacity>
                  <Text className="text-gray-700 ml-2 flex-1 text-sm">
                    I agree to the{' '}
                    <Text className="font-medium text-indigo-600" onPress={showPrivacyPolicy}>
                      Privacy Policy
                    </Text>{' '}
                    and{' '}
                    <Text className="font-medium text-indigo-600" onPress={showTermsOfService}>
                      Terms of Service
                    </Text>
                  </Text>
                </View>

                {status === 'pending' ? (
                  <ActivityIndicator size="large" color="#6366F1" className="my-4" />
                ) : (
                  <Pressable
                    className="rounded-2xl bg-primary/75 py-4 shadow-lg shadow-primary/30"
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

      <PolicyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        policyType={modalType}
      />
    </SafeAreaView>
  );
}
