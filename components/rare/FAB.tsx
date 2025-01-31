import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Platform } from 'react-native';

interface FABProps {
  onAddWork: () => void;
  onAddExpense: () => void;
}

const FloatingActionButton: React.FC<FABProps> = ({ onAddWork, onAddExpense }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation();

  const toggleOptions = () => {
    setIsVisible(!isVisible);
  };

  const handleAddWork = () => {
    onAddWork();
    setIsVisible(false);
    navigation.navigate('Work');
  };

  const handleAddExpense = () => {
    onAddExpense();
    setIsVisible(false);
    console.log('Adding Expense...');
  };

  return (
    <View style={{ position: 'absolute', bottom: 40, right: 20, alignItems: 'center' }}>
      <TouchableOpacity
        onPress={toggleOptions}
        style={[
          {
            backgroundColor: isVisible ? '#EF4444' : '#007AFF',
            height: 56,
            width: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              },
              android: {
                elevation: 5,
              },
            }),
          },
        ]}>
        <MaterialIcons name={isVisible ? 'close' : 'add'} size={isVisible ? 16 : 24} color="#fff" />
      </TouchableOpacity>

      {isVisible && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            width: 200,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              },
              android: {
                elevation: 5,
              },
            }),
          }}>
          <TouchableOpacity
            onPress={handleAddWork}
            style={{
              alignItems: 'center',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 12,
              marginBottom: 12,
            }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Add Work</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddExpense}
            style={{
              alignItems: 'center',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 12,
            }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FloatingActionButton;
