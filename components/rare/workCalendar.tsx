import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { CalendarPicker } from 'react-native-nepali-picker';
import { Ionicons } from '@expo/vector-icons';

interface WorkCalendarProps {
  selectedDates?: string[];
  onDateChange: (dates: string[]) => void;
  initialDate?: string;
}

const WorkCalendar: React.FC<WorkCalendarProps> = ({
  selectedDates = [],
  onDateChange,
  initialDate,
}) => {
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
  useEffect(() => {
    if (initialDate && !localDates.includes(initialDate)) {
      setLocalDates([initialDate]);
      onDateChange([initialDate]);
    }
  }, [initialDate]);

  useEffect(() => {
    setLocalDates(selectedDates);
  }, [selectedDates]);

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
      <TouchableOpacity
        onPress={toggleCalendar}
        className="flex-row items-center justify-between rounded-lg border border-gray/10 bg-white p-3">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={24} color="#4B5563" />
          <Text className="text-gray-700 ml-2">
            {localDates.map(formatDate).join(', ') || 'Select Event Dates'}
          </Text>
        </View>
        <Ionicons
          name={isCalendarVisible ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#4B5563"
        />
      </TouchableOpacity>

      <Animated.View
        style={[{ transform: [{ translateY: calendarTranslateY }] }]}
        className="mt-2 overflow-hidden rounded-xl bg-white shadow-sm">
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
