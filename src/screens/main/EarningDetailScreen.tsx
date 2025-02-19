import { useRoute, useNavigation } from '@react-navigation/native';
import CompanyRow from 'components/rare/CompanyRow';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'react-native-feather';

const EarningsDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { earnings } = route.params as { earnings: any | null | undefined };

  return (
    <View className="bg-gray-50 flex-1">
      <View className="bg-white p-4 shadow-sm">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft stroke="#4f46e5" width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-gray-900 text-xl font-bold">Company Earnings</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {earnings.earningsByCompany.map((company: any, index: number) => (
            <CompanyRow key={index} company={company} />
          ))}
        </View>
      </ScrollView>

      <View className="shadow-t-md bg-white p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 text-lg font-semibold">Total Earnings</Text>
          <View>
            <Text className="text-right text-lg font-bold text-green-500">
              +रु
              {earnings.earningsByCompany.reduce(
                (sum: number, company: any) => sum + company.amount,
                0
              )}
            </Text>
            <Text className="text-right text-sm font-semibold text-red-500">
              -रु
              {earnings.earningsByCompany.reduce(
                (sum: number, company: any) => sum + company.expenses,
                0
              )}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EarningsDetailScreen;
