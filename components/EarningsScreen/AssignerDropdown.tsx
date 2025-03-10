import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetAllAssigners } from 'hooks/assignee';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

interface AssignerDropdownProps {
  onSelectAssigner: (name: string | null) => void;
  activeAssigner: string | null;
}

const AssignerDropdown: React.FC<AssignerDropdownProps> = ({
  onSelectAssigner,
  activeAssigner,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: assigners } = useGetAllAssigners(user?.id || 0);

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className="border-gray-300 flex-row items-center rounded-lg border px-4 py-2">
        <Text className="text-gray-700 mr-2">{activeAssigner || 'Select Individual'}</Text>
        <MaterialCommunityIcons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="border-gray-300 absolute top-12 z-10 w-full rounded-lg border bg-white shadow-lg">
          <TouchableOpacity
            onPress={() => {
              onSelectAssigner(null);
              setIsOpen(false);
            }}
            className="border-gray-200 border-b px-4 py-2">
            <Text className="text-gray-700">All Individuals</Text>
          </TouchableOpacity>
          {assigners?.map((assigner) => (
            <TouchableOpacity
              key={assigner.name}
              onPress={() => {
                onSelectAssigner(assigner.name);
                setIsOpen(false);
              }}
              className="border-gray-200 border-b px-4 py-2">
              <Text className="text-gray-700">{assigner.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default AssignerDropdown;
