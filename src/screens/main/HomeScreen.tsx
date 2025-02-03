import StatsSection from 'components/HomeScreen/StatsSection';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import BookedDates from 'components/rare/BookedDates';
import UpcomingEventReminder from 'components/rare/UpcomingReminders';
import NepaliDate from 'nepali-date-converter';
import { RootState } from 'redux/store';
import { useSelector } from 'react-redux';
import HeaderSection from 'components/HomeScreen/HeaderSection';
import SwipeableUnifiedCard from 'components/cards/UnifiedCard';

const HomePage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDates, setSelectedDates] = useState<any[]>([]);
  const username = useSelector((state: RootState) => state.auth.name);

  const [isActive, setIsActive] = useState(false);

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
          console.log(datesList);

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

    // Convert Nepali date to Gregorian and filter upcoming events
    const upcomingEvents = selectedDates
      .map((event) => {
        const nepaliDate = new NepaliDate(event.date); // Convert to Nepali date
        const gregorianDate = nepaliDate.toJsDate(); // Convert Nepali date to Gregorian (JS Date)
        return { ...event, dateObj: gregorianDate };
      })
      .filter((event) => event.dateObj > today) // Only upcoming events
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()); // Sort by date

    return upcomingEvents.slice(0, 4); // Return only the first 3-4 upcoming events
  };

  const upcomingEvents = getUpcomingEvents();

  const monthlyData = [
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
  ];

  return (
    <SafeAreaView className=" flex-1 bg-white">
      <HeaderSection user={username} isActive={isActive} setIsActive={setIsActive} />
      <ScrollView className="mt-7" nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
        <BookedDates selectedDates={selectedDates} handleDateClick={handleDateClick} />

        <StatsSection monthlyData={monthlyData} />
        <SwipeableUnifiedCard monthlyData={monthlyData} />
        <View className="flex items-center justify-center ">
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
