import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import CompanyDropdown from 'components/EarningsScreen/CompanyDropdown';
import { MonthlyEventsModal } from 'components/EarningsScreen/MonthlyEventsModal';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetCompanies } from 'hooks/companies';
import { useGetEarnings } from 'hooks/earnings';
import { useGetEvents } from 'hooks/events';
import { useGetFinancials } from 'hooks/finance';
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

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
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCompanyId) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [selectedCompanyId]);

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data: earningsData, refetch: earningsRefetch } = useGetEarnings(userId || 0);
  const { data: eventsData, refetch } = useGetEvents(userId || 0);
  const { data: companiesData } = useGetCompanies();
  const { data: FinancialData } = useGetFinancials(userId, selectedCompanyId || 0);

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
        if (a.year !== b.year) return a.year - b.year;
        const aMonthIndex = nepaliMonths.indexOf(a.month.split(' ')[0]);
        const bMonthIndex = nepaliMonths.indexOf(b.month.split(' ')[0]);
        return aMonthIndex - bMonthIndex;
      });
  }, [earningsData?.monthly]);

  const totals = useMemo(() => {
    if (selectedCompanyId && FinancialData) {
      return {
        quoted: FinancialData.totalEarnings,
        received: FinancialData.totalReceived,
        due: FinancialData.totalDue,
      };
    }

    if (!earningsData?.total) return { quoted: 0, received: 0, due: 0 };

    return {
      quoted: parseFloat(earningsData.total.totalQuotedEarnings),
      received: earningsData.total.totalReceivedEarnings,
      due: earningsData.total.totalDueAmount,
    };
  }, [earningsData?.total, selectedCompanyId, FinancialData]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonthEvents, setSelectedMonthEvents] = useState<
    {
      id: number;
      eventDate: string[];
      earnings: string;
      eventType: string;
      workType: string[];
      company?: {
        id: number;
        name: string;
      };
      location?: string;
      assignedBy: string;
      assignedContactNumber: string;
      paymentStatus: string;
      dueAmount: number;
      eventCategory: string;
    }[]
  >([]);
  const [selectedMonthTotals, setSelectedMonthTotals] = useState({
    quoted: 0,
    received: 0,
    due: 0,
  });

  const handleMonthSelect = (monthData: MonthlyData) => {
    const [monthName, yearStr] = monthData.month.split(' ');
    const year = parseInt(yearStr, 10);

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
    const month = nepaliMonths.indexOf(monthName) + 1;

    const monthEventIds = new Set(
      earningsData?.events
        ?.filter((event) => {
          const eventDate = event.detailNepaliDate[0];
          return eventDate.nepaliYear === year && eventDate.nepaliMonth === month;
        })
        .map((event) => event.id) || []
    );

    const monthEvents = eventsData?.filter((event) => monthEventIds.has(event.id)) || [];

    const transformedEvents = monthEvents.map((event) => ({
      id: event.id,
      eventDate: event.nepaliEventDate,
      earnings: event.earnings.toString(),
      eventType: event.eventType,
      workType: Array.isArray(event.workType) ? event.workType : [event.eventType],
      company: event.company,
      location: event.venueDetails?.location || '',
      assignedBy: event.assignedBy || '',
      assignedContactNumber: event.assignedContactNumber,
      paymentStatus: event.paymentStatus,
      dueAmount: event.dueAmount,
      eventCategory: event.eventCategory,
    }));

    setSelectedMonth(monthData.month);
    setSelectedMonthEvents(transformedEvents);
    setSelectedMonthTotals({
      quoted: monthData.quotedEarnings,
      received: monthData.receivedEarnings,
      due: monthData.dueAmount,
    });
    setModalVisible(true);
  };

  const handleCompanySelect = (companyId: number | null) => {
    setSelectedCompanyId(companyId);
    setIsLoading(true);

    if (companyId === null) {
      setSelectedCompanyName(null);
      setIsLoading(false);
    } else {
      const company = companiesData?.find((c) => c.id === companyId);
      setSelectedCompanyName(company?.name || null);
    }
  };

  const renderMonthlyCard = (data: MonthlyData) => (
    <TouchableOpacity
      key={data.month}
      onPress={() => handleMonthSelect(data)}
      className="mb-4 overflow-hidden rounded-2xl">
      <LinearGradient
        colors={['#A30000', '#B32800']}
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
          <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const recentEvents = useMemo(() => {
    if (!FinancialData?.events) return [];
    return FinancialData.events.slice(0, 10); // Limit to 10 recent events for better performance
  }, [FinancialData?.events]);

  const renderCompanyStats = () => {
    if (!selectedCompanyId || !FinancialData) {
      if (isLoading) {
        return (
          <View className="mt-4 items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
            <ActivityIndicator size="large" color="#E50914" />
            <Text className="text-gray-600 mt-4 text-center text-base">
              Loading company data...
            </Text>
          </View>
        );
      }

      return (
        <View className="mt-4 items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-600 mt-4 text-center text-lg font-medium">
            No Data Available
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Please select a company you have worked with to view their events and earnings.
          </Text>
        </View>
      );
    }

    return (
      <View className="mt-4">
        <View className="rounded-2xl bg-primary/90 p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">{selectedCompanyName}</Text>
            <MaterialCommunityIcons name="office-building" size={24} color="white" />
          </View>
          <View className="mt-4 flex-row flex-wrap justify-between">
            <View className="mb-3 w-[48%] rounded-xl bg-white/10 p-3">
              <MaterialCommunityIcons name="calendar-multiple" size={20} color="white" />
              <Text className="mt-1 text-sm text-white/80">Total Events</Text>
              <Text className="text-xl font-bold text-white">{FinancialData.totalEvents}</Text>
            </View>
            <View className="mb-3 w-[48%] rounded-xl bg-white/10 p-3">
              <MaterialCommunityIcons name="cash-multiple" size={20} color="white" />
              <Text className="mt-1 text-sm text-white/80">Total Earnings</Text>
              <Text className="text-xl font-bold text-white">
                रू{FinancialData.totalEarnings.toLocaleString()}
              </Text>
            </View>
            <View className="w-[48%] rounded-xl bg-white/10 p-3">
              <MaterialCommunityIcons name="cash-check" size={20} color="white" />
              <Text className="mt-1 text-sm text-white/80">Received</Text>
              <Text className="text-xl font-bold text-white">
                रू{FinancialData.totalReceived.toLocaleString()}
              </Text>
            </View>
            <View className="w-[48%] rounded-xl bg-white/10 p-3">
              <MaterialCommunityIcons name="cash-remove" size={20} color="white" />
              <Text className="mt-1 text-sm text-white/80">Due Amount</Text>
              <Text className="text-xl font-bold text-white">
                रू{FinancialData.totalDue.toLocaleString()}
              </Text>
            </View>
            <View className="mt-3 w-[48%] rounded-xl bg-white/10 p-3">
              <MaterialCommunityIcons name="cash-remove" size={20} color="white" />
              <Text className="mt-1 text-sm text-white/80">Advance Balance</Text>
              <Text className="text-xl font-bold text-white">
                रू{FinancialData.advancePaymentBalance.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-gray-800 text-lg font-semibold">Recent Events</Text>
          </View>

          <ScrollView className="">
            {recentEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventPress(event)}
                className="mb-3 overflow-hidden rounded-xl shadow-sm">
                <LinearGradient
                  colors={['#A30000', '#B32800']}
                  className="p-4"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="mb-1 font-medium text-white" numberOfLines={1}>
                        {event.eventCategory || 'Event'}
                      </Text>
                      <Text className="text-xs text-white/70">
                        {event.nepaliEventDate || 'Unknown date'}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-lg font-bold text-white">
                        रू {typeof event.earnings === 'number' ? event.earnings : event.earnings}
                      </Text>
                      <View
                        className={`mt-1 rounded-full ${event.paymentStatus === 'PAID' ? 'bg-green-500/30' : 'bg-white/20'} px-3 py-1`}>
                        <Text
                          className={`text-xs ${event.paymentStatus === 'PAID' ? 'text-green-100' : 'text-white'}`}>
                          {event.paymentStatus || 'UNPAID'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {recentEvents.length === 0 && (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-400">No recent events found</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const handleEventPress = (event) => {
    const fullEvent = eventsData?.find((e) => e.id === event.id);
    if (fullEvent) {
      navigation.navigate('DateDetails', {
        details: {
          id: fullEvent.id,
          eventDate: fullEvent.nepaliEventDate,
          earnings: fullEvent.earnings,
          eventType: fullEvent.eventType,
          workType: Array.isArray(fullEvent.workType) ? fullEvent.workType : [fullEvent.eventType],
          company: fullEvent.company,
          location: fullEvent.location || '',
          assignedBy: fullEvent.assignedBy || '',
          assignedContactNumber: fullEvent.assignedContactNumber,
          paymentStatus: fullEvent.paymentStatus,
          dueAmount: fullEvent.dueAmount,
          eventCategory: fullEvent.eventCategory,
        },
      });
    }
  };

  return (
    <SafeAreaView className="mb-14 flex-1 bg-white">
      <View className="relative bg-primary/35 p-6 pt-16">
        <Text className="text-center text-2xl font-bold text-white">My Earnings</Text>
      </View>

      <ScrollView
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="mx-4 mt-4 overflow-hidden rounded-2xl">
          <LinearGradient
            colors={['#A30000', '#B32800']}
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
          <View className="mb-4 flex-row items-center justify-between">
            <Text className={`text-xl font-bold ${selectedCompanyId ? 'hidden' : 'block'}`}>
              Monthly Breakdown
            </Text>
            <CompanyDropdown
              onSelectCompany={handleCompanySelect}
              activeCompany={selectedCompanyName}
            />
          </View>

          {selectedCompanyId ? (
            renderCompanyStats()
          ) : monthlyBreakdown.length > 0 ? (
            monthlyBreakdown.map(renderMonthlyCard)
          ) : (
            <View className="items-center py-8">
              <MaterialCommunityIcons name="information-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-center">No earnings data available yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <MonthlyEventsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        events={selectedMonthEvents}
        monthName={selectedMonth || ''}
        onEventPress={(event) => {
          setModalVisible(false);
          setTimeout(() => {
            navigation.navigate('DateDetails', {
              details: event,
              refresh: async () => {
                const { data } = await queryClient.fetchQuery(['events', event.id], () =>
                  getEventById(event.id)
                );
                return data;
              },
            });
          }, 100);
        }}
        totalEarnings={selectedMonthTotals}
      />
    </SafeAreaView>
  );
}
