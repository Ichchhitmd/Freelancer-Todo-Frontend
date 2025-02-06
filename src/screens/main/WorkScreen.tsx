import AddWorkForm from 'components/forms/AddWorkForm';
import React from 'react';
import { View } from 'react-native';

const WorkScreen = () => {
  return (
    <View className="bg-gray-50 flex-1">
      <AddWorkForm />
    </View>
  );
};

export default WorkScreen;
