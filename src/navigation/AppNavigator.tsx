import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IncomeForm from 'components/forms/IncomeForm';
import ReimbursementForm from 'components/forms/ReimbursementForm';
import { useLogin } from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from 'redux/slices/authSlices';
import { RootState } from 'redux/store';

import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ChangePasswordScreen from '../screens/main/ChangePasswordScreen';
import CompanyDetails from '../screens/main/CompanyDetailsScreen';
import WorkScreen from '../screens/main/WorkScreen';

import HomeScreen from '~/screens/main/HomeScreen';
import ProfileScreen from '~/screens/main/ProfileScreen';
import DateDetailScreen from '~/screens/main/DateDetailScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
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
              },
              onError: () => {
                AsyncStorage.removeItem('cachedCredentials');
              },
              onSettled: () => setIsLoading(false),
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
    return <ActivityIndicator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ReimbursementForm" component={ReimbursementForm} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
          <Stack.Screen name="Add Income" component={IncomeForm} />
          <Stack.Screen name="Add Work" component={WorkScreen} />
          <Stack.Screen name="DateDetail" component={DateDetailScreen} />
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
