import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import {
  getMonthMatrix,
  getCurrentNepaliDate,
  nepaliMonths,
  toNepaliNumeral,
} from '../../lib/calendar';
import type { NepaliDateInfo } from '../../lib/calendar';

interface MonthViewProps {
  onSelectDate: (date: NepaliDateInfo | null) => void;
  selectedDate?: NepaliDateInfo | null;
}

export function MonthView({ onSelectDate, selectedDate = null }: MonthViewProps) {
  const currentDate = getCurrentNepaliDate();
  const [viewDate, setViewDate] = useState({
    year: currentDate.year,
    month: currentDate.month,
  });

  const matrix = getMonthMatrix(viewDate.year, viewDate.month);

  const navigateMonth = (delta: number) => {
    let newMonth = viewDate.month + delta;
    let newYear = viewDate.year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setViewDate({ year: newYear, month: newMonth });
  };

  const isDateSelected = (date: NepaliDateInfo) => {
    return (
      selectedDate !== null &&
      selectedDate.day === date.day &&
      selectedDate.month === date.month &&
      selectedDate.year === date.year
    );
  };

  const handleDateSelect = (date: NepaliDateInfo) => {
    const isAlreadySelected = isDateSelected(date);
    onSelectDate(isAlreadySelected ? null : date);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYear}>
          {nepaliMonths[viewDate.month]} {toNepaliNumeral(viewDate.year)}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.button}>
            <Feather name="chevron-left" size={24} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setViewDate({
                year: currentDate.year,
                month: currentDate.month,
              })
            }
            style={[styles.button, styles.todayButton]}>
            <Text style={styles.todayText}>आज</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.button}>
            <Feather name="chevron-right" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'].map((day, i) => (
            <View key={i} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {matrix.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((date, dayIndex) => {
                if (!date) return <View key={`${weekIndex}-${dayIndex}`} style={styles.emptyDay} />;

                const isSelected = isDateSelected(date);
                const isToday =
                  currentDate.day === date.day &&
                  currentDate.month === date.month &&
                  currentDate.year === date.year;

                return (
                  <TouchableOpacity
                    key={`${weekIndex}-${dayIndex}`}
                    style={[
                      styles.day,
                      isSelected && styles.selectedDay,
                      isToday && !isSelected && styles.today,
                    ]}
                    onPress={() => handleDateSelect(date)}>
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                        isToday && !isSelected && styles.todayText,
                      ]}>
                      {date.nepaliDate}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {selectedDate && (
        <View style={styles.selectedDatesContainer}>
          <Text style={styles.selectedDatesTitle}>Selected Date:</Text>
          <View style={styles.selectedDatesList}>
            <View style={styles.selectedDateChip}>
              <Text style={styles.selectedDateChipText}>
                {`${selectedDate.nepaliDate} ${nepaliMonths[selectedDate.month]} ${selectedDate.year}`}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  todayButton: {
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  todayText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  calendar: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  weekDays: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  weekDay: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  daysGrid: {
    paddingVertical: 4,
  },
  week: {
    flexDirection: 'row',
    height: 44,
  },
  day: {
    flex: 1,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  emptyDay: {
    flex: 1,
    margin: 2,
  },
  selectedDay: {
    backgroundColor: '#2563eb',
  },
  today: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  dayText: {
    fontSize: 16,
    color: '#334155',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  selectedDatesContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedDatesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  selectedDatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedDateChip: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  selectedDateChipText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
});
