import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import EarningsByCompanySection from 'components/HomeScreen/EarningsByCompany';
import MonthlyEarningsStats from 'components/MonthlyEarningStats';
import dummyData from 'data/dummyData.json';

const EarningsScreen = () => {
  const [earnings, setEarnings] = useState<{
    totalEarnings: number;
    totalExpenses: number;
    netEarnings: number;
    eventCount: number;
    earningsByCompany: {
      companyId: number;
      companyName: string;
      amount: number;
      expenses: number;
    }[];
  } | null>(null);

  useEffect(() => {
    setEarnings(dummyData.earnings); // Assuming earnings data is within the 'earnings' field
  }, []);

  if (!earnings) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-10">
      <View className="p-4">
        <Text className="mb-4 text-2xl font-bold text-gray-900">Earnings Overview</Text>

        <MonthlyEarningsStats
          earnings={earnings.earningsByCompany.map((company) => ({
            selectedDates: [new Date()],
            estimatedEarning: company.amount.toString(),
            expenses: company.expenses.toString(),
            totalEarnings: company.amount,
            totalExpenses: company.expenses,
            netEarnings: company.amount - company.expenses,
            eventCount: 1, // You might want to adjust this based on actual event count
            earningsByCompany: [company]
          }))}
        />

        <EarningsByCompanySection earnings={earnings.earningsByCompany} />
      </View>
    </ScrollView>
  );
};

export default EarningsScreen;
