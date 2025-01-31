import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';

const EditDateScreen = () => {
  const route = useRoute();
  const { dateDetails } = route.params;
  const [updatedDetails, setUpdatedDetails] = useState(dateDetails);

  const handleSave = () => {
    const storedDates = JSON.parse(localStorage.getItem('selectedDates') || '[]');
    const updatedDates = storedDates.map((item: any) =>
      item.date === updatedDetails.date ? updatedDetails : item
    );
    localStorage.setItem('selectedDates', JSON.stringify(updatedDates));
    // Optionally, navigate back or show a success message
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Edit Details for {updatedDetails.date}</Text>
      <TextInput
        value={updatedDetails.company}
        onChangeText={(text) => setUpdatedDetails({ ...updatedDetails, company: text })}
        placeholder="Company"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <TextInput
        value={updatedDetails.currentWork}
        onChangeText={(text) => setUpdatedDetails({ ...updatedDetails, currentWork: text })}
        placeholder="Current Work"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <TextInput
        value={updatedDetails.expenses}
        onChangeText={(text) => setUpdatedDetails({ ...updatedDetails, expenses: text })}
        placeholder="Expenses"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default EditDateScreen;
