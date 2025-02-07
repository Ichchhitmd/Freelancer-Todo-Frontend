import React from 'react';
import NepaliDate from 'nepali-date-converter';
import { Text } from 'react-native';

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

interface NepaliDateConverterProps {
  date: string;
  className?: string;
  showDay?: boolean;
  showMonth?: boolean;
  showDate?: boolean;
}

const NepaliDateConverter: React.FC<NepaliDateConverterProps> = ({
  date,
  className,
  showDay = true,
  showMonth = true,
  showDate = true,
}) => {
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

  const getNepaliDate = (dateStr: string) => {
    try {
      // Handle multiple dates separated by commas
      const dates = dateStr.split(',').map((d) => d.trim());
      const firstDate = dates[0]; // We'll show the first date in case of multiple dates

      // Convert AD date string to Date object
      const d = new Date(firstDate);
      if (isNaN(d.getTime())) throw new Error("Invalid date format");

      // Convert AD date to Nepali Date (BS)
      const nepaliDate = new NepaliDate(d);
      const dayOfWeek = nepaliDate.getDay();

      return {
        month: nepaliMonths[nepaliDate.getMonth()], // Month indexing corrected
        day: engToNepNum(nepaliDate.format('DD')),
        dayOfWeek: nepaliDays[dayOfWeek],
        hasMultipleDates: dates.length > 1,
      };
    } catch (error) {
      return null;
    }
  };

  const nepaliDate = getNepaliDate(date);

  if (!nepaliDate) {
    return <Text>Invalid Date</Text>;
  }

  return (
    <Text className={className}>
      {showDay && nepaliDate.dayOfWeek}
      {showDay && showMonth && ' - '}
      {showMonth && nepaliDate.month}
      {showMonth && showDate && ' '}
      {showDate && nepaliDate.day}
      {nepaliDate.hasMultipleDates && ' +'}
    </Text>
  );
};

export default NepaliDateConverter;
