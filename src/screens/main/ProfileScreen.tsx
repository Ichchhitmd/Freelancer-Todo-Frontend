import image from 'constants/image';
import React from 'react';
import { View, Text, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { logout } from 'redux/slices/authSlices';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { name, phone, email } = useSelector((state: RootState) => state.auth);

  const ProfileInfoCard = ({ icon, title, value }: { icon: string, title: string, value: string }) => (
    <View className="bg-white rounded-xl shadow-md p-4 mb-4 flex-row items-center">
      <MaterialCommunityIcons name={icon} size={24} color="black" className="mr-4" />
      <View>
        <Text className="text-gray-600 text-sm">{title}</Text>
        <Text className="text-gray-900 text-lg font-bold">{value}</Text>
      </View>
    </View>
  );

  const LogoutButton = ({ icon, title, onPress }: { icon: string, title: string, onPress: () => void }) => (
    <Pressable 
      onPress={onPress}
      className="bg-red-500 rounded-xl shadow-md p-4 mb-4 flex-row items-center justify-between"
    >
      <View className="flex-row items-center">
        <MaterialCommunityIcons name={icon} size={24} color="black" className="mr-4" />
        <Text className="text-gray-900 text-lg">{title}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="gray" />
    </Pressable>
  );

  const ProfileActionButton = ({ icon, title, onPress }: { icon: string, title: string, onPress: () => void }) => (
    <Pressable 
      onPress={onPress}
      className="bg-white rounded-xl shadow-md p-4 mb-4 flex-row items-center justify-between"
    >
      <View className="flex-row items-center">
        <MaterialCommunityIcons name={icon} size={24} color="black" className="mr-4" />
        <Text className="text-gray-900 text-lg">{title}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="gray" />
    </Pressable>
  );

  const HandleLogout = () => {
    dispatch(logout());
    navigation.navigate('LoginScreen');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-red-500 h-1/2 rounded-b-3xl">
        <View className="p-6">
          <View className="items-center mb-10 mt-6">
            <View className="relative mb-6">
              <Image 
                source={image.profile} 
                className="h-40 w-40 rounded-full border-4 border-blue-500"
              />
              <Pressable className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                <MaterialCommunityIcons name="pencil" size={20} color="white" />
              </Pressable>
            </View>
            <Text className="text-2xl font-bold text-gray-900">{name}</Text>
          </View>

          <ProfileInfoCard 
            icon="phone" 
            title="Phone Number" 
            value={phone} 
          />
          <ProfileInfoCard 
            icon="email" 
            title="Email Address" 
            value={email} 
          />
          <ProfileActionButton 
            icon="lock-reset" 
            title="Change Password"
            onPress={() => navigation.navigate('ChangePassword')} 
          />
          <LogoutButton 
            icon="logout" 
            title="Logout"
            onPress={HandleLogout}
          />
        </View>
      </View>
    </ScrollView>
  );
}
