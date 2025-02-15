import {
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import HeaderSection from 'components/HomeScreen/HeaderSection';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import BookedDates from 'components/rare/BookedDates';
import { useGetEvents } from 'hooks/events';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SwipeableUnifiedCard from 'components/cards/UnifiedCard';
import { useGetEarnings } from 'hooks/earnings';
import UpcomingEventReminder from 'components/rare/UpcomingReminders';

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

  const {
    data,
    isLoading: eventsIsLoading,
    isError,
    refetch: eventsRefetch,
  } = useGetEvents(userId || 0);

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

  if (isError || earningsIsError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-center text-red-500">
          Something went wrong. Pull down to refresh.
        </Text>
      </SafeAreaView>
    );
  }

  console.log('earningsData', earningsData);

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

  const selectedDates = events.flatMap((event) =>
    event.detailNepaliDate.map((date: NepaliDate) => ({
      date: `${date.nepaliYear}-${date.nepaliMonth}-${date.nepaliDay}`,
      details: event,
      nepaliDate: {
        month: date.nepaliMonth.toString(),
        day: date.nepaliDay.toString(),
      },
    }))
  );

  console.log('selectedDates', selectedDates);

  const handleDateClick = (dateDetails: Event) => {
    navigation.navigate('DateDetails', { details: dateDetails });
  };

  const bookedDatesEarnings = earningsData?.monthly;

  console.log('bookedDatesEarnings', bookedDatesEarnings);

  return (
    <SafeAreaView className="mb-20 flex-1 gap-2 bg-white">
      <HeaderSection
        user={userName}
        isActive={isActive}
        setIsActive={setIsActive}
        remainingAmount={remainingAmount}
      />
      <ScrollView
        className="mt-7"
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <BookedDates
          selectedDates={selectedDates}
          handleDateClick={handleDateClick}
          monthlyTotals={bookedDatesEarnings}
        />
        {!earningsIsLoading && !earningsIsError && (
          <>
            {console.log('Earnings data being passed:', earningsData?.monthly)}
            <SwipeableUnifiedCard
              monthlyData={earningsData?.monthly || {}}
              totalData={{
                totalEvents: earningsData?.total?.totalEvents || 0,
                totalQuotedEarnings: earningsData?.total?.totalQuotedEarnings || '0',
                totalReceivedEarnings: earningsData?.total?.totalReceivedEarnings || '0',
                totalDueAmount: earningsData?.total?.totalDueAmount || 0,
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
