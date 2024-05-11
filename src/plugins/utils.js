import dayjs from 'dayjs';

/**
 * Formats a date string to 'DD-MM-YYYY' format.
 * @param {string} dateString - The ISO string of the date to format.
 * @return {string} The formatted date string.
 */
export function formatDateString(dateString) {
  return dayjs(dateString).format('DD-MM-YYYY');
}

export function formatTimeString(timeString) {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
}

export function formatCurrencyString(amount) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatHourString(count) {
  const hours = Math.floor(count);
  const minutes = Math.round((count - hours) * 60);
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

export function totalHours(start, end, hasBreak) {
  const startTime = dayjs(`2024-01-01T${start}`);
  const endTime = dayjs(`2024-01-01T${end}`);
  const duration = endTime.diff(startTime, 'hour', true);
  const breakTime = hasBreak ? 0.5 : 0;
  const totalHoursWorked = duration - breakTime;
  const totalHoursText = formatHourString(totalHoursWorked);
  return {
    count: totalHoursWorked,
    text: totalHoursText,
  };
}

export function sortArray(array, propertyName, order = 'asc') {
  return array.sort((a, b) => {
    let valA = a[propertyName];
    let valB = b[propertyName];

    if (typeof valA === 'string') {
      valA = valA.toUpperCase();
    }
    if (typeof valB === 'string') {
      valB = valB.toUpperCase();
    }

    if (order === 'asc') {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });
}
