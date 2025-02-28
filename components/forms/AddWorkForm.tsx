import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import InputField from 'components/common/InputField';
import HorizontalSelector from 'components/rare/HorizontalScrollSelector';
import SelectDropdown from 'components/rare/SelectDropdown';
import { MonthView } from 'components/test/CalendarComponent';
import { useGetAllAssigners } from 'hooks/assignee';
import { useGetCompanies } from 'hooks/companies';
import { useGetEventTypes } from 'hooks/eventTypes';
import { useEvents, usePatchEvent } from 'hooks/events';
import { NepaliDateInfo } from 'lib/calendar';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { Contact, EventRequest, SecondaryContact, VenueDetails } from 'types/eventTypes';
import type { RootStackParamList } from 'types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddWorkForm: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { isEditMode = false, details = null } =
    (route.params as RootStackParamList['Add Work']) || {};

  // Form states
  const [selectedDates, setSelectedDates] = useState<NepaliDateInfo[]>([]);
  const [estimatedEarning, setEstimatedEarning] = useState('');
  const [actualEarning, setActualEarning] = useState<string | null>(null);
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedContactNumber, setAssignedContactNumber] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const [primaryContact, setPrimaryContact] = useState<Contact>({
    name: '',
    phoneNumber: '',
  });
  const [secondaryContact, setSecondaryContact] = useState<SecondaryContact | undefined>();
  const [venueDetails, setVenueDetails] = useState<VenueDetails>({
    location: '',
  });
  const [workType, setWorkType] = useState<string[]>([]);
  const [time, setTime] = useState<Date | null>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [side, setSide] = useState('');
  const [companyId, setCompanyId] = useState<number | undefined>();
  const [noCompany, setNoCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [advanceReceived, setAdvanceReceived] = useState<number | undefined>();
  const [eventCategoryId, setEventCategoryId] = useState<number | undefined>(undefined);
  const scrollViewRef = useRef(null);
  const [showAssignerSuggestions, setShowAssignerSuggestions] = useState(false);
  const [filteredAssigners, setFilteredAssigners] = useState<typeof assignees>([]);

  const handleScrollEnd = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const itemHeight = 40;
    const selectedIndex = Math.round(scrollOffset / itemHeight);

    if (eventTypes?.[selectedIndex]) {
      setEventCategoryId(eventTypes[selectedIndex].id);
      // Ensure we snap exactly to the item
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          y: selectedIndex * itemHeight,
          animated: true,
        });
      });
    }
  };

  useEffect(() => {
    if (isEditMode && details && eventTypes?.length > 0) {
      if (details.detailNepaliDate?.length > 0) {
        const date = details.detailNepaliDate[0];
        setSelectedDates([
          {
            year: date.nepaliYear,
            month: date.nepaliMonth - 1,
            day: date.nepaliDay,
            nepaliDate: date.nepaliDay.toString(),
          },
        ]);
      }

      // Handle time
      if (details.eventStartTime) {
        const [hours, minutes] = details.eventStartTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        setTime(date);
      }

      setEstimatedEarning(details.earnings?.toString() || '');
      setActualEarning(details.actualEarnings?.toString() || '');

      // Handle company vs individual
      if (details.companyId) {
        setNoCompany(false);
        setCompanyId(details.companyId);
        // Set the selected company name for the dropdown
        if (details.company?.name) {
          setSelectedCompany(details.company.name);
        }
      } else {
        setNoCompany(true);
        setAssignedBy(details.assignedBy || '');
        // Contact number comes without prefix from backend
        setAssignedContactNumber(details.assignedContactNumber || null);
      }

      // Handle contacts and venue
      setPrimaryContact(details.primaryContact || { name: '', phoneNumber: '' });
      setSecondaryContact(details.secondaryContact);
      setVenueDetails(details.venueDetails || { location: '' });

      // Handle other fields
      setWorkType(details.workType || []);
      setSide(details.side || '');
      setEventCategoryId(details.eventCategoryId);
      setAdvanceReceived(details.advanceReceived);

      // Set event category and scroll to it
      if (scrollViewRef.current && details.eventCategoryId) {
        const index = eventTypes.findIndex((t) => t.id === details.eventCategoryId);
        if (index !== -1) {
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({
              y: index * 40,
              animated: false,
            });
          }, 100);
        }
      }
    }
  }, [isEditMode, details, eventTypes]);

  useEffect(() => {
    if (!isEditMode && eventTypes?.length > 0 && !eventCategoryId) {
      setEventCategoryId(eventTypes[0].id);
    }
  }, [isEditMode, eventTypes, eventCategoryId]);

  const { data: eventTypes = [] } = useGetEventTypes();
  const { data: companies = [] } = useGetCompanies();

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

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data: assignees } = useGetAllAssigners(userId || 0);


  const { mutate: postEvent } = useEvents();
  const { mutate: updateEvent } = usePatchEvent();

  const handleSubmit = useCallback(async () => {
    if (!selectedDates.length) {
      alert('Please select a date.');
      return;
    }

    if (!eventCategoryId) {
      alert('Please select an event type.');
      return;
    }

    if (!side) {
      alert('Please select a side.');
      return;
    }

    if (!estimatedEarning) {
      alert('Please enter your earnings for this event.');
      return;
    }

    if (!workType.length) {
      alert('Please select at least one work type.');
      return;
    }

    if (noCompany) {
      if (!assignedBy) {
        alert('Please enter who assigned the work.');
        return;
      }

      if (!assignedContactNumber) {
        alert("Please enter assigner's contact number.");
        return;
      }
    }

    try {
      const selectedDate = selectedDates[0];
      const eventDates = [selectedDate.englishDate];
      const nepaliEventDates = [
        `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(
          selectedDate.day
        ).padStart(2, '0')}`,
      ];
      const detailNepaliDate = [
        {
          nepaliYear: selectedDate.year,
          nepaliMonth: selectedDate.month + 1, // Convert from 0-based to 1-based month
          nepaliDay: selectedDate.day,
        },
      ];

      const cleanObject = (obj: any) => {
        if (!obj) return obj;

        if (Array.isArray(obj)) {
          return obj.filter((item) => item !== undefined && item !== null);
        }

        if (typeof obj !== 'object') return obj;

        const cleaned = Object.entries(obj).reduce((acc, [key, value]) => {
          if (value === undefined || value === null) return acc;

          if (typeof value === 'object') {
            const cleanedValue = cleanObject(value);
            if (
              Array.isArray(cleanedValue)
                ? cleanedValue.length > 0
                : Object.keys(cleanedValue).length > 0
            ) {
              acc[key] = cleanedValue;
            }
            return acc;
          }
          acc[key] = value;
          return acc;
        }, {} as any);
        return cleaned;
      };

      const formattedData: EventRequest = cleanObject({
        eventDate: eventDates || [],
        nepaliEventDate: nepaliEventDates || [],
        detailNepaliDate,
        eventCategoryId: eventCategoryId || 0,
        side: side || '',
        earnings: parseFloat(estimatedEarning) || 0,
        userId: userId || 0,
        eventStartTime: time
          ? time.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : '',
        workType: workType || [],
        advanceReceived: advanceReceived || 0,
        primaryContact: {
          name: primaryContact.name || '',
          phoneNumber: primaryContact.phoneNumber?.replace('+977-', '') || '',
          whatsappNumber: primaryContact.whatsappNumber || '',
        },
        venueDetails: {
          name: venueDetails.name || '',
          location: venueDetails.location || '',
          photographerFirstPlace: venueDetails.photographerFirstPlace || '',
        },
        ...(secondaryContact
          ? {
              secondaryContact: {
                name: secondaryContact.name || '',
                phoneNumber: secondaryContact.phoneNumber?.replace('+977-', '') || '',
                relationId: secondaryContact.relationId || 0,
                relationContactNumber:
                  secondaryContact.relationContactNumber?.replace('+977-', '') || '',
              },
            }
          : {}),
        ...(companyId
          ? { companyId }
          : {
              assignedBy: assignedBy || '',
              assignedContactNumber: assignedContactNumber || null,
            }),
      });

      if (isEditMode && details?.id) {
        formattedData.id = details.id;
      }

      if (isEditMode) {
        try {
          // Update the event
          await updateEvent({
            eventId: details.id,
            eventData: formattedData,
          });
          
          // Find the selected company details
          const selectedCompanyDetails = companies?.find(c => c.id === companyId);
          
          // Navigate to DateDetail screen with the updated details
          navigation.navigate('MainTabs', {
            screen: 'DateDetails',
            params: { 
              details: {
                ...details,
                ...formattedData,
                id: details.id,
                company: companyId ? {
                  id: companyId,
                  name: selectedCompanyDetails?.name || ''
                } : undefined,
                assignedBy: noCompany ? assignedBy : undefined,
                assignedContactNumber: noCompany ? assignedContactNumber : undefined
              }
            }
          });
        } catch (error) {
          console.error('Error updating event:', error);
          alert('Failed to update work details. Please try again.');
        }
      } else {
        // Create new event
        postEvent(formattedData, {
          onSuccess: (data) => {
            if (data) {
              navigation.navigate('MainTabs', {
                screen: 'DateDetails',
                params: { details: data },
              });
            }
          },
          onError: (error) => {
            console.error('Error submitting form:', error);
            alert('Failed to save work details. Please try again.');
          },
        });
      }
    } catch (e) {
      console.error('Error submitting form:', e);
      alert('Failed to save work details. Please try again.');
    }
  }, [
    selectedDates,
    userId,
    eventCategoryId,
    side,
    estimatedEarning,
    actualEarning,
    time,
    workType,
    assignedBy,
    assignedContactNumber,
    primaryContact,
    secondaryContact,
    venueDetails,
    companyId,
    noCompany,
    isEditMode,
    details,
    updateEvent,
    postEvent,
    navigation,
  ]);

  const getCurrentSelectedDate = () => selectedDates[0] || null;

  useEffect(() => {}, [showTimePicker, time]);

  const handleTimeSelect = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);

    if (selectedTime && event.type === 'set') {
      setTime(selectedTime);
    }
  };

  const handleAssignerChange = useCallback(
    (text: string) => {
      setAssignedBy(text);
      if (assignees) {
        const filtered = assignees.filter((assigner) =>
          assigner.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredAssigners(filtered);
        setShowAssignerSuggestions(text.length > 0);
      }
    },
    [assignees]
  );

  const handleAssignerSelect = useCallback((assigner) => {
    setAssignedBy(assigner.name);
    // Remove any non-numeric characters and convert to number
    const cleanNumber = assigner.contactNumber.toString().replace(/\D/g, '');
    setAssignedContactNumber(parseInt(cleanNumber));
    setShowAssignerSuggestions(false);
  }, []);

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <FlatList
        className="flex-1"
        data={[1]}
        renderItem={() => (
          <>
            <View className="bg-red-500 px-6 py-14 shadow-lg">
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

            <View className="-mt-6 rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-xl">
              <View className="mb-8">
                <Text className="text-gray-800 mb-4 text-lg font-semibold">Select Date</Text>
                <MonthView
                  onSelectDate={(date: NepaliDateInfo | null) => {
                    setSelectedDates(date ? [date] : []);
                  }}
                  selectedDate={getCurrentSelectedDate()}
                />
              </View>

              <View className="mb-8">
                <Text className="text-gray-800 mb-4 text-lg font-semibold">Event Type</Text>
                <View
                  className="border-gray-100 h-[120px] overflow-hidden rounded-2xl border bg-white shadow-sm"
                  onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
                  <ScrollView
                    ref={scrollViewRef}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    onMomentumScrollEnd={handleScrollEnd}>
                    {eventTypes?.map((type) => {
                      const isSelected = eventCategoryId === type.id;
                      return (
                        <TouchableOpacity
                          key={type.id}
                          style={{
                            backgroundColor: isSelected ? '#E50914' : 'white',
                          }}
                          className="border-gray-100 w-full border-b last:border-b-0"
                          onPress={() => setEventCategoryId(type.id)}>
                          <View className="p-4">
                            <Text
                              className={`text-center text-lg font-medium ${
                                isSelected ? 'text-white' : 'text-gray-700'
                              }`}>
                              {type.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-gray-800 mb-4 text-lg font-semibold">Company Details</Text>
                <View className="border-gray-200 space-y-6 rounded-2xl border bg-white p-6 shadow-md">
                  <TouchableOpacity
                    onPress={() => {
                      setNoCompany(!noCompany);
                      if (!noCompany) {
                        setCompanyId(undefined);
                      } else {
                        setAssignedBy('');
                        setAssignedContactNumber(null);
                      }
                    }}
                    className="bg-gray-100 flex-row items-center justify-between rounded-lg p-3">
                    <Text className="text-gray-700 text-base font-medium">
                      {noCompany ? 'Switch to Company' : 'Switch to Individual'}
                    </Text>
                    <MaterialCommunityIcons
                      name={noCompany ? 'toggle-switch' : 'toggle-switch-off-outline'}
                      size={40}
                      color={noCompany ? '#E50914' : '#A0A0A0'}
                    />
                  </TouchableOpacity>

                  {!noCompany ? (
                    <View className="mt-2">
                      <SelectDropdown
                        data={companies?.map((company) => company.name) || []}
                        onSelect={(value) => {
                          setSelectedCompany(value);
                          const selectedCompany = companies?.find(
                            (company) => company.name === value
                          );
                          if (selectedCompany) {
                            setCompanyId(selectedCompany.id);
                          }
                        }}
                        defaultValue={selectedCompany}
                        defaultButtonText={selectedCompany || 'Select Company'}
                      />
                    </View>
                  ) : (
                    <View className="mt-4 space-y-4">
                      <View className="flex flex-col gap-2 space-y-2">
                        <Text className="text-gray-600 text-sm font-medium">Assigned By</Text>
                        <InputField
                          value={assignedBy}
                          onChangeText={handleAssignerChange}
                          placeholder="Enter who assigned the work"
                          icon="account"
                          onBlur={() => {
                            // Small delay to allow the item selection to complete
                            setTimeout(() => {
                              setShowAssignerSuggestions(false);
                            }, 200);
                          }}
                          onFocus={() => setShowAssignerSuggestions(true)}
                        />
                        {showAssignerSuggestions && (
                          <View className="absolute top-16 z-10 mt-1 w-full rounded-lg bg-white shadow-lg">
                            <ScrollView className="max-h-36" nestedScrollEnabled>
                              {filteredAssigners.map((assigner, index) => (
                                <TouchableOpacity
                                  key={index}
                                  className="border-gray-200 mb-2 rounded-2xl border bg-white p-4 shadow-md"
                                  onPress={() => handleAssignerSelect(assigner)}>
                                  <Text className="font-semibold text-black">{assigner.name}</Text>
                                  <Text className="text-gray-500 mt-1 text-sm">{`+977-${assigner.contactNumber}`}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                      <View className="flex flex-col gap-2 space-y-2">
                        <Text className="text-gray-600 text-sm font-medium">
                          Assigned Contact Number
                        </Text>
                        <InputField
                          value={assignedContactNumber?.toString() || ''}
                          onChangeText={(text) => {
                            // Remove any non-numeric characters
                            const cleanNumber = text.replace(/\D/g, '');
                            setAssignedContactNumber(cleanNumber ? parseInt(cleanNumber) : null);
                          }}
                          placeholder="Enter assigner's contact number"
                          keyboardType="numeric"
                          icon="phone"
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
              <View className="mb-8">
                <Text className="text-gray-800 mb-4 text-lg font-semibold">Event Details</Text>
                <View className="border-gray-100 space-y-8 rounded-2xl border bg-white p-4 shadow-sm">
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

                  <View className="space-y-8">
                    <TouchableOpacity
                      onPress={() => setShowTimePicker(true)}
                      className="border-gray-200 flex-row items-center gap-2 space-x-2 rounded-lg border bg-white p-4 shadow-sm">
                      <MaterialCommunityIcons name="clock-outline" size={24} color="#E50914" />
                      <View className="flex-1">
                        <Text className="text-gray-700 text-sm font-medium">Event Time</Text>
                        <Text className="text-gray-900 mt-1 text-base">
                          {time
                            ? time.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : 'Select Event Time'}
                        </Text>
                      </View>
                      <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>

                    {showTimePicker && (
                      <View style={{ marginBottom: 50 }}>
                        <DateTimePicker
                          testID="timePicker"
                          value={time || new Date()}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={handleTimeSelect}
                          themeVariant="light"
                          accentColor="#E50914"
                          style={{ marginBottom: 30 }}
                        />
                      </View>
                    )}

                    <View style={{ marginTop: 20 }}>
                      <InputField
                        label="Estimated Earning"
                        value={estimatedEarning}
                        onChangeText={setEstimatedEarning}
                        keyboardType="numeric"
                        placeholder="Enter your earnings for this event"
                        icon="cash"
                      />

                      <InputField
                        label="Advance Received"
                        value={advanceReceived}
                        onChangeText={setAdvanceReceived}
                        keyboardType="numeric"
                        placeholder="Enter your advance received for this event"
                        icon="cash"
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-gray-800 mb-4 text-lg font-semibold">
                  Contact Information
                </Text>
                <View className="border-gray-100 space-y-6 rounded-2xl border bg-white p-4 shadow-sm">
                  <View className="space-y-4">
                    <Text className="text-gray-700 text-base font-medium">
                      {side === 'BRIDE'
                        ? "Bride's Contact"
                        : side === 'GROOM'
                          ? "Groom's Contact"
                          : 'Primary Contact'}
                    </Text>
                    <InputField
                      label="Name"
                      value={primaryContact.name}
                      onChangeText={(text) =>
                        setPrimaryContact((prev) => ({ ...prev, name: text }))
                      }
                      placeholder={`Enter ${side === 'BRIDE' ? "bride's" : side === 'GROOM' ? "groom's" : 'primary contact'} name`}
                      icon="account"
                    />
                    <InputField
                      label="Phone Number"
                      value={primaryContact.phoneNumber}
                      onChangeText={(text) =>
                        setPrimaryContact((prev) => ({ ...prev, phoneNumber: text }))
                      }
                      keyboardType="numeric"
                      placeholder={`Enter ${side === 'BRIDE' ? "bride's" : side === 'GROOM' ? "groom's" : 'primary contact'} number`}
                      icon="phone"
                    />
                  </View>

                  <View className="space-y-4">
                    <Text className="text-gray-700 text-base font-medium">
                      {side === 'BRIDE'
                        ? "Bride's Secondary Contact"
                        : side === 'GROOM'
                          ? "Groom's Secondary Contact"
                          : 'Secondary Contact'}{' '}
                      (Optional)
                    </Text>
                    <InputField
                      label="Name"
                      value={secondaryContact?.name}
                      onChangeText={(text) =>
                        setSecondaryContact((prev) =>
                          prev
                            ? { ...prev, name: text }
                            : {
                                name: text,
                                phoneNumber: '',
                                relationId: 0,
                                relationContactNumber: '',
                              }
                        )
                      }
                      placeholder={`Enter ${side === 'BRIDE' ? "bride's seconday contact" : side === 'GROOM' ? "groom's seconday contact" : 'secondary contact'} name`}
                      icon="account"
                    />
                    <InputField
                      label="Phone Number"
                      value={secondaryContact?.phoneNumber}
                      onChangeText={(text) =>
                        setSecondaryContact((prev) =>
                          prev
                            ? { ...prev, phoneNumber: text }
                            : {
                                name: '',
                                phoneNumber: text,
                                relationId: 0,
                                relationContactNumber: '',
                              }
                        )
                      }
                      keyboardType="numeric"
                      placeholder={`Enter ${side === 'BRIDE' ? "bride's seconday contact" : side === 'GROOM' ? "groom's seconday contact" : 'secondary contact'} number`}
                      icon="phone"
                    />
                  </View>
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-gray-800 mb-4 text-lg font-semibold">Venue Details</Text>
                <View className="border-gray-100 space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
                  <InputField
                    label="Location"
                    value={venueDetails.location}
                    onChangeText={(text) =>
                      setVenueDetails((prev) => ({ ...prev, location: text }))
                    }
                    placeholder="Enter venue location"
                    icon="map-marker"
                  />
                  <InputField
                    label="Name"
                    value={venueDetails.name}
                    onChangeText={(text) => setVenueDetails((prev) => ({ ...prev, name: text }))}
                    placeholder="Enter venue name"
                    icon="home"
                  />
                </View>
              </View>

              <TouchableOpacity
                className="mt-6 rounded-2xl bg-red-600 p-4 shadow-lg shadow-red-600/30"
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
