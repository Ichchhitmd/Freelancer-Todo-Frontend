import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';

interface MonthlyData {
  eventId: number;
  month: string;
  totalIncome: number;
  totalExpense: number;
  eventCount: number;
}

interface SwipeableUnifiedCardProps {
  monthlyData: MonthlyData[];
  onPress?: () => void;
}

const SwipeableUnifiedCard: React.FC<SwipeableUnifiedCardProps> = ({ monthlyData, onPress }) => {
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

  const formatAmount = (amount: number) => {
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  const MonthCard = ({
    data1,
    data2,
    isSummary,
  }: {
    data1: MonthlyData;
    data2?: MonthlyData;
    isSummary?: boolean;
  }) => (
    <View style={{ width: screenWidth }} className="pt-3">
      <Pressable
        onPress={onPress}
        className="mb-4 w-full rounded-2xl bg-white p-5 shadow-lg"
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}>
        {isSummary ? (
          <View className="h-28">
            <Text className="text-gray-800 mb-6 text-center text-2xl font-bold">Summary</Text>
            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-green-700">Total Income</Text>
              <Text className="text-lg font-bold text-emerald-500">
                Rs. {formatAmount(monthlyData.reduce((sum, item) => sum + item.totalIncome, 0))}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-row justify-between">
            {[data1, data2].map(
              (data, index) =>
                data && (
                  <React.Fragment key={index}>
                    <View className={`flex-1 ${index === 0 ? 'pr-4' : 'pl-4'}`}>
                      <View className="items-center">
                        <MaterialCommunityIcons name="calendar-month" size={32} color="#333" />
                        <View className="items-center">
                          <Text className="text-gray-800 text-xl font-bold">{data.month}</Text>
                        </View>
                      </View>
                      <View className="mt-6">
                        <View className="flex-row justify-between">
                          <Text className="text-base font-semibold text-green-700">Income</Text>
                          <Text className="text-lg font-bold text-emerald-500">
                            Rs. {formatAmount(data.totalIncome)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {index === 0 && data2 && <View className="h-full w-[2px] bg-gray/15" />}
                  </React.Fragment>
                )
            )}
          </View>
        )}
      </Pressable>
    </View>
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={200}>
      {monthlyData.map((_, index) => {
        if (index % 2 === 0) {
          return (
            <MonthCard key={index} data1={monthlyData[index]} data2={monthlyData[index + 1]} />
          );
        }
        return null;
      })}

      {monthlyData.length % 1 !== 0 && (
        <MonthCard key={monthlyData.length - 1} data1={monthlyData[monthlyData.length - 1]} />
      )}

      <MonthCard key="summary" data1={monthlyData[0]} isSummary />
    </ScrollView>
  );
};

export default SwipeableUnifiedCard;
