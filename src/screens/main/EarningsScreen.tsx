import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useGetEvents } from 'hooks/events';
import { RootState } from 'redux/store';
import { useGetEarnings } from 'hooks/earnings';

interface MonthlyData {
  month: string;
  quotedEarnings: number;
  receivedEarnings: number;
  dueAmount: number;
  eventCount: number;
  year: number;
}

export default function EarningsScreen() {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: earningsData,
    isLoading: earningsIsLoading,
    isError: earningsIsError,
    refetch: earningsRefetch,
  } = useGetEarnings(userId || 0);

  const { data: eventsData, isLoading, isError, refetch } = useGetEvents(userId || 0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetch(), earningsRefetch()]).finally(() => setRefreshing(false));
  }, [refetch, earningsRefetch]);

  const monthlyBreakdown = useMemo(() => {
    if (!earningsData?.monthly) return [];

    const nepaliMonths = [
      'Baisakh',
      'Jestha',
      'Ashad',
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

    return Object.entries(earningsData.monthly)
      .map(([key, data]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          month: `${nepaliMonths[month - 1]} ${year}`,
          year,
          quotedEarnings: parseFloat(data.quotedEarnings),
          receivedEarnings: data.receivedEarnings,
          dueAmount: data.dueAmount,
          eventCount: data.eventCount,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        const aMonthIndex = nepaliMonths.indexOf(a.month.split(' ')[0]);
        const bMonthIndex = nepaliMonths.indexOf(b.month.split(' ')[0]);
        return bMonthIndex - aMonthIndex;
      });
  }, [earningsData?.monthly]);

  const totals = useMemo(() => {
    if (!earningsData?.total) return { quoted: 0, received: 0, due: 0 };

    return {
      quoted: parseFloat(earningsData.total.totalQuotedEarnings),
      received: earningsData.total.totalReceivedEarnings,
      due: earningsData.total.totalDueAmount,
    };
  }, [earningsData?.total]);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const renderMonthlyCard = (data: MonthlyData) => (
    <TouchableOpacity
      key={data.month}
      onPress={() => handleMonthSelect(data.month)}
      className="mb-4 overflow-hidden rounded-2xl">
      <LinearGradient
        colors={['#E50914', '#FF4B4B']}
        className="p-4"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 16 }}>
        <View className="flex-row items-center justify-between p-3">
          <View>
            <Text className="text-lg font-bold text-white">{data.month}</Text>
            <View className="mt-2 flex-row">
              <View className="mr-4 flex-row items-center">
                <MaterialCommunityIcons name="cash-multiple" size={20} color="white" />
                <Text className="ml-2 text-white">रू{data.quotedEarnings.toLocaleString()}</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="cash-check" size={20} color="white" />
                <Text className="ml-2 text-white">रू{data.receivedEarnings.toLocaleString()}</Text>
              </View>
            </View>
            <Text className="mt-1 text-sm text-white">Events: {data.eventCount}</Text>
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
          <Text className="text-gray-600">Due Amount: रू{data.dueAmount.toLocaleString()}</Text>
          <Text className="text-gray-600">Total Events: {data.eventCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading || earningsIsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="relative bg-red-500 p-6 pt-16">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-6 top-16 z-10">
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-center text-2xl font-bold text-white">My Earnings</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E50914" />
          <Text className="text-gray-600 mt-4">Loading your earnings data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || earningsIsError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="relative bg-red-500 p-6 pt-16">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-6 top-16 z-10">
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-center text-2xl font-bold text-white">My Earnings</Text>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#E50914" />
          <Text className="text-gray-800 mt-4 text-center text-lg">
            Unable to load earnings data
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Please check your internet connection and try again
          </Text>
          <TouchableOpacity onPress={onRefresh} className="mt-4 rounded-full bg-red-500 px-6 py-3">
            <Text className="font-bold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative bg-red-500 p-6 pt-16">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute left-6 top-16 z-10">
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-center text-2xl font-bold text-white">My Earnings</Text>
      </View>

      <ScrollView
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="mx-4 mt-4 overflow-hidden rounded-2xl">
          <LinearGradient
            colors={['#E50914', '#FF4B4B']}
            className="p-4"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <View className="flex-row justify-between py-2">
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-multiple" size={24} color="white" />
                <Text className="mt-2 text-sm text-white">Total Earnings</Text>
                <Text className="mt-1 text-lg font-bold text-white">
                  रू{totals.quoted.toLocaleString()}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-check" size={24} color="white" />
                <Text className="mt-2 text-sm text-white">Received</Text>
                <Text className="mt-1 text-lg font-bold text-green-300">
                  रू{totals.received.toLocaleString()}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-plus" size={24} color="white" />
                <Text className="mt-2 text-sm text-white">Due</Text>
                <Text className="mt-1 text-lg font-bold text-red-300">
                  रू{totals.due.toLocaleString()}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="mt-4 px-4">
          <Text className="mb-4 text-xl font-bold">Monthly Breakdown</Text>
          {monthlyBreakdown.length > 0 ? (
            monthlyBreakdown.map(renderMonthlyCard)
          ) : (
            <View className="items-center py-8">
              <MaterialCommunityIcons name="information-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-center">No earnings data available yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
