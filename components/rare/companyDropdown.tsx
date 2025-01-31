import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const companies = ['Wedding Inc.', 'PhotoPros', 'Elite Weddings', 'Event Masters'];

const CompanyDropdown: React.FC<{ value: string; onChange: (value: string) => void }> = ({
  value,
  onChange,
}) => {
  return (
    <View className="mb-4">
      <Text className="mb-1 font-medium text-gray-700">Company</Text>
      {companies.map((company, index) => (
        <TouchableOpacity
          key={index}
          className={`rounded-lg p-4 ${value === company ? 'bg-indigo-100' : 'bg-gray-100'} mb-2`}
          onPress={() => onChange(company)}>
          <Text className="text-gray-900">{company}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CompanyDropdown;
