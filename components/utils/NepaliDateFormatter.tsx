import React from 'react';
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

export function engToNepNum(strNum: string | number): string {
  return String(strNum)
    .split('')
    .map((ch) => tableOfEngNepNums.get(Number(ch)) ?? ch)
    .join('');
}

export const monthNames = [
  'Baisakh',
  'Jestha',
  'Ashadh',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

interface NepaliDate {
  nepaliDay: number;
  nepaliMonth: number;
  nepaliYear: number;
}

interface NepaliDateFormatterProps {
  dates: NepaliDate | NepaliDate[];
  className?: string;
  showYear?: boolean;
}

export const NepaliDateFormatter: React.FC<NepaliDateFormatterProps> = ({
  dates,
  className = '',
  showYear = false,
}) => {
  const datesArray = Array.isArray(dates) ? dates : [dates];

  if (datesArray.length === 0) return null;

  const firstMonth = datesArray[0].nepaliMonth;
  const sameMonth = datesArray.every((date) => date.nepaliMonth === firstMonth);

  const formatDate = () => {
    if (sameMonth) {
      const month = monthNames[firstMonth - 1];
      const days = datesArray.map((date) => engToNepNum(date.nepaliDay));
      const year = showYear ? ` ${engToNepNum(datesArray[0].nepaliYear)}` : '';
      return `${month} ${days.join(', ')}${year}`;
    } else {
      return datesArray
        .map((date) => {
          const month = monthNames[date.nepaliMonth - 1];
          const day = engToNepNum(date.nepaliDay);
          const year = showYear ? ` ${engToNepNum(date.nepaliYear)}` : '';
          return `${month} ${day}${year}`;
        })
        .join(', ');
    }
  };

  return <Text className={className}>{formatDate()}</Text>;
};

export const formatNepaliDates = (dates: NepaliDate | NepaliDate[]): string => {
  const datesArray = Array.isArray(dates) ? dates : [dates];

  if (datesArray.length === 0) return '';

  const firstMonth = datesArray[0].nepaliMonth;
  const sameMonth = datesArray.every((date) => date.nepaliMonth === firstMonth);

  if (sameMonth) {
    const month = monthNames[firstMonth - 1];
    const days = datesArray.map((date) => engToNepNum(date.nepaliDay));
    return `${month} ${days.join(', ')}`;
  } else {
    return datesArray
      .map((date) => {
        const month = monthNames[date.nepaliMonth - 1];
        const day = engToNepNum(date.nepaliDay);
        return `${month} ${day}`;
      })
      .join(', ');
  }
};
