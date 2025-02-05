import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  SafeAreaView,
  TextInputProps,
  StyleProp,
  ViewStyle
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { changePassword } from '../../../helper/authRequest';

// Local InputField component
export interface InputFieldRef {
  focus: () => void;
  blur: () => void;
}

export interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: string;
  containerStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
  nextInputRef?: React.RefObject<InputFieldRef>;
  onSubmitEditing?: () => void;
}

export const InputField = forwardRef<InputFieldRef, InputFieldProps>(({
  label,
  icon,
  containerStyle,
  iconColor = '#E50914',
  nextInputRef,
  onSubmitEditing,
  secureTextEntry,
  ...rest
}, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    }
  }));

  const handleSubmitEditing = () => {
    if (nextInputRef && nextInputRef.current) {
      nextInputRef.current.focus();
    } else if (onSubmitEditing) {
      onSubmitEditing();
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={[
        {
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: isFocused ? '#E50914' : '#E5E7EB',
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16
        },
        containerStyle
      ]}
    >
      {icon && (
        <MaterialCommunityIcons 
          name={icon} 
          size={24} 
          color={isFocused ? '#E50914' : iconColor} 
          style={{ marginRight: 16 }}
        />
      )}
      <View style={{ flex: 1 }}>
        {label && (
          <Text 
            style={{ 
              color: isFocused ? '#E50914' : '#6B7280', 
              fontSize: 12, 
              marginBottom: 4 
            }}
          >
            {label}
          </Text>
        )}
        <TextInput
          ref={inputRef}
          placeholderTextColor="#9CA3AF"
          style={{ 
            color: '#111827', 
            fontSize: 16, 
            fontWeight: 'bold',
            padding: 0
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType={nextInputRef ? 'next' : 'done'}
          blurOnSubmit={!nextInputRef}
          onSubmitEditing={handleSubmitEditing}
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
          autoCapitalize="none"
          {...rest}
        />
      </View>
    </TouchableOpacity>
  );
});

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentPasswordRef = useRef<InputFieldRef>(null);
  const newPasswordRef = useRef<InputFieldRef>(null);
  const confirmPasswordRef = useRef<InputFieldRef>(null);

  const handleChangePassword = async () => {
    // Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword
      });

      // Show success alert
      Alert.alert('Success', 'Password changed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <ScrollView className="flex-1">
        <View className="bg-red-500 px-4 py-10">
          <Text className="pt-5 text-center text-3xl font-bold text-white">Change Password</Text>
          <Text className="mt-2 text-center text-base text-red-100">
            Secure your account with a new password
          </Text>
        </View>

        <View className="-mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="space-y-4 px-2 mt-4">
            <InputField 
              ref={currentPasswordRef}
              icon="lock" 
              label="Current Password" 
              placeholder="Enter current password" 
              value={currentPassword} 
              onChangeText={setCurrentPassword} 
              secureTextEntry
              nextInputRef={newPasswordRef}
            />

            <InputField 
              ref={newPasswordRef}
              icon="lock-plus" 
              label="New Password" 
              placeholder="Enter new password" 
              value={newPassword} 
              onChangeText={setNewPassword} 
              secureTextEntry
              nextInputRef={confirmPasswordRef}
            />

            <InputField 
              ref={confirmPasswordRef}
              icon="lock-check" 
              label="Confirm New Password" 
              placeholder="Confirm new password" 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              secureTextEntry
              onSubmitEditing={handleChangePassword}
            />

            <TouchableOpacity
              onPress={handleChangePassword}
              className={`rounded-xl p-4 flex-row items-center justify-center ${isLoading ? 'bg-gray-400' : 'bg-[#E50914]'}`}
              disabled={isLoading}
            >
              <MaterialCommunityIcons 
                name="lock-reset" 
                size={24} 
                color="white" 
                className="mr-2" 
              />
              <Text className="text-white text-lg font-bold">
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}