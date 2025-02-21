import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CompanyEvent {
  id: number;
  eventDate: string[];
  earnings: string;
  actualEarnings: string | null;
  eventType: string;
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
  dueAmount: number;
  location?: string;
  workType: string[];
}

interface CompanyEventsModalProps {
  visible: boolean;
  onClose: () => void;
  events: CompanyEvent[] | undefined;
  companyName: string;
  onEventPress: (event: CompanyEvent) => void;
  statistics: {
    totalEvents: number;
    totalEarnings: number;
    totalReceived: number;
    totalDue: number;
    paymentStatus: {
      paid: number;
      partiallyPaid: number;
      unpaid: number;
    };
  };
}

export const CompanyEventsModal: React.FC<CompanyEventsModalProps> = ({
  visible,
  onClose,
  events = [],
  companyName,
  onEventPress,
  statistics,
}) => {
  const formatAmount = (amount: number) => amount.toLocaleString();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50">
        <View className="mt-20 flex-1 rounded-t-3xl bg-white">
          <LinearGradient
            colors={['#E50914', '#FF4B4B']}
            className="rounded-t-3xl p-4"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-white">{companyName}</Text>
                <Text className="mt-1 text-white">
                  {statistics.totalEvents} event{statistics.totalEvents !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} className="rounded-full bg-white/20 p-2">
                <MaterialCommunityIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row justify-between">
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-multiple" size={20} color="white" />
                <Text className="mt-1 text-sm text-white">Total</Text>
                <Text className="mt-1 font-bold text-white">
                  रू{formatAmount(statistics.totalEarnings)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-check" size={20} color="white" />
                <Text className="mt-1 text-sm text-white">Received</Text>
                <Text className="mt-1 font-bold text-green-300">
                  रू{formatAmount(statistics.totalReceived)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-plus" size={20} color="white" />
                <Text className="mt-1 text-sm text-white">Due</Text>
                <Text className="mt-1 font-bold text-red-300">
                  रू{formatAmount(statistics.totalDue)}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row justify-between">
              <View className="flex-1 items-center">
                <Text className="text-white">Paid</Text>
                <Text className="text-green-300">{statistics.paymentStatus.paid}</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-white">Partial</Text>
                <Text className="text-yellow-300">{statistics.paymentStatus.partiallyPaid}</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-white">Unpaid</Text>
                <Text className="text-red-300">{statistics.paymentStatus.unpaid}</Text>
              </View>
            </View>
          </LinearGradient>

          <ScrollView className="flex-1 px-4 pt-4">
            {events && events.length > 0 ? (
              events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => onEventPress(event)}
                  className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-gray-900 text-lg font-bold">{event.eventType}</Text>
                      <Text className="text-gray-600 mt-1">{event.eventDate[0]}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-bold text-blue-600">रू{event.earnings}</Text>
                      {event.actualEarnings && (
                        <Text className="text-sm text-green-600">
                          Received: रू{event.actualEarnings}
                        </Text>
                      )}
                      {event.dueAmount > 0 && (
                        <Text className="text-sm text-red-600">Due: रू{event.dueAmount}</Text>
                      )}
                    </View>
                  </View>

                  <View className="mt-3 flex-row flex-wrap items-center">
                    {event.workType?.map((type, index) => (
                      <View key={index} className="mb-2 mr-2 rounded-full bg-red-100 px-3 py-1">
                        <Text className="text-xs text-primary">{type}</Text>
                      </View>
                    ))}
                    <View
                      className={`rounded-full px-3 py-1 ${
                        event.paymentStatus === 'PAID'
                          ? 'bg-green-100'
                          : event.paymentStatus === 'PARTIALLY_PAID'
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                      }`}>
                      <Text
                        className={`text-xs ${
                          event.paymentStatus === 'PAID'
                            ? 'text-green-600'
                            : event.paymentStatus === 'PARTIALLY_PAID'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}>
                        {event.paymentStatus.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>

                  {event.location && (
                    <View className="mt-2 flex-row items-center">
                      <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-1 text-sm">{event.location}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View className="flex-1 items-center justify-center py-8">
                <MaterialCommunityIcons name="calendar-blank" size={48} color="#E50914" />
                <Text className="text-gray-600 mt-4 text-center text-lg">
                  No events found for this company
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
