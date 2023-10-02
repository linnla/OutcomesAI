import axios from 'axios';
import { config } from '../config/Config';
import { getToken } from './AuthService';
import { HandleTokenError } from './TokenError';

async function makeRequest(method, table, options = {}) {
  const url = `${config.baseUrl}${config.stage}/${table}`;
  //console.log('url:', url);
  //console.log('body:', options.body);
  //console.log('query params:', options.query_params);

  const token = await getToken();
  if (token instanceof Error) {
    return <HandleTokenError error={token} />;
  }

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios({
    method,
    url,
    headers: { ...defaultHeaders, ...options.headers },
    data: options.body,
    params: options.query_params,
  });

  return response;
}

export async function getOne(table, query_params) {
  try {
    const response = await makeRequest('get', table, { query_params });
    //console.log('getOne:', response.data.data[0]);

    if (!response.data.data.length) {
      throw new Error('No data found');
    }

    return response.data.data[0];
  } catch (error) {
    console.error('getOne error fetching data:', error);
    throw error;
  }
}

export async function getDrchronoData(table, body) {
  try {
    const response = await makeRequest('post', table, { body });
    //console.log('getDrchronoData:', response);

    if (response.data.length === 0) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('getOne error fetching data:', error);
    throw error;
  }
}

export async function getData(table, query_params) {
  try {
    const response = await makeRequest('get', table, { query_params });
    //console.log('getData:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('getData error fetching data:', error);
    throw error;
  }
}

export async function postData(table, body) {
  try {
    const response = await makeRequest('post', table, { body });
    //console.log('postData:', response);
    return response;
  } catch (error) {
    console.error('postData error creating data:', error);
    throw error;
  }
}

export async function putData(table, body) {
  try {
    const response = await makeRequest('put', table, { body });
    //console.log('putData:', response);
    return response;
  } catch (error) {
    console.error('putData error updating data:', error);
    throw error;
  }
}

export async function deleteData(table, body) {
  try {
    const response = await makeRequest('delete', table, { body });
    //console.log('deleteData:', response);
    return response;
  } catch (error) {
    console.error('deleteData error deleting data:', error);
    throw error;
  }
}
