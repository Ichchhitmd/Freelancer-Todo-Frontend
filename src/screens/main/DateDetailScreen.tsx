import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDeleteEvent, useGetEventById, usePatchEvent } from 'hooks/events';
import { useGetEventTypes } from 'hooks/eventTypes';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { WorkEvent } from 'types/WorkingScreenTypes';

type RootStackParamList = {
  DateDetail: {
    details: WorkEvent;
  };
  'Add Work': {
    isEditMode: boolean;
    details: WorkEvent;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DateDetail'>;

const DateDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Props['route']>();
  const { details: initialDetails } = route.params;

  // Fetch complete event details
  const { data: details, isLoading } = useGetEventById(initialDetails.id);
  const { data: eventTypes } = useGetEventTypes();
  const [actualEarnings, setActualEarnings] = useState<string>('');
  const [localDueAmount, setLocalDueAmount] = useState<number>(initialDetails.dueAmount || 0);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [actualEarningsError, setActualEarningsError] = useState<string | null>(null);
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutate: updateEvent } = usePatchEvent();

  const getEventTypeName = useCallback(
    (eventCategoryId: number) => {
      const eventType = eventTypes?.find((type) => type.id === eventCategoryId);
      return eventType?.name || 'Unknown';
    },
    [eventTypes]
  );

  // Update local state when details change
  useEffect(() => {
    if (details) {
      // Only set actualEarnings if it exists and is not zero
      if (details.actualEarnings && parseFloat(details.actualEarnings.toString()) !== 0) {
        setActualEarnings(details.actualEarnings.toString());
      } else {
        setActualEarnings('');
      }
      setLocalDueAmount(details.dueAmount || 0);
    }
  }, [details]);

  const getCompanyName = () => {
    // First try to get from API response
    if (details?.company?.name) return details.company.name;
    // Then try from initial details (WorkEvent)
    if (initialDetails.company?.name) return initialDetails.company.name;
    // Then try from primary contact
    if (details?.assignedBy) return `${details.assignedBy}'s Event`;
    if (initialDetails.assignedBy) return `${initialDetails.assignedBy}'s Event`;
    return 'Personal Event';
  };

  // Calculate due amount instantly when actual earnings change
  const handleActualEarningsChange = (text: string) => {
    // Allow empty input
    if (text === '') {
      setActualEarnings('');
      setActualEarningsError(null);
      return;
    }

    // Remove any non-numeric characters except decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Validate the number
    const number = parseFloat(cleanedText);
    if (isNaN(number)) {
      setActualEarningsError('Please enter a valid number');
    } else if (number < 0) {
      setActualEarningsError('Amount cannot be negative');
    } else {
      setActualEarningsError(null);
    }
    
    setActualEarnings(cleanedText);
  };

  // Use the refresh function when component mounts
  useEffect(() => {
    if (route.params.refresh) {
      route.params.refresh().then((freshData) => {
        if (freshData) {
          navigation.setParams({
            details: freshData,
          });
        }
      });
    }
  }, [route.params.refresh, navigation]);

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ef4444" />
          <Text className="text-gray-600 mt-4">Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!details) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-4">
          <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
          <Text className="text-gray-800 mt-4 text-center text-lg font-medium">
            Could not load event details
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-4 rounded-lg bg-red-500 px-6 py-3">
            <Text className="font-medium text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Use initial ID from route params while details are loading
  const detailsId = details?.id || initialDetails.id;

  const handleDelete = () => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEvent(details.id, {
            onSuccess: () => {
              navigation.goBack();
            },
          });
        },
      },
    ]);
  };

  const handleActualEarningsUpdate = () => {
    if (!actualEarnings && actualEarnings !== '') {
      Alert.alert('Error', 'Please enter actual earnings');
      return;
    }

    if (!details) {
      Alert.alert('Error', 'Event details not found');
      return;
    }

    const parsedActualEarnings = actualEarnings ? parseFloat(actualEarnings) : null;
    updateEvent(
      {
        eventId: details.id,
        eventData: {
          actualEarnings: parsedActualEarnings,
          dueAmount: localDueAmount,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Actual earnings updated successfully');
          navigation.setParams({
            details: {
              ...details,
              actualEarnings: parsedActualEarnings,
              dueAmount: localDueAmount,
            },
          });
        },
      }
    );
  };

  const DetailRow = ({
    icon,
    label,
    value,
    isActualEarnings = false,
  }: {
    icon: string;
    label: string;
    value: string;
    isActualEarnings?: boolean;
  }) => {
    if (isActualEarnings) {
      return (
        <View className="border-gray-100 border-b px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <MaterialCommunityIcons name={icon} size={24} color="#ef4444" />
              </View>
              <View className="ml-4">
                <Text className="text-gray-500 text-sm font-medium">{label}</Text>
                <Text className="text-gray-900 mt-1 text-lg font-semibold">{value}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowEarningsModal(true)}
              className="rounded-xl bg-red-500 px-4 py-2">
              <Text className="font-medium text-white">Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View className="border-gray-100 flex-row items-center border-b px-4 py-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <MaterialCommunityIcons name={icon} size={24} color="#ef4444" />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-gray-500 text-sm font-medium">{label}</Text>
          <Text className="text-gray-900 mt-1 text-lg font-semibold">{value}</Text>
        </View>
      </View>
    );
  };

  const nepaliMonths = [
    'बैशाख',
    'जेठ',
    'असार',
    'श्रावण',
    'भदौ',
    'असोज',
    'कार्तिक',
    'मंसिर',
    'पुष',
    'माघ',
    'फाल्गुन',
    'चैत',
  ];

  const tableOfEngNepNums = new Map([
    [0, '०'],
    [1, '१'],
    [2, '२'],
    [3, '३'],
    [4, '४'],
    [5, '५'],
    [6, '६'],
    [7, '७'],
    [8, '८'],
    [9, '९'],
  ]);

  function engToNepNum(num: number): string {
    return String(num)
      .split('')
      .map((ch) => tableOfEngNepNums.get(Number(ch)) ?? ch)
      .join('');
  }

  return (
    <SafeAreaView className="mb-20 flex-1 bg-white">
      <Modal
        animationType="slide"
        transparent
        visible={showEarningsModal}
        onRequestClose={() => setShowEarningsModal(false)}>
        <View className="flex-1 justify-center bg-black/50">
          <View className="mx-4 rounded-xl bg-white p-4">
            <Text className="text-gray-900 mb-4 text-lg font-semibold">
              Received amount till now for this event
            </Text>
            <TextInput
              value={actualEarnings}
              onChangeText={handleActualEarningsChange}
              keyboardType="numeric"
              placeholder="Enter actual earnings"
              className="bg-gray-50 border-gray-200 mb-4 rounded-lg border px-4 py-3 text-base"
              autoFocus
            />
            {actualEarningsError && (
              <Text className="mb-4 text-red-500">{actualEarningsError}</Text>
            )}
            <View className="flex-row justify-end gap-4 space-x-3">
              <TouchableOpacity
                onPress={() => setShowEarningsModal(false)}
                className="border-gray-200 rounded-lg border px-4 py-2">
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleActualEarningsUpdate();
                  setShowEarningsModal(false);
                }}
                disabled={!!actualEarningsError}
                className={`rounded-lg px-4 py-2 ${actualEarningsError ? 'bg-red-300' : 'bg-red-500'}`}>
                <Text
                  className={`font-medium ${actualEarningsError ? 'text-gray-500' : 'text-white'}`}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView className=" flex-1">
        <View className="bg-red-400 px-4 py-8">
          <Text className="text-center text-xl font-semibold text-white">
            {details.eventCategory?.name || 'Unknown Event Type'}
          </Text>

          <View className="flex flex-row items-center justify-center">
            {details.detailNepaliDate?.map((date, index) => (
              <Text
                key={index}
                className="items-center justify-center pt-2 text-center text-3xl font-bold text-white">
                {nepaliMonths[date.nepaliMonth - 1]} {engToNepNum(date.nepaliDay)}
                {index !== details.detailNepaliDate.length - 1 && ' , '}
              </Text>
            ))}
          </View>
        </View>

        <View className="mx-4 -mt-4 rounded-xl bg-white p-4 shadow-lg">
          <View className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MaterialCommunityIcons name="office-building" size={32} color="#ef4444" />
            </View>
            <Text className="text-gray-900 mt-2 text-xl font-bold">{getCompanyName()}</Text>
            <Text className="text-gray-500 my-1 text-base">
              {details.venueDetails?.name},{' '}
              {details.venueDetails?.location || 'No location provided'}
            </Text>
            <View className="mt-4 flex-row items-center justify-center gap-12">
              <TouchableOpacity
                className="flex-row items-center rounded-xl bg-red-500 px-4 py-2"
                onPress={() => {
                  navigation.navigate('Add Work', { isEditMode: true, details });
                }}>
                <MaterialCommunityIcons name="pencil" size={20} color="#ffffff" />
                <Text className="ml-2 font-semibold text-white">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center rounded-xl bg-red-500 px-4 py-2"
                onPress={() => {
                  navigation.navigate('ReimbursementForm', { detailsId });
                }}>
                <MaterialCommunityIcons name="cash-plus" size={20} color="#ffffff" />
                <Text className="ml-2 font-semibold text-white">Add Expense</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mt-4 bg-white">
          <Text className="text-gray-900 px-4 py-2 text-lg font-semibold">Event Details</Text>
          <DetailRow icon="account-heart" label="Side" value={details.side || 'Not specified'} />
          <DetailRow
            icon="clock-outline"
            label="Start Time"
            value={details.eventStartTime || 'Not specified'}
          />
          <DetailRow
            icon="camera-outline"
            label="Work Type"
            value={details.workType?.join(', ') || 'Not specified'}
          />
        </View>

        <View className="mt-4 bg-white">
          <Text className="text-gray-900 px-4 py-2 text-lg font-semibold">Financial Details</Text>
          <DetailRow
            icon="currency-inr"
            label="Total Amount"
            value={`रू ${parseFloat(details.earnings?.toString() || '0').toLocaleString()}`}
          />
          <DetailRow
            icon="currency-inr"
            label="Actual Earnings"
            value={actualEarnings ? `रू ${parseFloat(actualEarnings).toLocaleString()}` : 'Not set'}
            isActualEarnings
          />
          <DetailRow
            icon="currency-inr"
            label="Due Amount"
            value={`रू ${localDueAmount.toLocaleString()}`}
          />
        </View>

        <View className="mt-4 bg-white">
          <Text className="text-gray-900 px-4 py-2 text-lg font-semibold">Contact Information</Text>
          {details.primaryContact && (
            <DetailRow
              icon="account-outline"
              label="Primary Contact"
              value={`${details.primaryContact.name} - ${details.primaryContact.phoneNumber}`}
            />
          )}
          {details.secondaryContact && (
            <DetailRow
              icon="account-outline"
              label="Secondary Contact"
              value={`${details.secondaryContact.name} - ${details.secondaryContact.phoneNumber}`}
            />
          )}
          {details.company && (
            <DetailRow
              icon="domain"
              label="Company Contact"
              value={`${details.company.contactPerson || 'N/A'} - ${details.company.contactInfo || 'N/A'}`}
            />
          )}
          <View className="p-2">
            <TouchableOpacity
              onPress={handleDelete}
              className="flex items-center justify-center rounded-full bg-red-500 p-3 shadow-md active:opacity-75">
              <MaterialCommunityIcons name="trash-can" size={24} color="white" />
              <Text className="text-center text-white">Delete Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DateDetails;
