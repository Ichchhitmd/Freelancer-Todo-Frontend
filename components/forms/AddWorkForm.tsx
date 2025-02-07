import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import InputField from 'components/common/InputField';
import HorizontalSelector from 'components/rare/HorizontalScrollSelector';
import SelectDropdown from 'components/rare/SelectDropdown';
import WorkCalendar from 'components/rare/workCalendar';
import { useGetCompanies } from 'hooks/companies';
import { useEvents } from 'hooks/events';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import type { RootStackParamList } from 'types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddWorkForm: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { isEditMode = false, details = null } =
    (route.params as RootStackParamList['Add Work']) || {};

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [estimatedEarning, setEstimatedEarning] = useState('');
  const [actualEarning, setActualEarning] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [workType, setWorkType] = useState('');
  const [side, setSide] = useState('');
  const [eventType, setEventType] = useState('');
  const [companyId, setCompanyId] = useState(0);

  useEffect(() => {
    if (isEditMode && details) {
      setSelectedDates([details.eventDate]);
      setEstimatedEarning(details.earnings);
      setActualEarning(details.actualEarnings || '');
      setContactPerson(details.contactPerson);
      setContactInfo(details.contactInfo);
      setWorkType(details.workType);
      setSide(details.side);
      setEventType(details.eventType);
      setCompanyId(details.companyId);
    }
  }, [isEditMode, details]);

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
  const { mutate: postEvent, mutate: updateEvent } = useEvents();

  const handleDateChange = useCallback((dates: string[]) => {
    setSelectedDates(dates);
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

    if (!companyId) {
      alert('Please select a company.');
      return;
    }

    if (!eventType) {
      alert('Please select an event type.');
      return;
    }

    if (!workType) {
      alert('Please select a work type.');
      return;
    }

    if (!side) {
      alert('Please select a side.');
      return;
    }

    if (!estimatedEarning) {
      alert('Please enter an estimated earning.');
      return;
    }

    if (!contactPerson) {
      alert('Please enter a contact person.');
      return;
    }

    if (!contactInfo) {
      alert('Please enter contact info.');
      return;
    }

    // Convert eventType to uppercase
    const formattedEventType = eventType.toUpperCase();

    const formattedData = {
      userId: userId,
      earnings: parseFloat(estimatedEarning) || 0,
      actualEarnings: actualEarning ? parseFloat(actualEarning) : null,
      companyId: companyId,
      contactPerson: contactPerson,
      contactInfo: contactInfo,
      workType: workType,
      side: side,
      eventType: formattedEventType, // Use the formatted eventType
      eventDate: selectedDates[0],
      ...(isEditMode && details ? { id: details.id } : {}),
    };

    try {
      if (isEditMode) {
        await updateEvent(formattedData);
        navigation.goBack();
      } else {
        await postEvent(formattedData);
        navigation.goBack();
      }

      setSelectedDates([]);
      setCompanyId(0);
      setEstimatedEarning('');
      setActualEarning('');
      setContactPerson('');
      setContactInfo('');
      setWorkType('');
      setSide('');
      setEventType('');
    } catch (e) {
      alert('Failed to save work details. Please try again.');
    }
  }, [
    selectedDates,
    userId,
    estimatedEarning,
    actualEarning,
    contactPerson,
    contactInfo,
    workType,
    side,
    eventType,
    companyId,
    isEditMode,
    details,
    postEvent,
    updateEvent,
    navigation,
  ]);

  if (companiesLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <ScrollView className="flex-1">
        <View className="sticky bg-red-500 px-4 py-10">
          <Text className="pt-5 text-center text-3xl font-bold text-white">
            {isEditMode ? 'Edit Work' : 'Add New Work'}
          </Text>
          <Text className="mt-2 text-center text-base text-red-100">
            {isEditMode ? 'Update your event details' : 'Book your upcoming events'}
          </Text>
        </View>

        <View className="-mt-4 rounded-2xl bg-white py-4 shadow-sm">
          <WorkCalendar
            selectedDates={selectedDates}
            onDateChange={handleDateChange}
            initialDate={isEditMode ? details?.eventDate : undefined}
          />{' '}
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons name="office-building" size={20} color="#000000" />
            <Text className="text-gray-800 ml-2 text-lg font-semibold">Select Company</Text>
          </View>
          <SelectDropdown
            data={companies?.map((company) => company.name) || []}
            onSelect={(value) => {
              const selectedCompany = companies?.find((company) => company.name === value);
              setCompanyId(selectedCompany?.id ?? 0);
            }}
            defaultButtonText={isEditMode ? details?.company.name : 'Select Company'}
          />
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons name="calendar-star" size={20} color="#000000" />
            <Text className="text-gray-800 ml-2 text-lg font-semibold">Event Type</Text>
          </View>
          <View
            style={{ height: 120, width: '100%' }}
            className="border-gray-200 my-3 overflow-hidden rounded-md border bg-white">
            <FlatList
              data={EVENT_TYPES}
              keyExtractor={(item) => item.id.toString()}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = eventType === item.label;
                return (
                  <View className="border-gray-300 w-full border-b">
                    <TouchableOpacity
                      style={{
                        backgroundColor: isSelected ? '#E50914' : 'white',
                      }}
                      className="w-full"
                      onPress={() => setEventType(item.label)}>
                      <View className="flex-row items-center justify-center p-3">
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={20}
                          color={isSelected ? 'white' : '#374151'}
                        />
                        <Text
                          className={`ml-2 text-lg font-medium ${isSelected ? 'text-white' : 'text-black'}`}>
                          {item.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
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
            placeholder="Enter amount in ₹"
            value={estimatedEarning}
            onChangeText={setEstimatedEarning}
            keyboardType="numeric"
            icon="currency-inr"
          />
          {isEditMode && (
            <InputField
              placeholder="Enter actual receieved amount"
              value={actualEarning}
              onChangeText={setActualEarning}
              keyboardType="numeric"
              icon="currency-inr"
            />
          )}
          <InputField
            placeholder="Enter contact person"
            value={contactPerson}
            onChangeText={setContactPerson}
            icon="account"
          />
          <InputField
            placeholder="Enter contact info"
            value={contactInfo}
            onChangeText={setContactInfo}
            keyboardType="numeric"
            icon="phone"
          />
          <TouchableOpacity
            className="mx-auto mb-24 w-64 rounded-xl bg-red-500 p-4"
            onPress={handleSubmit}>
            <Text className="text-center text-lg font-semibold text-white">
              {isEditMode ? 'Update Work' : 'Save Work'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(AddWorkForm);
