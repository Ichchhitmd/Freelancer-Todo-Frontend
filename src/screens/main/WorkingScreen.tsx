import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from 'components/WorkingsScreen/EmptyState';
import { FilterBar } from 'components/WorkingsScreen/FilterBar';
import { WorkItem } from 'components/WorkingsScreen/WorkItem';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetEvents } from 'hooks/events';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { SimplifiedWorkItem, WorkEvent } from 'types/WorkingScreenTypes';

type RootStackParamList = {
  DateDetails: { details: WorkEvent };
  CompanyDetails: { companyId: number };
};

type FilterType = 'all' | 'upcoming' | 'past' | 'today' | 'unpaid' | 'paid';
type SortType = 'date-desc' | 'date-asc' | 'company' | 'earnings' | 'due-amount';

export const WorkingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: allEvents, isLoading, isError, refetch } = useGetEvents(userId || 0);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCompany, setActiveCompany] = useState<string>('');
  const [visibleEvents, setVisibleEvents] = useState<SimplifiedWorkItem[]>([]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Process raw events into simplified format
  const processEvents = useCallback((events: WorkEvent[]): SimplifiedWorkItem[] => {
    if (!events) return [];

    return events.map((event) => {
      const eventDate = new Date(event.eventDate[0]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isToday =
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear();

      const daysDifference = Math.floor(
        (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: event.id,
        companyId: event.company?.id || 0,
        companyName: event.company?.name || 'Unknown Company',
        nepaliEventDate: event.nepaliEventDate,
        detailNepaliDate: event.detailNepaliDate,
        eventType: event.eventCategory?.name || 'Unknown Type',
        side: event.side,
        workType: event.workType || [],
        earnings: event.earnings?.toString() || '0',
        location: event.location,
        originalEvent: event,
        statusText: isToday
          ? 'Today'
          : daysDifference > 0
            ? `In ${daysDifference} days`
            : `${Math.abs(daysDifference)} days ago`,
        daysDifference,
        isToday,
        paymentStatus: event.paymentStatus || 'UNPAID',
      };
    });
  }, []);

  // Filter and sort events
  useEffect(() => {
    if (!allEvents) return;

    let processedEvents = processEvents(allEvents);
    let filteredEvents = [...processedEvents];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Apply company filter first if active
    if (activeCompany) {
      filteredEvents = filteredEvents.filter((event) =>
        event.companyName.toLowerCase().includes(activeCompany.toLowerCase())
      );
    }

    // Apply main filter
    switch (activeFilter) {
      case 'upcoming':
        filteredEvents = filteredEvents.filter((event) => event.daysDifference >= 0);
        break;
      case 'past':
        filteredEvents = filteredEvents.filter((event) => event.daysDifference < 0);
        break;
      case 'today':
        filteredEvents = filteredEvents.filter((event) => event.isToday);
        break;
      case 'unpaid':
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.originalEvent?.paymentStatus === 'UNPAID' ||
            event.originalEvent?.paymentStatus === 'PARTIALLY_PAID'
        );
        break;
      case 'paid':
        filteredEvents = filteredEvents.filter(
          (event) => event.originalEvent?.paymentStatus === 'PAID'
        );
        break;
    }

    // Sort events
    switch (activeSort) {
      case 'date-desc':
        filteredEvents.sort((a, b) => {
          if (a.daysDifference < 0 && b.daysDifference < 0) {
            return a.daysDifference - b.daysDifference; // Most recent past event first
          }
          if (a.daysDifference >= 0 && b.daysDifference >= 0) {
            return a.daysDifference - b.daysDifference; // Closest future event first
          }
          return b.daysDifference - a.daysDifference;
        });
        break;
      case 'date-asc':
        filteredEvents.sort((a, b) => {
          if (a.daysDifference < 0 && b.daysDifference < 0) {
            return b.daysDifference - a.daysDifference; // Oldest past event first
          }
          if (a.daysDifference >= 0 && b.daysDifference >= 0) {
            return b.daysDifference - a.daysDifference; // Furthest future event first
          }
          return a.daysDifference - b.daysDifference;
        });
        break;
      case 'company':
        filteredEvents.sort((a, b) => a.companyName.localeCompare(b.companyName));
        break;
      case 'earnings':
        filteredEvents.sort((a, b) => {
          const aEarnings = parseFloat(a.earnings || '0');
          const bEarnings = parseFloat(b.earnings || '0');
          return bEarnings - aEarnings;
        });
        break;
      case 'due-amount':
        filteredEvents.sort((a, b) => {
          const aDue = a.originalEvent?.dueAmount || 0;
          const bDue = b.originalEvent?.dueAmount || 0;
          return bDue - aDue;
        });
        break;
    }

    // For upcoming events, limit to 10 items
    if (activeFilter === 'upcoming') {
      filteredEvents = filteredEvents.slice(0, 10);
    }

    setVisibleEvents(filteredEvents);
  }, [allEvents, activeFilter, activeSort, activeCompany, processEvents]);

  const handleWorkItemPress = useCallback(
    (item: SimplifiedWorkItem) => {
      if (item.originalEvent) {
        navigation.navigate('DateDetails', { details: item.originalEvent });
      }
    },
    [navigation]
  );


  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-red-50">
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-gray-800 mb-2 text-xl font-bold">Error Loading Events</Text>
          <Text className="text-gray-500 text-center">
            There was a problem loading your events. Please try again later.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-50 mb-14 flex-1">
      <LinearGradient colors={['#f8fafc', '#f1f5f9']} className="border-gray-200 border-b bg-white">
        <View className="relative bg-primary/35 p-6 pt-12">
          <Text className="text-center text-2xl font-bold text-white">My Works</Text>
        </View>
        <View className="px-6 pb-6 pt-8">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-600 mt-1 text-sm">
                {visibleEvents.length} event{visibleEvents.length !== 1 ? 's' : ''} shown
                {activeFilter === 'upcoming' &&
                  visibleEvents.length === 10 &&
                  ' (showing first 10)'}
              </Text>
            </View>
            <MaterialCommunityIcons name="calendar-multiple" size={28} color="#64748b" />
          </View>
        </View>
        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeCompany={activeCompany}
          setActiveCompany={setActiveCompany}
        />
      </LinearGradient>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-600 mt-4 font-medium">Loading your works...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#10B981']}
              tintColor="#10B981"
            />
          }>
          {visibleEvents.length > 0 ? (
            visibleEvents.map((item, index) => (
              <Pressable
                key={`${item.id}-${item.nepaliEventDate}`}
                onPress={() => handleWorkItemPress(item)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}>
                <WorkItem item={item} index={index} onPress={() => handleWorkItemPress(item)} />
              </Pressable>
            ))
          ) : (
            <EmptyState />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default WorkingScreen;
