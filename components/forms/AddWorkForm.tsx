import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import InputField from 'components/common/InputField';
import HorizontalSelector from 'components/rare/HorizontalScrollSelector';
import WorkCalendar from 'components/rare/workCalendar';
import SelectDropdown from 'components/rare/SelectDropdown';
import { useGetCompanies } from 'hooks/companies';
import { useEvents } from 'hooks/events';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

const AddWorkForm: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    userId: 0,
    companyId: 0,
    contactPerson: '',
    contactInfo: '',
    workType: '',
    side: '',
    eventType: '',
    estimatedEarning: '',
    eventDate: '',
  });

  const EVENT_TYPES = [
    { id: 'UNKNOWN', label: 'Unknown', icon: 'help-circle' },
    { id: 'MEHENDI', label: 'Mehendi', icon: 'flower' },
    { id: 'WEDDING', label: 'Wedding', icon: 'heart-multiple' },
    { id: 'RECEPTION', label: 'Reception', icon: 'party-popper' },
    { id: 'ENGAGEMENT', label: 'Engagement', icon: 'ring' },
    { id: 'PRE-WEDDING', label: 'Pre-Wedding', icon: 'camera-wireless' },
  ];

  const SIDE = [
    { id: 'BRIDE', label: 'Bride', icon: 'human-female' },
    { id: 'GROOM', label: 'Groom', icon: 'human-male' },
  ];

  const WORK_TYPE = [
    { id: 'PHOTO', label: 'Photography', icon: 'camera' },
    { id: 'VIDEO', label: 'Video', icon: 'video' },
    { id: 'DRONE', label: 'Drone', icon: 'drone' },
    { id: 'OTHER', label: 'Other', icon: 'help-circle' },
  ];

  const { data: companies, isLoading: companiesLoading } = useGetCompanies();

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  console.log(userId);

  const { mutate: postEvent } = useEvents();

  const handleChange = (key: string, value: any) => {
    if (key === 'companyId') {
      const selectedCompany = companies?.find((company) => company.name === value);
      setFormData((prev) => ({ ...prev, companyId: selectedCompany?.id ?? 0 })); // Ensure it's a number
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  if (companiesLoading) {
    return <Text>Loading...</Text>;
  }

  const handleDateChange = (dates: string[]) => {
    setSelectedDates(dates);
    setFormData((prev) => ({ ...prev, eventDate: dates.join(', ') }));
  };

  const handleSubmit = async () => {
    if (!selectedDates.length) {
      alert('Please select at least one date.');
      return;
    }

    if (userId === undefined) {
      alert('User not authenticated!');
      return;
    }

    const formattedData = {
      userId: userId,
      earnings: parseFloat(formData.estimatedEarning) || 0,
      companyId: formData.companyId,
      contactPerson: formData.contactPerson,
      contactInfo: formData.contactInfo,
      workType: formData.workType,
      side: formData.side,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
    };

    try {
      postEvent(formattedData);
      console.log('Work posted successfully!', formattedData);
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

        <View className=" -mt-4 rounded-2xl bg-white py-4 shadow-sm">
          <WorkCalendar selectedDates={selectedDates} onDateChange={handleDateChange} />
          <SelectDropdown
            data={companies?.map((company) => company.name) || []}
            onSelect={(value) => handleChange('companyId', value)}
          />
          <HorizontalSelector
            label="Event Type"
            icon="calendar-text"
            options={EVENT_TYPES}
            value={formData.eventType}
            onChange={(value) => handleChange('eventType', value)}
          />
          <HorizontalSelector
            label="Pick Side"
            icon="account-heart"
            options={SIDE}
            value={formData.side}
            onChange={(value) => handleChange('side', value)}
          />
          <HorizontalSelector
            label="Work Type"
            icon="wrench"
            options={WORK_TYPE}
            value={formData.workType}
            onChange={(value) => handleChange('workType', value)}
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
            label="Contact Person"
            placeholder="Enter contact person"
            value={formData.contactPerson}
            onChangeText={(text) => handleChange('contactPerson', text)}
            icon="account"
          />
          <InputField
            label="Contact Info"
            placeholder="Enter contact info"
            value={formData.contactInfo}
            onChangeText={(text) => handleChange('contactInfo', text)}
            keyboardType="numeric"
            icon="phone"
          />
          <TouchableOpacity className="rounded-xl w-64 mx-auto bg-red-500 p-4 mb-40" onPress={handleSubmit}>
            <Text className="text-center text-lg font-semibold text-white">Save Work</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddWorkForm;
