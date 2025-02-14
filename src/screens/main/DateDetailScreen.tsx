import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, ScrollView, View, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  company: Company;
  companyId: number;
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
  const route = useRoute<Props['route']>();
  const { details } = route.params;
  const navigation = useNavigation();

  const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
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
            <Text className="text-gray-900 mt-2 text-xl font-bold">{details.company.name}</Text>
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
          <DetailRow icon="cash-clock" label="Due Amount" value={`₹ ${details.dueAmount}`} />
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
          <DetailRow
            icon="domain"
            label="Company Contact"
            value={`${details.company.contactPerson} - ${details.company.contactInfo}`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DateDetails;
