import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

import EarningsScreen from '../screens/main/EarningsScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import WorkingScreen from '../screens/main/WorkingScreen';

import DateDetails from '~/screens/main/DateDetailScreen';

const Tab = createBottomTabNavigator();

const CustomModal = ({
  visible,
  onClose,
  navigation,
}: {
  visible: boolean;
  onClose: () => void;
  navigation: NavigationProp<ParamListBase>;
}) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#ef4444" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onClose();
            navigation.navigate('Add Work');
          }}
          style={styles.modalOption}>
          <MaterialCommunityIcons name="briefcase-plus" size={24} color="#ef4444" />
          <Text style={styles.modalOptionText}>Add Work</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onClose();
            navigation.navigate('Add Expenses');
          }}
          style={styles.modalOption}>
          <MaterialCommunityIcons name="cash-plus" size={24} color="#ef4444" />
          <Text style={styles.modalOptionText}>Add Expenses</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default function TabNavigator({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            height: 70,
            borderRadius: 10,
            overflow: 'hidden',
            elevation: 5,
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
                case 'My Works':
                  return focused ? 'briefcase' : 'briefcase-outline';
                case 'Earnings':
                  return focused ? 'currency-usd' : 'cash-multiple';
                case 'Profile':
                  return focused ? 'account' : 'account-outline';
                default:
                  return 'home-outline';
              }
            })();
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ef4444',
          tabBarInactiveTintColor: '#9ca3af',
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="My Works" component={WorkingScreen} />
        <Tab.Screen
          name="DateDetails"
          component={DateDetails}
          options={{
            tabBarItemStyle: { display: 'none' },
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="Plus"
          component={() => null}
          options={{
            tabBarLabel: '',
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setModalVisible(true);
            },
          }}
        />

        <Tab.Screen name="Earnings" component={EarningsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={navigation}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#374151',
  },
});
