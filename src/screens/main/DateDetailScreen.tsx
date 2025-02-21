import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDeleteEvent, useGetEventById, usePatchEvent } from 'hooks/events';
import React, { useState } from 'react';
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

interface Company {
  bio: string;
  contactInfo: string;
  contactPerson: string | null;
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  phone: string;
}

interface EventDetails {
  actualEarnings: string | null;
  company?: Company | null;
  companyId?: number;
  contactInfo: string | null;
  contactPerson: string | null;
  createdAt: string;
  earnings: string;
  eventDate: string[];
  eventStartTime: string;
  eventType: string;
  freelancerId: number | null;
  id: number;
  side: 'BRIDE' | 'GROOM';
  updatedAt: string;
  user: User;
  userId: number;
  workType: string[];
  dueAmount: number;
  nepaliEventDate: string[];
  detailNepaliDate: {
    nepaliDay: number;
    nepaliYear: number;
    nepaliMonth: number;
  }[];
  clientContactPerson1: string | null;
  clientContactNumber1: string | null;
  clientContactPerson2: string | null;
  clientContactNumber2: string | null;
  location: string;
}

type RootStackParamList = {
  DateDetail: {
    details: EventDetails;
  };
  'Add Work': {
    isEditMode: boolean;
    details: EventDetails;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DateDetail'>;

const DateDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Props['route']>();
  const { details: initialDetails, refresh } = route.params;

  // Fetch complete event details
  const { data: details, isLoading } = useGetEventById(initialDetails.id);
  const [actualEarnings, setActualEarnings] = useState<string>('');
  const [localDueAmount, setLocalDueAmount] = useState<number>(initialDetails.dueAmount);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutate: updateEvent } = usePatchEvent();

  // Use the refresh function when component mounts
  React.useEffect(() => {
    if (refresh) {
      refresh().then((freshData) => {
        if (freshData) {
          // Update the route params with fresh data
          navigation.setParams({
            details: freshData,
          });
        }
      });
    }
  }, [refresh, navigation]);

  // Update local state when details change
  React.useEffect(() => {
    if (details) {
      setActualEarnings(details.actualEarnings || '');
      setLocalDueAmount(details.dueAmount);
    }
  }, [details]);

  // Calculate due amount instantly when actual earnings change
  const handleActualEarningsChange = (text: string) => {
    setActualEarnings(text);
    if (details) {
      const earnings = parseFloat(details.earnings);
      const actual = text ? parseFloat(text) : 0;
      setLocalDueAmount(earnings - actual);
    }
  };

  if (isLoading || !details) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E50914" />
          <Text className="text-gray-600 mt-4">Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          // Force a refresh of the route params
          navigation.setParams({
            details: {
              ...details,
              actualEarnings,
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

  const detailsId = details.id;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Modal
        animationType="slide"
        transparent
        visible={showEarningsModal}
        onRequestClose={() => setShowEarningsModal(false)}>
        <View className="flex-1 justify-center bg-black/50">
          <View className="mx-4 rounded-xl bg-white p-4">
            <Text className="text-gray-900 mb-4 text-lg font-semibold">Update Actual Earnings</Text>
            <TextInput
              value={actualEarnings}
              onChangeText={handleActualEarningsChange}
              keyboardType="numeric"
              placeholder="Enter actual earnings"
              className="bg-gray-50 border-gray-200 mb-4 rounded-lg border px-4 py-3 text-base"
              autoFocus
            />
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
                className="rounded-lg bg-red-500 px-4 py-2">
                <Text className="font-medium text-white">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView className="mb-24 flex-1">
        <View className="bg-red-400 px-4 py-8">
          <Text className="text-center text-xl font-semibold text-white">{details.eventType}</Text>

          <View className="flex flex-row items-center justify-center">
            {details.detailNepaliDate.map((date, index) => (
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
            <Text className="text-gray-900 mt-2 text-xl font-bold">
              {details.company?.name || `${details.clientContactPerson1}'s Work`}
            </Text>
            <Text className="text-gray-500 text-base">{details.location}</Text>
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
          <DetailRow icon="account-heart" label="Side" value={details.side} />
          <DetailRow icon="clock-outline" label="Start Time" value={details.eventStartTime} />
          <DetailRow icon="camera-outline" label="Work Type" value={details.workType.join(', ')} />
        </View>

        <View className="mt-4 bg-white">
          <Text className="text-gray-900 px-4 py-2 text-lg font-semibold">Financial Details</Text>
          <DetailRow icon="currency-inr" label="Total Amount" value={`₹ ${details.earnings}`} />
          <DetailRow
            icon="currency-inr"
            label="Actual Earnings"
            value={`₹ ${actualEarnings}`}
            isActualEarnings
          />
          <DetailRow icon="currency-inr" label="Due Amount" value={`₹ ${localDueAmount}`} />
        </View>

        <View className="mt-4 bg-white">
          <Text className="text-gray-900 px-4 py-2 text-lg font-semibold">Contact Information</Text>
          {details.clientContactPerson1 && (
            <DetailRow
              icon="account-outline"
              label="Primary Contact"
              value={`${details.clientContactPerson1} - ${details.clientContactNumber1}`}
            />
          )}
          {details.clientContactPerson2 && (
            <DetailRow
              icon="account-outline"
              label="Secondary Contact"
              value={`${details.clientContactPerson2} - ${details.clientContactNumber2}`}
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
