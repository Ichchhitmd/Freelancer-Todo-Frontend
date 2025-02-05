import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { CalendarPicker } from 'react-native-nepali-picker';
import { Ionicons } from '@expo/vector-icons';

interface WorkCalendarProps {
  selectedDates?: string[];
  onDateChange: (dates: string[]) => void;
}

const WorkCalendar: React.FC<WorkCalendarProps> = ({ selectedDates = [], onDateChange }) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [localDates, setLocalDates] = useState<string[]>(selectedDates);
  const [animation] = useState(new Animated.Value(0));

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      return `${month}/${day}/${year}`;
    } catch {
      return dateString;
    }
  };

  const handleSelect = (date: string) => {
    const newDates = localDates.includes(date)
      ? localDates.filter((d) => d !== date)
      : [...localDates, date];

    setLocalDates(newDates);
    onDateChange(newDates);
  };

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
    Animated.timing(animation, {
      toValue: isCalendarVisible ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const formattedDates = localDates.map(formatDate).join(', ');

  const calendarTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View className="my-2">
      <TouchableOpacity onPress={toggleCalendar} className="flex-row items-center border border-gray/5 bg-white p-4 shadow-sm">
        <View className="mr-2">
          <Ionicons name="calendar" size={20} color="#6B46C1" />
        </View>
        <View className="flex-1">
          <Text className="text-base text-gray-800">{formattedDates || 'Select Event Dates'}</Text>
        </View>
        <Ionicons
          name={isCalendarVisible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B46C1"
        />
      </TouchableOpacity>

      <Animated.View
        style={[{ transform: [{ translateY: calendarTranslateY }] }]}
        className="mt-2 rounded-xl overflow-hidden bg-white shadow-sm">
        <CalendarPicker
          visible={isCalendarVisible}
          onClose={() => setIsCalendarVisible(false)}
          onDateSelect={handleSelect}
          theme="light"
          language="np"
          brandColor="#6B46C1"
        />
      </Animated.View>
    </View>
  );
};

export default WorkCalendar;
