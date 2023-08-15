/*
This is a file for only communication interface with a server.
In real developing you should delete "virtual axios" parts in this file
and use real axios parts alternatively.
*/

// import axios from "controllers/axios"
import ApiCallWithToken from '../../api/ApiCallWithToken';
import { getUserPracticeWithRetry } from '../../components/Authenticate';

const getAll = async () => {
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
    const response = await ApiCallWithToken(method, table, null, query_params);
    return response.data;
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
    const response = await ApiCallWithToken(method, table, null, query_params);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const validateRow = async (row) => {
  console.log('validateRow row:', row);
  if (row.postal_code === undefined || row.postal_code === null) {
    throw new Error('Postal code is a required field');
  }

  if (row.name === '' || row.name === null) {
    throw new Error('Name is a required field');
  }

  if (
    row.virtual === '' ||
    row.virtual === null ||
    (row.virtual !== true && row.virtual !== false)
  ) {
    throw new Error('Virtual is a required value');
  }

  if (
    row.status === '' ||
    row.status === null ||
    (row.status !== 'Active' && row.status !== 'Inactive')
  ) {
    throw new Error('Status is a required value');
  }

  const method = 'GET';
  const table = 'postal_codes';
  const query_params = {
    postal_code: row.postal_code,
  };

  try {
    if (row.postal_code !== null) {
      await ApiCallWithToken(method, table, null, query_params);
    }
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.errorType === 'NoResultFound'
    ) {
      throw new Error(`Postal code ${row.postal_code} not found`);
    } else {
      throw error;
    }
  }
};

const saveRow = async (row) => {
  console.log('saveRow:', row);
  try {
    const practice_id = await getUserPracticeWithRetry();
    if (practice_id === null) {
      throw new Error('Error getting practice_id');
    }

    let postalCodeData = {};
    try {
      const method = 'GET';
      const table = 'postal_codes';
      const query_params = {
        postal_code: row.postal_code,
      };

      const response = await ApiCallWithToken(
        method,
        table,
        null,
        query_params
      );

      postalCodeData = response.data.data[0];
    } catch (error) {
      throw new Error(
        `Error fetching postal code data postal code ${row.postal_code}`
      );
    }

    const city = postalCodeData.city;
    const county = postalCodeData.county;
    const state = postalCodeData.state;
    const state_code = postalCodeData.state_code;
    const country_code = postalCodeData.country_code;

    const body = {
      ...row,
      practice_id: practice_id,
      city: city,
      county: county,
      state: state,
      state_code: state_code,
      country_code: country_code,
    };

    try {
      const responseFromApi = await ApiCallWithToken(
        'POST',
        'offices',
        body,
        null
      );
      const id = responseFromApi.data.id;
      const newRow = await getDBRow(id);
      console.log('saveRow newRow:', newRow[0]);
      return newRow[0];
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    throw error;
  }
};

const deleteRow = (rowId) => {
  console.log(rowId);
  //real axios
  // return axios.delete(`/seller/${rowId}`);

  //virtual axios
  //return new Promise((resolve, reject) => {
  //  const deletedRow = rows.find((r) => r.id === rowId);
  //  rows = rows.filter((r) => r.id !== rowId);
  //  resolve({ data: deletedRow });
  //});
};

const OfficeController = {
  getAll,
  validateRow,
  saveRow,
  deleteRow,
};

export default OfficeController;
