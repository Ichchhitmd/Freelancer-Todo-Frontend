import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const WorkCalendar: React.FC<{ selectedDates?: Date[]; onDateChange: (dates: Date[]) => void }> = ({
  selectedDates = [],
  onDateChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Initialize state with selected dates
  const [dates, setDates] = useState<Date[]>(selectedDates);

  const handleDateChange = (date?: Date) => {
    if (date) {
      setPickerDate(date);
      setDates((prevDates) => {
        const exists = prevDates.some((d) => d.toDateString() === date.toDateString());
        const newDates = exists
          ? prevDates.filter((d) => d.toDateString() !== date.toDateString()) // Remove if already selected
          : [...prevDates, date]; // Add new date

        // Log the updated dates to verify
        console.log('Updated Dates:', newDates);

        // Pass updated dates to parent component
        onDateChange(newDates);
        return newDates;
      });
    }
  };

  // Convert dates to marked format for Calendar component
  const markedDates = dates.reduce(
    (acc, date) => {
      const formattedDate = date.toISOString().split('T')[0];
      acc[formattedDate] = {
        selected: true,
        marked: true,
        selectedColor: 'purple',
      };
      return acc;
    },
    {} as Record<string, any>
  );

  return (
    <View className="mb-6">
      <Text className="mb-2 font-medium text-gray-700">Select Work Dates</Text>


      {showPicker && (
        <View className="rounded-lg bg-white p-4 shadow">
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (date) {
                handleDateChange(date);
              }
              setShowPicker(false);
            }}
          />
        </View>
      )}

      <Calendar
        markedDates={markedDates}
        markingType={'multi-dot'}
        onDayPress={(day: { dateString: string | number | Date }) =>
          handleDateChange(new Date(day.dateString))
        }
      />
    </View>
  );
};

export default WorkCalendar;
