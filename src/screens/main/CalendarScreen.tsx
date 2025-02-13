import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { NepaliDateInfo } from 'lib/calendar';
import { MonthView } from 'components/test/CalendarComponent';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<NepaliDateInfo>();

  return (
    <View style={styles.container}>
      <MonthView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
