import { getOne } from '../utils/API';

export function validateIsInteger(key, value) {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return true; // It's already an integer
  } else if (typeof value === 'string') {
    const num = parseInt(value, 10);
    if (!isNaN(num) && Number.isInteger(num)) {
      return true; // Successfully parsed as an integer
    }
  }

  // If it's not a valid integer, throw an error
  const customError = new Error('Data Validation Error');
  customError.message = `${key} must be an integer, ${value}`;
  throw customError;
}

export function validateRequiredAttributes(
  requiredAttributes,
  attributeNames,
  row
) {
  const missingAttributes = [];

  for (let i = 0; i < requiredAttributes.length; i++) {
    const key = requiredAttributes[i];
    const attributeName = attributeNames[i];

    //console.log('row:', row);
    //console.log('key:', key);
    //console.log('key value:', row[key]);

    if (
      !(key in row) ||
      !row[key] ||
      row[key] === null ||
      row[key] === undefined ||
      (typeof row[key] === 'string' && row[key].trim() === '')
    ) {
      missingAttributes.push(attributeName);
    }
  }

  if (missingAttributes.length) {
    const lastAttribute = missingAttributes.pop();
    //const errorMessage = missingAttributes.length
    //  ? `${missingAttributes.join(
    //      ', '
    //    )} and ${lastAttribute} are required fields`
    //  : `${lastAttribute} is a required field`;
    //console.log(errorMessage);

    const errorMessage = missingAttributes.length
      ? `${missingAttributes.join(
          ', '
        )} and ${lastAttribute} are required fields\n`
      : `${lastAttribute} is a required field\n`;

    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = errorMessage;
    throw customError;
  }
  return true;
}

export function validateEmail(email) {
  // A common regex pattern for basic email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (!emailRegex.test(email)) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = `${email} is not a valid email address`;
    throw customError;
  }
  return true;
}

export function validatePostalCodeFormat(postalCode) {
  //console.log('validatePostalCode:', postalCode);

  if (postalCode === '00000') {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = `Postal code ${postalCode} does not exist`;
    throw customError;
  }

  if (postalCode.length !== 5) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message =
      'Invalid format for a postal code, 5 digits are required';
    throw customError;
  }

  const regex = /^[0-9]{1,5}$/;
  if (!regex.test(postalCode)) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message =
      'Invalid format for a postal code, only numbers are allowed';
    throw customError;
  }

  return true;
}

export async function validatePostalCodeExists(postalCode) {
  try {
    const data = await getOne('postal_codes', { postal_code: postalCode });
    return data;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.errorType &&
      error.response.data.errorType === 'NoResultFound'
    ) {
      const customError = new Error();
      customError.name = 'Data Validation Error';
      customError.message = 'Zip Code not found';
      throw customError;
    } else {
      throw error;
    }
  }
}

export function validateDateString(dateString) {
  // Validate its a string
  if (typeof dateString !== 'string') {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message =
      'Invalid date format. Expected a string in YYYY-MM-DD format.';
    throw customError;
  }

  // Validate the format: YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message =
      'Invalid date format. Expected a string in YYYY-MM-DD format.';
    throw customError;
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
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = 'Invalid date.';
    throw customError;
  }

  // Check if the date is in the future
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset the time of the current date to compare correctly
  if (dateObject > currentDate) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = 'The date cannot be in the future.';
    throw customError;
  }

  // Check if the date is more than 115 years ago
  const maxPastDate = new Date();
  maxPastDate.setFullYear(currentDate.getFullYear() - 115);
  if (dateObject < maxPastDate) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = 'The date cannot be more than 115 years ago.';
    throw customError;
  }

  return true;
}

export function validateDateObject(dateObject) {
  // Validate its a date object
  if (!(dateObject instanceof Date)) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = 'Invalid date. Expected a Date object.';
    throw customError;
  }

  // Ensure it's a valid date
  if (isNaN(dateObject.getTime())) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = 'Invalid date.';
    throw customError;
  }

  // Check if the date is in the future
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset the time of the current date to compare correctly
  if (dateObject > currentDate) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = 'Invalid date, the date cannot be in the future.';
    throw customError;
  }

  // Check if the date is more than 115 years ago
  const maxPastDate = new Date();
  maxPastDate.setFullYear(currentDate.getFullYear() - 115);
  if (dateObject < maxPastDate) {
    const customError = new Error();
    customError.name = 'Data Validation Error';
    customError.message = 'The date cannot be more than 115 years ago.';
    throw customError;
  }

  return true;
}
