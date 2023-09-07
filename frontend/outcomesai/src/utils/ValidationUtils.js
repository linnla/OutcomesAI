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

  return true;
};

export const validatePostalCode = async (postalCode) => {
  console.log('validatePostalCode:', postalCode);

  if (postalCode === '00000') {
    throw new Error(`Postal code ${postalCode} is not a valid postal code`);
  }

  if (postalCode.length !== 5) {
    throw new Error('Postal code must have 5 digits');
  }

  const regex = /^[0-9]{1,5}$/;
  if (!regex.test(postalCode)) {
    throw new Error('Postal code must be numbers');
  }

  return true;
};
