import AddWorkForm from 'components/forms/AddWorkForm';
import React from 'react';
import { View } from 'react-native';

const WorkScreen = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <AddWorkForm isEditMode={false} />
    </View>
  );
};

export default WorkScreen;
