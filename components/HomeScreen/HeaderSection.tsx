import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import getInitials from 'utils/initialsName';
import { getGreeting } from 'utils/utils';

interface HeaderSectionProps {
  advanceAmount: number | undefined;
  remainingAmount: number | undefined;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ advanceAmount, remainingAmount }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const greeting = getGreeting();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const checkBalance = (remainingAmount || 0) - (advanceAmount || 0);

  return (
    <View className="bg-red-50" style={{ paddingTop: insets.top }}>
      <View className="pb-3 pt-2">
        <Text className="text-center text-xl font-semibold text-red-900">{greeting}</Text>
      </View>

      <View className="bg-white">
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          className="flex-row items-center p-4"
          android_ripple={{ color: 'rgba(239, 68, 68, 0.1)' }}>
          <View className="mr-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-red-400">
            {user?.photo ? (
                <Image
                  source={{ uri: `${process.env.UPLOADS_BASE_URL}/${user.photo}` }}
                  className="h-20 w-20 rounded-full border-4 border-primary/35"
                  onError={() => dispatch(setError('Failed to load profile image'))}
                />
            ) : (
              <Text className="text-3xl font-bold text-white">{getInitials(user?.name)}</Text>
            )}
            </View>
          </View>

          <View className="flex-1">
            <Text className="mb-1 text-sm font-semibold text-red-400">Welcome back,</Text>
            <Text className="text-2xl font-extrabold text-red-900" numberOfLines={1}>
              {user?.name || 'Guest'}
            </Text>
            {checkBalance > 0 ? (
              <Text className="text-lg font-semibold text-green-500">Due: ₹{checkBalance}</Text>
            ) : (
              <Text className="text-lg font-semibold text-red-500">
                Advance: ₹{Math.abs(checkBalance)}
              </Text>
            )}
          </View>
        </Pressable>
      </View>

      <View className="h-3 bg-red-50" />
    </View>
  );
};

export default HeaderSection;
