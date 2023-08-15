import axios from 'axios';
import { config } from '../config/Config';
import { getToken } from '../utils/Authenticate';
import HandleTokenError from './HandleTokenError';

class DatabaseError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'DatabaseError';
    this.type = type;
  }
}

const CallApi = async (method, table, body, query_params) => {
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

    console.log(response);
    return response;
  } catch (error) {
    console.error(`Error on ${method} request:`, error);

    const errorObject = new DatabaseError(
      error.response.data.errorMessage,
      error.response.data.errorType
    );

    throw errorObject;
  }
};

export default CallApi;