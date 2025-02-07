import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useCallback, useEffect } from 'react';
import { Text, ScrollView, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { useGetCompaniesById } from 'hooks/companies';

type RootStackParamList = {
  CompanyDetails: undefined;
  MainTabs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CompanyDetails'>;

const CompanyDetails: React.FC = () => {
  const route = useRoute();
  const { companyId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const [imageError, setImageError] = useState(false);
  const { data: company, isLoading, error } = useGetCompaniesById(companyId);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const InfoCard = ({ icon, value, label }: { icon: string; value: string; label: string }) => (
    <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg">
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
        className="absolute top-0 left-0 right-0 bottom-0 rounded-2xl"
      />
      <View className="items-center">
        <View className="bg-red-100 p-3 rounded-full mb-2">
          <MaterialCommunityIcons name={icon} size={24} color="#ef4444" />
        </View>
        <Text className="text-gray-500 text-sm mb-1">{label}</Text>
        <Text className="text-gray-900 font-semibold text-base text-center">{value}</Text>
      </View>
    </View>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <View className="flex-row items-center mb-3 px-4">
      <View className="h-6 w-1 bg-red-500 rounded-full mr-2" />
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black text-2xl mt-40">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-black text-2xl mt-40">Something went wrong</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        className="px-4 py-4 pt-20">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full bg-white/20 p-2 z-50 absolute bottom-1">
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1 ml-4 text-center">{company.name}</Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1">
        <View className="items-center mt-10 mb-8">
          {company.imageUrl && !imageError ? (
            <Image
              source={{ uri: `${process.env.UPLOADS_BASE_URL}/${company.imageUrl}` }}
              className="h-28 w-28 rounded-full border-4 border-white shadow-lg"
              onError={handleImageError}
            />
          ) : (
            <View className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-br from-red-500 to-red-600 items-center justify-center shadow-lg">
              <Text className="text-white text-3xl font-bold">
                {getInitials(company.name)}
              </Text>
            </View>
          )}
          <View className="items-center mt-4">
            <Text className="text-2xl font-bold text-gray-900">{company.name}</Text>
            {company.location && (
              <View className="flex-row items-center mt-2 bg-white px-4 py-1 rounded-full shadow-sm">
                <MaterialCommunityIcons name="map-marker" size={16} color="#ef4444" />
                <Text className="text-gray-600 ml-1">{company.location}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="mb-8">
          <SectionTitle title="About" />
          <View className="bg-white mx-4 p-5 rounded-2xl shadow-md">
            <Text className="text-gray-600 leading-6 text-base">{company.bio}</Text>
          </View>
        </View>

        <View className="mb-8">
          <SectionTitle title="Contact Information" />
          <View className="bg-white mx-4 p-5 rounded-2xl shadow-md divide-y divide-gray-100">
            <View className="flex-row items-center py-3">
              <View className="bg-red-100 p-2 rounded-full">
                <MaterialCommunityIcons name="phone" size={20} color="#ef4444" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Phone Number</Text>
                <Text className="text-gray-900 font-medium">{company.contactInfo}</Text>
              </View>
            </View>
            <View className="flex-row items-center py-3">
              <View className="bg-red-100 p-2 rounded-full">
                <MaterialCommunityIcons name="account" size={20} color="#ef4444" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Contact Person</Text>
                <Text className="text-gray-900 font-medium">{company.contactPerson}</Text>
              </View>
            </View>
            <View className="flex-row items-center py-3">
              <View className="bg-red-100 p-2 rounded-full">
                <MaterialCommunityIcons name="map-marker" size={20} color="#ef4444" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-500 text-sm">Location</Text>
                <Text className="text-gray-900 font-medium">{company.location}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyDetails;