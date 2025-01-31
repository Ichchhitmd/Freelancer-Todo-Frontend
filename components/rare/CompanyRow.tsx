import React from 'react';
import { View, Text } from 'react-native';

interface CompanyRowProps {
  company: {
    companyName: string;
    amount: number;
    expenses: number;
  };
}

const CompanyRow: React.FC<CompanyRowProps> = ({ company }) => {
  const companyInitial = company.companyName ? company.companyName[0] : '?';  // Handle empty company name
  const currentDate = new Date().toLocaleDateString(); // Use passed date if available

  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
      <View className="flex-row items-center">
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Text className="text-xl font-semibold text-blue-600">{companyInitial}</Text>
        </View>
        <View>
          <Text className="font-semibold text-gray-900">{company.companyName}</Text>
          <Text className="text-sm text-gray-500">{currentDate}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-green-500">+रु{company.amount}</Text>
        <Text className="text-sm text-red-500">-रु{company.expenses}</Text>
      </View>
    </View>
  );
};

export default CompanyRow;
