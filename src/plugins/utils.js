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
export function totalHours(start, end, hasBreak) {
  const startTime = dayjs(`2024-01-01T${start}`);
  const endTime = dayjs(`2024-01-01T${end}`);
  const duration = endTime.diff(startTime, 'hour', true);
  const breakTime = hasBreak ? 0.5 : 0;
  const totalHoursWorked = duration - breakTime;
  const hours = Math.floor(totalHoursWorked);
  const minutes = Math.round((totalHoursWorked - hours) * 60);
  return `${hours}h${minutes.toString().padStart(2, '0')}m`;
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
