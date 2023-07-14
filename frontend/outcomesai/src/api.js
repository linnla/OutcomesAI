import axios from 'axios';
import { config } from './config';

export const searchTable = async (table, query_params) => {
  try {
    const idToken = sessionStorage.getItem('idToken');
    const response = await axios.get(
      `${config.baseUrl}${config.stage}/${table}`,
      {
        headers: {
          Authorization: idToken,
        },
        params: query_params,
      }
    );

    return response.data;
  } catch (error) {
    console.log('Error searching table:', error);
  }
};
