import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Event {
  id: number;
  eventDate: string[];
  earnings: string;
  eventType: string;
  company?: {
    id: number;
    name: string;
  } | null;
  location?: string;
  workType: string[];
  clientContactPerson1: string;
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
            colors={['#E50914', '#FF4B4B']}
            className="rounded-t-3xl p-4"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-white">{monthName}</Text>
                <Text className="text-white mt-1">
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
                <Text className="text-white mt-1 text-sm">Quoted</Text>
                <Text className="text-white mt-1 font-bold">
                  रू{formatAmount(totalEarnings.quoted)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-check" size={20} color="white" />
                <Text className="text-white mt-1 text-sm">Received</Text>
                <Text className="text-green-300 mt-1 font-bold">
                  रू{formatAmount(totalEarnings.received)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <MaterialCommunityIcons name="cash-plus" size={20} color="white" />
                <Text className="text-white mt-1 text-sm">Due</Text>
                <Text className="text-red-300 mt-1 font-bold">
                  रू{formatAmount(totalEarnings.due)}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <ScrollView className="flex-1 px-4 pt-4">
            {Array.isArray(events) && events.length > 0 ? events.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => onEventPress(event)}
                className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-bold text-gray-900">
                      {event.company?.name || `${event.clientContactPerson1}'s Work`}
                    </Text>
                    <Text className="text-gray-600 mt-1">{event.eventType}</Text>
                  </View>
                  <Text className="text-lg font-bold text-primary">रू{event.earnings}</Text>
                </View>

                <View className="mt-3 flex-row flex-wrap">
                  {event.workType.map((type, index) => (
                    <View
                      key={index}
                      className="mr-2 mb-2 rounded-full bg-red-100 px-3 py-1">
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
              </TouchableOpacity>
            )) : (
              <View className="flex-1 items-center justify-center py-8">
                <MaterialCommunityIcons name="calendar-blank" size={48} color="#E50914" />
                <Text className="text-gray-600 mt-4 text-center text-lg">No events found for this month</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
