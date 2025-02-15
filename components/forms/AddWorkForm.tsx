// AddWorkForm.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import InputField from 'components/common/InputField';
import HorizontalSelector from 'components/rare/HorizontalScrollSelector';
import SelectDropdown from 'components/rare/SelectDropdown';
import { MonthView } from 'components/test/CalendarComponent';
import { useGetCompanies } from 'hooks/companies';
import { useEvents } from 'hooks/events';
import { NepaliDateInfo } from 'lib/calendar';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserId } from 'redux/selectors/authSelectors';
import type { RootStackParamList } from 'types/navigation';
import DateTimePicker from '@react-native-community/datetimepicker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddWorkForm: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { isEditMode = false, details = null } =
    (route.params as RootStackParamList['Add Work']) || {};

  // Form states
  const [selectedDates, setSelectedDates] = useState<NepaliDateInfo[]>([]);
  
  // Wrapper functions to handle single date selection while maintaining array state
  const handleDateSelect = (date: NepaliDateInfo | null) => {
    setSelectedDates(date ? [date] : []);
  };
  
  const getCurrentSelectedDate = () => selectedDates[0] || null;
  const [estimatedEarning, setEstimatedEarning] = useState('');
  const [actualEarning, setActualEarning] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [workType, setWorkType] = useState<string[]>([]);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [side, setSide] = useState('');
  const [eventType, setEventType] = useState('');
  const [companyId, setCompanyId] = useState(0);
  const [clientContactNumber, setClientContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [noCompany, setNoCompany] = useState(false); // <-- New no company state

  // Load existing details if editing
  useEffect(() => {
    if (isEditMode && details) {
      // Convert the detailNepaliDate to NepaliDateInfo
      if (details.detailNepaliDate.length > 0) {
        const date = details.detailNepaliDate[0];
        setSelectedDates([{
          year: date.nepaliYear,
          month: date.nepaliMonth - 1, // Adjust month to 0-based index
          day: date.nepaliDay,
          nepaliDate: date.nepaliDay.toString(),
        }]);
      }
      setEstimatedEarning(details.earnings.toString());
      setActualEarning(details.actualEarnings?.toString() || '');
      setContactPerson(details.clientContactPerson1);
      setContactInfo(details.clientContactNumber1);
      setWorkType(details.workType);
      setSide(details.side);
      setEventType(details.eventType);
      setCompanyId(details.companyId);

      // If the details object has a location field, load it
      if (details.location) {
        setLocation(details.location);
      }
    }
  }, [isEditMode, details]);

  // Hardcoded arrays for event types, sides, work types
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

  // Hooks for fetching companies and posting/updating events
  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const userId = useSelector(selectUserId);
  const { mutate: postEvent, mutate: updateEvent } = useEvents();

  // Form submission

  const handleSubmit = useCallback(async () => {
    if (!selectedDates.length) {
      alert('Please select a date.');
      return;
    }

    if (userId === undefined) {
      alert('User not authenticated!');
      return;
    }

    if (!noCompany && !companyId) {
      alert('Please select a company or check "No Company"');
      return;
    }

    if (!eventType) {
      alert('Please select an event type.');
      return;
    }

    if (!workType.length) {
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

    if (!time) {
      alert('Please select event time.');
      return;
    }

    if (!location) {
      alert('Please enter location.');
      return;
    }

    try {
      // Format the selected date
      if (!selectedDates[0].englishDate) {
        alert('No valid English date found. Please select a date again.');
        return;
      }

      const selectedDate = selectedDates[0];
      const eventDates = [selectedDate.englishDate];
      const nepaliEventDates = [
        `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`
      ];
      const nepaliDetailDates = [{
        nepaliYear: selectedDate.year,
        nepaliMonth: selectedDate.month + 1,
        nepaliDay: selectedDate.day,
      }];

      const formattedData: EventRequest & { userId: number; id?: number } = {
        userId: userId,
        earnings: parseFloat(estimatedEarning) || 0,
        actualEarnings: actualEarning ? parseFloat(actualEarning) : null,
        clientContactPerson1: contactPerson,
        clientContactNumber1: contactInfo,
        clientContactNumber2: clientContactNumber,
        workType: workType,
        side: side,
        eventType: eventType,
        eventDate: eventDates,
        eventStartTime: time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        nepaliEventDate: nepaliEventDates,
        detailNepaliDate: nepaliDetailDates,
        location: location,
      };

      // Add companyId only if a company is selected
      if (!noCompany && companyId) {
        formattedData.companyId = companyId;
      }

      // Add id if in edit mode
      if (isEditMode && details) {
        formattedData.id = details.id;
      }


      if (isEditMode) {
        await updateEvent(formattedData);
      } else {
        await postEvent(formattedData);
      }

      navigation.goBack();
    } catch (e) {
      console.error(e);
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
    clientContactNumber,
    postEvent,
    updateEvent,
    navigation,
    time,
    location,
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
      <FlatList
        className="flex-1"
        data={[1]}
        renderItem={() => (
          <>
            {/* Header */}
            <View className="bg-red-500 px-6 py-12 shadow-lg">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute left-6 top-16 z-10"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
              <Text className="pt-4 text-center text-4xl font-bold text-white">
                {isEditMode ? 'Edit Work' : 'Add New Work'}
              </Text>
              <Text className="mt-3 text-center text-lg font-light tracking-wide text-red-100">
                {isEditMode ? 'Update your event details' : 'Book your upcoming events'}
              </Text>
            </View>

            {/* Form */}
            <View className="-mt-6 rounded-3xl bg-white p-4 shadow-xl">
              {/* Calendar */}
              <View className="mb-6">
                <MonthView onSelectDate={handleDateSelect} selectedDate={getCurrentSelectedDate()} />
              </View>

              {/* Event Types */}
              <View
                style={{ height: 120 }}
                className="mb-6 overflow-hidden rounded-2xl border border-gray/10 bg-white shadow-sm">
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                  {EVENT_TYPES.map((item) => {
                    const isSelected = eventType === item.id;
                    return (
                      <View key={item.id} className="border-b border-gray/5 last:border-b-0">
                        <TouchableOpacity
                          style={{
                            backgroundColor: isSelected ? '#E50914' : 'white',
                          }}
                          className="w-full"
                          onPress={() => setEventType(item.id)}>
                          <View className="flex-row items-center justify-center space-x-3 p-3">
                            <MaterialCommunityIcons
                              name={item.icon}
                              size={22}
                              color={isSelected ? 'white' : '#374151'}
                            />
                            <Text
                              className={`text-lg font-medium ${
                                isSelected ? 'text-white' : 'text-gray-700'
                              }`}>
                              {item.label}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
              <View className="mb-4 flex-row items-center">
                <TouchableOpacity
                  onPress={() => {
                    setNoCompany(!noCompany);
                    if (!noCompany) setCompanyId(0);
                  }}
                  className="flex-row items-center">
                  <MaterialCommunityIcons
                    name={noCompany ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={24}
                    color="#000000"
                  />
                  <Text className="text-gray-700 ml-2 text-base">No Company</Text>
                </TouchableOpacity>
              </View>

              {!noCompany && (
                <View className="mb-6">
                  <SelectDropdown
                    data={companies?.map((company) => company.name) || []}
                    onSelect={(value) => {
                      const selectedCompany = companies?.find((company) => company.name === value);
                      setCompanyId(selectedCompany?.id || null);
                    }}
                    defaultButtonText={isEditMode ? details?.company?.name : 'Select Company'}
                  />
                </View>
              )}
              <View className="space-y-6">
                <HorizontalSelector
                  label="Pick Side"
                  icon="account-heart"
                  options={SIDE}
                  value={side}
                  onChange={(value: string | string[]) => {
                    if (typeof value === 'string') {
                      setSide(value);
                    }
                  }}
                />

                <HorizontalSelector
                  label="Work Type"
                  icon="wrench"
                  options={WORK_TYPE}
                  value={workType}
                  onChange={(value) => {
                    setWorkType(Array.isArray(value) ? value : [value]);
                  }}
                  selectMultiple
                />

                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="mb-4 flex-row items-center space-x-2 rounded-lg border border-slate-200 bg-white p-4">
                  <MaterialCommunityIcons name="clock-outline" size={24} color="#374151" />
                  <View>
                    <Text className="text-gray-500 text-sm">Event Time</Text>
                    <Text className="text-gray-700 ml-1 text-base">
                      {time.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={false}
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime && event.type === 'set') {
                        setTime(selectedTime);
                      }
                    }}
                  />
                )}

                <InputField
                  placeholder="Estimated Earning (Income from this work)"
                  value={estimatedEarning}
                  onChangeText={setEstimatedEarning}
                  keyboardType="numeric"
                  icon="currency-inr"
                />
                {isEditMode && (
                  <InputField
                    placeholder="Enter actual received amount"
                    value={actualEarning}
                    onChangeText={setActualEarning}
                    keyboardType="numeric"
                    icon="currency-inr"
                  />
                )}

                <InputField
                  placeholder="Assigned By"
                  value={contactPerson}
                  onChangeText={setContactPerson}
                  icon="account"
                />
                <InputField
                  placeholder={
                    contactPerson ? `${contactPerson}'s Contact Number` : 'Contact Number'
                  }
                  value={contactInfo}
                  onChangeText={setContactInfo}
                  keyboardType="numeric"
                  icon="phone"
                />
                <InputField
                  placeholder="Enter Client's Number"
                  value={clientContactNumber}
                  onChangeText={setClientContactNumber}
                  keyboardType="numeric"
                  icon="phone"
                />

                <InputField
                  placeholder="Enter your work location"
                  value={location}
                  onChangeText={setLocation}
                  icon="map-marker"
                />
              </View>

              <TouchableOpacity
                className="mt-8 rounded-2xl bg-red-600 p-4 shadow-lg shadow-red-600/30"
                onPress={handleSubmit}>
                <Text className="text-center text-lg font-semibold text-white">
                  {isEditMode ? 'Update Work' : 'Add Work'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        keyExtractor={() => 'form'}
      />
    </SafeAreaView>
  );
};

export default React.memo(AddWorkForm);
