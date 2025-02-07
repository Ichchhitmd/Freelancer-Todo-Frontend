import { ParsedDate } from "types/WorkingScreenTypes";

const nepaliMonths = [
  'Baisakh', 'Jestha', 'Ashad', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
];

export const convertToNepaliDate = (dateString: string): ParsedDate => {
  try {
    const [yearStr, monthStr, dayStr] = dateString.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Invalid date');
    }

    return {
      day,
      month: nepaliMonths[month - 1] || 'Unknown',
      year,
      originalDate: dateString,
      timestamp: new Date(dateString).getTime(),
    };
  } catch (error) {
    return {
      day: 1,
      month: 'Unknown',
      year: 2000,
      originalDate: dateString,
      timestamp: 0,
    };
  }
};