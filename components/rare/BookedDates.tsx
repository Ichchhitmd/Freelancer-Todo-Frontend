import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { format } from 'date-fns';

interface BookedDatesProps {
  selectedDates: any[];
  handleDateClick: (dateDetails: any) => void;
}

const BookedDates: React.FC<BookedDatesProps> = ({ selectedDates, handleDateClick }) => {
  const groupedDates = selectedDates.reduce((acc, item) => {
    const month = format(new Date(item.date), 'MMMM yyyy');
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});

  return (
    <View className="mb-7 bg-white p-4">
      {Object.keys(groupedDates).length === 0 ? (
        <Text className="text-center text-lg text-red-400">No booked dates found!</Text>
      ) : (
        Object.keys(groupedDates).map((month) => (
          <View key={month} className="mb-6">
            <Text className="mb-3 text-2xl font-bold text-red-400">{month}</Text>
            <FlatList
              data={groupedDates[month]}
              numColumns={7}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleDateClick(item.details)}
                  className="m-1 h-10 w-10">
                  <View className="flex h-full w-full items-center justify-center rounded-full bg-pink-700 shadow-lg">
                    <Text className="font-semibold text-white">
                      {format(new Date(item.date), 'dd')}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                justifyContent: 'center',
                paddingHorizontal: 5,
              }}
            />
          </View>
        ))
      )}
    </View>
  );
};

export default BookedDates;
