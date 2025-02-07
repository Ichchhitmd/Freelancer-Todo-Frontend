import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from 'redux/store';
import { useGetEvents } from 'hooks/events';
import { FilterType, SimplifiedWorkItem, SortType } from 'types/WorkingScreenTypes';
import { convertToNepaliDate } from 'components/WorkingsScreen/DateUtils';
import { FilterBar } from 'components/WorkingsScreen/FilterBar';
import { WorkItem } from 'components/WorkingsScreen/WorkItem';
import { EmptyState } from 'components/WorkingsScreen/EmptyState';

const WorkingScreen = () => {
  const navigation = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('upcoming');
  const [activeSort, setActiveSort] = useState<SortType>('date-desc');
  const [visibleEvents, setVisibleEvents] = useState<SimplifiedWorkItem[]>([]);
  const [allEvents, setAllEvents] = useState<SimplifiedWorkItem[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data, isLoading, isError } = useGetEvents(userId || 0);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      const eventsArray = Array.isArray(data) ? data : [data];
      const currentTimestamp = new Date().getTime();

      const simplified: SimplifiedWorkItem[] = eventsArray.map((event) => ({
        id: event.id || `${event.company?.id}-${event.eventDate}`,
        companyId: event.company?.id || '',
        companyName: event.company?.name || 'Unknown Company',
        eventDate: convertToNepaliDate(event.eventDate || '2000-01-01'),
        isUpcoming: new Date(event.eventDate).getTime() > currentTimestamp,
        eventType: event.eventType || 'Unspecified',
        side: event.side || 'Unspecified',
        workType: event.workType || 'Unspecified',
        earnings: event.earnings ? parseFloat(event.earnings).toFixed(2) : 'N/A',
        status: event.status || 'pending',
        location: event.location,
      }));

      setAllEvents(simplified);
    }
  }, [data, isLoading, isError]);

  useEffect(() => {
    let filteredEvents = [...allEvents];

    switch (activeFilter) {
      case 'upcoming':
        filteredEvents = filteredEvents.filter((event) => event.isUpcoming);
        break;
      case 'past':
        filteredEvents = filteredEvents.filter((event) => !event.isUpcoming);
        break;
    }

    filteredEvents.sort((a, b) => {
      switch (activeSort) {
        case 'date-asc':
          return a.eventDate.timestamp - b.eventDate.timestamp;
        case 'date-desc':
          return b.eventDate.timestamp - a.eventDate.timestamp;
        case 'company':
          return a.companyName.localeCompare(b.companyName);
        default:
          return 0;
      }
    });

    if (activeFilter === 'upcoming') {
      filteredEvents = filteredEvents.slice(0, 10);
    }

    setVisibleEvents(filteredEvents);
  }, [allEvents, activeFilter, activeSort]);

  const handleCompanyClick = (companyId: number) => {
    navigation.navigate('CompanyDetails', { companyId });
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
      </View>

      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text className="mt-4 text-red-400">Loading your works...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: 80, // Extra padding for bottom navigation
          }}>
          {visibleEvents.length > 0 ? (
            visibleEvents.map((item, index) => (
              <WorkItem
                key={`${item.companyId}-${item.eventDate.originalDate}`}
                item={item}
                index={index}
                onPress={() => handleCompanyClick(item.companyId)}
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
