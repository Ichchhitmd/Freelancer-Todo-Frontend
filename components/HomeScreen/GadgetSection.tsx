import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const GadgetsSection: React.FC<{ freelancer: any }> = ({ freelancer }) => {
  return (
    <View className="my-4 rounded-xl bg-white p-6 shadow-md">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">My Gear</Text>
        <TouchableOpacity>
          <Text className="text-sm text-indigo-600">Manage</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {freelancer.gadgets.map((gadget: any, index: number) => (
          <View key={index} className="mr-6 w-64 rounded-xl bg-white p-6 shadow-lg">
            <View className="mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-200 to-indigo-300 p-6">
              <Text className="text-4xl text-indigo-700">📷</Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900">{gadget.name}</Text>
            <Text className="text-sm text-gray-500">{gadget.model}</Text>
            <Text className="mt-2 text-xl font-bold text-gray-900">रु{gadget.cost}</Text>
            <Text className="mt-2 text-xs text-gray-400">
              {new Date(gadget.purchaseDate).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default GadgetsSection;
