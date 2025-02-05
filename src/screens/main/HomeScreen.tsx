import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import NepaliDate from 'nepali-date-converter';

import { RootStackParamList } from '../../types/navigation';
import { RootState } from 'redux/store';
import HeaderSection from 'components/HomeScreen/HeaderSection';
import SwipeableUnifiedCard from 'components/cards/UnifiedCard';
import BookedDates from 'components/rare/BookedDates';
import UpcomingEventReminder from 'components/rare/UpcomingReminders';
import { useGetEvents } from 'hooks/events';
import { EventResponse } from 'types/eventTypes';

interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  actualIncome: number;
  eventCount: number;
  gadgetsPurchased: number;
}

const HomePage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDates, setSelectedDates] = useState<any[]>([]);
  const [eventsData, setEventsData] = useState<EventResponse>();
  const [isActive, setIsActive] = useState(false);

  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data, isLoading, isError } = useGetEvents(userId || 0);

  console.log(data);

  const transformedDates = React.useMemo(() => {
    if (!eventsData) return [];
    if (!Array.isArray(eventsData)) {
      return [{
        date: eventsData.eventDate,
        details: eventsData
      }];
    }
    return eventsData.map(event => ({
      date: event.eventDate,
      details: event
    }));
  }, [eventsData]);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setEventsData(data);
    }
  }, [data, isLoading, isError]);

  useEffect(() => {
    const loadBookedDates = async () => {
      try {
        const storedData = await AsyncStorage.getItem('bookedDates');
        if (storedData) {
          const parsedData: { selectedDates: string[] }[] = JSON.parse(storedData);
          const datesList = parsedData.flatMap((entry) =>
            entry.selectedDates.map((date: string) => ({
              date,
              details: entry,
            }))
          );
          setSelectedDates(datesList);
        }
      } catch (e) {
        console.error('Error loading booked dates:', e);
      }
    };

    loadBookedDates();
  }, []);

  const handleDateClick = (dateDetails: { date: string; details: any }) => {
    navigation.navigate('DateDetails', { details: dateDetails });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const upcomingEvents = selectedDates
      .map((event) => {
        const nepaliDate = new NepaliDate(event.date);
        const gregorianDate = nepaliDate.toJsDate();
        return { ...event, dateObj: gregorianDate };
      })
      .filter((event) => event.dateObj > today)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    return upcomingEvents.slice(0, 4);
  };

  const upcomingEvents = getUpcomingEvents();

  const monthlyData: MonthlyData[] = [
    {
      month: 'February 2023',
      totalIncome: 50000,
      totalExpense: 20000,
      actualIncome: 30000,
      eventCount: 10,
      gadgetsPurchased: 5,
    },
    {
      month: 'March 2023',
      totalIncome: 50000,
      totalExpense: 20000,
      actualIncome: 30000,
      eventCount: 10,
      gadgetsPurchased: 5,
    },
    {
      month: 'January 2023',
      totalIncome: 45000,
      totalExpense: 18000,
      actualIncome: 27000,
      eventCount: 8,
      gadgetsPurchased: 4,
    },
    {
      month: 'February 2023',
      totalIncome: 45000,
      totalExpense: 18000,
      actualIncome: 27000,
      eventCount: 8,
      gadgetsPurchased: 4,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HeaderSection user={userName} isActive={isActive} setIsActive={setIsActive} />
      <ScrollView className="mt-7" nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <BookedDates selectedDates={transformedDates} handleDateClick={handleDateClick} />

        <SwipeableUnifiedCard monthlyData={monthlyData} />
        <View className="flex items-center justify-center">
          <Text className="mb-4 text-2xl font-bold text-primary">Upcoming Events</Text>
        </View>
        {upcomingEvents.length > 0 &&
          upcomingEvents.map((event, index) => (
            <UpcomingEventReminder
              key={index}
              events={[event]}
              onPress={() => navigation.navigate('DateDetails', { details: event.details })}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;