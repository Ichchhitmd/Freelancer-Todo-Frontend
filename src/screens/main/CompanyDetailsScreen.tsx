import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetCompaniesById } from 'hooks/companies';
import React, { useState, useCallback } from 'react';
import { Text, ScrollView, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import getInitials from 'utils/initialsName';

type RootStackParamList = {
  CompanyDetails: undefined;
  MainTabs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CompanyDetails'>;

const CompanyDetails: React.FC = () => {
  const route = useRoute();
  const { companyId } = route.params as { companyId: number };
  const navigation = useNavigation<NavigationProp>();
  const [imageError, setImageError] = useState(false);
  const { data: company, isLoading, error } = useGetCompaniesById(companyId);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const SectionTitle = ({ title }: { title: string }) => (
    <View className="mb-3 flex-row items-center px-4">
      <View className="mr-2 h-6 w-1 rounded-full bg-red-500" />
      <Text className="text-gray-900 text-lg font-bold">{title}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mt-40 text-2xl text-black">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mt-40 text-2xl text-black">Something went wrong</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <LinearGradient colors={['#ef4444', '#dc2626']} className="px-4 py-4 pt-20">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute bottom-1 z-50 rounded-full bg-white/20 p-2">
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="ml-4 flex-1 text-center text-xl font-bold text-white">
            {company?.name}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1">
        <View className="mb-8 mt-10 items-center">
          {company?.imageUrl && !imageError ? (
            <Image
              source={{ uri: `${process.env.UPLOADS_BASE_URL}/${company.imageUrl}` }}
              className="h-28 w-28 rounded-full border-4 border-white shadow-lg"
              onError={handleImageError}
            />
          ) : (
            <View className="h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
              <Text className="text-3xl font-bold text-white">
                {getInitials(company?.name || '')}
              </Text>
            </View>
          )}
          <View className="mt-4 items-center">
            <Text className="text-gray-900 text-2xl font-bold">{company?.name}</Text>
            {company?.location && (
              <View className="mt-2 flex-row items-center rounded-full bg-white px-4 py-1 shadow-sm">
                <MaterialCommunityIcons name="map-marker" size={16} color="#ef4444" />
                <Text className="text-gray-600 ml-1">{company?.location}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="mb-8">
          <SectionTitle title="About" />
          <View className="mx-4 rounded-2xl bg-white p-5 shadow-md">
            <Text className="text-gray-600 text-base leading-6">{company?.bio}</Text>
          </View>
        </View>

        <View className="mb-8">
          <SectionTitle title="Contact Information" />
          <View className="divide-gray-100 mx-4 divide-y rounded-2xl bg-white p-5 shadow-md">
            <View className="flex-row items-center py-3">
              <View className="rounded-full bg-red-100 p-2">
                <MaterialCommunityIcons name="phone" size={20} color="#ef4444" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Phone Number</Text>
                <Text className="text-gray-900 font-medium">{company?.contactInfo}</Text>
              </View>
            </View>
            <View className="flex-row items-center py-3">
              <View className="rounded-full bg-red-100 p-2">
                <MaterialCommunityIcons name="account" size={20} color="#ef4444" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Contact Person</Text>
                <Text className="text-gray-900 font-medium">{company?.contactPerson}</Text>
              </View>
            </View>
            <View className="flex-row items-center py-3">
              <View className="rounded-full bg-red-100 p-2">
                <MaterialCommunityIcons name="map-marker" size={20} color="#ef4444" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Location</Text>
                <Text className="text-gray-900 font-medium">{company?.location}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyDetails;
