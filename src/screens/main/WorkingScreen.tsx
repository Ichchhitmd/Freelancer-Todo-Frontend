import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from 'components/WorkingsScreen/EmptyState';
import { FilterBar } from 'components/WorkingsScreen/FilterBar';
import { WorkItem } from 'components/WorkingsScreen/WorkItem';
import { useGetEvents } from 'hooks/events';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { WorkEvent, FilterType, SortType, SimplifiedWorkItem } from 'types/WorkingScreenTypes';
import { getDaysStatus } from 'utils/utils';

type RootStackParamList = {
  DateDetails: { details: WorkEvent };
  CompanyDetails: { companyId: number };
};

const WorkingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('upcoming');
  const [activeSort, setActiveSort] = useState<SortType>('date-desc');
  const [activeCompany, setActiveCompany] = useState<string | undefined>(undefined);
  const [visibleEvents, setVisibleEvents] = useState<SimplifiedWorkItem[]>([]);
  const [allEvents, setAllEvents] = useState<SimplifiedWorkItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data, isLoading, isError, refetch } = useGetEvents(userId || 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const processEvents = (events: WorkEvent | WorkEvent[]): SimplifiedWorkItem[] => {
    const eventsArray = Array.isArray(events) ? events : [events];
    const currentTimestamp = new Date().getTime();

    return eventsArray
      .sort((a, b) => new Date(a.eventDate[0]).getTime() - new Date(b.eventDate[0]).getTime())
      .map((event) => {
        const eventDate = new Date(event.eventDate[0]);
        const { statusText, statusStyle, daysDifference, isToday } = getDaysStatus(eventDate);
        return {
          id: event.id,
          companyId: event.company?.id || 0,
          companyName: event.company?.name || 'Unknown Company',
          nepaliEventDate: event.nepaliEventDate,
          detailNepaliDate: event.detailNepaliDate,
          isUpcoming: new Date(event.eventDate[0]).getTime() > currentTimestamp,
          eventType: event.eventType || 'Unspecified',
          side: event.side,
          workType: event.workType || ['Unspecified'],
          earnings: event.earnings ? `${parseFloat(event.earnings).toLocaleString()}` : 'N/A',
          location: event.location,
          originalEvent: event,
          statusText,
          statusStyle,
          daysDifference,
          isToday,
        };
      });
  };

  useEffect(() => {
    if (data && !isLoading && !isError) {
      const simplified = processEvents(data);
      setAllEvents(simplified);
    }
  }, [data, isLoading, isError]);

  useEffect(() => {
    let filteredEvents = [...allEvents];

    // Company filter
    if (activeCompany && activeCompany !== 'All Companies') {
      filteredEvents = filteredEvents.filter((event) => event.companyName === activeCompany);
    }

    // Filter by type
    switch (activeFilter) {
      case 'upcoming':
        filteredEvents = filteredEvents.filter((event) => event.isUpcoming);
        break;
      case 'past':
        filteredEvents = filteredEvents.filter((event) => !event.isUpcoming);
        break;
    }

    // Sort events
    switch (activeSort) {
      case 'date-desc':
        filteredEvents.sort(
          (a, b) =>
            new Date(a.originalEvent?.eventDate[0] || 0).getTime() -
            new Date(b.originalEvent?.eventDate[0] || 0).getTime()
        );
        break;
      case 'date-asc':
        filteredEvents.sort(
          (a, b) =>
            new Date(b.originalEvent?.eventDate[0] || 0).getTime() -
            new Date(a.originalEvent?.eventDate[0] || 0).getTime()
        );
        break;
      case 'company':
        filteredEvents.sort((a, b) => a.companyName.localeCompare(b.companyName));
        break;
    }

    if (activeFilter === 'upcoming') {
      filteredEvents = filteredEvents.slice(0, 10);
    }

    setVisibleEvents(filteredEvents);
  }, [allEvents, activeFilter, activeSort, activeCompany]);

  const handleWorkItemPress = (item: SimplifiedWorkItem) => {
    if (item.originalEvent) {
      navigation.navigate('DateDetails', { details: item.originalEvent });
    }
  };

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
    <SafeAreaView className="flex-1 bg-red-50">
      <View className="border-b border-red-200 bg-red-50 shadow-sm">
        <View className="flex items-center justify-center px-6 py-6">
          <Text className="text-3xl font-extrabold text-primary/70">My Works</Text>
          <Text className="mt-2 text-sm font-medium text-primary/90">
            {visibleEvents.length} event{visibleEvents.length !== 1 ? 's' : ''} shown
            {activeFilter === 'upcoming' && visibleEvents.length === 10 && ' (showing first 10)'}
          </Text>
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
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text className="mt-4 text-red-400">Loading your works...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#EF4444']}
              tintColor="#EF4444"
            />
          }>
          {visibleEvents.length > 0 ? (
            visibleEvents.map((item, index) => (
              <WorkItem
                key={`${item.id}-${item.nepaliEventDate}`}
                item={item}
                index={index}
                onPress={() => handleWorkItemPress(item)}
              />
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
