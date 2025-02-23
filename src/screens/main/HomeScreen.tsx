import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HeaderSection from 'components/HomeScreen/HeaderSection';
import SwipeableUnifiedCard from 'components/cards/UnifiedCard';
import BookedDates from 'components/rare/BookedDates';
import UpcomingEventReminder from 'components/rare/UpcomingReminders';
import { useGetEarnings } from 'hooks/earnings';
import { useGetEvents } from 'hooks/events';
import { getCurrentNepaliDate } from 'lib/calendar';
import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  View,
  RefreshControl,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserDetails } from 'redux/store';

interface NepaliDate {
  nepaliYear: number;
  nepaliMonth: number;
  nepaliDay: number;
}

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const userDetails = useSelector(selectUserDetails);
  const userName = userDetails?.userName;
  const userId = userDetails?.userId;

  const navigation = useNavigation();

  const { data, isLoading: eventsIsLoading, refetch: eventsRefetch } = useGetEvents(userId || 0);

  const {
    data: earningsData,
    isLoading: earningsIsLoading,
    isError: earningsIsError,
    refetch: earningsRefetch,
  } = useGetEarnings(userId || 0);

  const currentNepaliDate = getCurrentNepaliDate();
  const currentYear = currentNepaliDate.year;
  const currentMonth1Based = currentNepaliDate.month + 1;

  const filterMonthlyData = (monthlyData: { [key: string]: any }) => {
    const totalMonths = currentYear * 12 + (currentMonth1Based - 1);

    const offsets = [-2, -1, 0, 1];
    const targetMonths = offsets.map((offset) => {
      const targetTotalMonths = totalMonths + offset;
      const targetYear = Math.floor(targetTotalMonths / 12);
      const targetMonth = (targetTotalMonths % 12) + 1;
      return { year: targetYear, month: targetMonth };
    });

    const filteredEntries = Object.entries(monthlyData).filter(([key, value]) => {
      const entryYear = Number(value.nepaliDate.year);
      const entryMonth = Number(value.nepaliDate.month);
      const isMatch = targetMonths.some((t) => t.year === entryYear && t.month === entryMonth);

      return isMatch;
    });

    return Object.fromEntries(filteredEntries);
  };

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

  const remainingAmount = earningsData?.total?.totalDueAmount || 0;

  const events = Array.isArray(data) ? data : [data];

  if (eventsIsLoading || earningsIsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <HeaderSection user={userName} remainingAmount={remainingAmount} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E50914" />
          <Text className="text-gray-600 mt-4">Loading your events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedEvents: Record<string, any[]> = {};

  events.flatMap((event) =>
    event.detailNepaliDate.map((date: NepaliDate) => {
      const formattedMonth = date.nepaliMonth.toString().padStart(2, '0');
      const yearMonth = `${date.nepaliYear}-${formattedMonth}`;

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

    if (yearA !== yearB) return yearA - yearB;
    if (monthA === currentMonth1Based) return -1;
    if (monthB === currentMonth1Based) return 1;
    return monthA - monthB;
  });

  const finalSelectedDates = sortedGroupedEvents.flatMap(([_, events]) => events);

  const handleDateClick = (dateDetails: Event) => {
    navigation.navigate('DateDetails', { details: dateDetails });
  };

  const bookedDatesEarnings = earningsData?.monthly;
  const totalEvents = earningsData?.total?.totalEvents || 0;
  const totalQuotedEarnings = earningsData?.total?.totalQuotedEarnings || '0';
  const totalReceivedEarnings = earningsData?.total?.totalReceivedEarnings || 0;
  const totalDueAmount = earningsData?.total?.totalDueAmount || 0;

  const monthlyData = earningsData?.monthly || {};

  const filteredMonthlyData = filterMonthlyData(monthlyData);
  return (
    <SafeAreaView className="mb-20 flex-1 gap-2 bg-white">
      <HeaderSection user={userName} remainingAmount={remainingAmount} />
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
              monthlyData={filteredMonthlyData}
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
