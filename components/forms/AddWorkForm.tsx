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
import { RootState } from 'redux/store';
import type { RootStackParamList } from 'types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddWorkForm: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { isEditMode = false, details = null } =
    (route.params as RootStackParamList['Add Work']) || {};

  const [selectedDates, setSelectedDates] = useState<NepaliDateInfo[]>([]);
  const [estimatedEarning, setEstimatedEarning] = useState('');
  const [actualEarning, setActualEarning] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [workType, setWorkType] = useState<string[]>([]);

  const [side, setSide] = useState('');
  const [eventType, setEventType] = useState('');
  const [companyId, setCompanyId] = useState(0);

  useEffect(() => {
    if (isEditMode && details) {
      // Parse the event date string (assuming format: "YYYY-MM-DD")
      const [year, month, day] = details.eventDate.split('-').map(Number);

      // Create NepaliDateInfo object
      const nepaliDateInfo: NepaliDateInfo = {
        year,
        month: month - 1, // Adjust month to 0-based index
        day,
        nepaliDate: day.toString(), // You might want to convert this to Nepali numerals
      };

      setSelectedDates([nepaliDateInfo]);
      setEstimatedEarning(details.earnings.toString());
      setActualEarning(details.actualEarnings?.toString() || '');
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

    const eventDates: string[] = [];
    const nepaliEventDates: string[] = [];
    const nepaliDetailDates: { nepaliDay: number; nepaliMonth: number; nepaliYear: number }[] = [];

    try {
      for (const date of selectedDates) {
        const nepaliDateString = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
        nepaliEventDates.push(nepaliDateString);

        nepaliDetailDates.push({
          nepaliYear: date.year,
          nepaliMonth: date.month + 1,
          nepaliDay: date.day,
        });
        if (date.englishDate) {
          eventDates.push(date.englishDate);
        }

        const formattedData = {
          userId: userId,
          earnings: parseFloat(estimatedEarning) || 0,
          actualEarnings: actualEarning ? parseFloat(actualEarning) : null,
          companyId: companyId,
          contactPerson: contactPerson,
          contactInfo: contactInfo,
          workType: workType,
          side: side,
          eventType: eventType.toUpperCase(),
          eventDate: eventDates,
          nepaliEventDate: nepaliEventDates, // Send nepaliEventDate as an array
          detailNepaliDate: nepaliDetailDates,
          ...(isEditMode && details ? { id: details.id } : {}),
        };

        console.log('Sending event data for date:', date.englishDate);
        console.log('Formatted data:', formattedData);

        if (isEditMode) {
          await updateEvent(formattedData);
        } else {
          console.log('Gellloooooooooooooooo:', formattedData);
          await postEvent(formattedData);
        }
      }

      navigation.goBack();
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

  console.log('Selected Dates:', selectedDates);

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
            <View className="bg-red-500 px-6 py-12 shadow-lg">
              <Text className="pt-4 text-center text-4xl font-bold text-white">
                {isEditMode ? 'Edit Work' : 'Add New Work'}
              </Text>
              <Text className="mt-3 text-center text-lg font-light tracking-wide text-red-100">
                {isEditMode ? 'Update your event details' : 'Book your upcoming events'}
              </Text>
            </View>

            <View className="-mt-6 rounded-3xl bg-white p-4 shadow-xl">
              <View className="mb-6">
                <MonthView onSelectDates={setSelectedDates} selectedDates={selectedDates} />
              </View>

              <View className="mb-6">
                <SelectDropdown
                  data={companies?.map((company) => company.name) || []}
                  onSelect={(value) => {
                    const selectedCompany = companies?.find((company) => company.name === value);
                    setCompanyId(selectedCompany?.id ?? 0);
                  }}
                  defaultButtonText={isEditMode ? details?.company.name : 'Select Company'}
                />
              </View>

              <View
                style={{ height: 120 }}
                className="mb-6 overflow-hidden rounded-2xl border border-gray/10 bg-white shadow-sm">
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                  {EVENT_TYPES.map((item) => {
                    const isSelected = eventType === item.label;
                    return (
                      <View key={item.id} className="border-b border-gray/5 last:border-b-0">
                        <TouchableOpacity
                          style={{
                            backgroundColor: isSelected ? '#E50914' : 'white',
                          }}
                          className="w-full"
                          onPress={() => setEventType(item.label)}>
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
                    // Check if value is a string or an array of strings
                    setWorkType(Array.isArray(value) ? value : [value]);
                  }}
                  selectMultiple
                />
              </View>

              <View className="mt-6 space-y-4">
                <InputField
                  placeholder="Enter amount in ₹"
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
