import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useGetCompanies } from 'hooks/companies';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface CompanyDropdownProps {
  onSelectCompany: (companyId: number | null) => void;
  activeCompany: string | null;
}

const CompanyDropdown = ({ onSelectCompany, activeCompany }: CompanyDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<typeof companies>([]);
  const [isRenderDropdown, setIsRenderDropdown] = useState(false);
  const { data: companies } = useGetCompanies();
  const screenWidth = Dimensions.get('window').width;

  const handleCompanySelect = (companyName: string, companyId: number | null) => {
    onSelectCompany(companyId);
    toggleDropdown();
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      setIsRenderDropdown(true);
    } else {
      setTimeout(() => {
        setIsRenderDropdown(false);
        setSearch('');
        setFilteredCompanies(companies || []);
      }, 200);
    }
    setIsOpen(!isOpen);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered =
      companies?.filter((company) => company.name.toLowerCase().includes(text.toLowerCase())) || [];
    setFilteredCompanies(filtered);
  };

  useEffect(() => {
    setFilteredCompanies(companies || []);
  }, [companies]);

  return (
    <View className="relative z-50" style={{ minWidth: screenWidth * 0.5 }}>
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
          onPress={toggleDropdown}
          className="flex-row items-center justify-between rounded-xl bg-white p-3 shadow-sm">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="office-building"
              size={20}
              color="#E50914"
              className="mr-2"
            />
            <Text className="text-gray-800 text-base font-medium">
              {activeCompany || 'All Companies'}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#E50914"
          />
        </TouchableOpacity>
      )}

      {isRenderDropdown && (
        <>
          <View
            className="absolute top-14 w-full rounded-xl bg-white shadow-lg"
            style={{ maxHeight: 300 }}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ flexGrow: 0 }}
              style={{ maxHeight: 300 }}
              scrollEventThrottle={16}
              keyboardShouldPersistTaps="handled">
              <TouchableOpacity
                onPress={() => handleCompanySelect('All Companies', null)}
                className={`border-gray-100 border-b p-4 ${
                  activeCompany === null ? 'bg-primary/5' : ''
                }`}>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="office-building-outline"
                    size={20}
                    color={activeCompany === null ? '#E50914' : '#6B7280'}
                    className="mr-2"
                  />
                  <Text
                    className={`text-base ${
                      activeCompany === null ? 'font-medium text-primary' : 'text-gray-600'
                    }`}>
                    All Companies
                  </Text>
                </View>
              </TouchableOpacity>

              {filteredCompanies?.map((company) => (
                <TouchableOpacity
                  key={company.id}
                  onPress={() => handleCompanySelect(company.name, company.id)}
                  className={`border-gray-100 border-b p-4 ${
                    activeCompany === company.name ? 'bg-primary/5' : ''
                  }`}>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="office-building"
                      size={20}
                      color={activeCompany === company.name ? '#E50914' : '#6B7280'}
                      className="mr-2"
                    />
                    <Text
                      className={`text-base ${
                        activeCompany === company.name
                          ? 'font-medium text-primary'
                          : 'text-gray-600'
                      }`}>
                      {company.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

export default CompanyDropdown;
