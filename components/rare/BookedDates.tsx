import React from 'react';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import NepaliDate from 'nepali-date-converter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NepaliDateToEnglish } from 'utils/nepaliDateToEnglish';

interface DateDetail {
  date: string;
  details: any;
  nepaliDate?: {
    month: string;
    day: string;
  };
}

interface BookedDatesProps {
  selectedDates: DateDetail[];
  handleDateClick: (dateDetails: any) => void;
}

interface GroupedDates {
  [month: string]: DateDetail[];
}

const tableOfEngNepNums = new Map([
  [0, '०'],
  [1, '१'],
  [2, '२'],
  [3, '३'],
  [4, '४'],
  [5, '५'],
  [6, '६'],
  [7, '७'],
  [8, '८'],
  [9, '९'],
]);

function engToNepNum(strNum: string): string {
  return String(strNum)
    .split('')
    .map(function (ch) {
      if (ch === '.' || ch === ',') {
        return ch;
      }
      return tableOfEngNepNums.get(Number(ch)) ?? ch;
    })
    .join('');
}

const BookedDates: React.FC<BookedDatesProps> = ({ selectedDates, handleDateClick }) => {
  const getNepaliDate = (date: string) => {
    try {
      const d = new Date(date);
      const dateStr = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
      const nepaliDate = new NepaliDate(dateStr);

      const dayInEnglish = nepaliDate.format('DD');
      const dayInNepali = engToNepNum(dayInEnglish);

      return {
        month: nepaliDate.format('MMMM'),
        day: dayInNepali,
      };
    } catch (error) {
      console.error('Error converting date:', error);
      return null;
    }
  };

  const groupedDates: GroupedDates = React.useMemo(() => {
    if (!selectedDates || selectedDates.length === 0) return {};

    return selectedDates.reduce((acc: GroupedDates, item) => {
      const nepaliDate = getNepaliDate(item.date);
      if (!nepaliDate) return acc;

      const month = nepaliDate.month;
      if (!acc[month]) acc[month] = [];

      acc[month].push({
        ...item,
        nepaliDate,
      });

      return acc;
    }, {});
  }, [selectedDates]);

  return (
    <SafeAreaView className="w-full">
      <ScrollView className="w-full flex-1">
        {Object.keys(groupedDates).length === 0 ? (
          <View className="w-full items-center rounded-xl bg-white p-6 shadow-sm">
            <MaterialCommunityIcons name="calendar-blank" size={48} color="#f87171" />
            <Text className="text-gray-900 mt-2 text-xl font-semibold">No Dates Found</Text>
            <Text className="text-gray-500 mt-1 text-center text-base">
              You haven't booked any dates yet
            </Text>
          </View>
        ) : (
          Object.entries(groupedDates).map(([month, dates]: [string, DateDetail[]]) => (
            <View
              key={month}
              className="mb-4 w-full rounded-xl bg-white p-4 shadow-sm shadow-black">
              <View className="mb-2 flex-row items-center">
                <MaterialCommunityIcons name="calendar-month" size={24} color="#ef4444" />
                <Text className="text-gray-900 ml-2 text-xl font-bold">{month}</Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {dates.map((item: DateDetail, index: number) => (
                  <TouchableOpacity key={index} onPress={() => handleDateClick(item.details)}>
                    <View className="h-14 w-14 flex-col items-center justify-center border border-gray/25 bg-gray/25">
                      <Text className="text-lg font-bold text-black">{item.nepaliDate?.day}</Text>
                      <Text className="text-sm text-black">{NepaliDateToEnglish(item.date)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookedDates;
