import { useNavigation, useRoute } from '@react-navigation/native';
import InputField from 'components/common/InputField';
import HorizontalSelector from 'components/rare/HorizontalScrollSelector';
import * as ImagePicker from 'expo-image-picker';
import { usePostReimbursement } from 'hooks/reimbursements';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  Platform,
} from 'react-native';

const EXPENSE_TYPES = [
  { id: 'TRAVEL', label: 'Travel', icon: 'car' },
  { id: 'FOOD', label: 'Food', icon: 'silverware-fork-knife' },
  { id: 'ACCOMMODATION', label: 'Accommodation', icon: 'bed' },
  { id: 'EQUIPMENT_RENTAL', label: 'Equipment Rental', icon: 'tools' },
  { id: 'OTHER', label: 'Other', icon: 'help-circle' },
];

const ReimbursementForm = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { mutate: postReimbursement } = usePostReimbursement();
  const { detailsId } = route.params as { detailsId: number };
  const [expense, setExpense] = useState({
    type: '',
    amount: '',
    description: '',
    image: null as string | null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setExpense({ ...expense, image: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    if (!expense.type || !expense.amount || !expense.description || !detailsId) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('type', expense.type);
    formData.append('description', expense.description);
    formData.append('amount', expense.amount);
    formData.append('eventId', detailsId.toString());

    if (expense.image) {
      const imageUri = expense.image;
      const fileType = imageUri.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';

      formData.append('image', {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    postReimbursement(formData, {
      onSuccess: () => {
        Alert.alert('Success', 'Reimbursement request submitted!');
        navigation.goBack();
      },
      onError: (error: any) => {
        const errorData = error?.response?.data;
        const errorMessage =
          errorData?.message ||
          error?.message ||
          'Failed to submit reimbursement. Please try again.';
        Alert.alert('Error', errorMessage);
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ backgroundColor: '#FF5A5F', paddingVertical: 55, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
            Reimbursement Form
          </Text>
          <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginTop: 8 }}>
            Submit your expenses for reimbursement
          </Text>
        </View>

        <View
          style={{
            marginTop: -40,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}>
          <HorizontalSelector
            label="Expense Type"
            icon="tag"
            options={EXPENSE_TYPES}
            value={expense.type}
            onChange={(type) => setExpense({ ...expense, type })}
          />

          <InputField
            placeholder="Enter amount"
            value={expense.amount}
            onChangeText={(text) => setExpense({ ...expense, amount: text })}
            keyboardType="numeric"
            icon="currency-inr"
          />

          <InputField
            placeholder="Enter description"
            value={expense.description}
            onChangeText={(text) => setExpense({ ...expense, description: text })}
            multiline
            icon="note-text"
          />

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 12,
              paddingVertical: 16,
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FAFAFA',
            }}
            onPress={pickImage}>
            <Text style={{ color: '#616161', fontSize: 16 }}>Choose Receipt Image</Text>
          </TouchableOpacity>

          {expense.image && (
            <Image
              source={{ uri: expense.image }}
              style={{ marginTop: 16, height: 200, width: '100%', borderRadius: 12 }}
            />
          )}

          <TouchableOpacity
            style={{
              marginTop: 32,
              backgroundColor: '#FF5A5F',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={handleSubmit}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(ReimbursementForm);
