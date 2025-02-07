import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Event {
  date: string;
  details: any;
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
  const [refreshing, setRefreshing] = useState(false);
  const [isEverythingLoaded, setIsEverythingLoaded] = useState(false);

  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data, isLoading, isError, refetch } = useGetEvents(userId || 0);

  const parseDateString = (dateStr: string): { year: number; month: number; day: number; }[] => {
    const dates = dateStr.split(',').map((d) => d.trim());

    try {
      return dates.map((date) => {
        const [yearStr, monthStr, dayStr] = date.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          throw new Error('Invalid date components');
        }
        if (month < 1 || month > 12) {
          throw new Error('Invalid month');
        }
        if (day < 1 || day > 31) {
          throw new Error('Invalid day');
        }

        return { year, month, day };
      }).filter(date => date);
    } catch (error) {
      console.error('Error parsing date:', error);
      return [];
    }
  };

  const transformedDates = React.useMemo(() => {
    if (!eventsData) return [];

    const transformEvent = (event: any): Event[] => {
      const dates = parseDateString(event.eventDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      return dates
        .map((date) => {
          const eventDate = new Date(date.year, date.month - 1, date.day);
          if (eventDate >= currentDate) {
            return {
              date: `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`,
              details: {
                ...event,
                eventDate: `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`,
              },
            };
          }
          return null;
        })
        .filter((event): event is Event => event !== null);
    };

    if (!Array.isArray(eventsData)) {
      return transformEvent(eventsData);
    }

    const allEvents = eventsData.flatMap(transformEvent);

    const uniqueEvents = allEvents.reduce((unique: Event[], event: Event) => {
      if (!unique.some((e) => e.date === event.date && e.details.id === event.details.id)) {
        unique.push(event);
      }
      return unique;
    }, []);

    return uniqueEvents;
  }, [eventsData]);

  const upcomingEvents = React.useMemo(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const uniqueUpcoming = transformedDates.filter((event) => {
      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);
      return eventDate >= currentDate;
    });

    return [...new Map(uniqueUpcoming.map((event) => [event.date, event])).values()];
  }, [transformedDates]);

  const monthlyData = React.useMemo(() => {
    if (!eventsData) return [];
    const eventsArray = Array.isArray(eventsData) ? eventsData : [eventsData];
    const nepaliMonths = [
      'Baisakh', 'Jestha', 'Ashad', 'Shrawan', 'Bhadra', 'Ashwin',
      'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
    ];

    const monthlyMap: { [key: string]: MonthlyData } = {};
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    eventsArray.forEach((event) => {
      const eventDates = event.eventDate.split(',').map((d: string) => d.trim());
      
      const futureDates = eventDates.filter(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        return eventDate >= currentDate;
      });

      if (futureDates.length === 0) return;

      const earnings = parseFloat(event.earnings) || 0;
      const expenses = parseFloat(event.expenses) || 0;

      futureDates.forEach(dateStr => {
        const [year, monthStr] = dateStr.split('-');
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
            eventId: event.id,
            eventDate: dateStr,
          };
        }

        monthlyMap[key].totalIncome += earnings / futureDates.length;
        monthlyMap[key].totalExpense += expenses / futureDates.length;
        monthlyMap[key].eventCount += 1;
      });
    });

    const sortedKeys = Object.keys(monthlyMap).sort((a, b) => {
      const [aYear, aMonth] = a.split('-').map(Number);
      const [bYear, bMonth] = b.split('-').map(Number);
      return aYear - bYear || aMonth - bMonth;
    });

    return sortedKeys.map((key) => monthlyMap[key]);
  }, [eventsData]);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setEventsData(data);
      const eventsToSchedule = Array.isArray(data) ? data : [data];
      eventsToSchedule.forEach((event) => {
        try {
          const eventDates = event.eventDate.split(',').map((d: string) => d.trim());
          const futureDates = eventDates.filter(dateStr => {
            const [year, month, day] = dateStr.split('-').map(Number);
            const eventDate = new Date(year, month - 1, day);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            return eventDate >= currentDate;
          });

          futureDates.forEach(dateStr => {
            console.log('Scheduling event notification for:', dateStr, event);
            scheduleEventNotification(dateStr, event);
          });
        } catch (error) {
          console.error('Error scheduling notification:', error);
        }
      });
      setIsEverythingLoaded(true);
    }
  }, [data, isLoading, isError]);

  const handleDateClick = (dateDetails: Event) => {
    navigation.navigate('DateDetails', { details: dateDetails });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  }, [refetch]);

  if (!isEverythingLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="mb-20 flex-1 gap-2 bg-white">
      <HeaderSection user={userName} isActive={isActive} setIsActive={setIsActive} />
      <ScrollView
        className="mt-7"
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <BookedDates selectedDates={transformedDates} handleDateClick={handleDateClick} />
        <SwipeableUnifiedCard monthlyData={monthlyData} />
        <View className="flex items-center justify-center">
          <Text className="mb-4 text-2xl font-bold text-primary">Upcoming Events</Text>
        </View>
        <UpcomingEventReminder events={upcomingEvents} handleClick={handleDateClick} />
        <TouchableOpacity onPress={() => navigation.navigate('CompanyDetails')}>
          <Text>Click Me</Text>
          </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;