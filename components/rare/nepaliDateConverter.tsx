import React from 'react';
import NepaliDate from 'nepali-date-converter';
import { Text } from 'react-native';

// Define the map of English numerals to Nepali numerals
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

// Function to convert English numerals to Nepali numerals
function engToNepNum(strNum: string): string {
  return String(strNum)
    .split('')
    .map(function (ch) {
      if (ch === '.' || ch === ',') {
        return ch; // Preserve non-numeric characters like decimal points or commas
      }
      return tableOfEngNepNums.get(Number(ch)) ?? ch; // Convert English digits or return original if not found
    })
    .join('');
}

interface NepaliDateConverterProps {
  date: string;
}

const NepaliDateConverter: React.FC<NepaliDateConverterProps> = ({ date }) => {
  const nepaliMonths = [
    'वैशाख',
    'जेष्ठ',
    'आषाढ',
    'श्रावण',
    'भाद्रपद',
    'आश्विन',
    'कार्तिक',
    'मङ्सिर',
    'पुष',
    'माघ',
    'फागुन',
    'चैत',
  ];

  const nepaliDays = ['आइतवार', 'सोमवार', 'मङ्गलवार', 'बुधवार', 'बिहीवार', 'शुक्रवार', 'शनिवार'];

  // Converts English date to Nepali date format
  const getNepaliDate = (date: string) => {
    try {
      const d = new Date(date); // Make sure the input date is a valid JavaScript date
      if (isNaN(d.getTime())) {
        console.error('Invalid date:', date);
        return null; // If the date is invalid, return null
      }

      const dateStr = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
      const nepaliDate = new NepaliDate(dateStr);

      const nepaliDay = nepaliDays[d.getDay()]; // Get the Nepali day of the week
      const nepaliMonthIndex = nepaliDate.getMonth() - 1; // Get Nepali month index (1-based)
      const nepaliMonth = nepaliMonths[nepaliMonthIndex];

      const nepaliDayEng = nepaliDate.format('DD'); // Get the day in English numerals
      const nepaliDayNep = engToNepNum(nepaliDayEng); // Convert the day to Nepali numerals

      return {
        month: nepaliMonth, // Nepali month
        day: nepaliDayNep, // Nepali day number in Nepali numerals
        dayOfWeek: nepaliDay, // Day of the week in Nepali
      };
    } catch (error) {
      console.log('Error converting date:', error);
      return null;
    }
  };

  const nepaliDate = getNepaliDate(date);

  if (!nepaliDate) {
    return <Text>Invalid Date</Text>; // If the date conversion failed, show an error message
  }

  return (
    <Text>
      {nepaliDate.dayOfWeek} - {nepaliDate.month} {nepaliDate.day}
    </Text>
  );
};

export default NepaliDateConverter;
