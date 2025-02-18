import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpenseForm from 'components/forms/ExpenseForm';
import ReimbursementForm from 'components/forms/ReimbursementForm';
import { useLogin } from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from 'redux/slices/authSlices';

import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AddGadgetScreen from '../screens/main/AddGadgetScreen';
import ChangePasswordScreen from '../screens/main/ChangePasswordScreen';
import CompanyDetails from '../screens/main/CompanyDetailsScreen';
import EarningDetailScreen from '../screens/main/EarningDetailScreen';
import EditGadgetScreen from '../screens/main/EditGadgetScreen';
import GadgetDetailsScreen from '../screens/main/GadgetDetailsScreen';
import WorkScreen from '../screens/main/WorkScreen';

import HomeScreen from '~/screens/main/HomeScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const { mutate: loginUser } = useLogin();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const cachedCredentials = await AsyncStorage.getItem('cachedCredentials');

        if (cachedCredentials) {
          const { phone, password } = JSON.parse(cachedCredentials);

          loginUser(
            { phone, password, role: 'freelancer' },
            {
              onSuccess: (data) => {
                dispatch(loginSuccess(data));
                setIsAuthenticated(true);
              },
              onError: () => {
                AsyncStorage.removeItem('cachedCredentials');
                setIsAuthenticated(false);
              },
              onSettled: () => {
                setIsLoading(false);
              },
            }
          );
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EarningDetailScreen" component={EarningDetailScreen} />
          <Stack.Screen name="GadgetDetails" component={GadgetDetailsScreen} />
          <Stack.Screen name="AddGadget" component={AddGadgetScreen} />
          <Stack.Screen name="EditGadget" component={EditGadgetScreen} />
          <Stack.Screen name="ReimbursementForm" component={ReimbursementForm} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
          <Stack.Screen name="Add Expenses" component={ExpenseForm} />
          <Stack.Screen name="Add Work" component={WorkScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
