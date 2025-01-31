import { View, Text, TouchableOpacity } from 'react-native';
import CompanyRow from 'components/rare/CompanyRow';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EarningsByCompanySection: React.FC<{ earnings: any }> = ({ earnings }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleSeeAll = () => {
    navigation.navigate('EarningDetailScreen', { earnings });
  };

  return (
    <View className="mt-4 rounded-xl bg-white p-6 shadow-md">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">Earnings by Company</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text className="text-sm text-indigo-600">See all</Text>
        </TouchableOpacity>
      </View>

      {Array.isArray(earnings) && earnings.length > 0 ? (
        earnings.map((company: any, index: number) => <CompanyRow key={index} company={company} />)
      ) : (
        <Text>No earnings available</Text>
      )}
    </View>
  );
};

export default EarningsByCompanySection;
