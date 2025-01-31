import React from 'react';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import { format } from 'date-fns';
import NepaliDate from 'nepali-date-converter';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BookedDatesProps {
  selectedDates: any[];
  handleDateClick: (dateDetails: any) => void;
}

const BookedDates: React.FC<BookedDatesProps> = ({ selectedDates, handleDateClick }) => {
  const getNepaliDate = (date: string) => {
    try {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const dateStr = `${year}/${month}/${day}`;
      const nepaliDate = new NepaliDate(dateStr);
      return {
        month: nepaliDate.format('MMMM YYYY'),
        day: nepaliDate.format('DD'),
      };
    } catch (error) {
      console.log('Error converting date:', error);
      return null;
    }
  };

  const groupedDates = selectedDates.reduce((acc, item) => {
    const nepaliDate = getNepaliDate(item.date);
    const month = nepaliDate ? nepaliDate.month : format(new Date(item.date), 'MMMM yyyy');
    if (!acc[month]) acc[month] = [];
    acc[month].push({ ...item, nepaliDate });
    return acc;
  }, {});

  const MonthSection = ({ month, dates }: { month: string; dates: any[] }) => (
    <View className="mx-4 mb-6 rounded-2xl bg-white shadow-sm">
      <View className="border-b border-gray-100 p-4">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="calendar-month" size={24} color="#ef4444" />
          <Text className="ml-2 text-xl font-bold text-gray-900">{month}</Text>
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row flex-wrap">
          {dates.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDateClick(item.details)}
              className="m-1">
              <View className="h-14 w-14 items-center justify-center rounded-xl border border-red-100 bg-red-50">
                <Text className="text-lg font-bold text-red-500">
                  {item.nepaliDate ? item.nepaliDate.day : format(new Date(item.date), 'dd')}
                </Text>
                <Text className="text-xs text-gray-500">{format(new Date(item.date), 'EEE')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 rounded-xl bg-gray-50">
      <ScrollView className="flex-1">
        <View className="rounded-xl bg-red-400 px-4 py-6">
          <Text className="pt-5 text-center text-3xl font-bold text-white">Booked Dates</Text>
          <Text className="mt-2 text-center text-lg text-blue-100">
            {selectedDates.length} dates booked
          </Text>
        </View>

        <View className="mx-4 -mt-4 rounded-xl bg-white p-4 shadow-lg">
          <View className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MaterialCommunityIcons name="calendar-check" size={32} color="#ef4444" />
            </View>
            <Text className="mt-2 text-xl font-bold text-gray-900">Your Schedule</Text>
            <Text className="mt-1 text-base text-gray-500">All your upcoming work dates</Text>
          </View>
        </View>

        <View className="mt-6">
          {Object.keys(groupedDates).length === 0 ? (
            <View className="mx-4 rounded-xl bg-white p-6 shadow-sm">
              <View className="items-center">
                <MaterialCommunityIcons name="calendar-blank" size={48} color="#f87171" />
                <Text className="mt-2 text-xl font-semibold text-gray-900">No Dates Found</Text>
                <Text className="mt-1 text-center text-base text-gray-500">
                  You haven't booked any dates yet
                </Text>
              </View>
            </View>
          ) : (
            Object.entries(groupedDates).map(([month, dates]) => (
              <MonthSection key={month} month={month} dates={dates} />
            ))
          )}
        </View>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookedDates;
