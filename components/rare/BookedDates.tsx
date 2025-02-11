import React from 'react';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
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

const eventTypeColors = {
  WEDDING: { color: '#f43f5e', size: 70 },
  HALDI: { color: '#facc15', size: 70 },
  MEHENDI: { color: '#22c55e', size: 70 },
  RECEPTION: { color: '#2563eb', size: 70 },
  ENGAGEMENT: { color: '#9333ea', size: 70 },
  'PRE-WEDDING': { color: '#d97706', size: 70 },
};

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedDates).length === 0 ? (
          <View style={styles.noDatesContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={48} color="#f87171" />
            <Text style={styles.noDatesText}>No Dates Found</Text>
            <Text style={styles.noDatesSubText}>You haven't booked any dates yet</Text>
          </View>
        ) : (
          Object.entries(groupedDates).map(([month, dates]: [string, DateDetail[]]) => (
            <View key={month} style={styles.dateGroupContainer}>
              <View style={styles.monthHeader}>
                <MaterialCommunityIcons name="calendar-month" size={24} color="#ef4444" />
                <Text style={styles.monthText}>{month}</Text>
              </View>

              <View style={styles.datesContainer}>
                {dates.map((item: DateDetail, index: number) => {
                  const eventType = item.details.eventType;
                  const { color, size } = eventTypeColors[eventType] || { color: '#6b7280', size: 60 };

                  return (
                    <TouchableOpacity key={index} onPress={() => handleDateClick(item.details)}>
                      <Text style={styles.companyName}>{getInitials(item.details.company.name)}</Text>
                      <View
                        style={[
                          styles.dateBox,
                          { backgroundColor: color, height: size },
                        ]}>
                        <Text style={styles.dayText}>{item.nepaliDate?.day}</Text>
                        <Text style={styles.englishDateText}>{NepaliDateToEnglish(item.date)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View className="flex-row justify-between mt-2">
              <Text className="text-xl font-bold text-gray-900">50000</Text>
              <Text className="text-xl text-blue-600">30000</Text>
              <Text className="text-xl text-green-600">20000</Text> "
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  noDatesContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 24,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noDatesText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  noDatesSubText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  dateGroupContainer: {
    marginBottom: 8,
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 16,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateBox: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  englishDateText: {
    fontSize: 12,
    color: '#000000',
  },
});

export default BookedDates;
