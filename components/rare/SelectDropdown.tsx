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
        },
      });
    } catch (error) {
      console.error('Failed to add company. Please try again.', error);
    }
  };

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
            <Text className="z-30 text-4xl text-slate-500">×</Text>
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
          <Text className="h-4 w-4 text-slate-500">{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      )}

      {isRenderDropdown && (
        <View className="rounded-lg border border-secondary bg-white">
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            style={{ maxHeight: 120 }}
            className="border-gray-200 border-t">
            <TouchableOpacity
              className="border-gray-200 border-b bg-white px-4 py-3"
              onPress={() => handleSelect('Add Company')}
              activeOpacity={0.7}>
              <Text className="text-base text-red-500">+ Add Company</Text>
            </TouchableOpacity>
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(item)}
                className={`border-b border-secondary/5 px-4 py-3 ${
                  selectedItem === item ? 'bg-red-500' : 'bg-white'
                }`}>
                <Text
                  className={`text-base ${selectedItem === item ? 'text-white' : 'text-gray-700'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
