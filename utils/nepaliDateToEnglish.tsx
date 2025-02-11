import NepaliDate from 'nepali-datetime';

export const NepaliDateToEnglish = (nepaliDateStr: string): string | null => {
  try {
    const nepaliDate = new NepaliDate(nepaliDateStr, 'YYYY-MM-DD');

    if (!nepaliDate || typeof nepaliDate.getEnglishDate !== 'function') {
      throw new Error('Invalid Nepali date object');
    }

    const englishDate = nepaliDate.getDateObject();

    const monthIndex = englishDate.getMonth();
    const day = englishDate.getDate();

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const month = monthNames[monthIndex]; // Get the name of the month

    return `${day}-${month}`;
  } catch (error) {
    console.error('[Conversion] Error during conversion:', error);
    return null;
  }
};
