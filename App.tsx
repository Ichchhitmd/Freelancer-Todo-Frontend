import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './src/screens/main/HomeScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import './global.css';
import EarningsScreen from '~/screens/main/EarningsScreen';
import WorkScreen from '~/screens/main/WorkScreen';
import WorkingScreen from '~/screens/main/WorkingScreen';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DateDetails from '~/screens/main/DateDetailScreen';
import { TouchableOpacity, View } from 'react-native';
import { NavigationProp, ParamListBase, NavigationContainer } from '@react-navigation/native';

import { useEffect, useState } from 'react';
import { requestNotificationPermission } from 'utils/notification';

import { useFonts } from 'expo-font';

import { AppNavigator } from '~/navigation/AppNavigator';

enableScreens();

const Tab = createBottomTabNavigator();

function TabNavigator({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            height: 70,
            backgroundColor: '#fef2f2',
            borderRadius: 15,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 5 },
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === 'Plus') {
              return (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    backgroundColor: 'red',
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                  }}>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <MaterialCommunityIcons name="plus" size={32} color="white" />
                  </TouchableOpacity>
                </View>
              );
            }

            const iconName = (() => {
              switch (route.name) {
                case 'Home':
                  return focused ? 'home' : 'home-outline';
                case 'Add Work':
                  return focused ? 'work' : 'work-outline';
                case 'Workings':
                  return focused ? 'briefcase' : 'briefcase-outline';
                case 'Earnings':
                  return focused ? 'currency-usd' : 'cash-multiple';
                case 'Profile':
                  return focused ? 'account' : 'account-outline';
                default:
                  return 'help-outline';
              }
            })() as keyof typeof MaterialCommunityIcons.glyphMap;

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            paddingBottom: 5,
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen
          name="Workings"
          component={WorkingScreen}
          options={{ tabBarLabel: 'My Works' }}
        />
        <Tab.Screen
          name="Add Work"
          component={WorkScreen}
          options={{
            tabBarLabel: '',
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Add Work')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 7,
                  backgroundColor: 'red',
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }}>
                <MaterialCommunityIcons name="plus" size={32} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Earnings"
          component={EarningsScreen}
          options={{ tabBarLabel: 'Earnings' }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
        <Tab.Screen
          name="DateDetails"
          component={DateDetails}
          options={{
            tabBarItemStyle: { display: 'none' },
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>

      {/* <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="relative z-10 flex-row items-center gap-2">
              <TouchableOpacity onPress={() => navigation.navigate('Add Work')}>
                <MaterialIcons
                  name="work"
                  size={30}
                  color="white"
                  className="absolute bottom-[-360] right-5 rounded-full bg-red-500 p-3.5 text-white"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Add Expenses')}>
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={66}
                  color="#ef4444"
                  className="absolute bottom-[-365]"
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal> */}
    </View>
  );
}

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
}
