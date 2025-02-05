import { MaterialCommunityIcons } from '@expo/vector-icons';
import NepaliDateConverter from 'components/rare/nepaliDateConverter';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';

interface MonthlyData {
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
    <View style={{ width: screenWidth, paddingTop: 12 }}>
      <Pressable
        onPress={onPress}
        style={{
          width: '100%',
          borderRadius: 16,
          backgroundColor: '#ffffff',
          padding: 20,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
          marginBottom: 16,
        }}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}>
        {isSummary ? (
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: 24,
                color: '#333',
              }}>
              Summary
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '600', color: '#008000', fontSize: 16 }}>
                Total Income
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#10B981' }}>
                Rs. {formatAmount(monthlyData.reduce((sum, item) => sum + item.totalIncome, 0))}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={{ fontWeight: '600', color: '#E50914', fontSize: 16 }}>
                Total Expense
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#E50914' }}>
                Rs. {formatAmount(monthlyData.reduce((sum, item) => sum + item.totalExpense, 0))}
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {[data1, data2].map(
              (data, index) =>
                data && (
                  <View key={index} style={{ flex: 1, marginHorizontal: 8 }}>
                    <View className="flex items-center">
                      <MaterialCommunityIcons name="calendar-month" size={32} color="#333" />
                      <NepaliDateConverter
                        date={new Date().toISOString()}
                        className="text-xl font-bold text-primary"
                        showDay={false}
                        showMonth
                        showDate={false}
                      />
                    </View>
                    <View style={{ marginTop: 24 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: '600', color: '#008000', fontSize: 16 }}>
                          Income
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#10B981' }}>
                          Rs. {formatAmount(data.totalIncome)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 12,
                        }}>
                        <Text style={{ fontWeight: '600', color: '#E50914', fontSize: 16 }}>
                          Expense
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#E50914' }}>
                          Rs. {formatAmount(data.totalExpense)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
            )}
          </View>
        )}
      </Pressable>
    </View>
  );

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}>
        {monthlyData.map((_, index) =>
          index % 2 === 0 && index < monthlyData.length - 1 ? (
            <MonthCard key={index} data1={monthlyData[index]} data2={monthlyData[index + 1]} />
          ) : null
        )}
        <MonthCard key={monthlyData.length} data1={monthlyData[0]} isSummary />
      </ScrollView>
    </View>
  );
};

export default SwipeableUnifiedCard;
