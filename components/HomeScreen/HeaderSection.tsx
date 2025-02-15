import React from 'react';
import { View, Text, Switch, Pressable, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getGreeting } from 'utils/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderSectionProps {
  user: string | undefined;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  onProfilePress?: () => void;
  remainingAmount: number | undefined;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  user,
  isActive,
  setIsActive,
  onProfilePress,
  remainingAmount,
}) => {
  const insets = useSafeAreaInsets();
  const greeting = getGreeting();

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const handleStatusChange = (newValue: boolean) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setIsActive(newValue);
  };

  return (
    <View className="bg-red-50" style={{ paddingTop: insets.top }}>
      <View className="pb-3 pt-2">
        <Text className="text-center text-xl font-semibold text-red-900">{greeting}</Text>
      </View>

      <View className="bg-white">
        <Pressable
          onPress={onProfilePress}
          className="flex-row items-center p-4"
          android_ripple={{ color: 'rgba(239, 68, 68, 0.1)' }}>
          <View className="mr-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <MaterialCommunityIcons name="account" size={32} color="#ef4444" />
            </View>
          </View>

          <View className="flex-1">
            <Text className="mb-1 text-sm font-semibold text-red-400">Welcome back,</Text>
            <Text className="text-2xl font-extrabold text-red-900" numberOfLines={1}>
              {user || 'Guest'}
            </Text>
            <Text className="text-lg font-semibold text-red-500">Due: ₹{remainingAmount || 0}</Text>
          </View>

          <Animated.View className="items-center" style={{ opacity: fadeAnim }}>
            <Switch
              value={isActive}
              onValueChange={handleStatusChange}
              trackColor={{ false: '#fecaca', true: '#22c55e' }}
              thumbColor={isActive ? '#22c55e' : '#f87171'}
              ios_backgroundColor="#fecaca"
              className="mb-2"
            />
            <View className={`rounded-full px-4 py-1.5 ${isActive ? 'bg-green-500' : 'bg-red-50'}`}>
              <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-red-400'}`}>
                {isActive ? 'AVAILABLE' : 'OFFLINE'}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      <View className="h-3 bg-red-50" />
    </View>
  );
};

export default HeaderSection;
