import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Event {
  id: number;
  eventDate: string[];
  earnings: string | number;
  eventType: string;
  company?: {
    id: number;
    name: string;
  } | null;
  location?: string;
  assignedBy?: string;
  assignedContactNumber?: number;
  workType: string[];
  clientContactPerson1?: string;
  paymentStatus?: string;
  dueAmount?: number;
  eventCategory?: {
    id: number;
    name: string;
  } | null;
}

interface MonthlyEventsModalProps {
  visible: boolean;
  onClose: () => void;
  events: Event[];
  monthName: string;
  onEventPress: (event: Event) => void;
  totalEarnings: {
    quoted: number;
    received: number;
    due: number;
  };
}

export const MonthlyEventsModal: React.FC<MonthlyEventsModalProps> = ({
  visible,
  onClose,
  events,
  monthName,
  onEventPress,
  totalEarnings,
}) => {
  const formatAmount = (amount: number) => amount.toLocaleString();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50">
        <View className="mt-20 flex-1 rounded-t-3xl bg-white">
          <LinearGradient
            colors={['#E5091459', '#FF4B4B']}
            className="rounded-t-3xl p-4"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-white">{monthName}</Text>
                <Text className="mt-1 text-white">
                  {events.length} event{events.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} className="rounded-full bg-white/20 p-2">
                <MaterialCommunityIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row justify-between">
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-multiple" size={20} color="white" />
                <Text className="mt-1 text-sm text-white">Quoted</Text>
                <Text className="mt-1 font-bold text-white">
                  रू{formatAmount(totalEarnings.quoted)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-check" size={20} color="white" />
                <Text className="mt-1 text-sm text-white">Received</Text>
                <Text className="mt-1 font-bold text-green-300">
                  रू{formatAmount(totalEarnings.received)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-plus" size={20} color="white" />
                <Text className="mt-1 text-sm text-white">Due</Text>
                <Text className="mt-1 font-bold text-red-300">
                  रू{formatAmount(totalEarnings.due)}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <ScrollView className="flex-1 px-4 pt-4">
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => onEventPress(event)}
                  className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-gray-900 text-lg font-bold">
                        {event.company?.name || `${event.assignedBy}'s Work`}
                      </Text>
                      <Text className="text-gray-600 mt-1">
                        {event.eventCategory?.name || event.eventType}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-bold text-blue-600">
                        रू{typeof event.earnings === 'string' ? event.earnings : event.earnings.toLocaleString()}
                      </Text>
                      {event.paymentStatus && (
                        <View className={`mt-1 rounded-full px-2 py-0.5 ${event.paymentStatus === 'PAID' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Text className={`text-xs ${event.paymentStatus === 'PAID' ? 'text-green-700' : 'text-red-700'}`}>
                            {event.paymentStatus}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View className="mt-3 flex-row flex-wrap">
                    {event.workType.map((type, index) => (
                      <View key={index} className="mb-2 mr-2 rounded-full bg-red-100 px-3 py-1">
                        <Text className="text-xs text-primary">{type}</Text>
                      </View>
                    ))}
                  </View>

                  {event.location && (
                    <View className="mt-2 flex-row items-center">
                      <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-1 text-sm">{event.location}</Text>
                    </View>
                  )}
                  
                  {event.dueAmount > 0 && (
                    <View className="mt-2 flex-row items-center">
                      <MaterialCommunityIcons name="cash-remove" size={16} color="#EF4444" />
                      <Text className="text-red-500 ml-1 text-sm">Due: रू{event.dueAmount.toLocaleString()}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View className="flex-1 items-center justify-center py-8">
                <MaterialCommunityIcons name="calendar-blank" size={48} color="#E50914" />
                <Text className="text-gray-600 mt-4 text-center text-lg">
                  No events found for this month
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
