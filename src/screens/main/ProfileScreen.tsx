import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfilePicture } from 'helper/userRequest';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updatePhoto, setError } from 'redux/slices/authSlices';
import { RootState } from 'redux/store';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [locationName, setLocationName] = useState<string>('Loading location...');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const convertCoordinatesToLocation = useCallback(async (coordinates: string) => {
    try {
      const [latitude, longitude] = coordinates.split(',').map((coord) => parseFloat(coord.trim()));

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates format');
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FreelancerTodoApp/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      const address = data.address;
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.suburb ||
        address.county ||
        'Unknown City';
      const country = address.country || 'Unknown Country';

      const locationString = `${city}, ${country}`;
      setLocationName(locationString);
    } catch (error) {
      console.error('Error converting coordinates:', error);
      setLocationName('Location not available');
    }
  }, []);

  useEffect(() => {
    if (user?.location) {
      convertCoordinatesToLocation(user.location);
    } else {
      setLocationName('Location not available');
    }
  }, [user?.location, convertCoordinatesToLocation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const formData = new FormData();
        formData.append('photo', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);

        try {
          const response = await updateUserProfilePicture(formData);
          if (response.photo) {
            dispatch(updatePhoto(response.photo));
            Alert.alert('Success', 'Profile picture updated successfully');
          }
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert('Error', `Failed to update profile picture: ${error.message}`);
          } else {
            Alert.alert('Error', 'Failed to update profile picture. Please try again later.');
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', `Failed to pick image: ${error.message}`);
      } else {
        Alert.alert('Error', 'Failed to pick image. Please try again later.');
      }
    }
  }, [dispatch]);

  const HandleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert('Error', `Failed to logout: ${error.message}`);
            } else {
              Alert.alert('Error', 'Failed to logout. Please try again later.');
            }
          }
        },
      },
    ]);
  }, [dispatch, navigation]);

  const getInitials = useCallback((name: string) => {
    try {
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    } catch (error) {
      console.error('Error getting initials:', error);
      return 'U';
    }
  }, []);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">User not found. Please login again.</Text>
        <TouchableOpacity onPress={HandleLogout} className="mt-4 rounded-full bg-red-500 px-6 py-3">
          <Text className="font-semibold text-white">Return to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#E50914']}
            tintColor="#E50914"
          />
        }>
        <View className="bg-primary/35 px-4 py-10">
          <Text className="pt-5 text-center text-3xl font-bold text-white">My Profile</Text>
          <Text className="mt-2 text-center text-base text-red-100">
            Manage your personal information
          </Text>
        </View>

        <View className="-mt-4 rounded-t-2xl bg-white p-4 shadow-sm">
          <View className="mb-6 items-center">
            <View className="relative mb-4">
              {user.photo ? (
                <Image
                  source={{ uri: `${process.env.UPLOADS_BASE_URL}/${user.photo}` }}
                  className="h-40 w-40 rounded-full border-4 border-primary/35"
                  onError={() => dispatch(setError('Failed to load profile image'))}
                />
              ) : (
                <View className="h-40 w-40 items-center justify-center rounded-full border-4 border-primary/35 bg-primary/10">
                  <Text className="text-4xl font-bold text-primary/90">
                    {getInitials(user.name)}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                className="absolute bottom-0 right-0 rounded-full bg-primary/50 p-3 shadow-lg"
                onPress={pickImage}>
                <MaterialCommunityIcons name="pencil" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-800 mb-2 text-2xl font-bold">{user.name}</Text>
          </View>

          <View className="space-y-4 px-2">
            <View className="bg-white p-4">
              <View className="space-y-4">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="email"
                    size={24}
                    color="#E5091480"
                    style={{ marginRight: 16 }}
                  />
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm">Email</Text>
                    <Text className="text-gray-900 text-lg font-bold">{user.email}</Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="phone"
                    size={24}
                    color="#E5091480"
                    style={{ marginRight: 16 }}
                  />
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm">Phone</Text>
                    <Text className="text-gray-900 text-lg font-bold">
                      {user.phone || 'Not provided'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={24}
                    color="#E5091480"
                    style={{ marginRight: 16 }}
                  />
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm">Location</Text>
                    <Text className="text-gray-900 text-lg font-bold">{locationName}</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ChangePassword')}
              className="mt-6 flex-row items-center justify-center rounded-xl bg-primary/60 p-4">
              <MaterialCommunityIcons name="lock-reset" size={24} color="white" className="mr-2" />
              <Text className="text-lg font-bold text-white">Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={HandleLogout}
              className="mb-12 mt-4 flex-row items-center justify-center rounded-xl bg-black p-4">
              <MaterialCommunityIcons name="logout" size={24} color="white" className="mr-2" />
              <Text className="text-lg font-bold text-white">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
