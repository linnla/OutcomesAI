import CallApi from '../../api/CallApi';
import { getUserPracticeWithRetry } from '../../utils/Authenticate';
import {
  validatePostalCode,
  validateRequiredAttributes,
} from '../../utils/ValidationUtils';

class DatabaseError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'DatabaseError';
    this.type = type;
  }
}

const getAll = async (showInactive) => {
  let practice_id;

  try {
    practice_id = await getUserPracticeWithRetry();
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

const getDBRow = async (id) => {
  console.log('getDBRow:', id);
  const method = 'GET';
  const table = 'offices';
  const query_params = {
    id: id,
  };

  try {
    const response = await CallApi(method, table, null, query_params);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const validateRow = async (row) => {
  const requiredAttributes = ['name', 'postal_code'];
  const attributeNames = ['Office name', 'Postal Code'];
  try {
    await validateRequiredAttributes(requiredAttributes, attributeNames, row);
    await validatePostalCode(row.postal_code);
  } catch (error) {
    console.log('validateRow error:', error);
    throw error;
  }
};

const saveRow = async (row, oldRow, isNew) => {
  console.log('saveRow:', row);

  let practice_id;
  try {
    practice_id = await getUserPracticeWithRetry();
    if (practice_id === null) {
      throw new Error('Error getting practice_id');
    }
  } catch (error) {
    console.log('saveRow practice_id error:', error);
    throw error;
  }

  let city;
  let county;
  let state;
  let state_code;
  let country_code;

  if (isNew || row.postal_code !== oldRow.postal_code) {
    let postalCodeData = {};
    try {
      const method = 'GET';
      const table = 'postal_codes';
      const query_params = {
        postal_code: row.postal_code,
      };

      const response = await CallApi(method, table, null, query_params);

      postalCodeData = response.data.data[0];
      city = postalCodeData.city;
      county = postalCodeData.county;
      state = postalCodeData.state;
      state_code = postalCodeData.state_code;
      country_code = postalCodeData.country_code;
    } catch (error) {
      console.log('saveRow postalCodeData error:', error);
      const errorObject = new DatabaseError(
        `Error fetching postal code data postal code ${row.postal_code}`,
        'error.response.data.errorType'
      );
      throw errorObject;
    }
  } else {
    city = row.city;
    county = row.county;
    state = row.state;
    state_code = row.state_code;
    country_code = row.country_code;
  }

  const body = {
    ...row,
    practice_id: practice_id,
    city: city,
    county: county,
    state: state,
    state_code: state_code,
    country_code: country_code,
  };

  let method;
  if (isNew) {
    method = 'POST';
  } else {
    method = 'PUT';
  }

  try {
    const responseFromApi = await CallApi(method, 'offices', body, null);
    const id = responseFromApi.data.id;
    const newRow = await getDBRow(id);
    console.log('updateRow newRow:', newRow[0]);
    return newRow[0];
  } catch (error) {
    console.log('saveRow API error:', error);
    throw error;
  }
};

const deleteRow = async (rowId, rows) => {
  console.log(rowId);

  try {
    const responseFromApi = await CallApi(
      'DELETE',
      'offices',
      { id: rowId },
      null
    );
    console.log('deleteRow response', responseFromApi);
    return new Promise((resolve, reject) => {
      const deletedRow = rows.find((r) => r.id === rowId);
      rows = rows.filter((r) => r.id !== rowId);
      resolve({ data: deletedRow });
    });
  } catch (error) {
    console.log('saveRow API error:', error);
    throw error;
  }

  //virtual axios
  return new Promise((resolve, reject) => {
    const deletedRow = rows.find((r) => r.id === rowId);
    rows = rows.filter((r) => r.id !== rowId);
    resolve({ data: deletedRow });
  });
};

const OfficeController = {
  getAll,
  validateRow,
  saveRow,
  deleteRow,
};

export default OfficeController;
