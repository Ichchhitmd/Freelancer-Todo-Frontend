import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { CalendarPicker } from 'react-native-nepali-picker';
import NepaliDate from 'nepali-date-converter';

interface WorkCalendarProps {
  selectedDates?: Date[];
  onDateChange: (dates: Date[]) => void;
}

const WorkCalendar: React.FC<WorkCalendarProps> = ({ selectedDates = [], onDateChange }) => {
  const [visible, setVisible] = useState(false);
  const [dates, setDates] = useState<Date[]>(selectedDates);

  const handleDateSelect = (pickedDate: string) => {
    const newDate = new Date(pickedDate);
    setDates((prevDates) => {
      const exists = prevDates.some((d) => d.toDateString() === newDate.toDateString());
      const newDates = exists
        ? prevDates.filter((d) => d.toDateString() !== newDate.toDateString())
        : [...prevDates, newDate];

      onDateChange(newDates);
      return newDates;
    });
  };

  return (
    <View className={`mb-6`}>
      <CalendarPicker
        visible={visible}
        onClose={() => setVisible(false)}
        onDateSelect={handleDateSelect}
        theme="light"
        language="np"
        brandColor="#6B46C1"
      />

      <TouchableOpacity onPress={() => setVisible(true)} className="rounded-lg bg-primary/75 p-3">
        <Text className="text-center text-white">Select Dates</Text>
      </TouchableOpacity>

      {dates.length > 0 && (
        <View className="mt-4">
          <Text className="text-gray-700 mb-2 font-medium">Selected Dates:</Text>

          <FlatList
            data={dates.sort((a, b) => a.getTime() - b.getTime())}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              let nepaliDateStr = '';
              try {
                // Format the date as YYYY/MM/DD
                const year = item.getFullYear();
                const month = (item.getMonth() + 1).toString().padStart(2, '0');
                const day = item.getDate().toString().padStart(2, '0');
                const dateStr = `${year}/${month}/${day}`;
                console.log('Converting date:', dateStr);

                const nepaliDate = new NepaliDate(dateStr);
                nepaliDateStr = `${nepaliDate.format('MMMM DD, YYYY')} BS`;
              } catch (error) {
                console.log('Error converting date:', error);
                nepaliDateStr = 'Date out of range';
              }

              return (
                <View className="mr-2 rounded-lg bg-purple-100 px-4 py-2">
                  <Text className="text-sm text-primary">{nepaliDateStr}</Text>
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default WorkCalendar;
