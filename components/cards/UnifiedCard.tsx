import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';

interface MonthlyData {
  [key: string]: {
    dueAmount: number;
    eventCount: number;
    nepaliDate: {
      nepaliYear: number;
      nepaliMonth: number;
    };
    quotedEarnings: number;
    receivedEarnings: number;
  };
}

interface TotalData {
  totalEvents: number;
  totalQuotedEarnings: string;
  totalReceivedEarnings: string;
  totalDueAmount: number;
}

interface SwipeableUnifiedCardProps {
  monthlyData: MonthlyData;
  totalData: TotalData;
}

const SwipeableUnifiedCard: React.FC<SwipeableUnifiedCardProps> = ({ monthlyData, totalData }) => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(2);

  useEffect(() => {
    if (scrollViewRef.current && availableMonths.length > 0) {
      scrollViewRef.current.scrollTo({ x: screenWidth * currentIndex, animated: false });
    }
  }, [currentIndex]);

  // Return null if no data is available
  if (!monthlyData || Object.keys(monthlyData).length === 0) {
    return null;
  }

  const availableMonths = Object.keys(monthlyData).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return yearA === yearB ? monthA - monthB : yearA - yearB;
  });

 

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

  const getNepaliMonthName = (month: number) => {
    const nepaliMonths = [
      'Baisakh',
      'Jestha',
      'Ashadh',
      'Shrawan',
      'Bhadra',
      'Ashwin',
      'Kartik',
      'Mangsir',
      'Poush',
      'Magh',
      'Falgun',
      'Chaitra',
    ];
    return nepaliMonths[month - 1] || '';
  };

  const getMonthName = (monthKey: string) => {
    const monthData = monthlyData[monthKey];
    if (monthData?.nepaliDate?.nepaliMonth) {
      return getNepaliMonthName(monthData.nepaliDate.nepaliMonth);
    }

    const [year, month] = monthKey.split('-');
    return getNepaliMonthName(parseInt(month));
  };

  const getYear = (monthKey: string) => {
    const monthData = monthlyData[monthKey];
    if (monthData?.nepaliDate?.nepaliYear) {
      return monthData.nepaliDate.nepaliYear;
    }
    const [year] = monthKey.split('-');
    return parseInt(year);
  };

  const MonthlyCard = ({ monthKey1, monthKey2 }: { monthKey1: string; monthKey2?: string }) => {
    const isSingleMonth = !monthKey2;

    return (
      <View style={{ width: screenWidth }} className="pt-3">
        <Pressable className="mx-4 rounded-2xl bg-white p-5 shadow-lg" style={{ elevation: 4 }}>
          <View className="flex-row justify-between">
            {[{ key: monthKey1 }, ...(isSingleMonth ? [] : [{ key: monthKey2! }])].map(
              (item, index) => (
                <React.Fragment key={index}>
                  <View className={`flex-1 ${isSingleMonth ? '' : index === 0 ? 'pr-4' : 'pl-4'}`}>
                    <View className="items-center">
                      <MaterialCommunityIcons name="calendar-month" size={32} color="#333" />
                      <View className="items-center">
                        <View className="items-center">
                          <Text className="text-gray-800 text-xl font-bold">
                            {getMonthName(item.key)}
                          </Text>
                          <Text className="text-gray-500 text-sm">{getYear(item.key)} BS</Text>
                        </View>
                        {monthlyData[item.key]?.eventCount > 0 ? (
                          <Text className="text-gray-600 text-sm">
                            {monthlyData[item.key].eventCount} Events
                          </Text>
                        ) : (
                          <Text className="text-gray-500 text-sm">No events scheduled</Text>
                        )}
                      </View>
                    </View>
                    <View className="mt-4">
                      {monthlyData[item.key]?.eventCount > 0 ? (
                        <>
                          <View className="mb-2 flex-row justify-between">
                            <Text className="text-xl font-semibold text-green-600">
                              रू{formatAmount(monthlyData[item.key].receivedEarnings)}
                            </Text>
                            <Text className="text-xl font-semibold text-red-600">
                              रू{formatAmount(monthlyData[item.key].dueAmount)}
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
                  {!isSingleMonth && index === 0 && <View className="bg-gray-200 h-full w-[2px]" />}
                </React.Fragment>
              )
            )}
          </View>
        </Pressable>
      </View>
    );
  };

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
              <Text className="text-lg font-semibold text-blue-700">Total Earnings</Text>
              <Text className="text-xl font-bold text-blue-700">
                रू{formatAmount(totalData.totalQuotedEarnings)}
              </Text>
            </View>
            <View className="mb-4 flex-row justify-between">
              <Text className="text-lg font-semibold text-green-700">Total Received</Text>
              <Text className="text-xl font-bold text-green-700">
                रू{formatAmount(totalData.totalReceivedEarnings)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-lg font-semibold text-red-500">Total Due</Text>
              <Text className="text-xl font-bold text-red-500">
                रू{formatAmount(totalData.totalDueAmount)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );

  // Handle single month case
  if (availableMonths.length === 1) {
    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={10}>
        <MonthlyCard monthKey1={availableMonths[0]} />
        <SummaryCard />
      </ScrollView>
    );
  }

  // Handle multiple months case
  const monthPairs = [];
  for (let i = 0; i < availableMonths.length; i += 2) {
    if (i + 1 < availableMonths.length) {
      monthPairs.push({
        monthKey1: availableMonths[i],
        monthKey2: availableMonths[i + 1],
      });
    } else {
      monthPairs.push({
        monthKey1: availableMonths[i],
      });
    }
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={10}>
      {monthPairs.map((pair, index) => (
        <MonthlyCard
          key={`${pair.monthKey1}-${pair.monthKey2 || 'single'}`}
          monthKey1={pair.monthKey1}
          monthKey2={pair.monthKey2}
        />
      ))}
      <SummaryCard />
    </ScrollView>
  );
};

export default SwipeableUnifiedCard;
