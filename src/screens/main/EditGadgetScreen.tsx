import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import { editGadget } from 'redux/slices/gadgetSlices';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

export default function EditGadgetScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { gadget } = route.params as { gadget: any };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: gadget.name,
    model: gadget.model,
    cost: gadget.cost.toString(),
    purchaseDate: new Date(gadget.purchaseDate)
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ ...prev, purchaseDate: selectedDate }));
    }
  };

  const handleSubmitEditing = async () => {
    try {
      if (!formData.name.trim() || !formData.model.trim() || !formData.cost.trim()) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      const cost = parseFloat(formData.cost);
      if (isNaN(cost) || cost <= 0) {
        Alert.alert('Error', 'Please enter a valid cost');
        return;
      }

      setIsSubmitting(true);

      const updatedGadget = {
        ...gadget,
        name: formData.name.trim(),
        model: formData.model.trim(),
        cost: cost,
        purchaseDate: formData.purchaseDate.toISOString()
      };

      await dispatch(editGadget({ id: gadget.id, data: updatedGadget })).unwrap();
      Alert.alert('Success', 'Gadget updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update gadget'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputField = ({ 
    label, 
    value, 
    onChangeText, 
    icon,
    keyboardType = 'default',
    editable = true
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    icon: string;
    keyboardType?: 'default' | 'numeric';
    editable?: boolean;
  }) => (
    <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <View className="flex-row items-center">
        <View className="bg-red-50 p-2 rounded-lg mr-3">
          <MaterialCommunityIcons 
            name={icon as any} 
            size={24} 
            color="#E50914" 
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-600 text-sm mb-1">{label}</Text>
          <TextInput
            className="text-gray-900 text-lg"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            editable={editable}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="absolute top-0 left-0 right-0 z-50 bg-red-500 shadow-sm">
        <View className="p-6 pt-16">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="absolute left-6 top-16 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          <Text className="text-center text-2xl font-bold text-white">
            Edit Gadget
          </Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingTop: 100 }} // Add padding to account for sticky header
      >
        {/* Content */}
        <View className="p-6">
          {/* Icon */}
          <View className="bg-red-100 p-6 rounded-full self-center mb-8 shadow-lg">
            <MaterialCommunityIcons 
              name="devices" 
              size={64} 
              color="#E50914" 
            />
          </View>

          {/* Form Fields */}
          {renderInputField({
            label: 'Name',
            value: formData.name,
            onChangeText: (text) => setFormData(prev => ({ ...prev, name: text })),
            icon: 'tag'
          })}

          {renderInputField({
            label: 'Model',
            value: formData.model,
            onChangeText: (text) => setFormData(prev => ({ ...prev, model: text })),
            icon: 'information'
          })}

          {renderInputField({
            label: 'Cost',
            value: formData.cost,
            onChangeText: (text) => setFormData(prev => ({ ...prev, cost: text })),
            icon: 'cash',
            keyboardType: 'numeric'
          })}

          {/* Date Picker */}
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-4"
          >
            <View className="flex-row items-center">
              <View className="bg-red-50 p-2 rounded-lg mr-3">
                <MaterialCommunityIcons 
                  name="calendar" 
                  size={24} 
                  color="#E50914" 
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm mb-1">Purchase Date</Text>
                <Text className="text-gray-900 text-lg">
                  {formData.purchaseDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.purchaseDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Submit Button */}
          <View className="mt-8">
            <TouchableOpacity 
              onPress={handleSubmitEditing}
              disabled={isSubmitting}
              className="bg-red-500 p-4 rounded-xl flex-row items-center justify-center shadow-sm"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons 
                    name="content-save" 
                    size={24} 
                    color="white" 
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-bold text-lg">Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
