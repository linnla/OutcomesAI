import CallApi, { getRequest, CallApiPromise } from '../../api/CallApi';
import {
  validatePostalCodeFormat,
  validateRequiredAttributes,
} from '../../utils/ValidationUtils';

export const validateRow = (newRow, oldRow, isNew) => {
  const requiredAttributes = ['name', 'postal_code'];
  const attributeNames = ['Office name', 'Postal Code'];

  return new Promise(async (resolve, reject) => {
    try {
      await validateRequiredAttributes(
        requiredAttributes,
        attributeNames,
        newRow
      );
      let updatedRow = {};
      if (newRow.postal_code !== oldRow.postal_code) {
        validatePostalCodeFormat(newRow.postal_code);
        const method = 'GET';
        const table = 'postal_codes';
        const query_params = {
          postal_code: newRow.postal_code,
        };
        const postalCodeInfo = await getRequest(
          method,
          table,
          null,
          query_params
        );

        updatedRow = {
          ...newRow,
          city: postalCodeInfo.city,
          county: postalCodeInfo.county,
          state: postalCodeInfo.state,
          state_code: postalCodeInfo.state_code,
          country_code: postalCodeInfo.country_code,
        };
      } else {
        updatedRow = {
          ...newRow,
        };
      }
      resolve(updatedRow);
    } catch (error) {
      reject(error);
    }
  });
};

export const saveRow = (newRow, oldRow, isNew) => {
  return new Promise(async (resolve, reject) => {
    let method;
    if (isNew) {
      method = 'POST';
    } else {
      method = 'PUT';
    }

    try {
      const response = await CallApiPromise(method, 'offices', newRow, null);
      let savedRow = {
        id: response.data.id,
        practice_id: newRow.practice_id,
        name: newRow.name,
        postal_code: newRow.postal_code,
        city: newRow.city,
        county: newRow.county,
        state: newRow.state,
        state_code: newRow.state_code,
        status: newRow.status,
        virtual: newRow.virtual,
      };
      resolve(savedRow);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteRow = (rowId, rows) => {
  return new Promise(async (resolve, reject) => {
    console.log(rowId);

    try {
      await CallApiPromise('DELETE', 'offices', { id: rowId }, null);
      const deletedRow = rows.find((r) => r.id === rowId);
      rows = rows.filter((r) => r.id !== rowId);

      resolve({ data: deletedRow });
    } catch (error) {
      reject(error);
    }
  });
};
