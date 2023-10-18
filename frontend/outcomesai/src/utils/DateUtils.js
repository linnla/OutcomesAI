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

export function dateStringToDate(dateString) {
  // Assuming medication.date_prescribed is in a valid date format
  const datePrescribed = new Date(dateString);

  // Get the components of the date
  const year = datePrescribed.getFullYear();
  const month = datePrescribed.getMonth(); // Months are zero-based
  const day = datePrescribed.getDate();

  // Create a new Date object with the components
  const formattedDate = new Date(year, month, day);
  return formattedDate;
}

export function getYear(date) {
  let dateObject = new Date();
  if (date instanceof Date) {
    dateObject = date;
  } else {
    dateObject = new Date(date);
  }
  if (isNaN(dateObject.getTime())) {
    return 0;
  }
  return dateObject.getFullYear();
}

export function getMonth(date) {
  let dateObject = new Date();
  if (date instanceof Date) {
    dateObject = date;
  } else {
    dateObject = new Date(date);
  }
  if (isNaN(dateObject.getTime())) {
    return 0;
  }

  // Javascript returns a zero based month for Jan
  return dateObject.getMonth() + 1;
}

export function getDayNumber(date) {
  let dateObject = new Date();
  if (date instanceof Date) {
    dateObject = date;
  } else {
    dateObject = new Date(date);
  }
  if (isNaN(dateObject.getTime())) {
    return 0;
  }
  return dateObject.getDate();
}

export function getMinutes(date) {
  let dateObject = new Date();
  if (date instanceof Date) {
    dateObject = date;
  } else {
    dateObject = new Date(date);
  }
  if (isNaN(dateObject.getTime())) {
    return 0;
  }
  return dateObject.getMinutes();
}

export function getHours(date) {
  let dateObject = new Date();
  if (date instanceof Date) {
    dateObject = date;
  } else {
    dateObject = new Date(date);
  }
  if (isNaN(dateObject.getTime())) {
    return 0;
  }
  return dateObject.getHours();
}

export function getDayOfWeek(date) {
  let dateObject = new Date();
  if (date instanceof Date) {
    dateObject = date;
  } else {
    dateObject = new Date(date);
  }
  if (isNaN(dateObject.getTime())) {
    return 8;
  }
  return dateObject.getDay();
}

export function getQuarter(date) {
  let dateObject = new Date();
  if (date instanceof Date) {
    dateObject = date;
  } else {
    dateObject = new Date(date);
  }
  if (isNaN(dateObject.getTime())) {
    return 0;
  }

  const month = dateObject.getMonth() + 1; // JavaScript months are 0-based
  return Math.ceil(month / 3);
}

export function getYesterday() {
  // Create a new Date object for today
  const today = new Date();

  // Subtract one day from today to get yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Get the year, month, and day components of yesterday
  const yyyy = yesterday.getFullYear();
  const mm = String(yesterday.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
  const dd = String(yesterday.getDate()).padStart(2, '0');

  // Create the 'yyyy-mm-dd' formatted string for yesterday
  const yesterdayDateString = `${yyyy}-${mm}-${dd}`;
  return yesterdayDateString;
}

export function calculateAge(date) {
  let dateObject = new Date();
  if (date instanceof Date) {
    dateObject = date;
  } else {
    dateObject = new Date(date);
  }
  if (isNaN(dateObject.getTime())) {
    return 0;
  }

  const currentDate = new Date();
  let age = currentDate.getFullYear() - dateObject.getFullYear();

  // Check if the birthday has occurred this year
  if (
    currentDate.getMonth() < dateObject.getMonth() ||
    (currentDate.getMonth() === dateObject.getMonth() &&
      currentDate.getDate() < dateObject.getDate())
  ) {
    age--;
  }

  return age;
}
