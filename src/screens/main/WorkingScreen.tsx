import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { useGetEvents } from 'hooks/events';
import { EventResponse } from 'types/eventTypes';

// Nepali month names
const nepaliMonths = [
  'Baisakh',
  'Jestha',
  'Ashad',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra'
];

// Utility function to convert date to Nepali format
const convertToNepaliDate = (dateString: string): string => {
  try {
    const [yearStr, monthStr, dayStr] = dateString.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    // Validate inputs
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return dateString; // Return original if parsing fails
    }

    // Get Nepali month name
    const nepaliMonthName = nepaliMonths[month - 1] || 'Unknown';

    // Return formatted Nepali date
    return `${day} ${nepaliMonthName}, ${year}`;
  } catch (error) {
    console.error('Date conversion error:', error);
    return dateString;
  }
};

// Define a type for simplified work item
interface SimplifiedWorkItem {
  companyName: string;
  eventDate: string;
  eventType: string;
  side: string;
  workType: string;
  earnings: string;
}

const WorkingScreen = () => {
  const [simplifiedEvents, setSimplifiedEvents] = useState<SimplifiedWorkItem[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data, isLoading, isError } = useGetEvents(userId || 0);

  // Transform raw events data into simplified work items
  useEffect(() => {
    if (data && !isLoading && !isError) {
      // Ensure data is an array
      const eventsArray = Array.isArray(data) ? data : [data];
      
      const simplified = eventsArray.map(event => ({
        companyName: event.company?.name || 'Unknown Company',
        // Convert to Nepali date format
        eventDate: event.eventDate 
          ? convertToNepaliDate(event.eventDate) 
          : 'No Date',
        eventType: event.eventType || 'Unspecified',
        side: event.side || 'Unspecified',
        workType: event.workType || 'Unspecified',
        earnings: event.earnings ? `₹${parseFloat(event.earnings).toFixed(2)}` : 'N/A'
      }));

      setSimplifiedEvents(simplified);
    }
  }, [data, isLoading, isError]);

  const renderWorkItem = (item: SimplifiedWorkItem, index: number) => (
    <View key={index} style={styles.workItem}>
      <View style={styles.workItemHeader}>
        <Text style={styles.companyName}>{item.companyName}</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.detailsContainer}
      >
        <View style={[styles.badge, styles.dateBadge]}>
          <Text style={styles.badgeText}>📅 {item.eventDate}</Text>
        </View>
        
        <View style={[styles.badge, styles.typeBadge]}>
          <Text style={styles.badgeText}>🎉 {item.eventType}</Text>
        </View>
        
        <View style={[styles.badge, styles.sideBadge]}>
          <Text style={styles.badgeText}>👥 {item.side}</Text>
        </View>
        
        <View style={[styles.badge, styles.workTypeBadge]}>
          <Text style={styles.badgeText}>🎥 {item.workType}</Text>
        </View>
      </ScrollView>
      
      <View style={styles.earningsContainer}>
        <Text style={styles.earningsText}>Earnings: {item.earnings}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Works</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {simplifiedEvents.length > 0 ? (
          simplifiedEvents.map(renderWorkItem)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {isLoading ? 'Loading works...' : 'No work entries found'}
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
    backgroundColor: 'white', // Netflix's dark background
  },
  header: {
    backgroundColor: '#E50914', // Netflix's signature red
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  workItem: {
    backgroundColor: 'white', // White background for cards
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workItemHeader: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 5,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E50914', // Netflix red for emphasis
    textTransform: 'uppercase',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
    backgroundColor: '#F0F0F0', // Light gray background
  },
  badgeText: {
    color: '#333', // Dark text for contrast
    fontSize: 12,
    fontWeight: '600',
  },
  dateBadge: {
    backgroundColor: '#E50914', // Netflix red
    color: 'white',
  },
  typeBadge: {
    backgroundColor: '#4CAF50', // Green for variety
    color: 'white',
  },
  sideBadge: {
    backgroundColor: '#2196F3', // Blue for contrast
    color: 'white',
  },
  workTypeBadge: {
    backgroundColor: '#FF9800', // Orange for visibility
    color: 'white',
  },
  earningsContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  earningsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E50914', // Netflix red for earnings
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#141414',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
export default WorkingScreen;