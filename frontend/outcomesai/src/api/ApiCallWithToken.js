import axios from 'axios';
import { config } from '../config/Config';
import { getToken } from '../components/Authenticate';
import HandleTokenError from './HandleTokenError';

const ApiCallWithToken = async (method, table, body, query_params) => {
  const url = `${config.baseUrl}${config.stage}/${table}`;

  console.log(method, table, body, query_params, url);

  try {
    const token = await getToken();

    // Check for token error and handle
    if (token instanceof Error) {
      return <HandleTokenError error={token} />;
    }

    let response;
    switch (method) {
      case 'GET':
        response = await axios.get(url, {
          headers: {
            Authorization: token,
          },
          params: query_params,
        });
        break;
      case 'POST':
        response = await axios.post(url, body, {
          headers: {
            Authorization: token,
          },
        });
        break;
      case 'PUT':
        response = await axios.put(url, body, {
          headers: {
            Authorization: token,
          },
        });
        break;
      case 'DELETE':
        response = await axios.delete(url, {
          headers: {
            Authorization: token,
          },
          data: body,
        });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response;
  } catch (error) {
    console.error(`Error on ${method} request:`, error);
    throw error; // Propagate the error up for proper handling
  }
};

export default ApiCallWithToken;
