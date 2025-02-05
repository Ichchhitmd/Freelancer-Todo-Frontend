import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import { removeGadget } from 'redux/slices/gadgetSlices';
import { GadgetResponse } from 'types/gadgetTypes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function GadgetDetailsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const [isDeleting, setIsDeleting] = useState(false);

  const routeParams = route.params as { gadget?: GadgetResponse } | undefined;
  const gadget = routeParams?.gadget;
  if (!gadget) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-6">
          <MaterialCommunityIcons 
            name="alert-circle-outline" 
            size={64} 
            color="#EF4444" 
          />
          <Text className="text-red-500 text-lg font-bold mt-4">
            Gadget not found
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mt-4 bg-red-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderDetailRow = useCallback(({ label, value, icon }: { label: string; value: string | number; icon?: string }) => (
    <View className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
      {icon && (
        <View className="bg-red-50 p-2 rounded-lg mr-3">
          <MaterialCommunityIcons 
            name={icon as any}
            size={24} 
            color="#E50914" 
          />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-gray-500 text-sm">{label}</Text>
        <Text className="text-gray-900 font-bold mt-1">{value.toString()}</Text>
      </View>
    </View>
  ), []);

  const handleEdit = useCallback(() => {
    try {
      navigation.navigate('EditGadget', { gadget });
    } catch (error) {
      Alert.alert('Error', 'Failed to navigate to edit screen. Please try again.');
    }
  }, [navigation, gadget]);

  const handleDelete = useCallback(async () => {
    Alert.alert(
      'Delete Gadget',
      'Are you sure you want to delete this gadget? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              setIsDeleting(true);
              await dispatch(removeGadget(gadget.id)).unwrap();
              Alert.alert(
                'Success', 
                'Gadget deleted successfully',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              if (error instanceof Error) {
                Alert.alert('Error', `Failed to delete gadget: ${error.message}`);
              } else {
                Alert.alert('Error', 'Failed to delete gadget. Please try again later.');
              }
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  }, [dispatch, gadget.id, navigation]);

  const getIconName = useCallback((model: string) => {
    const modelLower = model.toLowerCase();
    if (modelLower.includes('laptop')) return 'laptop';
    if (modelLower.includes('camera')) return 'camera';
    if (modelLower.includes('lens')) return 'camera-iris';
    if (modelLower.includes('drone')) return 'drone';
    return 'devices';
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="absolute top-0 left-0 right-0 z-50 bg-red-500 shadow-sm">
        <View className="p-6 pt-16">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="absolute left-6 top-16 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          <Text className="text-center text-2xl font-bold text-white">
            Gadget Details
          </Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingTop: 100 }}
      >
        <View className="p-6">
          <View className="bg-red-100 p-6 rounded-full self-center mb-8 shadow-lg">
            <MaterialCommunityIcons 
              name={getIconName(gadget.model)}
              size={64} 
              color="#E50914" 
            />
          </View>

          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-1">
              {gadget.name}
            </Text>
            <Text className="text-gray-500 text-center">
              {gadget.model}
            </Text>
          </View>

          <View className="space-y-4">
            {renderDetailRow({ 
              label: 'Name', 
              value: gadget.name,
              icon: 'tag'
            })}
            {renderDetailRow({ 
              label: 'Model', 
              value: gadget.model,
              icon: 'information'
            })}
            {renderDetailRow({ 
              label: 'Cost', 
              value: `$${gadget.cost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`,
              icon: 'cash'
            })}
            {renderDetailRow({ 
              label: 'Purchase Date', 
              value: new Date(gadget.purchaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              icon: 'calendar'
            })}
          </View>

          <View className="flex-row mt-8 space-x-4 gap-6">
            <TouchableOpacity 
              onPress={handleEdit}
              className="flex-1 bg-blue-500 p-4 rounded-xl flex-row items-center justify-center shadow-sm"
            >
              <MaterialCommunityIcons 
                name="pencil" 
                size={24} 
                color="white" 
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-bold">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-500 p-4 rounded-xl flex-row items-center justify-center shadow-sm"
            >
              {isDeleting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons 
                    name="delete" 
                    size={24} 
                    color="white" 
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-bold">Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}