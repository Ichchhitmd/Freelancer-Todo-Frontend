import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AssignerDropdownProps {
  data: Array<{
    name: string;
    contactNumber: string;
    totalEarnings: number;
    totalPaid: number;
    advancePaymentBalance: number;
  }>;
  onSelect: (item: string) => void;
  defaultButtonText?: string;
}

const AssignerDropdown: React.FC<AssignerDropdownProps> = ({
  data,
  onSelect,
  defaultButtonText = 'Select an Individual',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [isRenderDropdown, setIsRenderDropdown] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

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
    setFilteredData(data.filter((item) => item.name.toLowerCase().includes(text.toLowerCase())));
  };

  const handleSelect = (item: { name: string }) => {
    setSelectedItem(item.name);
    onSelect(item.name);
    toggleDropdown();
  };

  useEffect(() => {
    if (defaultButtonText && defaultButtonText !== 'Select an Individual') {
      setSelectedItem(defaultButtonText);
    }
  }, [defaultButtonText]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={{ marginBottom: 15 }}>
      <TouchableOpacity
        onPress={toggleDropdown}
        activeOpacity={0.8}
        style={{
          backgroundColor: 'white',
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#ddd',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        <Text style={{ color: selectedItem ? '#000' : '#666', fontSize: 16 }}>
          {selectedItem || defaultButtonText}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      {isRenderDropdown && (
        <Animated.View
          style={{
            height: dropdownHeight,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            marginTop: 5,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              backgroundColor: '#f9f9f9',
            }}>
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={search}
              onChangeText={handleSearch}
              placeholder="Search..."
              placeholderTextColor="#aaa"
              style={{
                flex: 1,
                paddingVertical: 8,
                fontSize: 14,
                borderBottomWidth: 0,
                color: '#000',
              }}
            />
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: index !== filteredData.length - 1 ? 1 : 0,
                    borderBottomColor: '#eee',
                    backgroundColor: selectedItem === item.name ? '#f1faff' : 'white',
                  }}>
                  <Text style={{ fontSize: 16, color: '#333' }}>{item.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ padding: 15, alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>No results found</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

export default AssignerDropdown;
