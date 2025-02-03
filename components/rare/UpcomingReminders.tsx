import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NepaliDateConverter from './nepaliDateConverter';

interface UpcomingEventReminderProps {
  events: {
    date: string;
    details: {
      eventName: string;
      brideGroom: string;
      estimatedEarning: string;
    };
  }[];
  onPress: (eventId: number) => void; // Passing eventId to handle which event is pressed
}

const UpcomingEventReminder: React.FC<UpcomingEventReminderProps> = ({ events, onPress }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {events.slice(0, 4).map((nextEvent, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onPress(index)} // You can handle this with the eventId or index
          activeOpacity={0.8}
          style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.eventName}>{nextEvent.details.eventName}</Text>

            <View style={styles.eventDetailRow}>
              <MaterialCommunityIcons name="account-group" size={22} color="#4B5563" />
              <Text style={styles.eventDetailText}>Event with {nextEvent.details.brideGroom}</Text>
            </View>

            <View style={styles.eventDetailRow}>
              <MaterialCommunityIcons name="calendar" size={22} color="#4B5563" />
              <Text style={styles.eventDateText}>
                <NepaliDateConverter date={nextEvent.date} />
              </Text>
            </View>

            <View style={styles.eventDetailRow}>
              <MaterialCommunityIcons name="currency-usd" size={22} color="#10B981" />
              <Text style={styles.earningsText}>
                Estimated: {nextEvent.details.estimatedEarning}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd', // Light border color for paper
    overflow: 'hidden',
    position: 'relative',
  },
  cardContent: {
    position: 'relative',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'serif', // More notepad-like font
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  eventDateText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  earningsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
});

export default UpcomingEventReminder;
