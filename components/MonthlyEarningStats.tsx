import React from 'react';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';

interface EventExpense {
  eventId: number;
  eventDate: string;
  company: string;
  expenses: Expense[];
}

interface Expense {
  id: number;
  eventId: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}
interface EarningsData {
  totalEarnings: number;
  totalExpenses: number;
  netEarnings: number;
  selectedDates: Date[];
  estimatedEarning: string;
  expenses: string;
  eventCount: number;
  earningsByCompany: EarningsByCompany[];
}

interface EarningsByCompany {
  companyId: number;
  companyName: string;
  amount: number;
  expenses: number;
}


interface MonthlyEarningsStatsProps {
  earnings: EarningsData[];
}

const MonthlyEarningsStats: React.FC<MonthlyEarningsStatsProps> = ({ earnings }) => {
  const groupByMonth = (earnings: EarningsData[]) => {
    const grouped = earnings.reduce(
      (acc, entry) => {
        const month = dayjs(entry.selectedDates[0]).format('YYYY-MM');
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(entry);
        return acc;
      },
      {} as Record<string, EarningsData[]>
    );
    return grouped;
  };

  const groupedEarnings = groupByMonth(earnings);
  const months = Object.keys(groupedEarnings);

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-gray-900">Monthly Earnings Overview</Text>

      {months.map((month) => {
        const monthData = groupedEarnings[month];

        const totalEarnings = monthData.reduce(
          (total, entry) => total + parseFloat(entry.estimatedEarning || '0'),
          0
        );
        const totalExpenses = monthData.reduce(
          (total, entry) => total + parseFloat(entry.expenses || '0'),
          0
        );
        const dueEarnings = totalEarnings - totalExpenses;

        return (
          <View key={month} className="mt-6 rounded-lg bg-white p-4 shadow-lg">
            <Text className="mb-4 text-2xl font-bold text-gray-900">
              {dayjs(month).format('MMMM YYYY')}
            </Text>

            <View className="flex-row justify-between gap-4">
              {/* Total Earnings Card */}
              <View className="flex-1 rounded-lg bg-green-500 p-6">
                <Text className="text-lg font-semibold text-white">Total Earnings</Text>
                <Text className="mt-2 text-xl text-white">{`रु ${totalEarnings.toFixed(2)}`}</Text>
              </View>

              {/* Total Expenses Card */}
              <View className="flex-1 rounded-lg bg-red-600 p-6">
                <Text className="text-lg font-semibold text-white">Total Expenses</Text>
                <Text className="mt-2 text-xl text-white">{`रु ${totalExpenses.toFixed(2)}`}</Text>
              </View>
            </View>

            <View className="mt-4">
              {/* Due Earnings Card */}
              <View className="rounded-lg bg-blue-500 p-6">
                <Text className="text-lg font-semibold text-white">Due Earnings</Text>
                <Text className="mt-2 text-xl text-white">{`रु ${dueEarnings.toFixed(2)}`}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default MonthlyEarningsStats;
