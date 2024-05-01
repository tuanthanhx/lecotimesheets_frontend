import dayjs from 'dayjs';

/**
 * Formats a date string to 'DD-MM-YYYY' format.
 * @param {string} dateString - The ISO string of the date to format.
 * @return {string} The formatted date string.
 */
export function formatDateString(dateString) {
  return dayjs(dateString).format('DD-MM-YYYY');
}
