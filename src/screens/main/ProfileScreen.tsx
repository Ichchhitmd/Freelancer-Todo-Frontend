import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { logout, updatePhoto, setError } from 'redux/slices/authSlices';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfilePicture } from 'helper/userRequest';
import GadgetsSection from 'components/HomeScreen/GadgetSection';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    const getLocationName = async () => {
      try {
        if (user?.location) {
          
          const coordinates = user.location.split(',').map(coord => {
            const parsed = parseFloat(coord.trim());
            if (isNaN(parsed)) {
              throw new Error(`Invalid coordinate: ${coord}`);
            }
            return parsed;
          });
          
          const [latitude, longitude] = coordinates;
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'YourAppName/1.0 (your@email.com)'
              }
            }
          );
          
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Fetch error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          const address = data.address;
          let formattedLocation = '';
          
          if (address.city) formattedLocation = address.city;
          else if (address.town) formattedLocation = address.town;
          else if (address.village) formattedLocation = address.village;
          else if (address.county) formattedLocation = address.county;
          
          if (address.country) {
            formattedLocation += formattedLocation ? `, ${address.country}` : address.country;
          }
          
          setLocationName(formattedLocation || 'Location not available');
        }
      } catch (error) {
        console.error('Full error converting coordinates:', error);
        
        if (error instanceof Error) {
          Alert.alert('Location Error', `Unable to convert location: ${error.message}`);
        }
        
        setLocationName(user?.location || 'Location not available');
      }
    };

    if (user?.location) {
      getLocationName();
    }
  }, [user?.location]);

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const uploadImage = async (uri: string) => {
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'image.jpg';
      
      formData.append('photo', {
        uri,
        name: filename,
        type: 'image/jpeg',
      } as any);
  
      const response = await updateUserProfilePicture(formData);
      
      if (response.photo) {
        dispatch(updatePhoto(response.photo));
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Error', error.message || 'Failed to upload image');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to update your profile picture!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const ProfileInfoCard = () => (
    <View className="bg-white rounded-b-xl shadow-md p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <MaterialCommunityIcons name="email" size={24} color="black" className="mr-4" />
        <View>
          <Text className="text-gray-600 text-sm">Email</Text>
          <Text className="text-gray-900 text-lg font-bold">{user.email}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center mb-3 border-t border-gray-200 pt-3">
        <MaterialCommunityIcons name="phone" size={24} color="black" className="mr-4" />
        <View>
          <Text className="text-gray-600 text-sm">Phone</Text>
          <Text className="text-gray-900 text-lg font-bold">{user.phone}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center border-t border-gray-200 pt-3">
        <MaterialCommunityIcons name="map-marker" size={24} color="black" className="mr-4" />
        <View>
          <Text className="text-gray-600 text-sm">Location</Text>
          <Text className="text-gray-900 text-lg font-bold">
            {locationName || user.location || 'Location not available'}
          </Text>
        </View>
      </View>
    </View>
  );

  const HandleLogout = () => {
    dispatch(logout());
    navigation.navigate('LoginScreen');
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-red-500 h-1/2.5 rounded-b-3xl pt-4">
        <View className="p-6">
          <View className="items-center mb-10 mt-6">
            <View className="relative mb-6">
              {user.photo ? (
                <Image 
                  source={{ uri: `${process.env.UPLOADS_BASE_URL}/${user.photo}` }}
                  className="h-40 w-40 rounded-full border-4 border-blue-500"
                  onError={() => dispatch(setError('Failed to load profile image'))}
                />
              ) : (
                <View className="h-40 w-40 rounded-full border-4 border-blue-500 bg-blue-200 items-center justify-center">
                  <Text className="text-4xl font-bold text-blue-600">
                    {getInitials(user.name)}
                  </Text>
                </View>
              )}
              <Pressable 
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2"
                onPress={pickImage}
              >
                <MaterialCommunityIcons name="pencil" size={20} color="white" />
              </Pressable>
            </View>

            <Text className="text-2xl font-bold text-white mb-2">{user.name}</Text>
          </View>
        </View>
      </View>

      <View className="px-2">
        <ProfileInfoCard />
        
        <Pressable 
          onPress={() => navigation.navigate('ChangePassword')}
          className="bg-black rounded-xl shadow-md p-4 mb-4 flex-row items-center justify-center"
        >
          <MaterialCommunityIcons name="lock-reset" size={24} color="white" className="mr-2" />
          <Text className="text-white text-lg font-bold">Change Password</Text>
        </Pressable>

        <Pressable 
          onPress={HandleLogout}
          className="bg-red-500 rounded-xl shadow-md p-4 mb-4 flex-row items-center justify-center"
        >
          <MaterialCommunityIcons name="logout" size={24} color="white" className="mr-2" />
          <Text className="text-white text-lg font-bold">Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
