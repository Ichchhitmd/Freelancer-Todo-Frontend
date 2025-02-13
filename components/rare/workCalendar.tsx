import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import type { NepaliDateInfo } from '../../lib/calendar';
import { MonthView } from 'components/test/CalendarComponent';

export function withCalendarInput(
  WrappedComponent: React.FC<{
    onSelectDate: (date: NepaliDateInfo) => void;
    selectedDate?: NepaliDateInfo;
  }>
) {
  return function CalendarInput({
    onSelectDate,
    selectedDate,
  }: {
    onSelectDate: (date: NepaliDateInfo) => void;
    selectedDate?: NepaliDateInfo;
  }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState<NepaliDateInfo | undefined>(selectedDate);

    const handleDateSelect = (date: NepaliDateInfo) => {
      setSelected(date);
    };

    return (
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputContainer}>
          <Text style={styles.inputText}>
            {selected ? `${selected.year}/${selected.month + 1}/${selected.day}` : 'Select Date'}
          </Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <MonthView onSelectDate={handleDateSelect} selectedDate={selected} />
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => {
                  setModalVisible(false);
                  if (selected) onSelectDate(selected);
                }}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  inputText: {
    fontSize: 16,
    color: '#334155',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  doneButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  doneText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
