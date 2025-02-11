import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInputProps,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Gadget {
  id?: string;
  name: string;
  type: 'camera' | 'lens' | 'drone' | 'laptop';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
}

interface InputFieldRef {
  focus: () => void;
  blur: () => void;
}

interface InputFieldProps extends TextInputProps {
  label: string;
  icon: string;
  containerStyle?: StyleProp<ViewStyle>;
  nextInputRef?: React.RefObject<InputFieldRef>;
  onSubmitEditing?: () => void;
}

const InputField = forwardRef<InputFieldRef, InputFieldProps>(
  (
    { label, icon, value, onChangeText, containerStyle, nextInputRef, onSubmitEditing, ...rest },
    ref
  ) => {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
    }));

    const handleSubmitEditing = () => {
      if (nextInputRef && nextInputRef.current) {
        nextInputRef.current.focus();
      } else if (onSubmitEditing) {
        onSubmitEditing();
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        className={`mb-4 flex-row items-center rounded-xl border bg-white px-4 py-4 ${
          isFocused ? 'border-red-500' : 'border-gray-200'
        }`}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={isFocused ? '#E50914' : '#666'}
          className="mr-4"
        />
        <View className="flex-1">
          <Text className={`mb-1 text-xs ${isFocused ? 'text-red-500' : 'text-gray-500'}`}>
            {label}
          </Text>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#9CA3AF"
            className="text-gray-900 p-0 text-base"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType={nextInputRef ? 'next' : 'done'}
            blurOnSubmit={false}
            onSubmitEditing={handleSubmitEditing}
            autoCorrect={false}
            autoCapitalize="none"
            enablesReturnKeyAutomatically
            {...rest}
          />
        </View>
      </TouchableOpacity>
    );
  }
);

export default function UpdateGadgetScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { gadget: initialGadget } = route.params as { gadget: Gadget };

  const [gadget, setGadget] = useState<Gadget>(initialGadget);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const gadgetTypes: Gadget['type'][] = ['camera', 'lens', 'drone', 'laptop'];

  const nameInputRef = useRef<InputFieldRef>(null);
  const brandInputRef = useRef<InputFieldRef>(null);
  const modelInputRef = useRef<InputFieldRef>(null);
  const serialInputRef = useRef<InputFieldRef>(null);

  const handleInputChange = (key: keyof Gadget, value: string) => {
    setGadget((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setGadget((prev) => ({
      ...prev,
      purchaseDate: currentDate.toISOString().split('T')[0],
    }));
  };

  const validateForm = () => {
    const { name, brand, model, serialNumber } = gadget;
    if (!name || !brand || !model || !serialNumber) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleUpdateGadget = () => {
    if (validateForm()) {
      // TODO: Implement actual update logic (e.g., API call or Redux action)
      Alert.alert('Gadget Updated', 'Your gadget has been successfully updated', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  const handleDeleteGadget = () => {
    Alert.alert('Delete Gadget', 'Are you sure you want to delete this gadget?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // TODO: Implement actual delete logic
          navigation.goBack();
        },
      },
    ]);
  };

  const getIconForType = (type: Gadget['type']) => {
    const iconMap = {
      laptop: 'laptop',
      camera: 'camera',
      lens: 'camera-iris',
      drone: 'drone',
    };
    return iconMap[type];
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            className="flex-1">
            <View className="bg-red-500 p-5 pt-10">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute left-5 top-10 z-10">
                <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-center text-2xl font-bold text-white">Update Gadget</Text>
            </View>

            <View className="p-5">
              <InputField
                ref={nameInputRef}
                label="Gadget Name"
                value={gadget.name}
                onChangeText={(text) => handleInputChange('name', text)}
                icon="devices"
                nextInputRef={brandInputRef}
              />

              <View className="mb-5">
                <Text className="text-gray-500 mb-2">Gadget Type</Text>
                <View className="flex-row justify-between">
                  {gadgetTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => handleInputChange('type', type)}
                      className={`
                        flex-row items-center rounded-lg p-3
                        ${gadget.type === type ? 'bg-red-500' : 'bg-gray-100'}
                      `}>
                      <MaterialCommunityIcons
                        name={getIconForType(type)}
                        size={20}
                        color={gadget.type === type ? 'white' : '#666'}
                        className="mr-2"
                      />
                      <Text
                        className={`
                          capitalize
                          ${gadget.type === type ? 'text-white' : 'text-gray-700'}
                        `}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <InputField
                ref={brandInputRef}
                label="Brand"
                value={gadget.brand}
                onChangeText={(text) => handleInputChange('brand', text)}
                icon="tag"
                nextInputRef={modelInputRef}
              />

              <InputField
                ref={modelInputRef}
                label="Model"
                value={gadget.model}
                onChangeText={(text) => handleInputChange('model', text)}
                icon="tag-text"
                nextInputRef={serialInputRef}
              />

              <InputField
                ref={serialInputRef}
                label="Serial Number"
                value={gadget.serialNumber}
                onChangeText={(text) => handleInputChange('serialNumber', text)}
                icon="barcode"
              />

              <View className="mb-5">
                <Text className="text-gray-500 mb-2">Purchase Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="border-gray-200 flex-row items-center rounded-xl border bg-white p-3">
                  <MaterialCommunityIcons name="calendar" size={20} color="#666" className="mr-2" />
                  <Text>{gadget.purchaseDate}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(gadget.purchaseDate)}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View className="mb-5 flex-row justify-between">
                <TouchableOpacity
                  onPress={handleUpdateGadget}
                  className="mr-2 flex-1 items-center justify-center rounded-xl bg-red-500 p-3">
                  <MaterialCommunityIcons name="pencil" size={24} color="white" className="mr-2" />
                  <Text className="text-base font-bold text-white">Update Gadget</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDeleteGadget}
                  className="bg-gray-200 ml-2 flex-1 items-center justify-center rounded-xl p-3">
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color="#E50914"
                    className="mr-2"
                  />
                  <Text className="text-base font-bold text-red-500">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
