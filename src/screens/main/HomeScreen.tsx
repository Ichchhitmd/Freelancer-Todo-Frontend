import EarningsByCompanySection from 'components/HomeScreen/EarningsByCompany';
import GadgetsSection from 'components/HomeScreen/GadgetSection';
import HeaderSection from 'components/HomeScreen/HeaderSection';
import StatsSection from 'components/HomeScreen/StatsSection';
import FloatingActionButton from 'components/rare/FAB';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import BookedDates from 'components/rare/BookedDates';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

const HomePage: React.FC = () => {
  const freelancer = {
    isActive: true,
    gadgets: [{ cost: 100 }, { cost: 200 }],
    earnings: { totalEarnings: 1000, totalExpenses: 500 },
  }; // Mock freelancer data

  const [isActive, setIsActive] = useState<boolean>(freelancer.isActive);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDates, setSelectedDates] = useState<any[]>([]);
  const user = useSelector((state: RootState) => state.auth.name);

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
    <SafeAreaView className="mb-4 flex-1 gap-6 bg-gray-100 ">
      <HeaderSection user={user} isActive={isActive} setIsActive={setIsActive} />
      <ScrollView className="px-6 py-4" nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
        <BookedDates selectedDates={selectedDates} handleDateClick={handleDateClick} />

        <StatsSection earnings={freelancer.earnings} freelancer={freelancer} />
        <EarningsByCompanySection earnings={freelancer.earnings} />
        <GadgetsSection freelancer={freelancer} />
      </ScrollView>
      <FloatingActionButton
        onAddWork={() => {
          /* Add work handler */
        }}
        onAddExpense={() => {
          /* Add expense handler */
        }}
      />
    </SafeAreaView>
  );
};

export default HomePage;
