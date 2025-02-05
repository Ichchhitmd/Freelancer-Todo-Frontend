import NepaliDate from 'nepali-datetime';

export const NepaliDateToEnglish = (nepaliDateStr: string): string | null => {
  console.log('[Conversion] Starting conversion for:', nepaliDateStr);

  try {
    const nepaliDate = new NepaliDate(nepaliDateStr, 'YYYY-MM-DD');

    if (!nepaliDate || typeof nepaliDate.getEnglishDate !== 'function') {
      throw new Error('Invalid Nepali date object');
    }

    const englishDate = nepaliDate.getDateObject(); // This gives you the equivalent JavaScript Date object

    const monthIndex = englishDate.getMonth(); // JavaScript months are 0-indexed
    const day = englishDate.getDate();

    // Array of month names (English)
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
