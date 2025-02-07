import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import './global.css';
import EarningsScreen from '~/screens/main/EarningsScreen';
import WorkScreen from '~/screens/main/WorkScreen';
import WorkingScreen from '~/screens/main/WorkingScreen';
import EarningDetailScreen from '~/screens/main/EarningDetailScreen';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DateDetails from '~/screens/main/DateDetailScreen';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { useEffect, useState } from 'react';
import { requestNotificationPermission } from 'utils/notification';
import GadgetDetailsScreen from '~/screens/main/GadgetDetailsScreen';
import AddGadgetScreen from '~/screens/main/AddGadgetScreen';
import EditGadgetScreen from '~/screens/main/EditGadgetScreen';
import ReimbursementForm from 'components/forms/ReimbursementForm';
import ChangePasswordScreen from '~/screens/main/ChangePasswordScreen';
import CompanyDetails from '~/screens/main/CompanyDetailsScreen';
import PlusScreen from '~/screens/main/PlusScreen';
import ExpenseForm from 'components/forms/ExpenseForm';

const Stack = createNativeStackNavigator();
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
        <Tab.Screen name="Workings" component={WorkingScreen} options={{ tabBarLabel: 'My Works' }} />
        <Tab.Screen
          name="Plus"
          component={PlusScreen}
          options={{
            tabBarLabel: '',
            tabBarButton: () => (
              <TouchableOpacity
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
                }}
                onPress={() => setModalVisible(true)}
              >
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

<Modal
  transparent={true}
  visible={modalVisible}
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View className="flex-1 justify-center items-center bg-black/50">
      <View
        className="relative z-10 flex-row gap-2 items-center"
      >
        <TouchableOpacity onPress={() => navigation.navigate('Add Work')}>
          <MaterialIcons
            name="work"
            size={30}
            color="white"
            className="p-3.5 rounded-full bg-red-500 absolute right-5 bottom-[-360] text-white"
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
</Modal>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="EarningDetailScreen" component={EarningDetailScreen} />
            <Stack.Screen name="GadgetDetails" component={GadgetDetailsScreen} />
            <Stack.Screen name="AddGadget" component={AddGadgetScreen} />
            <Stack.Screen name="EditGadget" component={EditGadgetScreen} />
            <Stack.Screen name="ReimbursementForm" component={ReimbursementForm} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
            <Stack.Screen name="Add Expenses" component={ExpenseForm} />
            <Stack.Screen name="Add Work" component={WorkScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
}
