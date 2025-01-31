import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

const DateDetails: React.FC = () => {
  const route = useRoute();
  const { details } = route.params;

  return (
    <ScrollView className="p-6 bg-white flex-1">
      <Text className="text-2xl font-bold text-gray-900">Work Details</Text>
      
      <Text className="text-lg mt-4">
        <Text className="font-semibold">Company:</Text> {details.company}
      </Text>
      <Text className="text-lg mt-2">
        <Text className="font-semibold">Event:</Text> {details.eventName}
      </Text>
      <Text className="text-lg mt-2">
        <Text className="font-semibold">Bride/Groom:</Text> {details.brideGroom}
      </Text>
      <Text className="text-lg mt-2">
        <Text className="font-semibold">Estimated Earning:</Text> रु {details.estimatedEarning}
      </Text>
      <Text className="text-lg mt-2">
        <Text className="font-semibold">Description:</Text> {details.description}
      </Text>
    </ScrollView>
  );
};

export default DateDetails;
