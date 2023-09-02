export const validateRequiredAttributes = (
  requiredAttributes,
  attributeNames,
  row
) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < requiredAttributes.length; i++) {
      const key = requiredAttributes[i];
      const attributeName = attributeNames[i];

      if (
        !(key in row) ||
        !row[key] ||
        row[key] === null ||
        row[key] === undefined
      ) {
        reject(`${attributeName} is a required field`);
      }
    }

    resolve(true);
  });
};

export const validatePostalCode = (postalCode) => {
  console.log('validatePostalCode:', postalCode);
  return new Promise((resolve, reject) => {
    if (postalCode === '00000') {
      reject(`Postal code ${postalCode} is not a valid postal code`);
    }

    if (postalCode.length !== 5) {
      reject('Postal code must have 5 digits');
    }

    const regex = /^[0-9]{1,5}$/;
    if (!regex.test(postalCode)) {
      reject('Postal code must be numbers');
    }

    resolve(true);
  });
};
