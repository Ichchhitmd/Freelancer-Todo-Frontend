import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetEventTypes } from 'hooks/eventTypes';
import { useDeleteEvent, useGetEventById, usePatchEvent } from 'hooks/events';
import { useAddEventIncome } from 'hooks/income';
import React, { useState, useEffect } from 'react';
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
  Linking,
  Platform,
} from 'react-native';
import { WorkEvent } from 'types/WorkingScreenTypes';

type RootStackParamList = {
  DateDetail: { details: WorkEvent };
  'Add Work': { isEditMode: boolean; details: WorkEvent };
  ReimbursementForm: { detailsId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DateDetail'>;

const DateDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Props['route']>();
  const { details: initialDetails } = route.params;

  const { data: details, isLoading, refetch } = useGetEventById(initialDetails.id);
  const { data: eventTypes } = useGetEventTypes();
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutate: updateEvent } = usePatchEvent();
  const { mutate: addEventIncome } = useAddEventIncome();
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [newIncome, setNewIncome] = useState<string>('');
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (route.params.refresh) {
      route.params.refresh().then((freshData) => {
        if (freshData) {
          navigation.setParams({ details: freshData });
          refetch();
        }
      });
    }
  }, [route.params.refresh, navigation, refetch]);

  const getCompanyName = () => {
    if (details?.company?.name) return details.company.name;
    if (initialDetails.company?.name) return initialDetails.company.name;
    if (details?.assignedBy) return `${details.assignedBy}'s Event`;
    if (initialDetails.assignedBy) return `${initialDetails.assignedBy}'s Event`;
  };

  const handleNewIncomeChange = (text: string) => {
    if (text === '') {
      setNewIncome('');
      setIncomeError(null);
      return;
    }
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const number = parseFloat(cleanedText);
    if (isNaN(number)) setIncomeError('Please enter a valid number');
    else if (number <= 0) setIncomeError('Amount must be greater than 0');
    else setIncomeError(null);
    setNewIncome(cleanedText);
  };

  const handleAddIncome = () => {
    if (!newIncome) return Alert.alert('Error', 'Please enter an amount');
    if (incomeError) return Alert.alert('Error', incomeError);

    const parsedIncome = parseFloat(newIncome);
    addEventIncome(
      { eventId: details.id, actualEarnings: parsedIncome },
      {
        onSuccess: () => {
          setNewIncome('');
          setShowEarningsModal(false);
          Alert.alert('Success', 'Income added successfully');
          refetch();
        },
        onError: (error) => {
          Alert.alert('Error', 'Failed to add income');
          console.error(error);
        },
      }
    );
  };

  const advancePaymentEvent = () => details?.advanceReceived || 0;

  const totalReceived = () =>
    parseFloat(details?.actualEarnings?.toString() || '0') + advancePaymentEvent();

  const handleDelete = () => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEvent(details.id, { onSuccess: () => navigation.goBack() });
        },
      },
    ]);
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

  const engToNepNum = (num: number) =>
    String(num)
      .split('')
      .map((ch) => tableOfEngNepNums.get(Number(ch)) ?? ch)
      .join('');

  const DetailCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    console.log(label, value),
    <View className="m-1 flex-1 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
        <MaterialCommunityIcons name={icon} size={20} color="#ef4444" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-gray-500 text-xs font-medium">{label}</Text>
        <Text className="text-gray-900 text-base font-semibold">{value}</Text>
      </View>
    </View>
  );

  const FinancialCard = ({
    icon,
    label,
    value,
    highlight = false,
  }: {
    icon: string;
    label: string;
    value: string;
    highlight?: boolean;
  }) => (
    <View
      className={`mb-3 flex-row items-center rounded-xl p-3 shadow-sm ${highlight ? 'bg-green-50' : 'bg-white'}`}>
      <View
        className={`h-12 w-12 items-center justify-center rounded-full ${highlight ? 'bg-green-200' : 'bg-green-100'}`}>
        <MaterialCommunityIcons name={icon} size={24} color="#22c55e" />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-gray-500 text-xs font-medium">{label}</Text>
        <Text className={`text-lg font-semibold ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
          {value}
        </Text>
      </View>
    </View>
  );

  const ContactCard = ({
    name,
    phone,
    type,
  }: {
    name: string;
    phone: string;
    type: 'primary' | 'secondary' | 'company';
  }) => {
    const handlePhonePress = (phone?: string) => {
      if (!phone) return;
      Linking.openURL(Platform.OS === 'ios' ? `telprompt:${phone}` : `tel:${phone}`);
    };
    if (!name && !phone) return null;

    const getIcon = () => {
      switch (type) {
        case 'primary':
          return 'account-star';
        case 'secondary':
          return 'account-supervisor';
        case 'company':
          return 'domain';
        default:
          return 'account';
      }
    };

    const getTitle = () => {
      switch (type) {
        case 'primary':
          return 'Primary Contact';
        case 'secondary':
          return 'Secondary Contact';
        case 'company':
          return 'Company Contact';
        default:
          return 'Contact';
      }
    };

    return (
      <View className="mb-3 rounded-xl bg-white p-4 shadow-sm">
        <View className="mb-2 flex-row items-center">
          <MaterialCommunityIcons name={getIcon()} size={18} color="#ef4444" />
          <Text className="ml-2 font-medium text-red-500">{getTitle()}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 text-base font-semibold">{name || 'N/A'}</Text>
          <TouchableOpacity
            className="flex-row items-center rounded-full bg-red-500 px-3 py-1.5"
            onPress={() => handlePhonePress(phone)}>
            <MaterialCommunityIcons name="phone" size={16} color="#fff" />
            <Text className="ml-1 font-medium text-white">{phone || 'N/A'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="bg-gray-100 flex-1">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ef4444" />
          <Text className="text-gray-600 mt-4">Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!details) {
    return (
      <SafeAreaView className="bg-gray-100 flex-1">
        <View className="flex-1 items-center justify-center p-4">
          <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
          <Text className="text-gray-800 mt-4 text-center text-lg font-medium">
            Could not load event details
          </Text>
          <TouchableOpacity
            className="mt-4 rounded-lg bg-red-500 px-6 py-3"
            onPress={() => navigation.goBack()}>
            <Text className="font-medium text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const detailsId = details?.id || initialDetails.id;

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <Modal
        animationType="slide"
        transparent
        visible={showEarningsModal}
        onRequestClose={() => setShowEarningsModal(false)}>
        <View className="flex-1 justify-center bg-black/50">
          <View className="mx-4 rounded-xl bg-white p-5 shadow-lg">
            <View className="mb-4 flex-row items-center">
              <MaterialCommunityIcons name="currency-inr" size={24} color="#ef4444" />
              <Text className="text-gray-900 ml-2 text-lg font-semibold">Add Income</Text>
            </View>
            <TextInput
              value={newIncome}
              onChangeText={handleNewIncomeChange}
              keyboardType="numeric"
              placeholder="Enter income amount"
              className="border-gray-200 bg-gray-50 mb-4 rounded-lg border px-4 py-3 text-base"
              autoFocus
            />
            {incomeError && <Text className="mb-4 text-red-500">{incomeError}</Text>}
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                className="border-gray-200 rounded-lg border px-4 py-2"
                onPress={() => {
                  setNewIncome('');
                  setShowEarningsModal(false);
                }}>
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-lg px-4 py-2 ${incomeError || !newIncome ? 'bg-red-300' : 'bg-red-500'}`}
                onPress={handleAddIncome}
                disabled={!!incomeError || !newIncome}>
                <Text
                  className={`font-medium ${incomeError || !newIncome ? 'text-gray-500' : 'text-white'}`}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="bg-red-500 px-4 py-8">
        <View className="flex-row items-center justify-center">
          {details.detailNepaliDate?.map((date, index) => (
            <Text key={index} className="pt-2 text-center text-3xl font-bold text-white">
              {nepaliMonths[date.nepaliMonth - 1]} {engToNepNum(date.nepaliDay)}
              {index !== details.detailNepaliDate.length - 1 && ' , '}
            </Text>
          ))}
        </View>
      </View>

      <View className="mx-4 -mt-4 rounded-xl bg-white p-5 shadow-lg">
        <View className="items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <MaterialCommunityIcons name="office-building" size={28} color="#ef4444" />
          </View>
          <Text className="text-gray-900 mt-3 text-xl font-bold">{getCompanyName()}</Text>
          {details.venueDetails?.location && (
            <View className="mt-1 flex-row items-center">
              <MaterialCommunityIcons name="map-marker" size={16} color="#ef4444" />
              <Text className="text-gray-500 ml-1 text-base">
                {details.venueDetails?.name ? `${details.venueDetails.name}, ` : ''}
                {details.venueDetails.location}
              </Text>
            </View>
          )}
        </View>
        <View className="absolute right-4 top-4">
          <TouchableOpacity
            className="rounded-full bg-white p-2 shadow-md"
            onPress={() => navigation.navigate('Add Work', { isEditMode: true, details })}>
            <MaterialCommunityIcons name="pencil" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-4 right-4">
          <TouchableOpacity className="rounded-full bg-white p-2 shadow-md" onPress={handleDelete}>
            <MaterialCommunityIcons name="trash-can" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-4 mt-4 flex-row justify-around px-4">
        {['details', 'financial', 'contacts'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`mx-2 flex-1 rounded-full py-3 ${activeTab === tab ? 'bg-red-500' : 'bg-white'} shadow-md`}
            onPress={() => setActiveTab(tab)}>
            <Text
              className={`text-center font-semibold ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4 pb-4">
        {activeTab === 'details' && (
          <View>
            <View className="flex-row flex-wrap">
              <DetailCard
                icon="party-popper"
                label="Event Type"
                value={details.eventCategory?.name || 'Not specified'}
              />
              <DetailCard
                icon="account-heart"
                label="Side"
                value={details.side || 'Not specified'}
              />
            </View>
            <View className="mt-2 flex-row flex-wrap">
              <DetailCard
                icon="clock-outline"
                label="Start Time"
                value={details.eventStartTime || 'Not specified'}
              />
              <DetailCard
                icon="camera-outline"
                label="Work Type"
                value={details.workType?.join(', ') || 'Not specified'}
              />
            </View>
          </View>
        )}

        {activeTab === 'financial' && (
          <View>
            <FinancialCard
              icon="currency-inr"
              label="Total Amount"
              value={`रू ${parseFloat(details.earnings?.toString() || '0').toLocaleString()}`}
            />
            <FinancialCard
              icon="currency-inr"
              label="Amount Received Till Now"
              value={`रू ${totalReceived().toLocaleString()}`}
              highlight
            />
            <FinancialCard
              icon="currency-inr"
              label="Due Amount"
              value={`रू ${parseFloat(details.dueAmount?.toString() || '0').toLocaleString()}`}
            />
            <FinancialCard
              icon="currency-inr"
              label="Advance Amount"
              value={`रू ${advancePaymentEvent().toLocaleString()}`}
            />
            <View className="mb-24 mt-4 flex-row justify-between gap-2">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center rounded-full bg-green-500 py-3 shadow-md"
                onPress={() => {
                  setNewIncome('');
                  setShowEarningsModal(true);
                }}>
                <MaterialCommunityIcons name="cash-plus" size={20} color="#fff" />
                <Text className="ml-2 font-semibold text-white">Add Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center rounded-full bg-red-500 py-3 shadow-md"
                onPress={() => navigation.navigate('ReimbursementForm', { detailsId })}>
                <MaterialCommunityIcons name="cash-minus" size={20} color="#fff" />
                <Text className="ml-2 font-semibold text-white">Add Expense</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'contacts' && (
          <View>
            {details.primaryContact && (
              <ContactCard
                name={details.primaryContact.name}
                phone={details.primaryContact.phoneNumber}
                type="primary"
              />
            )}
            {details.secondaryContact && (
              <ContactCard
                name={details.secondaryContact.name}
                phone={details.secondaryContact.phoneNumber}
                type="secondary"
              />
            )}
            {details.company && (
              <ContactCard
                name={details.company.contactPerson || ''}
                phone={details.company.contactInfo || ''}
                type="company"
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DateDetails;
