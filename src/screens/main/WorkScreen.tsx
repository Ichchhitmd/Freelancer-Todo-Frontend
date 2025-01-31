import AddWorkForm from 'components/forms/AddWorkForm';
import React from 'react';
import { View } from 'react-native';

const WorkScreen = () => {
  return (
    <View className="flex-1 justify-center bg-gray-50 pt-6 ">
      <AddWorkForm />
    </View>
  );
};

export default WorkScreen;
