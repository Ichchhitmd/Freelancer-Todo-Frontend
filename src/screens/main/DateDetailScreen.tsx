import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, ScrollView, View, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NepaliDate from 'nepali-date-converter';

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
  contactInfo: string;
  contactPerson: string;
  createdAt: string;
  earnings: string;
  eventDate: string;
  eventTime: string | null;
  eventType: string;
  freelancerId: number | null;
  id: number;
  side: 'BRIDE' | 'GROOM';
  updatedAt: string;
  user: User;
  userId: number;
  workType: string;
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
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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
  function engToNepNum(strNum: string): string {
    return String(strNum)
      .split('')
      .map((ch) => tableOfEngNepNums.get(Number(ch)) ?? ch)
      .join('');
  }

  const getNepaliDate = (date: string) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) throw new Error('Invalid date format');

      const dateStr = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
      const nepaliDate = new NepaliDate(dateStr);

      const nepaliDay = engToNepNum(nepaliDate.format('DD'));
      const nepaliMonth = nepaliDate.format('MMMM');

      return `${nepaliMonth} - ${nepaliDay}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const detailsId = details.id;

  const ActionDrawer = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isDrawerVisible}
      onRequestClose={() => setIsDrawerVisible(false)}>
      <TouchableOpacity
        className="flex-1 bg-black/5"
        activeOpacity={1}
        onPress={() => setIsDrawerVisible(false)}>
        <View className="mt-auto rounded-t-3xl bg-white">
          <View className="p-4">
            <View className="bg-gray-300 mx-auto mb-4 h-1 w-12 rounded-full" />
            <Text className="text-gray-900 mb-4 text-center text-xl font-bold">Select Action</Text>
            <TouchableOpacity
              className="bg-gray-50 mb-3 flex-row items-center rounded-xl p-4"
              onPress={() => {
                navigation.navigate('Add Work', { isEditMode: true, details });
              
                setIsDrawerVisible(false);
              }}>
              <MaterialCommunityIcons name="pencil" size={24} color="#ef4444" />
              <View className="ml-4">
                <Text className="text-gray-900 text-lg font-semibold">Edit Work</Text>
                <Text className="text-gray-500 text-sm">Modify work details</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-50 mb-3 flex-row items-center rounded-xl p-4"
              onPress={() => {
                navigation.navigate('ReimbursementForm', { detailsId });
                setIsDrawerVisible(false);
              }}>
              <MaterialCommunityIcons name="cash-plus" size={24} color="#ef4444" />
              <View className="ml-4">
                <Text className="text-gray-900 text-lg font-semibold">Add Reimbursements</Text>
                <Text className="text-gray-500 text-sm">Record expenses and claims</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="border-gray-200 border-t p-4"
            onPress={() => setIsDrawerVisible(false)}>
            <Text className="text-center text-lg font-semibold text-red-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="bg-red-400 px-4 py-8">
          <Text className="pt-7 text-center text-3xl font-bold text-white">
            {getNepaliDate(details.eventDate)}
          </Text>
        </View>

        <View className="mx-4 -mt-4 rounded-xl bg-white p-4 shadow-lg">
          <View className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MaterialCommunityIcons name="office-building" size={32} color="#ef4444" />
            </View>
            <Text className="text-gray-900 mt-2 text-xl font-bold">{details.company.name}</Text>
          </View>
        </View>

        <View className="mt-4">
          <DetailRow icon="calendar-star" label="Event" value={details.eventType} />
          <DetailRow icon="account-heart" label="Side" value={details.side} />
          <DetailRow
            icon="currency-inr"
            label="Estimated Earning"
            value={`₹ ${details.earnings}`}
          />

          <DetailRow icon="phone" label="Contact Person" value={details.contactPerson || 'N/A'} />

          <DetailRow icon="phone" label="Contact Info" value={details.contactInfo} />
        </View>

        <View className="p-4">
          <TouchableOpacity
            className="mb-3 rounded-xl bg-red-500 p-4"
            onPress={() => setIsDrawerVisible(true)}>
            <Text className="text-center text-lg font-semibold text-white">Take Action</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border-gray-300 rounded-xl border bg-white p-4"
            onPress={() => {}}>
            <Text className="text-gray-700 text-center text-lg font-semibold">Contact Company</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ActionDrawer />
    </SafeAreaView>
  );
};

export default DateDetails;
