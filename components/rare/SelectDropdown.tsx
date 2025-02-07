import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePostCompanies, useGetCompanies } from 'hooks/companies';
import { CompanyRequest } from 'types/companiesTypes';

interface SelectDropdownProps {
  data: string[];
  onSelect: (item: string) => void;
  defaultButtonText?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  data,
  onSelect,
  defaultButtonText = 'Select a company',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [isRenderDropdown, setIsRenderDropdown] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCompany, setNewCompany] = useState<CompanyRequest>({
    name: '',
    contactPerson: '',
    contactInfo: '',
  });

  const animation = useRef(new Animated.Value(0)).current;
  const { refetch: refetchCompanies } = useGetCompanies();

  const toggleDropdown = () => {
    const toValue = isOpen ? 0 : 1;
    if (!isOpen) {
      setIsRenderDropdown(true);
    }

    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      if (isOpen) {
        setIsRenderDropdown(false);
        setSearch('');
        setFilteredData(data);
      }
    });

    setIsOpen(!isOpen);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredData(data.filter((item) => item.toLowerCase().includes(text.toLowerCase())));
  };

  const handleSelect = (item: string) => {
    if (item === 'Add Company') {
      setIsModalVisible(true);
    } else {
      setSelectedItem(item);
      onSelect(item);
      toggleDropdown();
    }
  };

  const { mutate: postCompany } = usePostCompanies();

  const handleAddCompany = async () => {
    try {
      await postCompany(newCompany, {
        onSuccess: async () => {
          await refetchCompanies();
          setSelectedItem(newCompany.name);
          onSelect(newCompany.name);
          setIsModalVisible(false);
          setNewCompany({ name: '', contactPerson: '', contactInfo: '' });
        },
        onError: (error) => {
          console.error('Error adding company:', error);
          alert('Failed to add company. Please try again.');
        },
      });
    } catch (error) {
      console.error('Error in handleAddCompany:', error);
      alert('Failed to add company. Please try again.');
    }
  };

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // Reduced from 600 to 250
  });

  useEffect(() => {
    if (defaultButtonText && defaultButtonText !== 'Select a company') {
      setSelectedItem(defaultButtonText);
    }
  }, [defaultButtonText]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <View className="relative z-10 mb-4 w-full">
      {isOpen ? (
        <View className="flex-row items-center rounded-lg border border-slate-200 bg-white px-4 py-2">
          <TextInput
            className="mr-2 flex-1 text-base text-slate-900"
            placeholder="Search companies..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={toggleDropdown}>
            <Text className="text-lg text-slate-500">×</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="h-12 flex-row items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm"
          onPress={toggleDropdown}
          activeOpacity={0.9}>
          <Text className={`text-base ${selectedItem ? 'text-slate-900' : 'text-slate-500'}`}>
            {selectedItem || defaultButtonText}
          </Text>
          <Text className="text-slate-500">{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      )}

      {isRenderDropdown && (
        <>
          <Animated.View
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
            style={{ maxHeight, height: maxHeight }} // Ensure maxHeight is controlling the height
          >
            <ScrollView
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={true}
              bounces={false}
              className="max-h-[250px]">
              <TouchableOpacity
                className="flex-row items-center justify-center border-b border-slate-100 px-4 py-2 active:bg-slate-50"
                onPress={() => handleSelect('Add Company')}
                activeOpacity={0.7}>
                <MaterialCommunityIcons name="plus" size={20} />
                <Text className="ml-2 text-base">Add Company</Text>
              </TouchableOpacity>
              {filteredData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="border-b border-slate-100 px-4 py-2 active:bg-slate-50"
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}>
                  <Text className="text-base text-slate-900">{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </>
      )}

      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        transparent={true}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-4/5 rounded-lg bg-white p-6 shadow-lg">
            <Text className="mb-6 text-center text-xl font-bold">Add Company</Text>

            <TextInput
              value={newCompany.name}
              onChangeText={(text) => setNewCompany({ ...newCompany, name: text })}
              placeholder="Company Name"
              className="mb-4 rounded-md border border-slate-300 p-3"
            />

            <TextInput
              value={newCompany.contactPerson}
              onChangeText={(text) => setNewCompany({ ...newCompany, contactPerson: text })}
              placeholder="Contact Person"
              className="mb-4 rounded-md border border-slate-300 p-3"
            />

            <TextInput
              value={newCompany.contactInfo}
              onChangeText={(text) => setNewCompany({ ...newCompany, contactInfo: text })}
              placeholder="Contact Number"
              keyboardType="phone-pad"
              className="mb-6 rounded-md border border-slate-300 p-3"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="mb-4 rounded-xl bg-secondary/50 px-4 py-2">
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCompany}
                className="mb-4 rounded-xl bg-primary px-4 py-2">
                <Text className="text-white">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectDropdown;
