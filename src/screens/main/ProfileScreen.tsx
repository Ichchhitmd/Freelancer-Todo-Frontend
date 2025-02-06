import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { logout, updatePhoto, setError } from 'redux/slices/authSlices';
import { fetchGadgets, removeGadget } from 'redux/slices/gadgetSlices';
import { GadgetResponse } from 'types/gadgetTypes';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfilePicture } from 'helper/userRequest';
import { LinearGradient } from 'expo-linear-gradient';

const GadgetCard: React.FC<{
  gadget: GadgetResponse;
  onPress: () => void;
  onDelete: () => void;
}> = ({ gadget, onPress, onDelete }) => {
  const getIconName = (model: string) => {
    const modelLower = model.toLowerCase();
    if (modelLower.includes('laptop')) return 'laptop';
    if (modelLower.includes('camera')) return 'camera';
    if (modelLower.includes('lens')) return 'camera-iris';
    if (modelLower.includes('drone')) return 'drone';
    return 'devices';
  };

  return (
    <TouchableOpacity onPress={onPress} className="mb-4">
      <LinearGradient colors={['#F5F5F5', '#FFFFFF']} className="rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center">
          <View className="rounded-xl bg-red-100 p-3">
            <MaterialCommunityIcons name={getIconName(gadget.model)} size={24} color="#E50914" />
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-gray-800 text-lg font-bold">{gadget.name}</Text>
            <Text className="text-gray-500 text-sm">{gadget.model}</Text>
            <View className="mt-1 flex-row items-center">
              <Text className="text-gray-400 mr-4 text-xs">
                Cost: ${gadget.cost.toLocaleString()}
              </Text>
              <Text className="text-gray-400 text-xs">
                Purchased: {new Date(gadget.purchaseDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={onDelete}
              className="p-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialCommunityIcons name="delete-outline" size={24} color="#E50914" />
            </TouchableOpacity>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const GadgetDetailsBottomSheet: React.FC<{
  gadget: GadgetResponse | null;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
}> = ({ gadget, bottomSheetModalRef, snapPoints }) => {
  if (!gadget) return null;

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
      }}>
      <BottomSheetScrollView
        contentContainerStyle={{
          padding: 16,
          alignItems: 'center',
        }}>
        <View className="mb-6 w-full items-center">
          <View className="mb-4 rounded-full bg-red-100 p-6">
            <MaterialCommunityIcons
              name={
                gadget.model === 'laptop'
                  ? 'laptop'
                  : gadget.model === 'lens'
                    ? 'camera-iris'
                    : gadget.model === 'camera'
                      ? 'camera'
                      : 'drone'
              }
              size={48}
              color="#E50914"
            />
          </View>
          <Text className="text-gray-800 text-2xl font-bold">{gadget.name}</Text>
          <Text className="text-gray-500 text-base">{gadget.model}</Text>
        </View>

        <View className="bg-gray-100 mb-4 w-full rounded-2xl p-4">
          <View className="mb-2 flex-row justify-between">
            <Text className="text-gray-600">Cost</Text>
            <Text className="font-bold">${gadget.cost.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Purchase Date</Text>
            <Text className="font-bold">{new Date(gadget.purchaseDate).toLocaleDateString()}</Text>
          </View>
        </View>

        <TouchableOpacity className="w-full flex-row items-center justify-center rounded-xl bg-red-500 p-4">
          <MaterialCommunityIcons name="pencil" size={20} color="white" className="mr-2" />
          <Text className="font-bold text-white">Edit Gadget</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    gadgets = [],
    loading = false,
    error = null,
  } = useSelector((state: RootState) => state.gadgets) || {
    gadgets: [],
    loading: false,
    error: null,
  };
  const [locationName, setLocationName] = useState<string>('Loading location...');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const convertCoordinatesToLocation = useCallback(async (coordinates: string) => {
    try {
      // Split coordinates into latitude and longitude
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

  const fetchGadgetsData = useCallback(async () => {
    try {
      await dispatch(fetchGadgets()).unwrap();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', `Failed to fetch gadgets: ${error.message}`);
      } else {
        Alert.alert('Error', 'Failed to fetch gadgets. Please try again later.');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchGadgetsData();
  }, [fetchGadgetsData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchGadgetsData();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchGadgetsData]);

  const handleAddGadget = () => {
    navigation.navigate('AddGadget');
  };

  const handleDeleteGadget = async (id: number) => {
    Alert.alert(
      'Delete Gadget',
      'Are you sure you want to delete this gadget? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeGadget(id)).unwrap();
              Alert.alert('Success', 'Gadget deleted successfully');
            } catch (error) {
              if (error instanceof Error) {
                Alert.alert('Error', `Failed to delete gadget: ${error.message}`);
              } else {
                Alert.alert('Error', 'Failed to delete gadget. Please try again later.');
              }
            }
          },
        },
      ]
    );
  };

  const handleGadgetPress = useCallback(
    (gadget: GadgetResponse) => {
      try {
        navigation.navigate('GadgetDetails', { gadget });
      } catch (error) {
        Alert.alert('Error', 'Failed to open gadget details. Please try again.');
      }
    },
    [navigation]
  );

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
    <SafeAreaView className="flex-1 bg-gray-50">
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
        <View className="bg-red-500 px-4 py-10">
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
                  className="h-40 w-40 rounded-full border-4 border-red-500"
                  onError={() => dispatch(setError('Failed to load profile image'))}
                />
              ) : (
                <View className="h-40 w-40 items-center justify-center rounded-full border-4 border-[#E50914] bg-red-100">
                  <Text className="text-4xl font-bold text-[#E50914]">
                    {getInitials(user.name)}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                className="absolute bottom-0 right-0 rounded-full bg-[#E50914] p-3 shadow-lg"
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
                    color="#E50914"
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
                    color="#E50914"
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
                    color="#E50914"
                    style={{ marginRight: 16 }}
                  />
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm">Location</Text>
                    <Text className="text-gray-900 text-lg font-bold">{locationName}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-6">
              <View className="mb-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-800 text-2xl font-bold">My Gadgets</Text>
                  <Text className="text-gray-500 text-sm">
                    {(gadgets || []).length} {(gadgets || []).length === 1 ? 'gadget' : 'gadgets'}{' '}
                    registered
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleAddGadget}
                  className="flex-row items-center rounded-full bg-red-500 px-4 py-2">
                  <MaterialCommunityIcons name="plus" size={20} color="white" />
                  <Text className="ml-1 font-semibold text-white">Add New</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <View className="py-8">
                  <ActivityIndicator size="large" color="#E50914" />
                </View>
              ) : error ? (
                <View className="rounded-xl bg-red-50 px-4 py-8">
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={48}
                    color="#EF4444"
                    style={{ alignSelf: 'center' }}
                  />
                  <Text className="mt-4 text-center text-red-500">{error}</Text>
                  <TouchableOpacity
                    onPress={handleRefresh}
                    className="mt-4 self-center rounded-full bg-red-500 px-6 py-3">
                    <Text className="font-semibold text-white">Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : !gadgets || gadgets.length === 0 ? (
                <View className="bg-gray-50 rounded-xl px-4 py-8">
                  <MaterialCommunityIcons
                    name="devices"
                    size={48}
                    color="#9CA3AF"
                    style={{ alignSelf: 'center' }}
                  />
                  <Text className="text-gray-500 mt-4 text-center">
                    No gadgets added yet. Add your first gadget to get started!
                  </Text>
                </View>
              ) : (
                <View>
                  {(gadgets || []).map((gadget) => (
                    <View key={gadget.id}>
                      <GadgetCard
                        gadget={gadget}
                        onPress={() => handleGadgetPress(gadget)}
                        onDelete={() => handleDeleteGadget(gadget.id)}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ChangePassword')}
              className="mt-6 flex-row items-center justify-center rounded-xl bg-[#E50914] p-4">
              <MaterialCommunityIcons name="lock-reset" size={24} color="white" className="mr-2" />
              <Text className="text-lg font-bold text-white">Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={HandleLogout}
              className="mt-4 mb-12 flex-row items-center justify-center rounded-xl bg-black p-4">
              <MaterialCommunityIcons name="logout" size={24} color="white" className="mr-2" />
              <Text className="text-lg font-bold text-white">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
