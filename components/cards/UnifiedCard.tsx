import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';

interface MonthlyEarnings {
  quotedEarnings: string;
  receivedEarnings: number;
  dueAmount: number;
  eventCount: number;
}

interface MonthlyData {
  [key: string]: MonthlyEarnings;
}

interface TotalData {
  totalEvents: number;
  totalQuotedEarnings: string;
  totalReceivedEarnings: number;
  totalDueAmount: number;
}

interface SwipeableUnifiedCardProps {
  monthlyData: MonthlyData;
  totalData: TotalData;
}

const SwipeableUnifiedCard: React.FC<SwipeableUnifiedCardProps> = ({ monthlyData, totalData }) => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(1);

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

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (numAmount >= 100000) return `${(numAmount / 100000).toFixed(1)}L`;
    if (numAmount >= 1000) return `${(numAmount / 1000).toFixed(1)}K`;
    return numAmount.toString();
  };

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const getEmptyMonthData = (monthKey: string): MonthlyEarnings => ({
    quotedEarnings: '0',
    receivedEarnings: 0,
    dueAmount: 0,
    eventCount: 0,
  });

  const MonthlyCard = ({
    data1,
    data2,
    monthKey1,
    monthKey2,
  }: {
    data1?: MonthlyEarnings;
    data2?: MonthlyEarnings;
    monthKey1: string;
    monthKey2: string;
  }) => (
    <View style={{ width: screenWidth }} className="pt-3">
      <Pressable className="mx-4 rounded-2xl bg-white p-5 shadow-lg" style={{ elevation: 4 }}>
        <View className="flex-row justify-between">
          {[
            { data: data1 || getEmptyMonthData(monthKey1), key: monthKey1 },
            { data: data2 || getEmptyMonthData(monthKey2), key: monthKey2 },
          ].map((item, index) => (
            <React.Fragment key={index}>
              <View className={`flex-1 ${index === 0 ? 'pr-4' : 'pl-4'}`}>
                <View className="items-center">
                  <MaterialCommunityIcons name="calendar-month" size={32} color="#333" />
                  <View className="items-center">
                    <Text className="text-gray-800 text-xl font-bold">
                      {getMonthName(item.key)}
                    </Text>
                    {item.data.eventCount > 0 ? (
                      <Text className="text-gray-600 text-sm">{item.data.eventCount} Events</Text>
                    ) : (
                      <Text className="text-gray-500 text-sm">No events scheduled</Text>
                    )}
                  </View>
                </View>
                <View className="mt-4">
                  {item.data.eventCount > 0 ? (
                    <>
                      <View className="mb-2 flex-row justify-between">
                        <Text className="text-xl font-semibold text-green-600">
                          रू{formatAmount(item.data.receivedEarnings)}
                        </Text>
                        <Text className="text-xl font-semibold text-red-600">
                          रू{formatAmount(item.data.dueAmount)}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <View className="items-center justify-center py-4">
                      <Text className="text-gray-500 text-center">
                        No earnings for {getMonthName(item.key)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {index === 0 && <View className="bg-gray-200 h-full w-[2px]" />}
            </React.Fragment>
          ))}
        </View>
      </Pressable>
    </View>
  );

  const SummaryCard = () => (
    <View style={{ width: screenWidth }} className="pt-3">
      <Pressable className="mx-4 rounded-2xl bg-white p-5 shadow-lg" style={{ elevation: 4 }}>
        <View className="h-full">
          <Text className="text-gray-800 mb-6 text-center text-2xl font-bold">Total Summary</Text>
          <View className="flex-row items-center justify-between">
            <MaterialCommunityIcons name="calendar-month" size={24} color="#4B5563" />
            <Text className="text-gray-600 text-lg">{totalData.totalEvents} Total Events</Text>
          </View>
          <View className="mt-6">
            <View className="mb-4 flex-row justify-between">
              <Text className="text-lg font-semibold text-green-700">Total Earnings</Text>
              <Text className="text-xl font-bold text-emerald-500">
                रू{formatAmount(totalData.totalQuotedEarnings)}
              </Text>
            </View>
            <View className="mb-4 flex-row justify-between">
              <Text className="text-lg font-semibold text-blue-700">Total Received</Text>
              <Text className="text-xl font-bold text-blue-500">
                रू{formatAmount(totalData.totalReceivedEarnings)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-lg font-semibold text-red-700">Total Due</Text>
              <Text className="text-xl font-bold text-red-500">
                रू{formatAmount(totalData.totalDueAmount)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );

  // Get current month and year
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Create month keys for current and next month
  const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const nextMonthKey =
    currentMonth === 12
      ? `${currentYear + 1}-01`
      : `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  // Create month keys for past months
  const getPastMonthKey = (monthsAgo: number) => {
    const date = new Date(currentYear, currentMonth - 1 - monthsAgo);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const pastMonthKeys = [getPastMonthKey(1), getPastMonthKey(2)];

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={10}>
      <MonthlyCard
        monthKey1={pastMonthKeys[0]}
        monthKey2={pastMonthKeys[1]}
        data1={monthlyData[pastMonthKeys[0]]}
        data2={monthlyData[pastMonthKeys[1]]}
      />

      {/* Current and Next Month */}
      <MonthlyCard
        monthKey1={currentMonthKey}
        monthKey2={nextMonthKey}
        data1={monthlyData[currentMonthKey]}
        data2={monthlyData[nextMonthKey]}
      />

      {/* Summary Card */}
      <SummaryCard />
    </ScrollView>
  );
};

export default SwipeableUnifiedCard;
