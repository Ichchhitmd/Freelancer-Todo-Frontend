import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BrideGroomDropdown from 'components/BrideGroomDropdown';
import InputField from 'components/common/InputField';
import CompanyDropdown from 'components/rare/companyDropdown';
import WorkCalendar from 'components/rare/workCalendar';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-red-500 px-4 py-10">
          <Text className="pt-5 text-center text-3xl font-bold text-white">Add New Work</Text>
          <Text className="mt-2 text-center text-lg text-blue-100">Book your upcoming events</Text>
        </View>

        <View className="mx-4 -mt-4 rounded-xl bg-white p-4 shadow-lg">
          <View className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MaterialCommunityIcons name="calendar-plus" size={32} color="#ef4444" />
            </View>
            <Text className="mt-2 text-xl font-bold text-gray-900">Work Details</Text>
            <Text className="mt-1 text-base text-gray-500">Fill in the event information</Text>
          </View>
        </View>

        <View className="m-4 rounded-xl bg-white p-4 shadow-sm">
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

          {/* <InputField
            label="Bride/Groom Wedding"
            placeholder="Enter details"
            value={formData.brideGroom}
            onChangeText={(text) => handleChange('brideGroom', text)}
            icon="account-heart"
          /> */}

          <BrideGroomDropdown
            value={formData.brideGroom}
            onChange={(value) => handleChange('brideGroom', value)}
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

          <TouchableOpacity
            className="mt-6 rounded-xl bg-red-500 p-4 shadow-sm"
            onPress={handleSubmit}>
            <Text className="text-center text-lg font-semibold text-white">Save Work</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddWorkForm;
