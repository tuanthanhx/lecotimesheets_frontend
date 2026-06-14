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

export function normalizeBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

export function getComparableId(value) {
  if (value && typeof value === 'object' && 'id' in value) {
    return value.id;
  }

  return value;
}

export function idValueComparator(value, itemValue) {
  const normalizedValue = getComparableId(value);
  const normalizedItemValue = getComparableId(itemValue);

  if (normalizedValue == null || normalizedItemValue == null) {
    return normalizedValue === normalizedItemValue;
  }

  return String(normalizedValue) === String(normalizedItemValue);
}

export function normalizeSelectId(value) {
  const normalizedValue = getComparableId(value);

  if (normalizedValue == null || normalizedValue === '') {
    return normalizedValue;
  }

  const numericValue = Number(normalizedValue);
  return Number.isNaN(numericValue) ? normalizedValue : numericValue;
}

export function totalHours(start, end, hasBreak) {
  if (!start || !end) {
    return null;
  }
  const startTime = dayjs(`2024-01-01T${start}`);
  const endTime = dayjs(`2024-01-01T${end}`);
  const duration = endTime.diff(startTime, 'hour', true);
  const breakTime = normalizeBoolean(hasBreak) ? 0.5 : 0;
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
