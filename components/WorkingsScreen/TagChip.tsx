import React from 'react';
import { View, Text } from 'react-native';

interface TagChipProps {
  text: string;
  colors?: string;
}

const eventTypeColors: { [key: string]: string } = {
  MEHENDI: 'bg-green-600',
  WEDDING: 'bg-red-600',
  RECEPTION: 'bg-pink-600',
  OTHER: 'bg-gray-600',
  ENGAGEMENT: 'bg-blue-600',
  PREWEDDING: 'bg-purple-600',
};

const sideColors: { [key: string]: string } = {
  GROOM: 'bg-blue-400',
  BRIDE: 'bg-red-400',
};

const workTypeColors: { [key: string]: string } = {
  VIDEO: 'bg-red-500',
  PHOTO: 'bg-blue-500',
  DRONE: 'bg-green-500',
  OTHER: 'bg-gray-600',
};

export const TagChip = ({ colors, text }: TagChipProps) => {
  const color = eventTypeColors[text.toUpperCase()] || 'bg-gray-600';
  const sideColor = sideColors[text.toUpperCase()] || 'bg-gray-600';
  const workColor = workTypeColors[text.toUpperCase()] || 'bg-gray-600';

  return (
    <View
      className={`${color} ${colors} ${sideColor} ${workColor} mb-2 mr-2 flex-row items-center rounded-lg px-3 py-1.5 shadow-sm`}>
      <Text className="text-sm font-medium text-white">{text}</Text>
    </View>
  );
};
