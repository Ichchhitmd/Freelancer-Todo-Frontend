import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CompanyDropdown from 'components/rare/companyDropdown';
import InputField from 'components/common/InputField';
import HorizontalSelector from 'components/rare/HorizontalScrollSelector';
import WorkCalendar from 'components/rare/workCalendar';

const EVENT_TYPES = [
  { id: 'unknown', label: 'Unknown', icon: 'help-circle' },
  { id: 'mehendi', label: 'Mehendi', icon: 'flower' },
  { id: 'wedding', label: 'Wedding', icon: 'heart-multiple' },
  { id: 'reception', label: 'Reception', icon: 'party-popper' },
  { id: 'engagement', label: 'Engagement', icon: 'ring' },
  { id: 'pre-wedding', label: 'Pre-Wedding', icon: 'camera-wireless' },
];

const SIDE = [
  { id: 'bride', label: 'Bride', icon: 'human-female' },
  { id: 'groom', label: 'Groom', icon: 'human-male' },
];

const AddWorkForm: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [formData, setFormData] = useState({
    company: '',
    eventName: '',
    side: '',
    eventType: '',
    estimatedEarning: '',
    description: '',
    selectedDate: new Date(),
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    handleChange('selectedDate', dates);
  };

  const handleSubmit = async () => {
    if (!selectedDates.length) {
      alert('Please select at least one date.');
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('bookedDates');
      const parsedData = existingData ? JSON.parse(existingData) : [];
      const updatedData = [...parsedData, { ...formData, selectedDates }];
      await AsyncStorage.setItem('bookedDates', JSON.stringify(updatedData));
      console.log('Work saved successfully!', updatedData);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  };

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <ScrollView className="flex-1">
        <View className="bg-red-500 px-4 py-10">
          <Text className="pt-5 text-center text-3xl font-bold text-white">Add New Work</Text>
          <Text className="mt-2 text-center text-base text-red-100">Book your upcoming events</Text>
        </View>

        <View className=" -mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <View className="space-y-4">
            <CompanyDropdown
              value={formData.company}
              onChange={(value) => handleChange('company', value)}
            />

            <InputField
              label="Event Name"
              placeholder="Enter event name"
              value={formData.eventName}
              onChangeText={(text) => handleChange('eventName', text)}
              icon="calendar-star"
            />

            <HorizontalSelector
              label="Event Type"
              icon="calendar-text"
              options={EVENT_TYPES}
              value={formData.eventType}
              onChange={(value) => handleChange('eventType', value)}
            />

            <HorizontalSelector
              label="PICK SIDE"
              icon="account-heart"
              options={SIDE}
              value={formData.side}
              onChange={(value) => handleChange('side', value)}
            />

            <InputField
              label="Estimated Earning"
              placeholder="Enter amount in ₹"
              value={formData.estimatedEarning}
              onChangeText={(text) => handleChange('estimatedEarning', text)}
              keyboardType="numeric"
              icon="currency-inr"
            />

            <InputField
              label="Description"
              placeholder="Enter event description"
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              multiline
              icon="text-box-outline"
            />

            <WorkCalendar selectedDates={selectedDates} onDateChange={handleDateChange} />

            <TouchableOpacity className="mt-2 rounded-xl bg-red-500 p-4" onPress={handleSubmit}>
              <Text className="text-center text-lg font-semibold text-white">Save Work</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddWorkForm;
