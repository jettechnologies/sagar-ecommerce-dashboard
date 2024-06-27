import { differenceInDays, format } from 'date-fns';

// would expand it later to allow for weeks
export function formatDateDifference(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const difference = differenceInDays(now, date);
  return `${Math.abs(difference)} days`;
}

export function formatToHumanReadableDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'do MMMM yyyy');
}