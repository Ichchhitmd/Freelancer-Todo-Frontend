import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useGetEvents } from 'hooks/events';
import { RootState } from 'redux/store';

interface MonthlyData {
  eventId: number;
  month: string;
  totalIncome: number;
  totalExpense: number;
  eventCount: number;
  eventDate: string;
}

export default function EarningsScreen() {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: eventsData, isLoading, isError, refetch } = useGetEvents(userId || 0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // Process monthly breakdown
  const monthlyBreakdown = useMemo(() => {
    if (!eventsData) return [];
    
    const eventsArray = Array.isArray(eventsData) ? eventsData : [eventsData];
    const nepaliMonths = [
      'Baisakh', 'Jestha', 'Ashad', 'Shrawan', 'Bhadra', 'Ashwin',
      'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
    ];

    const monthlyMap: { [key: string]: MonthlyData } = {};

    eventsArray.forEach((event) => {
      try {
        // Split and validate event dates
        const eventDates = event.eventDate?.split(',').map((d: string) => d.trim()) || [];
        if (eventDates.length === 0) return;

        const earnings = parseFloat(event.earnings) || 0;
        const expenses = parseFloat(event.expenses) || 0;

        // Get the first valid date from the array
        let validDate = null;
        for (const dateStr of eventDates) {
          try {
            const [year, month, day] = dateStr.split('-').map(Number);
            
            // Basic date validation
            if (!year || !month || !day) continue;
            if (month < 1 || month > 12) continue;
            if (day < 1 || day > 32) continue;
            
            validDate = { year, month };
            break;
          } catch (err) {
            console.error('Error parsing date:', dateStr, err);
            continue;
          }
        }

        if (!validDate) return;

        const monthNumber = validDate.month;
        const monthName = nepaliMonths[monthNumber - 1];
        const monthKey = `${monthName} ${validDate.year}`;

        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {
            eventId: event.id,
            month: monthKey,
            totalIncome: 0,
            totalExpense: 0,
            eventCount: 0,
            eventDate: event.eventDate,
          };
        }

        monthlyMap[monthKey].totalIncome += earnings;
        monthlyMap[monthKey].totalExpense += expenses;
        monthlyMap[monthKey].eventCount += 1;
      } catch (error) {
        console.error('Error processing event:', event, error);
      }
    });

    return Object.values(monthlyMap).sort((a, b) => {
      try {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        
        const aYearNum = parseInt(aYear);
        const bYearNum = parseInt(bYear);
        
        if (aYearNum !== bYearNum) {
          return bYearNum - aYearNum;
        }
        
        return nepaliMonths.indexOf(bMonth) - nepaliMonths.indexOf(aMonth);
      } catch (error) {
        console.error('Error sorting months:', error);
        return 0;
      }
    });
  }, [eventsData]);

  // Calculate total earnings and expenses
  const totals = useMemo(() => {
    return monthlyBreakdown.reduce((acc, curr) => ({
      earnings: acc.earnings + curr.totalIncome,
      expenses: acc.expenses + curr.totalExpense
    }), { earnings: 0, expenses: 0 });
  }, [monthlyBreakdown]);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const renderMonthlyCard = (data: MonthlyData) => (
    <TouchableOpacity 
      key={data.month}
      onPress={() => handleMonthSelect(data.month)}
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
            <Text className="text-white text-lg font-bold">{data.month}</Text>
            <View className="flex-row mt-2">
              <View className="flex-row items-center mr-4">
                <MaterialCommunityIcons 
                  name="arrow-up-circle" 
                  size={20} 
                  color="white" 
                />
                <Text className="text-white ml-2">
                  रू{data.totalIncome.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name="arrow-down-circle" 
                  size={20} 
                  color="white" 
                />
                <Text className="text-white ml-2">
                  रू{data.totalExpense.toFixed(2)}
                </Text>
              </View>
            </View>
            <Text className="text-white text-sm mt-1">
              Events: {data.eventCount}
            </Text>
          </View>
          <MaterialCommunityIcons 
            name={selectedMonth === data.month ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="white" 
          />
        </View>
      </LinearGradient>

      {selectedMonth === data.month && (
        <View className="bg-white px-4 py-2">
          <Text className="text-gray-600">
            Net Income: रू{(data.totalIncome - data.totalExpense).toFixed(2)}
          </Text>
          <Text className="text-gray-600">
            Total Events: {data.eventCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E50914" />
          <Text className="mt-4 text-gray-600">Loading your earnings data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
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
        <View className="flex-1 justify-center items-center px-4">
          <MaterialCommunityIcons 
            name="alert-circle-outline" 
            size={48} 
            color="#E50914" 
          />
          <Text className="mt-4 text-lg text-gray-800 text-center">
            Unable to load earnings data
          </Text>
          <Text className="mt-2 text-gray-600 text-center">
            Please check your internet connection and try again
          </Text>
          <TouchableOpacity 
            onPress={onRefresh}
            className="mt-4 bg-red-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                  +रू{totals.earnings.toFixed(2)}
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
                  -रू{totals.expenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="mt-4 px-4">
          <Text className="text-xl font-bold mb-4">Monthly Breakdown</Text>
          {monthlyBreakdown.length > 0 ? (
            monthlyBreakdown.map(renderMonthlyCard)
          ) : (
            <View className="py-8 items-center">
              <MaterialCommunityIcons 
                name="information-outline" 
                size={48} 
                color="#9CA3AF" 
              />
              <Text className="mt-4 text-gray-500 text-center">
                No earnings data available yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}