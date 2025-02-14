import React from 'react';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NepaliDate from 'nepali-date-converter';

interface DateDetail {
  date: string;
  details: any;
  isToday?: boolean;
  nepaliDate?: {
    month: string;
    day: string;
  };
}

interface BookedDatesProps {
  selectedDates: DateDetail[];
  handleDateClick: (dateDetails: any) => void;
  monthlyTotals?: {
    quotedEarnings: string;
    receivedEarnings: number;
    dueAmount: number;
  };
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

const BookedDates: React.FC<BookedDatesProps> = ({
  selectedDates,
  handleDateClick,
  monthlyTotals,
}) => {
  const getNepaliDate = (date: string) => {
    try {
      const [year, month, day] = date.split('-').map((num) => parseInt(num));
      return {
        month: month.toString(),
        day: engToNepNum(day.toString()),
      };
    } catch (error) {
      return null;
    }
  };

  const groupedDates: GroupedDates = React.useMemo(() => {
    if (!selectedDates || selectedDates.length === 0) return {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDates.reduce((acc: GroupedDates, item) => {
      const eventDate = new Date(item.date);
      eventDate.setHours(0, 0, 0, 0);

      // Skip past dates
      if (eventDate < today) return acc;

      const nepaliDate = getNepaliDate(item.date);
      if (!nepaliDate) return acc;

      const monthNames = [
        'Baisakh',
        'Jestha',
        'Ashadh',
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
      const monthName = monthNames[parseInt(nepaliDate.month) - 1];

      if (!acc[monthName]) acc[monthName] = [];

      acc[monthName].push({
        ...item,
        isToday: eventDate.getTime() === today.getTime(),
        nepaliDate: {
          ...nepaliDate,
          month: monthName,
        },
      });

      return acc;
    }, {});
  }, [selectedDates]);

  const eventColors: Record<string, string> = {
    WEDDING: '#FF2400',
    MEHENDI: '#34D399',
    RECEPTION: '#FBBF24',
    ENGAGEMENT: '#F88379',
    'PRE-WEDDING': '#FDE047',
    UNKNOWN: '#6D28D9',
  };

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
          <>
            {Object.entries(groupedDates).map(([month, dates]: [string, DateDetail[]]) => (
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
                      <View
                        className={`h-12 w-12 flex-col items-center justify-center rounded-full border ${item.isToday ? 'border-2 border-white' : 'border border-gray/5'}`}
                        style={{
                          backgroundColor: eventColors[item.details?.eventType],
                          transform: [{ scale: item.isToday ? 1.1 : 1 }],
                        }}>
                        <Text className="text-lg font-bold text-white">{item.nepaliDate?.day}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="mx-3 my-3">
                  {monthlyTotals && (
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold text-blue-900">
                        ₹{monthlyTotals.quotedEarnings}
                      </Text>
                      <View className="mx-2 h-8 w-[1px] bg-gray" />
                      <Text className="font-semibold text-green-600">
                        ₹{monthlyTotals.receivedEarnings}
                      </Text>
                      <View className="mx-2 h-8 w-[1px] bg-gray" />
                      <Text className="font-semibold text-red-600">₹{monthlyTotals.dueAmount}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookedDates;
