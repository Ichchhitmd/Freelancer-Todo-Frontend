import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Define interfaces for earnings and expenses
interface EarningItem {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
}

interface MonthlyBreakdown {
  month: string;
  totalEarnings: number;
  totalExpenses: number;
  items: EarningItem[];
}

export default function EarningsScreen() {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Sample data - replace with actual data fetching logic
  const earningsData: EarningItem[] = [
    { 
      id: '1', 
      date: '2024-01-15', 
      amount: 5000, 
      description: 'Web Development Project', 
      type: 'income' 
    },
    { 
      id: '2', 
      date: '2024-01-20', 
      amount: 2000, 
      description: 'Design Work', 
      type: 'income' 
    },
    { 
      id: '3', 
      date: '2024-01-25', 
      amount: 1500, 
      description: 'Software Subscription', 
      type: 'expense' 
    },
  ];

  // Process monthly breakdown
  const monthlyBreakdown = useMemo(() => {
    const breakdown: { [key: string]: MonthlyBreakdown } = {};

    earningsData.forEach(item => {
      const date = new Date(item.date);
      const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

      if (!breakdown[monthKey]) {
        breakdown[monthKey] = {
          month: monthKey,
          totalEarnings: 0,
          totalExpenses: 0,
          items: []
        };
      }

      breakdown[monthKey].items.push(item);

      if (item.type === 'income') {
        breakdown[monthKey].totalEarnings += item.amount;
      } else {
        breakdown[monthKey].totalExpenses += item.amount;
      }
    });

    return Object.values(breakdown).sort((a, b) => {
      return new Date(b.month).getTime() - new Date(a.month).getTime();
    });
  }, [earningsData]);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const renderMonthlyCard = (breakdown: MonthlyBreakdown) => (
    <TouchableOpacity 
      key={breakdown.month}
      onPress={() => handleMonthSelect(breakdown.month)}
      className="mb-4 rounded-2xl overflow-hidden"
    >
      <LinearGradient
        colors={['#E50914', '#FF4B4B']}
        className="p-4"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-lg font-bold">{breakdown.month}</Text>
            <View className="flex-row mt-2">
              <View className="flex-row items-center mr-4">
                <MaterialCommunityIcons 
                  name="arrow-up-circle" 
                  size={20} 
                  color="white" 
                />
                <Text className="text-white ml-2">
                  ${breakdown.totalEarnings.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                
                  name="arrow-down-circle" 
                  size={20} 
                  color="white" 
                />
                <Text className="text-white ml-2">
                  ${breakdown.totalExpenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          <MaterialCommunityIcons 
            name={selectedMonth === breakdown.month ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="white" 
          />
        </View>
      </LinearGradient>

      {selectedMonth === breakdown.month && (
        <View className="bg-white px-4 py-2">
          {breakdown.items.map(item => (
            <View 
              key={item.id} 
              className={`
                flex-row justify-between items-center 
                py-3 px-4 rounded-xl mb-2
                ${item.type === 'income' ? 'bg-green-50' : 'bg-red-50'}
              `}
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name={item.type === 'income' ? 'arrow-up' : 'arrow-down'} 
                  size={20} 
                  color={item.type === 'income' ? '#10B981' : '#EF4444'} 
                />
                <Text className="ml-3 text-base">
                  {item.description}
                </Text>
              </View>
              <Text 
                className={`
                  text-base font-bold
                  ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}
                `}
              >
                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-red-500 p-6 pt-16 relative">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="absolute left-6 top-16 z-10"
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
        <Text className="text-center text-2xl font-bold text-white">
          Earnings & Expenses
        </Text>
      </View>

      <ScrollView 
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-4 mt-4 rounded-2xl overflow-hidden">
  <LinearGradient
    colors={['#E50914', '#FF4B4B']}
    className="p-4"
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
    <View className="flex-row justify-between">
      <View className="items-center flex-1">
        <MaterialCommunityIcons 
          name="arrow-up-circle" 
          size={24} 
          color="white" 
        />
        <Text className="text-white mt-2 text-sm">Total Earnings</Text>
        <Text className="text-green-300 mt-1 text-lg font-bold">
          +$10,500.00
        </Text>
      </View>
      <View className="items-center flex-1">
        <MaterialCommunityIcons 
          name="arrow-down-circle" 
          size={24} 
          color="white" 
        />
        <Text className="text-white mt-2 text-sm">Total Expenses</Text>
        <Text className="text-red-300 mt-1 text-lg font-bold">
          -$3,200.00
        </Text>
      </View>
    </View>
  </LinearGradient>
</View>

        <View className="mt-4 px-4">
          <Text className="text-xl font-bold mb-4">Monthly Breakdown</Text>
          {monthlyBreakdown.map(renderMonthlyCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}