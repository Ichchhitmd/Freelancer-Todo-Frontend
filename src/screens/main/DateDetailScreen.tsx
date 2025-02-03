import { useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, ScrollView, View, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NepaliDateConverter from 'components/rare/nepaliDateConverter';

type RootStackParamList = {
  DateDetail: {
    details: {
      company: string;
      eventName: string;
      brideGroom: string;
      estimatedEarning: string;
      description: string;
      selectedDates: string;
    };
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DateDetail'>;

const DateDetails: React.FC = () => {
  const route = useRoute<Props['route']>();
  const { details } = route.params;
  console.log(details);
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
            <NepaliDateConverter date={details.selectedDates} />
          </Text>
        </View>

        <View className="mx-4 -mt-4 rounded-xl bg-white p-4 shadow-lg">
          <View className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MaterialCommunityIcons name="office-building" size={32} color="#ef4444" />
            </View>
            <Text className="text-gray-900 mt-2 text-xl font-bold">{details.company}</Text>
          </View>
        </View>

        <View className="mt-4">
          <DetailRow icon="calendar-star" label="Event" value={details.eventName} />
          <DetailRow icon="account-heart" label="Bride/Groom" value={details.brideGroom} />
          <DetailRow
            icon="currency-inr"
            label="Estimated Earning"
            value={`₹ ${details.estimatedEarning}`}
          />

          <View className="px-4 py-6">
            <View className="mb-4 flex-row items-center">
              <MaterialCommunityIcons name="text-box-outline" size={24} color="#ef4444" />
              <Text className="text-gray-900 ml-2 text-lg font-semibold">Description</Text>
            </View>
            <Text className="text-gray-700 text-base leading-7">{details.description}</Text>
          </View>
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
