import React, { useState, useCallback, useMemo } from 'react';
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
  const [estimatedEarning, setEstimatedEarning] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [workType, setWorkType] = useState('');
  const [side, setSide] = useState('');
  const [eventType, setEventType] = useState('');
  const [companyId, setCompanyId] = useState(0);

  const EVENT_TYPES = useMemo(
    () => [
      { id: 'UNKNOWN', label: 'Unknown', icon: 'help-circle' },
      { id: 'MEHENDI', label: 'Mehendi', icon: 'flower' },
      { id: 'WEDDING', label: 'Wedding', icon: 'heart-multiple' },
      { id: 'RECEPTION', label: 'Reception', icon: 'party-popper' },
      { id: 'ENGAGEMENT', label: 'Engagement', icon: 'ring' },
      { id: 'PRE-WEDDING', label: 'Pre-Wedding', icon: 'camera-wireless' },
    ],
    []
  );

  const SIDE = useMemo(
    () => [
      { id: 'BRIDE', label: 'Bride', icon: 'human-female' },
      { id: 'GROOM', label: 'Groom', icon: 'human-male' },
    ],
    []
  );

  const WORK_TYPE = useMemo(
    () => [
      { id: 'PHOTO', label: 'Photography', icon: 'camera' },
      { id: 'VIDEO', label: 'Video', icon: 'video' },
      { id: 'DRONE', label: 'Drone', icon: 'drone' },
      { id: 'OTHER', label: 'Other', icon: 'help-circle' },
    ],
    []
  );

  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { mutate: postEvent } = useEvents();

  const handleDateChange = useCallback((dates: string[]) => {
    setSelectedDates(dates);
  }, []);

  const handleEstimatedEarningChange = useCallback((text: string) => {
    setEstimatedEarning(text);
  }, []);

  const handleSubmit = useCallback(async () => {
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
      earnings: parseFloat(estimatedEarning) || 0,
      companyId: companyId,
      contactPerson: contactPerson,
      contactInfo: contactInfo,
      workType: workType,
      side: side,
      eventType: eventType,
      eventDate: selectedDates.join(', '),
    };

    try {
      postEvent(formattedData);
      console.log('Work posted successfully!', formattedData);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  }, [
    selectedDates,
    userId,
    estimatedEarning,
    contactPerson,
    contactInfo,
    workType,
    side,
    eventType,
    companyId,
    postEvent,
  ]);

  if (companiesLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <ScrollView className="flex-1">
        <View className="bg-red-500 px-4 py-10">
          <Text className="pt-5 text-center text-3xl font-bold text-white">Add New Work</Text>
          <Text className="mt-2 text-center text-base text-red-100">Book your upcoming events</Text>
        </View>

        <View className="-mt-4 rounded-2xl bg-white py-4 shadow-sm">
          <WorkCalendar selectedDates={selectedDates} onDateChange={handleDateChange} />
          <SelectDropdown
            data={companies?.map((company) => company.name) || []}
            onSelect={(value) => {
              const selectedCompany = companies?.find((company) => company.name === value);
              setCompanyId(selectedCompany?.id ?? 0);
            }}
          />
          <HorizontalSelector
            label="Event Type"
            icon="calendar-text"
            options={EVENT_TYPES}
            value={eventType}
            onChange={setEventType}
          />
          <HorizontalSelector
            label="Pick Side"
            icon="account-heart"
            options={SIDE}
            value={side}
            onChange={setSide}
          />
          <HorizontalSelector
            label="Work Type"
            icon="wrench"
            options={WORK_TYPE}
            value={workType}
            onChange={setWorkType}
          />
          <InputField
            label="Estimated Earning"
            placeholder="Enter amount in ₹"
            value={estimatedEarning}
            onChangeText={handleEstimatedEarningChange}
            keyboardType="numeric"
            icon="currency-inr"
          />
          <InputField
            label="Contact Person"
            placeholder="Enter contact person"
            value={contactPerson}
            onChangeText={setContactPerson}
            icon="account"
          />
          <InputField
            label="Contact Info"
            placeholder="Enter contact info"
            value={contactInfo}
            onChangeText={setContactInfo}
            keyboardType="numeric"
            icon="phone"
          />
          <TouchableOpacity
            className="mx-auto mb-24 w-64 rounded-xl bg-red-500 p-4"
            onPress={handleSubmit}>
            <Text className="text-center text-lg font-semibold text-white">Save Work</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(AddWorkForm);
