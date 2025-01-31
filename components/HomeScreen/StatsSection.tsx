import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatsSectionProps {
  earnings: {
    totalEarnings: number;
    totalExpenses: number;
    eventCount: number;
  };
  freelancer: {
    gadgets: Array<{ cost: number }>;
  };
}

const StatsSection: React.FC<StatsSectionProps> = ({ earnings, freelancer }) => {
  const remainingEarnings =
    earnings.totalEarnings - freelancer.gadgets.reduce((sum, g) => sum + g.cost, 0);

  const StatCard = ({
    title,
    amount,
    subtitle,
    icon,
    bgColor,
    textColor,
  }: {
    title: string;
    amount: number;
    subtitle: string;
    icon: string;
    bgColor: string;
    textColor: string;
  }) => (
    <View className="w-60 rounded-xl bg-white p-4 shadow-sm">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-base font-medium text-gray-600">{title}</Text>
        <View className={`rounded-full ${bgColor} p-2`}>
          <MaterialCommunityIcons name={icon} size={20} color={textColor} />
        </View>
      </View>

      <View className="flex-row items-baseline">
        <Text className={`mr-1 text-2xl font-bold ${textColor}`}>₹</Text>
        <Text className={`text-2xl font-bold ${textColor}`}>{amount.toLocaleString()}</Text>
      </View>

      <Text className="mt-1 text-sm text-gray-500">{subtitle}</Text>
    </View>
  );

  return (
    <View className="my-6 rounded-xl bg-white p-4 shadow-md">
      <View className="mx-4">
        <Text className="text-xl font-bold text-gray-900">Financial Overview</Text>
        <Text className="text-base text-gray-500">Track your earnings and expenses</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        <StatCard
          title="Total Earnings"
          amount={earnings.totalEarnings}
          subtitle={`${earnings.eventCount} events completed`}
          icon="cash-multiple"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />

        <StatCard
          title="Total Expenses"
          amount={earnings.totalExpenses}
          subtitle={`${freelancer.gadgets.length} gadgets purchased`}
          icon="trending-down"
          bgColor="bg-red-50"
          textColor="text-red-500"
        />

        <StatCard
          title="Available Balance"
          amount={remainingEarnings}
          subtitle="Remaining earnings"
          icon="wallet"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />

        <StatCard
          title="Monthly Average"
          amount={Math.round(earnings.totalEarnings / 12)}
          subtitle="Based on yearly earnings"
          icon="chart-line"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
      </ScrollView>
    </View>
  );
};

export default StatsSection;
