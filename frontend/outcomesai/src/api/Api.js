import axios from 'axios';
import { config } from '../config/Config';

export const queryTable = (table, query_params) => {
  const url = `${config.baseUrl}${config.stage}/${table}`;

  return new Promise((resolve, reject) => {
    const idToken = sessionStorage.getItem('idToken');

    axios
      .get(url, {
        headers: {
          Authorization: idToken,
        },
        params: query_params,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createRecord = async (table, body) => {
  const url = `${config.baseUrl}${config.stage}/${table}`;
  try {
    const idToken = sessionStorage.getItem('idToken');
    const response = await axios.post(url, body, {
      headers: {
        Authorization: idToken,
      },
    });

    return response;
  } catch (error) {
    console.log('Error creating record:', error);
    return Promise.reject(error);
  }
};

export const updateRecord = async (table, body) => {
  const url = `${config.baseUrl}${config.stage}/${table}`;
  try {
    const idToken = sessionStorage.getItem('idToken');
    const response = await axios.put(url, body, {
      headers: {
        Authorization: idToken,
      },
    });

    return response;
  } catch (error) {
    console.log('Error creating record:', error);
    return Promise.reject(error);
  }
};

export const deleteRecord = async (table, body) => {
  const url = `${config.baseUrl}${config.stage}/${table}`;
  try {
    const idToken = sessionStorage.getItem('idToken');
    const response = await axios.delete(url, {
      headers: {
        Authorization: idToken,
      },
      data: body,
    });

    return response;
  } catch (error) {
    console.log('Error deleting record:', error);
    return Promise.reject(error);
  }
};
