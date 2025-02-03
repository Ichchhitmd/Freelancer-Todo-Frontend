import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  actualIncome: number;
  eventCount: number;
  gadgetsPurchased: number;
}

interface StatsSectionProps {
  monthlyData: MonthlyData[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ monthlyData }) => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(1); // Default to the middle card

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: screenWidth, animated: false });
    }
  }, []);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(newIndex);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  const EstimatedIncomeCard = ({
    estimatedIncome,
    eventCount,
  }: {
    estimatedIncome: number;
    eventCount: number;
  }) => (
    <View className="flex-1 rounded-xl bg-white p-3 shadow-sm">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-gray-600 text-sm font-medium">Estimated Income</Text>
        <View className="rounded-full bg-purple-50 p-1.5">
          <MaterialCommunityIcons name="chart-line" size={16} color="#9333ea" />
        </View>
      </View>
      <View className="flex-row flex-wrap items-baseline">
        <Text className="mr-0.5 text-lg font-bold text-purple-600">₹</Text>
        <Text className="text-lg font-bold text-purple-600">{formatAmount(estimatedIncome)}</Text>
      </View>
      <Text className="text-gray-500 mt-1 text-xs">{eventCount} events planned</Text>
    </View>
  );

  const ActualIncomeCard = ({
    actualIncome,
    totalExpense,
    gadgetsPurchased,
  }: {
    actualIncome: number;
    totalExpense: number;
    gadgetsPurchased: number;
  }) => (
    <View className="flex-1 rounded-xl bg-white p-3 shadow-sm">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-gray-600 text-sm font-medium">Actual Income</Text>
        <View className="rounded-full bg-blue-50 p-1.5">
          <MaterialCommunityIcons name="wallet" size={16} color="#2563eb" />
        </View>
      </View>
      <View className="mb-1 flex-row flex-wrap items-baseline">
        <Text className="mr-0.5 text-lg font-bold text-blue-600">₹</Text>
        <Text className="text-lg font-bold text-blue-600">{formatAmount(actualIncome)}</Text>
      </View>
      <Text className="text-gray-500 mb-3 text-xs">After expenses</Text>

      <View className="border-gray-100 border-t pt-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600 text-xs">Total Expense</Text>
          <View className="flex-row items-baseline">
            <Text className="text-xs font-medium text-red-500">₹{formatAmount(totalExpense)}</Text>
          </View>
        </View>
        <Text className="text-gray-500 mt-0.5 text-xs">{gadgetsPurchased} gadgets purchased</Text>
      </View>
    </View>
  );

  return (
    <View className="my-4 rounded-xl bg-white py-3 shadow-md">
      <View className="mx-2 mb-4 flex items-center justify-center">
        <Text className="text-gray-900 text-lg font-bold">
          {monthlyData[currentIndex]?.month} Overview
        </Text>
        <Text className="text-gray-500 text-sm">Track earnings & expenses</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}
        contentContainerStyle={{ width: `${100 * monthlyData.length}%` }}>
        {monthlyData.map((data, index) => (
          <View key={index} style={{ width: screenWidth, paddingHorizontal: 8 }}>
            <View className="flex-row justify-between px-2" style={{ gap: 12 }}>
              <EstimatedIncomeCard
                estimatedIncome={data.totalIncome}
                eventCount={data.eventCount}
              />
              <ActualIncomeCard
                actualIncome={data.actualIncome}
                totalExpense={data.totalExpense}
                gadgetsPurchased={data.gadgetsPurchased}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StatsSection;
