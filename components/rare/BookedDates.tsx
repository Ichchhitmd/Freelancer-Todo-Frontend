import { MaterialCommunityIcons } from '@expo/vector-icons';
import { monthNames, engToNepNum } from 'components/utils/NepaliDateFormatter';
import React from 'react';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';

interface DateDetail {
  date: string;
  details: any;
  isToday?: boolean;
  nepaliDate?: {
    nepaliDay: number;
    nepaliMonth: number;
    nepaliYear: number;
  };
}

interface MonthlyEarnings {
  quotedEarnings: number;
  receivedEarnings: number;
  dueAmount: number;
  eventCount: number;
  nepaliDate: {
    nepaliYear: number;
    nepaliMonth: number;
  };
}

interface BookedDatesProps {
  selectedDates: DateDetail[] | null | undefined;
  handleDateClick: (dateDetails: any) => void;
  monthlyTotals?: Record<string, MonthlyEarnings> | null;
}

interface GroupedDates {
  [month: string]: DateDetail[];
}

const BookedDates: React.FC<BookedDatesProps> = ({
  selectedDates,
  handleDateClick,
  monthlyTotals,
}) => {
  const getNepaliDate = (date: string): DateDetail['nepaliDate'] | null => {
    try {
      const [year, month, day] = date.split('-').map((num) => parseInt(num));
      return {
        nepaliDay: day,
        nepaliMonth: month,
        nepaliYear: year,
      };
    } catch (error) {
      return null;
    }
  };

  const groupedDates: GroupedDates = React.useMemo(() => {
    if (!selectedDates || selectedDates.length === 0) return {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sort selected dates by month and then by day
    const sortedDates = selectedDates.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Prioritize today's month
      if (dateA.getFullYear() === today.getFullYear() && dateA.getMonth() === today.getMonth())
        return -1;
      if (dateB.getFullYear() === today.getFullYear() && dateB.getMonth() === today.getMonth())
        return 1;

      return dateA.getTime() - dateB.getTime();
    });

    return sortedDates.reduce((acc: GroupedDates, item) => {
      const eventDate = new Date(item.date);
      eventDate.setHours(0, 0, 0, 0);

      // Skip past dates
      if (eventDate < today) return acc;

      const nepaliDate = getNepaliDate(item.date);
      if (!nepaliDate) return acc;

      const monthName = monthNames[nepaliDate.nepaliMonth - 1];

      if (!acc[monthName]) acc[monthName] = [];

      acc[monthName].push({
        ...item,
        isToday: eventDate.getTime() === today.getTime(),
        nepaliDate,
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

  const getMonthlyTotals = (month: string) => {
    if (!monthlyTotals) return null;

    const monthIndex = monthNames.indexOf(month) + 1;
    const entry = Object.entries(monthlyTotals).find(
      ([_, data]) => data.nepaliDate.month === monthIndex
    );

    return entry ? entry[1] : null;
  };

  return (
    <SafeAreaView className="w-full">
      <ScrollView style={{ maxHeight: 350 }} nestedScrollEnabled className="w-full flex-1">
        {groupedDates &&
          Object.entries(groupedDates).map(([month, dates]) => {
            const monthTotals = getMonthlyTotals(month);

            return (
              <View
                key={month}
                className="mb-4 w-full rounded-xl bg-white p-4 shadow-sm shadow-black">
                <View className="mb-2 flex-row items-center">
                  <MaterialCommunityIcons name="calendar-month" size={24} color="#ef4444" />
                  <Text className="text-gray-900 ml-2 text-xl font-bold">{month}</Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {dates
                    .sort((a, b) => (a.nepaliDate?.nepaliDay || 0) - (b.nepaliDate?.nepaliDay || 0))
                    .map((item: DateDetail, index: number) => (
                      <TouchableOpacity key={index} onPress={() => handleDateClick(item.details)}>
                        <View
                          className={`h-12 w-12 flex-col items-center justify-center rounded-full border ${
                            item.isToday ? 'border-2 border-white' : 'border border-gray/5'
                          }`}
                          style={{
                            backgroundColor:
                              eventColors[item.details?.eventType] || eventColors.UNKNOWN,
                            transform: [{ scale: item.isToday ? 1.1 : 1 }],
                          }}>
                          <Text className="text-center text-sm font-semibold text-white">
                            {engToNepNum(item.nepaliDate?.nepaliDay)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>

                {monthTotals && (
                  <View className="mx-3 my-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex flex-col items-center justify-center">
                        <Text className="text-xl font-semibold text-blue-600">
                          ₹{monthTotals.quotedEarnings}
                        </Text>
                        <Text className="text-sm font-semibold text-blue-600">Total Earnings</Text>
                      </View>

                      <View className="mx-2 h-8 w-[1px] bg-gray" />
                      <View className="flex flex-col items-center justify-center">
                        <Text className="text-2xl font-semibold text-red-600">
                          ₹{monthTotals.dueAmount}
                        </Text>
                        <Text className="text-sm font-semibold text-red-600">Total Due</Text>
                      </View>

                      <View className="mx-2 h-8 w-[1px] bg-gray" />
                      <View className="flex flex-col items-center justify-center">
                        <Text className="text-xl font-semibold text-green-600">
                          ₹{monthTotals.receivedEarnings}
                        </Text>
                        <Text className="text-sm font-semibold text-green-600">Total Received</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}

        {Object.keys(groupedDates).length === 0 && (
          <View className="mb-4 w-full rounded-xl bg-white p-4 shadow-sm shadow-black">
            <Text className="text-gray-500 text-center">No upcoming dates available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookedDates;
