import axios from 'axios';
import { config } from '../config/Config';
import { getToken } from './AuthService';
import { HandleTokenError } from './HandleTokenError';

async function makeRequest(method, table, options = {}) {
  const url = `${config.baseUrl}${config.stage}/${table}`;
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
    console.log(response.data.data[0]);
    return response.data.data[0];
  } catch (error) {
    console.error('getOne error fetching data:', error);
    throw error;
  }
}

export async function getData(table, query_params) {
  try {
    const response = await makeRequest('get', table, { query_params });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('getData error fetching data:', error);
    throw error;
  }
}

export async function postData(table, body) {
  try {
    const response = await makeRequest('post', table, { body });
    console.log('POST request', response);
    return response;
  } catch (error) {
    console.error('postData error creating data:', error);
    throw error;
  }
}

export async function putData(table, body) {
  try {
    const response = await makeRequest('put', table, { body });
    console.log('PUT request', response);
    return response;
  } catch (error) {
    console.error('putData error updating data:', error);
    throw error;
  }
}

export async function deleteData(table, body) {
  try {
    const response = await makeRequest('delete', table, { body });
    console.log('DELETE request', response);
    return response;
  } catch (error) {
    console.error('deleteData error deleting data:', error);
    throw error;
  }
}
