import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HeaderSection from 'components/HomeScreen/HeaderSection';
import SwipeableUnifiedCard from 'components/cards/UnifiedCard';
import BookedDates from 'components/rare/BookedDates';
import UpcomingEventReminder from 'components/rare/UpcomingReminders';
import { useGetEarnings } from 'hooks/earnings';
import { useGetEvents } from 'hooks/events';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, View, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

interface NepaliDate {
  nepaliYear: number;
  nepaliMonth: number;
  nepaliDay: number;
}

const HomeScreen = () => {
  const [isActive, setIsActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { userName, userId } = useSelector((state: RootState) => ({
    userName: state.auth.user?.name,
    isActive: state.auth.user?.isActive,
    userId: state.auth.user?.id,
  }));

  const navigation = useNavigation();

  const { data, isLoading: eventsIsLoading, refetch: eventsRefetch } = useGetEvents(userId || 0);

  const {
    data: earningsData,
    isLoading: earningsIsLoading,
    isError: earningsIsError,
    refetch: earningsRefetch,
  } = useGetEarnings(userId || 0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([eventsRefetch(), earningsRefetch()]).then(() => {
      setRefreshing(false);
    });
  }, [eventsRefetch, earningsRefetch]);

  useFocusEffect(
    useCallback(() => {
      eventsRefetch();
      earningsRefetch();
    }, [eventsRefetch, earningsRefetch])
  );

  if (eventsIsLoading || earningsIsLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#EF4444" />
      </SafeAreaView>
    );
  }

  const remainingAmount = earningsData?.total?.totalDueAmount || 0;

  const events = Array.isArray(data) ? data : [data];

  if (eventsIsLoading || earningsIsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <HeaderSection
          user={userName}
          isActive={isActive}
          setIsActive={setIsActive}
          remainingAmount={remainingAmount}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11

  const groupedEvents: Record<string, any[]> = {};

  events.flatMap((event) =>
    event.detailNepaliDate.map((date: NepaliDate) => {
      const formattedMonth = date.nepaliMonth.toString().padStart(2, '0'); // Ensure MM format
      const yearMonth = `${date.nepaliYear}-${formattedMonth}`; // Format YYYY-MM

      const eventData = {
        date: `${date.nepaliYear}-${formattedMonth}-${date.nepaliDay}`,
        details: event,
        nepaliDate: {
          month: formattedMonth,
          day: date.nepaliDay.toString(),
        },
      };

      if (!groupedEvents[yearMonth]) {
        groupedEvents[yearMonth] = [];
      }
      groupedEvents[yearMonth].push(eventData);

      return eventData;
    })
  );

  const sortedGroupedEvents = Object.entries(groupedEvents).sort(([keyA], [keyB]) => {
    const [yearA, monthA] = keyA.split('-').map(Number);
    const [yearB, monthB] = keyB.split('-').map(Number);

    // Sort by year first
    if (yearA !== yearB) return yearA - yearB;

    if (monthA === currentMonth) return -1;
    if (monthB === currentMonth) return 1;

    return monthA - monthB;
  });

  const finalSelectedDates = sortedGroupedEvents.flatMap(([_, events]) => events);

  const handleDateClick = (dateDetails: Event) => {
    navigation.navigate('DateDetails', { details: dateDetails });
  };

  const bookedDatesEarnings = earningsData?.monthly;
  console.log('bookedDatesEarnings', bookedDatesEarnings);

  const totalEvents = earningsData?.total?.totalEvents || 0;

  const totalQuotedEarnings = earningsData?.total?.totalQuotedEarnings || '0';

  const totalReceivedEarnings = earningsData?.total?.totalReceivedEarnings || 0;

  const totalDueAmount = earningsData?.total?.totalDueAmount || 0;

  return (
    <SafeAreaView className="mb-20 flex-1 gap-2 bg-white">
      <HeaderSection
        user={userName}
        isActive={isActive}
        setIsActive={setIsActive}
        remainingAmount={remainingAmount}
      />
      <ScrollView
        className="mt-2"
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <BookedDates
          selectedDates={finalSelectedDates}
          handleDateClick={handleDateClick}
          monthlyTotals={bookedDatesEarnings}
        />
        {!earningsIsLoading && !earningsIsError && (
          <>
            <SwipeableUnifiedCard
              monthlyData={earningsData?.monthly || {}}
              totalData={{
                totalEvents,
                totalQuotedEarnings,
                totalReceivedEarnings: totalReceivedEarnings.toString(),
                totalDueAmount,
              }}
            />
          </>
        )}

        {events.length > 0 && (
          <UpcomingEventReminder
            events={events.map((event) => ({
              date: event.eventDate[0],
              details: event,
            }))}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
