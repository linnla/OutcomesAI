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
