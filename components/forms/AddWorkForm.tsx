import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import InputField from 'components/common/InputField';
import CompanyDropdown from 'components/rare/companyDropdown';

import WorkCalendar from 'components/rare/workCalendar';

const AddWorkForm: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const [formData, setFormData] = useState({
    company: '',
    eventName: '',
    brideGroom: '',
    estimatedEarning: '',
    description: '',
    selectedDate: new Date(),
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    handleChange('selectedDate', dates); // Sync with formData for the selected date
  };

  const handleSubmit = async () => {
    if (!selectedDates.length) {
      alert('Please select at least one date.');
      return;
    }

    const newEntry = {
      ...formData,
      selectedDates,
    };

    try {
      const existingData = await AsyncStorage.getItem('bookedDates');
      const parsedData = existingData ? JSON.parse(existingData) : [];

      // Append new data
      const updatedData = [...parsedData, newEntry];

      await AsyncStorage.setItem('bookedDates', JSON.stringify(updatedData));

      console.log('Work saved successfully!', updatedData);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  };

  return (
    <ScrollView
      className="rounded-2xl bg-white p-6 shadow-lg"
      contentContainerStyle={{ paddingBottom: 28 }}>
      <View>
        <Text className="mb-4 text-4xl font-bold text-gray-900">Add Work</Text>

        <CompanyDropdown
          value={formData.company}
          onChange={(value) => handleChange('company', value)}
        />

        <InputField
          label="Event Name"
          placeholder="Enter event name"
          value={formData.eventName}
          onChangeText={(text) => handleChange('eventName', text)}
        />
        <InputField
          label="Bride/Groom Wedding"
          placeholder="Enter details"
          value={formData.brideGroom}
          onChangeText={(text) => handleChange('brideGroom', text)}
        />
        <InputField
          label="Estimated Earning (रु)"
          placeholder="Enter amount"
          value={formData.estimatedEarning}
          onChangeText={(text) => handleChange('estimatedEarning', text)}
          keyboardType="numeric"
        />
        <InputField
          label="Description"
          placeholder="Enter description"
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
        />

        <WorkCalendar selectedDates={selectedDates} onDateChange={handleDateChange} />

        <View className="mb-2 mt-6">
          <TouchableOpacity className="rounded-xl bg-indigo-600 p-4" onPress={handleSubmit}>
            <Text className="text-center text-lg font-bold text-white">Save Work</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddWorkForm;
