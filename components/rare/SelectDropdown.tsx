import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

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
  const animation = useRef(new Animated.Value(0)).current;
  const [isRenderDropdown, setIsRenderDropdown] = useState(false);
  const { height: screenHeight } = Dimensions.get('window');

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
    setSelectedItem(item);
    onSelect(item);
    toggleDropdown();
  };

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });
  useEffect(() => {
    if (defaultButtonText && defaultButtonText !== 'Select a company') {
      setSelectedItem(defaultButtonText);
    }
  }, [defaultButtonText]);

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
          className="h-16 flex-row items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
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
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View className="absolute inset-0 z-10 bg-black/5" style={{ height: screenHeight }} />
          </TouchableWithoutFeedback>

          <Animated.View
            className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
            style={{ maxHeight }}>
            <ScrollView keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
              {filteredData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="border-b border-slate-100 px-4 py-3 active:bg-slate-50"
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}>
                  <Text className="text-base text-slate-900">{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default SelectDropdown;
