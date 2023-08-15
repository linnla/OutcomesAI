import CallApi from '../api/CallApi';

export const validateRequiredAttributes = async (
  requiredAttributes,
  attributeNames,
  row
) => {
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
};

export const validatePostalCode = async (postalCode) => {
  if (postalCode == '00000') {
    throw new Error(`Postal code ${postalCode} not found`);
  }

  if (postalCode.length !== 5) {
    throw new Error('Postal code must have 5 digits');
  }

  const regex = /^[0-9]{1,5}$/;
  if (!regex.test(postalCode)) {
    throw new Error('Postal code must be numbers');
  }

  const method = 'GET';
  const table = 'postal_codes';
  const query_params = {
    postal_code: postalCode,
  };

  try {
    await CallApi(method, table, null, query_params);
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.errorType === 'NoResultFound'
    ) {
      throw new Error(`Postal code ${postalCode} not found`);
    } else {
      throw error;
    }
  }
};
