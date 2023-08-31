import CallApi, { getRequest } from '../../api/CallApi';
import {
  validatePostalCode,
  validateRequiredAttributes,
} from '../../utils/ValidationUtils';

export const getAll = async () => {
  let practice_id;

  try {
    practice_id = 100101;
    if (practice_id === null) {
      throw new Error('practice_id is not set');
    }
  } catch (error) {
    throw error;
  }

  const method = 'GET';
  const table = 'offices';
  const query_params = {
    practice_id: practice_id,
  };

  try {
    const response = await CallApi(method, table, null, query_params);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

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
        await validatePostalCode(newRow.postal_code);
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
      resolve(updatedRow); // Both validations passed
    } catch (error) {
      reject(error);
    }
  });
};

export const saveRow = (row, oldRow, isNew) => {
  return new Promise(async (resolve, reject) => {
    let practice_id;
    try {
      practice_id = 100101;
      if (practice_id === null) {
        throw new Error('Error getting practice_id');
      }
    } catch (error) {
      reject(error);
    }

    let body = {
      ...row,
      practice_id: practice_id,
    };

    let method;
    if (isNew) {
      method = 'POST';
    } else {
      method = 'PUT';
    }

    try {
      const responseFromApi = await CallApi(method, 'offices', body, null);
      body.id = responseFromApi.data.id;
      resolve(body);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteRow = (rowId, rows) => {
  return new Promise(async (resolve, reject) => {
    console.log(rowId);

    try {
      await CallApi('DELETE', 'offices', { id: rowId }, null);
      const deletedRow = rows.find((r) => r.id === rowId);
      rows = rows.filter((r) => r.id !== rowId);

      resolve({ data: deletedRow });
    } catch (error) {
      reject(error);
    }
  });
};
