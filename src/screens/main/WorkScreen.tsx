import AddWorkForm from 'components/forms/AddWorkForm';
import React from 'react';
import { View } from 'react-native';

const WorkScreen = ({ route }: { route: any }) => {
  const { isEditMode, details } = route.params || {};

  return (
    <View className="flex-1 bg-gray-50">
      <AddWorkForm isEditMode={!isEditMode} details={details} />
    </View>
  );
};

export default WorkScreen;
