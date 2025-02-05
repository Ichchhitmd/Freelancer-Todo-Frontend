import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkData {
  company: string;
  selectedDate: Date[];
  eventType: string;
  side: string;
}

const WorkingScreen = () => {
  const [workData, setWorkData] = useState<WorkData[]>([]);

  useEffect(() => {
    const fetchWorkData = async () => {
      try {
        const existingData = await AsyncStorage.getItem('bookedDates');
        if (existingData) {
          const parsedData: WorkData[] = JSON.parse(existingData);
          
          // Sort the work data by the latest date
          const sortedData = parsedData.sort((a, b) => {
            // If selectedDate is an array, take the first (latest) date
            const dateA = a.selectedDate ? new Date(a.selectedDate[0]).getTime() : 0;
            const dateB = b.selectedDate ? new Date(b.selectedDate[0]).getTime() : 0;
            
            // Sort in descending order (latest first)
            return dateB - dateA;
          });

          setWorkData(sortedData);
        }
      } catch (error) {
        Alert.alert('Error', 'Could not fetch work data');
      }
    };

    fetchWorkData();
  }, []);

  const renderWorkItem = (item: WorkData, index: number) => {
    // Format the date
    const formattedDates = item.selectedDate 
      ? item.selectedDate.map(date => new Date(date).toLocaleDateString())
      : [];

    return (
      <View key={index} style={styles.workItem}>
        <Text style={styles.workItemTitle}>
          {item.company || 'Unnamed Company'}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.labelContainer}
        >
          <View style={[styles.labelBox, styles.dateBox]}>
            <Text style={styles.labelText}>
              Date: {formattedDates.join(', ') || 'No Date Selected'}
            </Text>
          </View>
          <View style={[styles.labelBox, styles.eventTypeBox]}>
            <Text style={styles.labelText}>
              Event Type: {item.eventType || 'Not Specified'}
            </Text>
          </View>
          <View style={[styles.labelBox, styles.sideBox]}>
            <Text style={styles.labelText}>
              Side: {item.side || 'Not Specified'}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Works</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {workData.length > 0 ? (
          workData.map(renderWorkItem)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No work entries found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add a new work entry in the Add Work section
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#7b68ee',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  workItem: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7b68ee',
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  labelBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white', // White text for all labels
  },
  eventTypeBox: {
    backgroundColor: '#1E88E5', // Blue background
  },
  sideBox: {
    backgroundColor: '#9C27B0', // Purple background
  },
  dateBox: {
    backgroundColor: '#4CAF50', // Green background
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default WorkingScreen;