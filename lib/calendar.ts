import NepaliDate from 'nepali-date-converter';

export interface NepaliDateInfo {
  year: number;
  month: number;
  day: number;
  nepaliDate: string;
  englishDate?: string;
}

export const nepaliMonths = [
  'बैशाख',
  'जेठ',
  'असार',
  'श्रावण',
  'भदौ',
  'आश्विन',
  'कार्तिक',
  'मंसिर',
  'पौष',
  'माघ',
  'फाल्गुन',
  'चैत्र',
];

export const nepaliWeekDays = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];

export const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toNepaliNumeral(num: number): string {
  return num
    .toString()
    .split('')
    .map((d) => nepaliNumerals[parseInt(d)])
    .join('');
}

const daysInMonth = [
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2080
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 29, 31], // 2081
  [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2082
  [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2083
];

function getDaysInMonth(year: number, month: number): number {
  const yearIndex = year - 2080; // Our data starts from 2080 BS
  if (yearIndex >= 0 && yearIndex < daysInMonth.length) {
    return daysInMonth[yearIndex][month];
  }
  return 30;
}

export function getNepaliEnglishDates(
  year: number,
  month: number,
  day: number
): {
  nepaliDate: string;
  englishDate: string;
} {
  const nepaliDate = new NepaliDate(year, month, day);
  const englishDate = nepaliDate.toJsDate();

  // Add Nepal's timezone offset (UTC+5:45)
  const nepalOffsetHours = 5;
  const nepalOffsetMinutes = 45;
  englishDate.setHours(englishDate.getHours() + nepalOffsetHours);
  englishDate.setMinutes(englishDate.getMinutes() + nepalOffsetMinutes);

  return {
    nepaliDate: `${year}-${month + 1}-${day}`,
    englishDate: englishDate.toISOString().split('T')[0],
  };
}

export function getMonthMatrix(year: number, month: number): NepaliDateInfo[][] {
  const matrix: NepaliDateInfo[][] = [];
  const firstDay = new NepaliDate(year, month, 1);
  let currentWeek: NepaliDateInfo[] = Array(firstDay.getDay()).fill(null);

  const daysInCurrentMonth = getDaysInMonth(year, month);

  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const { englishDate } = getNepaliEnglishDates(year, month, day);

    currentWeek.push({
      year,
      month,
      day,
      nepaliDate: toNepaliNumeral(day),
      englishDate,
    });

    if (currentWeek.length === 7) {
      matrix.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    matrix.push(currentWeek.concat(Array(7 - currentWeek.length).fill(null)));
  }

  return matrix;
}
export function getCurrentNepaliDate(): NepaliDateInfo {
  const today = new NepaliDate();
  const jsDate = today.toJsDate();

  // Add Nepal's timezone offset (UTC+5:45)
  const nepalOffsetHours = 5;
  const nepalOffsetMinutes = 45;
  jsDate.setHours(jsDate.getHours() + nepalOffsetHours);
  jsDate.setMinutes(jsDate.getMinutes() + nepalOffsetMinutes);

  return {
    year: today.getYear(),
    month: today.getMonth(),
    day: today.getDate(),
    nepaliDate: toNepaliNumeral(today.getDate()),
    englishDate: jsDate.toISOString().split('T')[0],
  };
}
