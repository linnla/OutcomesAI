export function parseUTCDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)); // Remember that months are 0-indexed in JS
}

export function formatDateToMMDDYYYY(date) {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed.
  const year = date.getUTCFullYear();
  return `${month}-${day}-${year}`;
}
