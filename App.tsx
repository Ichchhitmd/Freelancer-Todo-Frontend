import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';

import './global.css';
import EarningsScreen from '~/screens/main/EarningsScreen';
import WorkScreen from '~/screens/main/WorkScreen';
import EarningDetailScreen from '~/screens/main/EarningDetailScreen';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DateDetails from '~/screens/main/DateDetailScreen';
import ChangePasswordScreen from '~/screens/main/ChangePasswordScreen';
import GadgetDetailsScreen from '~/screens/main/GadgetDetailsScreen';
import AddGadgetScreen from '~/screens/main/AddGadgetScreen';
import EditGadgetScreen from '~/screens/main/EditGadgetScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { paddingBottom: 10, bottom: 0 },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Add Work') {
            iconName = focused ? 'work' : 'work-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'attach-money' : 'attach-money';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add Work" component={WorkScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="ChangePassword" component={ChangePasswordScreen} 
      options={{
          tabBarItemStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="DateDetails"
        component={DateDetails}
        options={{
          tabBarItemStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
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
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
}
