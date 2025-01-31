import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const companies = [
  { name: 'Wedding Inc.', icon: 'camera-iris' },
  { name: 'PhotoPros', icon: 'camera-wireless' },
  { name: 'Elite Weddings', icon: 'camera-timer' },
  { name: 'Event Masters', icon: 'camera-enhance' },
  { name: 'Luxury Weddings', icon: 'camera-party' },
  { name: 'Creative Events', icon: 'camera-image' },
  { name: 'Dream Weddings', icon: 'camera-burst' },
  { name: 'Wedding Tech Nepal', icon: 'camera-burst' },

];

const CompanyDropdown: React.FC<{ value: string; onChange: (value: string) => void }> = ({
  value,
  onChange,
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  // Filter companies based on search text
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center">
        <MaterialCommunityIcons name="office-building" size={20} color="#ef4444" />
        <Text className="ml-2 font-medium text-gray-700">Company</Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
        onPress={() => setOpen(!open)}>
        {open ? (
          <TextInput
            className="flex-1 text-gray-700"
            placeholder="Search company..."
            value={search}
            onChangeText={setSearch}
          />
        ) : (
          <Text className={`text-gray-700 ${value ? 'font-medium' : 'text-gray-400'}`}>
            {value || 'Select a company'}
          </Text>
        )}
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#ef4444"
        />
      </TouchableOpacity>

      {open && (
        <View className="absolute top-full left-0 right-0 z-10 bg-white rounded-b-xl shadow-md">
          {/* ScrollView with fixed maxHeight */}
          <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
            <FlatList
              data={filteredCompanies.slice(0, 3)} // Optionally adjust the number of items to show
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-row items-center p-4 border-b border-gray-100 ${
                    value === item.name ? 'bg-red-50' : ''
                  }`}
                  onPress={() => {
                    onChange(item.name);
                    setSearch(''); // Clear search when a company is selected
                    setOpen(false); // Close dropdown
                  }}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={value === item.name ? '#ef4444' : '#9ca3af'}
                  />
                  <Text
                    className={`ml-3 flex-1 ${value === item.name ? 'font-medium text-red-500' : 'text-gray-700'}`}>
                    {item.name}
                  </Text>
                  {value === item.name && (
                    <MaterialCommunityIcons name="check-circle" size={20} color="#ef4444" />
                  )}
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CompanyDropdown;
