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

  const getDateForOffset = (offset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toISOString();
  };

  const MonthCard = ({ data, dateOffset }: { data: MonthlyData; dateOffset: number }) => (
    <View style={{ width: screenWidth }}>
      <Pressable
        onPress={onPress}
        style={{
          width: '100%',
          borderRadius: 12,
          backgroundColor: '#fff',
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}>
        <View style={{ marginBottom: 16 }} className="flex items-center justify-between">
          <MaterialCommunityIcons name="calendar-month" size={28} color="#000000" />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginLeft: 8 }} className="flex items-center">
              <NepaliDateConverter
                date={getDateForOffset(dateOffset)}
                className="text-3xl font-bold text-primary"
                showDay={false}
                showMonth={true}
                showDate={false}
              />
            </View>
          </View>
        </View>

        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="cash" size={28} color="#008000" />
              <Text style={{ color: '#008000', fontWeight: '600', marginLeft: 8 }}>
                Estimated Income
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#10B981' }}>
              Rs. {formatAmount(data.totalIncome)}
            </Text>
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="cash-minus" size={28} color="#E50914" />
              <Text style={{ color: '#E50914', fontWeight: '600', marginLeft: 8 }}>
                Total Expenses
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#E50914' }}>
              Rs. {formatAmount(data.totalExpense)}
            </Text>
          </View>

          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopWidth: 1,
              borderColor: '#E5E7EB',
              paddingTop: 8,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="cash-check" size={28} color="#3B82F6" />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ color: '#3B82F6', fontWeight: '600' }}>Net Balance</Text>
                <Text style={{ color: '#6B7280', fontSize: 12 }}>
                  {data.eventCount} events planned
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#3B82F6' }}>
              Rs. {formatAmount(data.totalIncome - data.totalExpense)}
            </Text>
          </View>
        </View>
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
        {monthlyData.map((data, index) => (
          <MonthCard key={index} data={data} dateOffset={index - 1} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SwipeableUnifiedCard;
