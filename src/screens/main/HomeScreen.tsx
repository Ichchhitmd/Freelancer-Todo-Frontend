import EarningsByCompanySection from 'components/HomeScreen/EarningsByCompany';
import GadgetsSection from 'components/HomeScreen/GadgetSection';
import HeaderSection from 'components/HomeScreen/HeaderSection';
import StatsSection from 'components/HomeScreen/StatsSection';
import FloatingActionButton from 'components/rare/FAB';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BookedDates from 'components/rare/BookedDates';

const HomePage: React.FC = () => {
  const user = { name: 'John Doe' }; // Mock user data
  const freelancer = {
    isActive: true,
    gadgets: [{ cost: 100 }, { cost: 200 }],
    earnings: { totalEarnings: 1000, totalExpenses: 500 },
  }; // Mock freelancer data

  const [isActive, setIsActive] = useState<boolean>(freelancer.isActive);
  const navigation = useNavigation();
  const [selectedDates, setSelectedDates] = useState<any[]>([]);

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

  return (
    <SafeAreaView className="mb-4 flex-1 gap-4 bg-gray-100 ">
      <HeaderSection user={user} isActive={isActive} setIsActive={setIsActive} />
      <ScrollView className="px-6 py-4" nestedScrollEnabled={true}>
        <View className="flex items-center justify-center">
          <Text className="mb-2 text-2xl font-bold text-gray-900">Your Booked Dates</Text>
        </View>

        <BookedDates selectedDates={selectedDates} handleDateClick={handleDateClick} />

        <StatsSection earnings={freelancer.earnings} freelancer={freelancer} />
        <EarningsByCompanySection earnings={freelancer.earnings} />
        <GadgetsSection freelancer={freelancer} />
      </ScrollView>
      <FloatingActionButton />
    </SafeAreaView>
  );
};

export default HomePage;
