import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from './useAuth';
import { loginSuccess } from 'redux/slices/authSlices';

export const useAutoLogin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mutate: loginUser } = useLogin();

  useEffect(() => {
    const checkCachedCredentials = async () => {
      try {
        const cachedCredentials = await AsyncStorage.getItem('cachedCredentials');

        if (cachedCredentials) {
          const { phone, password } = JSON.parse(cachedCredentials);

          loginUser(
            { phone, password, role: 'freelancer' },
            {
              onSuccess: (data) => {
                dispatch(loginSuccess(data));
                navigation.navigate('MainTabs');
              },
              onError: () => {
                // If login fails with cached credentials, remove them
                AsyncStorage.removeItem('cachedCredentials');
              },
            }
          );
        }
      } catch (error) {
        console.error('Error checking cached credentials:', error);
      }
    };

    checkCachedCredentials();
  }, []);
};
