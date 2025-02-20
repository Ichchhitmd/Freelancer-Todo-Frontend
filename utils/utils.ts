export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export interface DaysStatus {
  statusText: string;
  statusStyle: string;
  daysDifference: number;
  isToday: boolean;
}

export const getDaysStatus = (eventDate: Date): DaysStatus => {
  const today = new Date();
  const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
  const eventMidnight = new Date(eventDate.setHours(0, 0, 0, 0));
  
  const timeDiff = eventMidnight.getTime() - todayMidnight.getTime();
  const daysDifference = Math.round(timeDiff / (1000 * 3600 * 24));
  const isToday = daysDifference === 0;

  let statusText = '';
  let statusStyle = '';

  if (isToday) {
    statusText = 'Today';
    statusStyle = 'bg-green-100 border-green-300';
  } else if (daysDifference === 1) {
    statusText = 'Tomorrow';
    statusStyle = 'bg-blue-100 border-blue-300';
  } else if (daysDifference > 1) {
    statusText = `${daysDifference} days left`;
    statusStyle = 'bg-blue-100 border-blue-300';
  } else {
    const daysAgo = Math.abs(daysDifference);
    statusText = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    statusStyle = 'bg-red-100 border-red-300';
  }

  return { statusText, statusStyle, daysDifference, isToday };
};