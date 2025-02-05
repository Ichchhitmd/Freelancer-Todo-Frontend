import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { RootStackParamList } from '../../types/navigation';
import { RootState } from 'redux/store';
import HeaderSection from 'components/HomeScreen/HeaderSection';
import SwipeableUnifiedCard from 'components/cards/UnifiedCard';
import BookedDates from 'components/rare/BookedDates';
import UpcomingEventReminder from 'components/rare/UpcomingReminders';
import { useGetEvents } from 'hooks/events';
import { EventResponse } from 'types/eventTypes';
import { scheduleEventNotification } from 'utils/eventNotification';

interface Event {
  date: string;
  details: any;
  dateObj?: Date;
}
interface MonthlyData {
  eventId: number;
  month: string;
  totalIncome: number;
  totalExpense: number;
  eventCount: number;
  eventDate: string;
}

const HomePage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [eventsData, setEventsData] = useState<EventResponse>();
  const [isActive, setIsActive] = useState(false);

  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data, isLoading, isError } = useGetEvents(userId || 0);

  const parseDateString = (dateStr: string): Date[] => {
    const dates = dateStr.split(',').map((d) => d.trim());

    try {
      return dates.map((date) => {
        const [year, month, day] = date.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid date');
        }
        return parsedDate;
      });
    } catch (error) {
      console.error('Error parsing date:', error);
      return [];
    }
  };

  const transformedDates = React.useMemo(() => {
    if (!eventsData) return [];

    const transformEvent = (event: any): Event[] => {
      const dates = parseDateString(event.eventDate);
      return dates.map((date) => ({
        date: date.toISOString().split('T')[0],
        details: {
          ...event,
          eventDate: date.toISOString().split('T')[0],
        },
        dateObj: date,
      }));
    };

    if (!Array.isArray(eventsData)) {
      return transformEvent(eventsData);
    }

    const allEvents = eventsData.flatMap(transformEvent);

    const uniqueEvents = allEvents.reduce((unique: any[], event: any) => {
      if (!unique.some((e) => e.date === event.date && e.details.id === event.details.id)) {
        unique.push(event);
      }
      return unique;
    }, []);

    return uniqueEvents;
  }, [eventsData]);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setEventsData(data);
      const eventsToSchedule = Array.isArray(data) ? data : [data];
      eventsToSchedule.forEach((event) => {
        console.log('Scheduling event notification for:', event.eventDate, event);
        scheduleEventNotification(event.eventDate, event);
      });
    }
  }, [data, isLoading, isError]);

  useEffect(() => {
    if (eventsData) {
      if (Array.isArray(eventsData)) {
        eventsData.forEach((event) => scheduleEventNotification(event.eventDate, event));
      } else {
        scheduleEventNotification(eventsData.eventDate, eventsData);
      }
    }
  }, [eventsData]);

  const handleDateClick = (dateDetails: Event) => {
    navigation.navigate('DateDetails', { details: dateDetails });
  };

  const upcomingEvents = React.useMemo(() => {
    const uniqueUpcoming = transformedDates.filter(
      (event) => event.dateObj && event.dateObj > new Date()
    );
    return [...new Map(uniqueUpcoming.map((event) => [event.date, event])).values()];
  }, [transformedDates]);

  const monthlyData = React.useMemo(() => {
    if (!eventsData) return [];
    const eventsArray = Array.isArray(eventsData) ? eventsData : [eventsData];
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

    const monthlyMap: { [key: string]: MonthlyData } = {};

    eventsArray.forEach((event) => {
      const eventDates = event.eventDate.split(',').map((d: string) => d.trim());

      const earnings = parseFloat(event.earnings) || 0;
      const expenses = parseFloat(event.expenses) || 0;

      const [year, monthStr] = eventDates[0].split('-');
      const monthNumber = parseInt(monthStr, 10);
      if (isNaN(monthNumber)) return;

      const monthName = nepaliMonths[monthNumber - 1] || 'Unknown';
      const key = `${year}-${monthNumber}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          month: monthName,
          totalIncome: 0,
          totalExpense: 0,
          eventCount: 0,
          eventId: event.id, // Use event ID properly here
          eventDate: eventDates[0], // Use the first date as the event date
        };
      }

      monthlyMap[key].totalIncome += earnings; // Add earnings once per event
      monthlyMap[key].totalExpense += expenses; // Add expenses
      monthlyMap[key].eventCount += 1; // Increase event count
    });

    console.log('Monthly Data by Event ID: ', monthlyMap);
    console.log('Events Array: ', eventsArray);
    console.log('Upcoming Events: ', upcomingEvents);

    const sortedKeys = Object.keys(monthlyMap).sort((a, b) => {
      const [aYear, aMonth] = a.split('-').map(Number);
      const [bYear, bMonth] = b.split('-').map(Number);
      return aYear - bYear || aMonth - bMonth;
    });

    return sortedKeys.map((key) => monthlyMap[key]);
  }, [eventsData]);

  console.log('Monthly Data: ', monthlyData);
  return (
    <SafeAreaView className="mb-20 flex-1 bg-white">
      <HeaderSection user={userName} isActive={isActive} setIsActive={setIsActive} />
      <ScrollView className="mt-7" nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <BookedDates selectedDates={transformedDates} handleDateClick={handleDateClick} />
        <SwipeableUnifiedCard monthlyData={monthlyData} />
        <View className="flex items-center justify-center">
          <Text className="mb-4 text-2xl font-bold text-primary">Upcoming Events</Text>
        </View>
        <UpcomingEventReminder events={upcomingEvents} handleClick={handleDateClick} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
