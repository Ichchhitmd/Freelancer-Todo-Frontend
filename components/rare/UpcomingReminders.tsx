import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NepaliDate from 'nepali-datetime'; // Use nepali-datetime for Nepali date handling

interface EventDetails {
  eventId: number;
  eventType: string;
  side: string;
  earnings: string;
  contactPerson: string;
  company: {
    name: string;
  };
  eventDate: string;
}

interface UpcomingEventReminderProps {
  events: {
    date: string;
    details: EventDetails;
  }[];
  handleClick: (dateDetails: any) => void;
}

const tableOfEngNepNums = new Map([
  [0, '०'],
  [1, '१'],
  [2, '२'],
  [3, '३'],
  [4, '४'],
  [5, '५'],
  [6, '६'],
  [7, '७'],
  [8, '८'],
  [9, '९'],
]);

function engToNepNum(strNum: string): string {
  return String(strNum)
    .split('')
    .map((ch) => tableOfEngNepNums.get(Number(ch)) ?? ch)
    .join('');
}

const formatMultipleDates = (dates: string[]) => {
  if (dates.length === 0) return 'No Dates';

  const nepaliDates = dates.map((date) => {
    try {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error('Invalid date format');
      }

      const nepaliDate = new NepaliDate(date, 'YYYY-MM-DD');
      const day = engToNepNum(nepaliDate.format('DD'));
      return day;
    } catch (error) {
      return 'Invalid Date';
    }
  });

  if (nepaliDates.includes('Invalid Date')) {
    return 'Invalid Date';
  }

  const firstDate = dates[0];
  const nepaliDate = new NepaliDate(firstDate, 'YYYY-MM-DD');
  const nepaliMonth = nepaliDate.format('MMMM'); // Extract month in Nepali

  return `${nepaliMonth} - ${nepaliDates.join(', ')}`;
};

const UpcomingEventReminder: React.FC<UpcomingEventReminderProps> = ({ events, handleClick }) => {
  const sortedEvents = [...events].sort((a, b) => a.details.eventId - b.details.eventId);

  const formatEventName = (details: EventDetails) => `${details.eventType} (${details.side})`;

  const getDisplayName = (details: EventDetails) => details.contactPerson || details.company.name;

  return (
    <View>
      {sortedEvents.map((event, index) => {
        const dates = event.date.split(',').map((d: string) => d.trim());

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleClick(event.details)}
            activeOpacity={0.8}
            style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.eventName} numberOfLines={1}>
                {formatEventName(event.details)}
              </Text>

              <View style={styles.eventDetailRow}>
                <MaterialCommunityIcons name="account-group" size={22} color="#4B5563" />
                <Text style={styles.eventDetailText} numberOfLines={1}>
                  Event with {getDisplayName(event.details)}
                </Text>
              </View>

              <View style={styles.eventDetailRow}>
                <MaterialCommunityIcons name="calendar" size={22} color="#4B5563" />
                <Text style={styles.eventDateText}>{formatMultipleDates(dates)}</Text>
              </View>

              <View style={styles.eventDetailRow}>
                <MaterialCommunityIcons name="currency-usd" size={22} color="#10B981" />
                <Text style={styles.earningsText}>
                  Estimated: Rs.{' '}
                  {engToNepNum(parseFloat(event.details.earnings).toLocaleString())}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardContent: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
    textTransform: 'capitalize',
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  eventDateText: {
    fontSize: 14,
    color: '#6B7280',
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
