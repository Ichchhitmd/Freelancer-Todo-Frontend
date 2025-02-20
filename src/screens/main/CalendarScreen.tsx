import { MonthView } from 'components/test/CalendarComponent';
import { NepaliDateInfo } from 'lib/calendar';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<NepaliDateInfo | null>(null);

  return (
    <View style={styles.container}>
      <MonthView
        selectedDate={selectedDate}
        onSelectDate={(date: NepaliDateInfo | null) => setSelectedDate(date)}
      />
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
