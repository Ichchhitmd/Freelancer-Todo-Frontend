import NepaliDate from 'nepali-datetime';

export const convertNepaliToEnglish = (nepaliDateStr: string): string | null => {
  console.log('[Conversion] Starting conversion for:', nepaliDateStr);

  try {
    const nepaliDate = new NepaliDate(nepaliDateStr, 'YYYY-MM-DD');

    if (!nepaliDate || typeof nepaliDate.getEnglishDate !== 'function') {
      throw new Error('Invalid Nepali date object');
    }

    const englishDate = nepaliDate.getDateObject(); // This gives you the equivalent JavaScript Date object

    const year = englishDate.getFullYear();
    const month = englishDate.getMonth() + 1; // JavaScript months are 0-indexed
    const day = englishDate.getDate();


    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('[Conversion] Error during conversion:', error);
    return null;
  }
};