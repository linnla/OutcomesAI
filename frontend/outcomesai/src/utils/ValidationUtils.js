import { getOne } from '../utils/API';

export function validateRequiredAttributes(
  requiredAttributes,
  attributeNames,
  row
) {
  for (let i = 0; i < requiredAttributes.length; i++) {
    const key = requiredAttributes[i];
    const attributeName = attributeNames[i];

    if (
      !(key in row) ||
      !row[key] ||
      row[key] === null ||
      row[key] === undefined
    ) {
      throw new Error(`${attributeName} is a required field`);
    }
  }

  return true;
}

export function validatePostalCodeFormat(postalCode) {
  //console.log('validatePostalCode:', postalCode);

  if (postalCode === '00000') {
    throw new Error(`Postal code ${postalCode} does not exist`);
  }

  if (postalCode.length !== 5) {
    throw new Error('Invalid format for a postal code, 5 digits are required');
  }

  const regex = /^[0-9]{1,5}$/;
  if (!regex.test(postalCode)) {
    throw new Error(
      'Invalid format for a postal code, only numbers are allowed'
    );
  }

  return true;
}

export async function validatePostalCodeExists(postalCode) {
  try {
    const data = await getOne('postal_codes', { postal_code: postalCode });
    return data;
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.data.errorMessage) {
      if (
        error.response.data.errorMessage ===
        'A database result was required but none was found'
      ) {
        errorMessage = `Postal code ${postalCode} does not exist`;
      } else {
        errorMessage = error.response.data.errorMessage;
      }
    } else if (error.response.data.status) {
      const statusCode = error.response.data.status;
      if (statusCode >= 500) {
        errorMessage = 'Error accessing database or server';
      }
    }
    throw new Error(errorMessage);
  }
}

export function validateDateString(dateString) {
  if (typeof dateString !== 'string') {
    throw new Error(
      'Invalid date format. Expected a string in YYYY-MM-DD format.'
    );
  }

  // Validate the format: YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) {
    throw new Error(
      'Invalid date format. Expected a string in YYYY-MM-DD format.'
    );
  }

  // Ensure it's a valid date
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const dateObject = new Date(year, month - 1, day);
  if (
    dateObject.getUTCFullYear() !== year ||
    dateObject.getUTCMonth() + 1 !== month ||
    dateObject.getUTCDate() !== day
  ) {
    throw new Error('Invalid date.');
  }

  // Check if the date is in the future
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset the time of the current date to compare correctly
  if (dateObject > currentDate) {
    throw new Error('The date cannot be in the future.');
  }

  // Check if the date is more than 115 years ago
  const maxPastDate = new Date();
  maxPastDate.setFullYear(currentDate.getFullYear() - 115);
  if (dateObject < maxPastDate) {
    throw new Error('The date cannot be more than 115 years ago.');
  }

  return true;
}

export function validateDateObject(dateObject) {
  if (!(dateObject instanceof Date)) {
    throw new Error('Invalid date. Expected a Date object.');
  }

  // Ensure it's a valid date
  if (isNaN(dateObject.getTime())) {
    throw new Error('Invalid date.');
  }

  // Check if the date is in the future
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset the time of the current date to compare correctly
  if (dateObject > currentDate) {
    throw new Error('Invalid date, the date cannot be in the future.');
  }

  // Check if the date is more than 115 years ago
  const maxPastDate = new Date();
  maxPastDate.setFullYear(currentDate.getFullYear() - 115);
  if (dateObject < maxPastDate) {
    throw new Error(
      'Invalid date, the date cannot be more than 115 years ago.'
    );
  }

  return true;
}
